(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("remover-dropzone");
  const fileInput = $("remover-file-input");
  const removeAllBtn = $("remove-all-btn");
  const downloadAllBtn = $("download-all-btn");
  const fileListEl = $("file-list");
  const statusEl = $("remover-status");

  let filesToProcess = [];
  let isStripping = false;

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
      if (!file.type.startsWith("image/")) continue;
      filesToProcess.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        originalSize: file.size,
        strippedBlob: null,
      });
    }
    renderFileList();
    removeAllBtn.disabled = filesToProcess.length === 0;
    track("metadata_remover_files_added", { count: files.length });
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
      status.id = `status-${item.id}`;
      status.style = "text-align: right; display: flex; align-items: center; gap: 12px;";
      
      if (item.strippedBlob) {
        status.innerHTML = `
          <div style="display: flex; flex-direction: column;">
            <span class="num" style="font-weight: 600;">Stripped</span>
            <span style="color: var(--accent); font-weight: 600;">${formatSize(item.strippedBlob.size)}</span>
          </div>
          <button class="btn btn-sm btn-ghost" onclick="window.downloadSingle('${item.id}')">Download</button>
        `;
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
    if (!item || !item.strippedBlob) return;
    const url = URL.createObjectURL(item.strippedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clean-${item.file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  async function stripFile(item) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          
          // Re-encoding to the same type strips metadata
          canvas.toBlob((blob) => {
            if (blob) {
              item.strippedBlob = blob;
              resolve();
            } else {
              reject(new Error("Metadata removal failed"));
            }
          }, item.file.type, 0.92); // High quality re-encode
        };
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = e.target.result;
      };
      reader.readAsDataURL(item.file);
    });
  }

  async function stripAll() {
    if (isStripping) return;
    isStripping = true;
    removeAllBtn.disabled = true;
    statusEl.textContent = "Stripping metadata locally...";
    
    for (const item of filesToProcess) {
      try {
        await stripFile(item);
      } catch (err) {
        console.error(err);
      }
    }
    
    renderFileList();
    statusEl.textContent = "Done. Metadata removed from all files.";
    downloadAllBtn.disabled = filesToProcess.every(i => !i.strippedBlob);
    isStripping = false;
    removeAllBtn.disabled = false;
    track("metadata_remover_all_completed", { count: filesToProcess.length });
  }

  async function downloadAll() {
    const zip = new JSZip();
    filesToProcess.forEach((item) => {
      if (item.strippedBlob) {
        zip.file(`clean-${item.file.name}`, item.strippedBlob);
      }
    });
    
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clean-images.zip";
    a.click();
    URL.revokeObjectURL(url);
    track("metadata_remover_download_zip", { count: filesToProcess.length });
  }

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

  removeAllBtn.addEventListener("click", stripAll);
  downloadAllBtn.addEventListener("click", downloadAll);

})();
