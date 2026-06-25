(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("bg-dropzone");
  const fileInput = $("bg-file-input");
  const originalPreview = $("bg-original-preview");
  const resultPreview = $("bg-result-preview");
  const tolerance = $("bg-tolerance");
  const toleranceValue = $("bg-tolerance-value");
  const feather = $("bg-feather");
  const featherValue = $("bg-feather-value");
  const protection = $("bg-protection");
  const protectionValue = $("bg-protection-value");
  const processBtn = $("bg-process-btn");
  const downloadBtn = $("bg-download-btn");
  const statusEl = $("bg-status");

  let sourceFile = null;
  let resultBlob = null;
  let resultUrl = null;
  let resultName = "transparent-background.png";

  function baseOf(name) {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(0, i) : name;
  }

  function readPreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        reject(new Error("Cannot read image"));
      };
      img.src = objUrl;
    });
  }

  function estimateBackgroundColor(data, w, h) {
    const samples = [];
    const band = Math.max(6, Math.floor(Math.min(w, h) / 48));
    const push = (x, y) => {
      const i = (y * w + x) * 4;
      samples.push([data[i], data[i + 1], data[i + 2]]);
    };
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < band; y++) {
        push(x, y);
        push(x, h - 1 - y);
      }
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < band; x++) {
        push(x, y);
        push(w - 1 - x, y);
      }
    }
    const median = (idx) => {
      const values = samples.map((sample) => sample[idx]).sort((a, b) => a - b);
      return values[Math.floor(values.length / 2)] || 255;
    };
    return [median(0), median(1), median(2)];
  }

  function localContrast(data, w, h, x, y) {
    const center = (y * w + x) * 4;
    let maxDistance = 0;
    const compare = (nx, ny) => {
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) return;
      const i = (ny * w + nx) * 4;
      const dr = data[center] - data[i];
      const dg = data[center + 1] - data[i + 1];
      const db = data[center + 2] - data[i + 2];
      maxDistance = Math.max(maxDistance, Math.sqrt(dr * dr + dg * dg + db * db));
    };
    compare(x - 1, y);
    compare(x + 1, y);
    compare(x, y - 1);
    compare(x, y + 1);
    return maxDistance;
  }

  function colorDistance(data, i, bg) {
    const dr = data[i] - bg[0];
    const dg = data[i + 1] - bg[1];
    const db = data[i + 2] - bg[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function removeSimpleBackground(imageData, floodTolerance, edgeFeather, subjectProtection) {
    const { data, width: w, height: h } = imageData;
    const bg = estimateBackgroundColor(data, w, h);
    const mask = new Uint8Array(w * h);
    const queue = [];
    let qi = 0;
    const protect = Math.max(0, subjectProtection);
    const idx = (x, y) => y * w + x;
    const add = (x, y, isSeed) => {
      const p = idx(x, y);
      if (mask[p]) return;
      if (colorDistance(data, p * 4, bg) > floodTolerance) return;
      if (!isSeed && protect > 0 && localContrast(data, w, h, x, y) > protect) return;
      mask[p] = 1;
      queue.push(p);
    };

    for (let x = 0; x < w; x++) {
      add(x, 0, true);
      add(x, h - 1, true);
    }
    for (let y = 0; y < h; y++) {
      add(0, y, true);
      add(w - 1, y, true);
    }

    while (qi < queue.length) {
      const p = queue[qi++];
      const x = p % w;
      const y = Math.floor(p / w);
      if (x > 0) add(x - 1, y, false);
      if (x + 1 < w) add(x + 1, y, false);
      if (y > 0) add(x, y - 1, false);
      if (y + 1 < h) add(x, y + 1, false);
    }

    const clear = Math.max(10, floodTolerance * 0.55);
    const soft = Math.max(clear + 1, edgeFeather);
    for (let p = 0; p < mask.length; p++) {
      const i = p * 4;
      const d = colorDistance(data, i, bg);
      if (mask[p]) {
        data[i + 3] = d <= clear ? 0 : Math.min(255, Math.round(255 * (d - clear) / (soft - clear)));
        continue;
      }
      const x = p % w;
      const y = Math.floor(p / w);
      const nearBg =
        (x > 0 && mask[p - 1]) ||
        (x + 1 < w && mask[p + 1]) ||
        (y > 0 && mask[p - w]) ||
        (y + 1 < h && mask[p + w]);
      if (nearBg && d < soft) {
        data[i + 3] = Math.max(90, Math.round(255 * d / soft));
      }
    }
    return imageData;
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function clearResult() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = null;
    resultBlob = null;
    downloadBtn.disabled = true;
    resultPreview.innerHTML = `<span>${resultPreview.dataset.emptyText || "Result appears here"}</span>`;
  }

  async function setFile(file) {
    if (!file || !(file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name))) return;
    sourceFile = file;
    clearResult();
    const preview = await readPreview(file);
    originalPreview.innerHTML = `<img src="${preview}" alt="">`;
    resultName = `${baseOf(file.name)}-no-bg.png`;
    processBtn.disabled = false;
    setStatus(statusEl.dataset.readyText || "Ready. Works best when the background touches the image edges and is mostly one color.");
    if (typeof window.cuTrack === "function") window.cuTrack("file_selected", { bytes: file.size || 0, file_count: 1 });
  }

  async function processFile() {
    if (!sourceFile) return;
    processBtn.disabled = true;
    downloadBtn.disabled = true;
    setStatus(statusEl.dataset.processingText || "Removing background locally in your browser...");
    try {
      const img = await loadImageFromFile(sourceFile);
      const w = img.naturalWidth || img.width || 1024;
      const h = img.naturalHeight || img.height || 1024;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const protectionLevel = protection ? parseFloat(protection.value) : 34;
      ctx.putImageData(
        removeSimpleBackground(imageData, parseFloat(tolerance.value), parseFloat(feather.value), protectionLevel),
        0,
        0
      );
      resultPreview.innerHTML = "";
      resultPreview.appendChild(canvas);
      resultBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!resultBlob) throw new Error("PNG export failed");
      downloadBtn.disabled = false;
      
      let doneText = statusEl.dataset.doneText || "Done. Export keeps the source dimensions: {w}x{h}px transparent PNG.";
      doneText = doneText.replace("{w}", w).replace("{h}", h);
      setStatus(doneText);
      
      if (typeof window.cuTrack === "function") window.cuTrack("processing_completed", { bytes: sourceFile.size || 0, width: w, height: h, file_count: 1 });
    } catch (error) {
      clearResult();
      setStatus(statusEl.dataset.errorText || "Could not remove this background. Try an image with a simpler white or solid background.");
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unknown" });
    } finally {
      processBtn.disabled = !sourceFile;
    }
  }

  function downloadPng() {
    if (!resultBlob) return;
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = resultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (typeof window.cuTrack === "function") window.cuTrack("download_clicked", { bytes: resultBlob.size || 0, file_count: 1 });
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  dropzone.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dropzone.classList.add("drag");
  });
  dropzone.addEventListener("dragover", (e) => e.preventDefault());
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag");
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    e.target.value = "";
  });
  tolerance.addEventListener("input", () => {
    toleranceValue.textContent = tolerance.value;
    if (sourceFile) clearResult();
  });
  feather.addEventListener("input", () => {
    featherValue.textContent = feather.value;
    if (sourceFile) clearResult();
  });
  if (protection && protectionValue) {
    protection.addEventListener("input", () => {
      protectionValue.textContent = protection.value;
      if (sourceFile) clearResult();
    });
  }
  processBtn.addEventListener("click", processFile);
  downloadBtn.addEventListener("click", downloadPng);
})();
