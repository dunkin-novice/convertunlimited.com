(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("pdf-dropzone");
  const fileInput = $("pdf-file-input");
  const orientationSelect = $("pdf-orientation");
  const sizeSelect = $("pdf-size");
  const marginSelect = $("pdf-margin");
  const generateBtn = $("generate-pdf-btn");
  const fileListEl = $("file-list");
  const statusEl = $("pdf-status");

  let filesToProcess = [];

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
      
      const previewUrl = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(file);
      });

      filesToProcess.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        previewUrl,
        rotation: 0
      });
    }
    renderFileList();
    generateBtn.disabled = filesToProcess.length === 0;
    track("pdf_creator_files_added", { count: files.length });
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    filesToProcess.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "file-card";
      card.style = "background: var(--bg-2); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; position: relative;";
      
      card.innerHTML = `
        <div style="position: relative; aspect-ratio: 1; background: var(--bg-3); border-radius: 8px; overflow: hidden;">
            <img src="${item.previewUrl}" style="width: 100%; height: 100%; object-fit: contain; transform: rotate(${item.rotation}deg);">
        </div>
        <div style="display: flex; flex-direction: column; gap: 2px;">
            <strong style="font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</strong>
            <span style="font-size: 11px; color: var(--ink-4);">${formatSize(item.size)}</span>
        </div>
        <div style="display: flex; gap: 4px;">
            <button class="btn btn-sm btn-ghost" onclick="window.movePage(${index}, -1)" title="Move Up" ${index === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn btn-sm btn-ghost" onclick="window.movePage(${index}, 1)" title="Move Down" ${index === filesToProcess.length - 1 ? 'disabled' : ''}>↓</button>
            <button class="btn btn-sm btn-ghost" onclick="window.rotatePage(${index})" title="Rotate">⟳</button>
            <button class="btn btn-sm btn-ghost" onclick="window.removePage(${index})" title="Remove" style="color: var(--accent);">×</button>
        </div>
      `;
      
      fileListEl.appendChild(card);
    });
  }

  window.movePage = (index, direction) => {
      const target = index + direction;
      if (target < 0 || target >= filesToProcess.length) return;
      const temp = filesToProcess[index];
      filesToProcess[index] = filesToProcess[target];
      filesToProcess[target] = temp;
      renderFileList();
  };

  window.rotatePage = (index) => {
      filesToProcess[index].rotation = (filesToProcess[index].rotation + 90) % 360;
      renderFileList();
  };

  window.removePage = (index) => {
      filesToProcess.splice(index, 1);
      renderFileList();
      generateBtn.disabled = filesToProcess.length === 0;
  };

  async function generatePdf() {
    if (filesToProcess.length === 0) return;
    const { jsPDF } = window.jspdf;
    
    generateBtn.disabled = true;
    statusEl.textContent = "Generating PDF locally...";
    
    try {
        const orientation = orientationSelect.value;
        const pageSize = sizeSelect.value;
        const margin = parseInt(marginSelect.value);
        
        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: pageSize === 'auto' ? 'a4' : pageSize
        });

        for (let i = 0; i < filesToProcess.length; i++) {
            const item = filesToProcess[i];
            if (i > 0) doc.addPage(pageSize === 'auto' ? 'a4' : pageSize, orientation);
            
            const imgProps = doc.getImageProperties(item.previewUrl);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            const printableWidth = pageWidth - (margin * 2);
            const printableHeight = pageHeight - (margin * 2);
            
            let width = imgProps.width;
            let height = imgProps.height;
            
            // Handle rotation in aspect ratio calc
            if (item.rotation % 180 !== 0) {
                [width, height] = [height, width];
            }

            const ratio = Math.min(printableWidth / width, printableHeight / height);
            const finalWidth = width * ratio;
            const finalHeight = height * ratio;
            
            const x = margin + (printableWidth - finalWidth) / 2;
            const y = margin + (printableHeight - finalHeight) / 2;

            doc.addImage(item.previewUrl, 'JPEG', x, y, finalWidth, finalHeight, undefined, 'FAST', item.rotation);
        }

        doc.save('convertunlimited-images.pdf');
        statusEl.textContent = "Done. PDF downloaded.";
        track("pdf_creator_completed", { count: filesToProcess.length });
    } catch (err) {
        console.error("PDF generation failed:", err);
        statusEl.textContent = "Error generating PDF. Please try again.";
    } finally {
        generateBtn.disabled = false;
    }
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

  generateBtn.addEventListener("click", generatePdf);

})();
