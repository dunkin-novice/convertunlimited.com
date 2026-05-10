(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("heic-dropzone");
  const fileInput = $("heic-file-input");
  const formatSelect = $("heic-format");
  const qualitySlider = $("heic-quality");
  const qualityValue = $("heic-quality-value");
  const convertAllBtn = $("convert-all-btn");
  const downloadAllBtn = $("download-all-btn");
  const fileListEl = $("file-list");
  const statusEl = $("heic-status");

  let filesToProcess = [];
  let isConverting = false;

  function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  function track(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
    } catch (_) { /* noop */ }
  }

  async function addFiles(files) {
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".heic") && !file.name.toLowerCase().endsWith(".heif") && !file.type.includes("heic")) continue;
      filesToProcess.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        originalSize: file.size,
        outBlob: null,
        outUrl: null,
        status: "ready"
      });
    }
    renderFileList();
    convertAllBtn.disabled = filesToProcess.length === 0;
    track("heic_files_added", { count: files.length });
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    filesToProcess.forEach((item) => {
      const row = document.createElement("div");
      row.className = "file-row";
      row.style = "display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-2); border-radius: 8px; margin-bottom: 8px; font-size: 13px;";
      
      const info = document.createElement("div");
      info.style = "display: flex; flex-direction: column; gap: 2px;";
      info.innerHTML = `<strong>${item.file.name}</strong><span style="color: var(--ink-3)">${formatSize(item.originalSize)}</span>`;
      
      const status = document.createElement("div");
      status.style = "text-align: right; display: flex; align-items: center; gap: 12px;";
      
      if (item.status === "done" && item.outBlob) {
        status.innerHTML = `
          <div style="display: flex; flex-direction: column;">
            <span class="num" style="font-weight: 600;">${formatSize(item.outBlob.size)}</span>
            <span style="color: var(--accent); font-weight: 600;">Converted</span>
          </div>
          <button class="btn btn-sm btn-ghost" onclick="window.downloadSingle('${item.id}')">Download</button>
        `;
      } else if (item.status === "busy") {
        status.innerHTML = `<span style="color: var(--ink-3)">Converting...</span>`;
      } else if (item.status === "err") {
        status.innerHTML = `<span style="color: var(--accent)">Failed</span>`;
      } else {
        status.innerHTML = `<span style="color: var(--ink-4)">Ready</span>`;
      }
      
      row.appendChild(info);
      row.appendChild(status);
      fileListEl.appendChild(row);
    });
  }

  window.downloadSingle = (id) => {
    const item = filesToProcess.find((i) => i.id === id);
    if (!item || !item.outUrl) return;
    const a = document.createElement("a");
    a.href = item.outUrl;
    a.download = `converted-${item.file.name.split('.')[0]}.${formatSelect.value === 'jpeg' ? 'jpg' : formatSelect.value}`;
    a.click();
  };

  async function convertFile(item, format, quality) {
    item.status = "busy";
    renderFileList();
    
    try {
      // heic2any returns a Blob
      const result = await heic2any({
        blob: item.file,
        toType: "image/" + format,
        quality: quality / 100
      });
      
      const blob = Array.isArray(result) ? result[0] : result;
      item.outBlob = blob;
      item.outUrl = URL.createObjectURL(blob);
      item.status = "done";
    } catch (err) {
      console.error("HEIC conversion failed:", err);
      item.status = "err";
    }
  }

  async function convertAll() {
    if (isConverting) return;
    const format = formatSelect.value;
    const quality = parseInt(qualitySlider.value);
    
    isConverting = true;
    convertAllBtn.disabled = true;
    statusEl.textContent = "Converting HEIC files locally...";
    
    for (const item of filesToProcess) {
      if (item.status !== "done") {
        await convertFile(item, format, quality);
      }
    }
    
    renderFileList();
    statusEl.textContent = "Done. All files processed.";
    downloadAllBtn.disabled = filesToProcess.every(i => i.status !== "done");
    isConverting = false;
    convertAllBtn.disabled = false;
    track("heic_all_completed", { count: filesToProcess.length, format });
  }

  async function downloadAll() {
    const zip = new JSZip();
    filesToProcess.forEach((item) => {
      if (item.outBlob) {
        const ext = formatSelect.value === 'jpeg' ? 'jpg' : formatSelect.value;
        zip.file(`converted-${item.file.name.split('.')[0]}.${ext}`, item.outBlob);
      }
    });
    
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-photos.zip";
    a.click();
    URL.revokeObjectURL(url);
    track("heic_download_zip", { count: filesToProcess.length });
  }

  qualitySlider.addEventListener("input", () => {
    qualityValue.textContent = `${qualitySlider.value}%`;
  });

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) addFiles(e.target.files);
    e.target.value = "";
  });

  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("drag"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag");
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  });

  convertAllBtn.addEventListener("click", convertAll);
  downloadAllBtn.addEventListener("click", downloadAll);

})();
