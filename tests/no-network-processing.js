#!/usr/bin/env node
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "dist", "privacy-build");
const PORT = Number(process.env.PORT || 4187);
const CHROME =
  process.env.CHROME ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
      const requested = decodeURIComponent(url.pathname);
      const candidate = path.normalize(path.join(SITE, requested));
      if (!candidate.startsWith(SITE)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      const file = fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()
        ? path.join(candidate, "index.html")
        : candidate;
      if (!fs.existsSync(file)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": contentType(file),
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'none'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'",
      });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cdp(port, method, pathSuffix = "") {
  return fetch(`http://127.0.0.1:${port}${pathSuffix}`, { method }).then((r) => r.json());
}

async function waitForCdp(port) {
  let lastError;
  for (let i = 0; i < 30; i += 1) {
    try {
      await cdp(port, "GET", "/json/version");
      return;
    } catch (error) {
      lastError = error;
      await wait(250);
    }
  }
  throw lastError || new Error("Chrome debugging endpoint did not become ready.");
}

async function run() {
  if (!fs.existsSync(SITE)) {
    throw new Error("dist/privacy-build missing. Run node scripts/build-privacy.js first.");
  }

  const server = await startServer();
  const debugPort = 9233;
  const userDataDir = path.join("/tmp", `convertunlimited-privacy-${Date.now()}`);
  const chrome = spawn(CHROME, [
    "--headless=new",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `http://127.0.0.1:${PORT}/`,
  ], { stdio: "ignore" });

  try {
    await waitForCdp(debugPort);
    const target = await cdp(debugPort, "PUT", `/json/new?${encodeURIComponent(`http://127.0.0.1:${PORT}/`)}`);
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    const requests = [];
    let id = 0;
    const pending = new Map();
    const send = (method, params = {}) => new Promise((resolve) => {
      const msgId = ++id;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        pending.get(message.id)(message.result);
        pending.delete(message.id);
      }
      if (message.method === "Network.requestWillBeSent") {
        requests.push(message.params.request.url);
      }
    });

    await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
    await send("Network.enable");
    await send("Page.enable");
    await wait(3000);

    async function verifyFlow(label, route, expression) {
      await send("Page.navigate", { url: `http://127.0.0.1:${PORT}${route}` });
      await wait(1800);
      const beforeProcessing = requests.length;
      const result = await send("Runtime.evaluate", { expression, awaitPromise: true });
      await wait(1200);
      const afterProcessing = requests.slice(beforeProcessing)
        .filter((url) => !url.startsWith("data:") && !url.startsWith("blob:"));
      if (result.exceptionDetails) {
        throw new Error(`${label} runtime verification failed: ${JSON.stringify(result.exceptionDetails)}`);
      }
      if (afterProcessing.length) {
        throw new Error(`${label} made network requests during processing:\n${afterProcessing.join("\n")}`);
      }
    }

    const imageFixture = `
      const sent = [];
      const fail = (name) => function () { sent.push(name); throw new Error(name + " is disabled in privacy verification"); };
      window.fetch = fail("fetch");
      XMLHttpRequest.prototype.open = fail("XMLHttpRequest");
      navigator.sendBeacon = fail("sendBeacon");
      const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const file = new File([bytes], "audit.png", { type: "image/png" });
      const dt = new DataTransfer();
      dt.items.add(file);
    `;

    await verifyFlow("image converter", "/", `(async () => {
      ${imageFixture}
      const input = document.getElementById("file-input");
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 800));
      document.getElementById("primary-btn").click();
      await new Promise((resolve) => setTimeout(resolve, 1800));
      return sent;
    })()`);

    await verifyFlow("metadata remover", "/metadata-remover/", `(async () => {
      ${imageFixture}
      const input = document.getElementById("remover-file-input");
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 800));
      document.getElementById("remove-all-btn").click();
      await new Promise((resolve) => setTimeout(resolve, 1800));
      return sent;
    })()`);

    await verifyFlow("background remover", "/background-remover/", `(async () => {
      ${imageFixture}
      const input = document.getElementById("bg-file-input");
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 800));
      document.getElementById("bg-process-btn").click();
      await new Promise((resolve) => setTimeout(resolve, 1800));
      return sent;
    })()`);

    const external = requests.filter((url) => !url.startsWith(`http://127.0.0.1:${PORT}`) && !url.startsWith("data:") && !url.startsWith("blob:"));
    ws.close();

    if (external.length) {
      throw new Error(`External requests found:\n${external.join("\n")}`);
    }
    console.log("No-network processing verification passed.");
  } finally {
    chrome.kill();
    server.close();
  }
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
