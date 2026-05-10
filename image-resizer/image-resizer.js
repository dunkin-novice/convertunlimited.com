(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("resizer-dropzone");
  const fileInput = $("resizer-file-input");
  const widthInput = $("resizer-width");
  const heightInput = $("resizer-height");
  const aspectCheckbox = $("resizer-aspect");
  const formatSelect = $("resizer-format");
  const qualitySlider = $("resizer-quality");
  const qualityValue = $("resizer-quality-value");
  const resizeAllBtn = $("resize-all-btn");
  const downloadAllBtn = $("download-all-btn");
  const fileListEl = $("file-list");
  const statusEl = $("resizer-status");
  const qualityContainer = $("quality-container");

  let filesToProcess = [];
  let isResizing = false;

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
      
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      const dimensions = await new Promise((resolve) => {
        img.onload = () => {
          resolve({ w: img.width, h: img.height });
          URL.revokeObjectURL(url);
        };
        img.src = url;
      });

      filesToProcess.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        originalSize: file.size,
        originalW: dimensions.w,
        originalH: dimensions.h,
        resizedBlob: null,
        resizedW: 0,
        resizedH: 0
      });
    }
    
    if (filesToProcess.length > 0 && !widthInput.value && !heightInput.value) {
        widthInput.value = filesToProcess[0].originalW;
        heightInput.value = filesToProcess[0].originalH;
    }
    
    renderFileList();
    resizeAllBtn.disabled = filesToProcess.length === 0;
    track("resizer_files_added", { count: files.length });
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    filesToProcess.forEach((item) => {
      const row = document.createElement("div");
      row.className = "file-row";
      row.style = "display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-2); border-radius: 8px; margin-bottom: 8px; font-size: 13px;";
      
      const info = document.createElement("div");
      info.style = "display: flex; flex-direction: column; gap: 2px;";
      info.innerHTML = `<strong>${item.file.name}</strong><span style="color: var(--ink-3)">${item.originalW}x${item.originalH} · ${formatSize(item.originalSize)}</span>`;
      
      const status = document.createElement("div");
      status.id = `status-${item.id}`;
      status.style = "text-align: right; display: flex; align-items: center; gap: 12px;";
      
      if (item.resizedBlob) {
        status.innerHTML = `
          <div style="display: flex; flex-direction: column;">
            <span class="num" style="font-weight: 600;">${item.resizedW}x${item.resizedH}</span>
            <span style="color: var(--accent); font-weight: 600;">${formatSize(item.resizedBlob.size)}</span>
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
    if (!item || !item.resizedBlob) return;
    const url = URL.createObjectURL(item.resizedBlob);
    const a = document.createElement("a");
    const ext = item.resizedBlob.type.split("/")[1].replace("jpeg", "jpg");
    a.href = url;
    a.download = `resized-${item.file.name.split('.')[0]}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function getTargetDimensions(originalW, originalH, targetW, targetH, lockAspect) {
    if (!lockAspect) return { w: targetW || originalW, h: targetH || originalH };
    
    if (targetW && !targetH) {
        return { w: targetW, h: Math.round(targetW * (originalH / originalW)) };
    }
    if (!targetW && targetH) {
        return { w: Math.round(targetH * (originalW / originalH)), h: targetH };
    }
    if (targetW && targetH) {
        // If both provided, prioritize the one that was most recently changed or width
        return { w: targetW, h: Math.round(targetW * (originalH / originalW)) };
    }
    return { w: originalW, h: originalH };
  }

  async function resizeFile(item, targetW, targetH, format, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const dims = getTargetDimensions(img.width, img.height, targetW, targetH, aspectCheckbox.checked);
          const canvas = document.createElement("canvas");
          canvas.width = dims.w;
          canvas.height = dims.h;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, dims.w, dims.h);
          
          const outputType = format === "original" ? item.file.type : format;

          canvas.toBlob((blob) => {
            if (blob) {
              item.resizedBlob = blob;
              item.resizedW = dims.w;
              item.resizedH = dims.h;
              resolve();
            } else {
              reject(new Error("Resizing failed"));
            }
          }, outputType, outputType === "image/png" ? undefined : quality / 100);
        };
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = e.target.result;
      };
      reader.readAsDataURL(item.file);
    });
  }

  async function resizeAll() {
    if (isResizing) return;
    const targetW = parseInt(widthInput.value);
    const targetH = parseInt(heightInput.value);
    const format = formatSelect.value;
    const quality = parseInt(qualitySlider.value);
    
    isResizing = true;
    resizeAllBtn.disabled = true;
    statusEl.textContent = "Processing images locally...";
    
    for (const item of filesToProcess) {
      try {
        await resizeFile(item, targetW, targetH, format, quality);
      } catch (err) {
        console.error(err);
      }
    }
    
    renderFileList();
    statusEl.textContent = "Done. All images resized.";
    downloadAllBtn.disabled = filesToProcess.every(i => !i.resizedBlob);
    isResizing = false;
    resizeAllBtn.disabled = false;
    track("resizer_all_completed", { count: filesToProcess.length, format });
  }

  async function downloadAll() {
    const zip = new JSZip();
    filesToProcess.forEach((item) => {
      if (item.resizedBlob) {
        const ext = item.resizedBlob.type.split("/")[1].replace("jpeg", "jpg");
        zip.file(`resized-${item.file.name.split('.')[0]}.${ext}`, item.resizedBlob);
      }
    });
    
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resized-images.zip";
    a.click();
    URL.revokeObjectURL(url);
    track("resizer_download_zip", { count: filesToProcess.length });
  }

  // Handle auto-calculation for aspect ratio UI
  widthInput.addEventListener("input", () => {
    if (aspectCheckbox.checked && filesToProcess.length > 0) {
        const ratio = filesToProcess[0].originalH / filesToProcess[0].originalW;
        heightInput.value = Math.round(widthInput.value * ratio) || "";
    }
  });

  heightInput.addEventListener("input", () => {
    if (aspectCheckbox.checked && filesToProcess.length > 0) {
        const ratio = filesToProcess[0].originalW / filesToProcess[0].originalH;
        widthInput.value = Math.round(heightInput.value * ratio) || "";
    }
  });

  formatSelect.addEventListener("change", () => {
    const val = formatSelect.value;
    qualityContainer.style.opacity = (val === "image/png") ? "0.3" : "1";
    qualitySlider.disabled = (val === "image/png");
  });

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

  resizeAllBtn.addEventListener("click", resizeAll);
  downloadAllBtn.addEventListener("click", downloadAll);

})();
