#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const WRAPPER = path.join(ROOT, "analytics-events.js");
const SKIP_DIRS = new Set([".git", "dist", "node_modules", "scripts", "vendor"]);
const FINDINGS = [];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function extractSet(name) {
  const source = read(WRAPPER);
  const pattern = new RegExp(`var\\s+${name}\\s*=\\s+new\\s+Set\\s*\\(\\s*\\[([\\s\\S]*?)\\]\\s*\\)`);
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not find ${name} in analytics-events.js`);
  return new Set([...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(full);
  }
  return files;
}

const allowedEvents = extractSet("ALLOWED_EVENTS");
const allowedParams = extractSet("ALLOWED_PARAMS");

for (const file of walk(ROOT)) {
  const source = read(file);
  const relative = rel(file);

  if (relative !== "analytics-events.js" && /dataLayer\s*\.\s*push\s*\(/.test(source)) {
    FINDINGS.push(`${relative}: raw dataLayer.push call outside analytics-events.js`);
  }

  for (const match of source.matchAll(/cuTrack\s*\(\s*["']([^"']+)["']\s*(?:,\s*\{([\s\S]*?)\})?/g)) {
    const eventName = match[1];
    const paramsBody = match[2] || "";
    if (!allowedEvents.has(eventName)) {
      FINDINGS.push(`${relative}: unknown cuTrack event "${eventName}"`);
    }

    for (const param of paramsBody.matchAll(/([A-Za-z_$][\w$]*)\s*:/g)) {
      const key = param[1];
      if (!allowedParams.has(key)) {
        FINDINGS.push(`${relative}: event "${eventName}" uses non-allowlisted param "${key}"`);
      }
    }
  }
}

if (FINDINGS.length) {
  console.error("Analytics event validation failed:");
  for (const finding of FINDINGS) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Analytics event validation passed for ${walk(ROOT).length} JS files.`);
