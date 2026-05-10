(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("merge-dropzone");
  const fileInput = $("merge-file-input");
  const mergeBtn = $("merge-btn");
  const downloadAllBtn = $("download-all-btn");
  const fileListEl = $("file-list");
  const statusEl = $("merge-status");

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
      if (file.type !== "application/pdf") continue;
      
      filesToProcess.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size
      });
    }
    renderFileList();
    mergeBtn.disabled = filesToProcess.length < 2;
    track("pdf_merge_files_added", { count: files.length });
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    filesToProcess.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "file-row";
      row.style = "display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-2); border-radius: 8px; margin-bottom: 8px; font-size: 13px;";
      
      const info = document.createElement("div");
      info.style = "display: flex; flex-direction: column; gap: 2px;";
      info.innerHTML = `<strong>${item.name}</strong><span style="color: var(--ink-3)">${formatSize(item.size)}</span>`;
      
      const controls = document.createElement("div");
      controls.style = "display: flex; gap: 8px;";
      controls.innerHTML = `
          <button class="btn btn-sm btn-ghost" onclick="window.movePdf(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button class="btn btn-sm btn-ghost" onclick="window.movePdf(${index}, 1)" ${index === filesToProcess.length - 1 ? 'disabled' : ''}>↓</button>
          <button class="btn btn-sm btn-ghost" onclick="window.removePdf(${index})" style="color: var(--accent);">×</button>
      `;
      
      row.appendChild(info);
      row.appendChild(controls);
      fileListEl.appendChild(row);
    });
  }

  window.movePdf = (index, direction) => {
      const target = index + direction;
      if (target < 0 || target >= filesToProcess.length) return;
      const temp = filesToProcess[index];
      filesToProcess[index] = filesToProcess[target];
      filesToProcess[target] = temp;
      renderFileList();
  };

  window.removePdf = (index) => {
      filesToProcess.splice(index, 1);
      renderFileList();
      mergeBtn.disabled = filesToProcess.length < 2;
  };

  async function mergePdfs() {
    if (filesToProcess.length < 2) return;
    const { PDFDocument } = PDFLib;
    
    mergeBtn.disabled = true;
    statusEl.textContent = "Merging PDFs locally...";
    
    try {
        const mergedPdf = await PDFDocument.create();
        
        for (const item of filesToProcess) {
            const pdfBytes = await item.file.arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged-document.pdf";
        a.click();
        statusEl.textContent = "Done. Merged PDF downloaded.";
        track("pdf_merge_completed", { count: filesToProcess.length });
    } catch (err) {
        console.error("Merge failed:", err);
        statusEl.textContent = "Error merging PDFs. Ensure they are not password protected.";
    } finally {
        mergeBtn.disabled = false;
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

  mergeBtn.addEventListener("click", mergePdfs);

})();
