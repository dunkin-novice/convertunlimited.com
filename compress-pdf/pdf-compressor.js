(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("compress-dropzone");
  const fileInput = $("compress-file-input");
  const compressLevelSelect = $("compress-level");
  const compressBtn = $("compress-btn");
  const fileListEl = $("file-list");
  const statusEl = $("compress-status");

  let currentFile = null;
  let isCompressing = false;

  function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  async function loadPdf(file) {
    if (file.type !== "application/pdf") return;
    currentFile = file;
    statusEl.textContent = `File ready: ${file.name} (${formatSize(file.size)})`;
    compressBtn.disabled = false;
    fileListEl.innerHTML = "";
    if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded", { bytes: file.size });
  }

  async function compressPdf() {
    if (!currentFile || isCompressing) return;
    const { PDFDocument } = PDFLib;
    
    isCompressing = true;
    compressBtn.disabled = true;
    statusEl.textContent = "Optimizing PDF structure locally...";
    fileListEl.innerHTML = "";

    try {
        const pdfBytes = await currentFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // pdf-lib's 'save' with object streams often reduces size of unoptimized PDFs
        // by rebuilding the cross-reference table and compressing object streams.
        const compressedBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false
        });

        const blob = new Blob([compressedBytes], { type: "application/pdf" });
        const originalSize = currentFile.size;
        const compressedSize = blob.size;
        const savedPct = Math.round(((originalSize - compressedSize) / originalSize) * 100);

        const url = URL.createObjectURL(blob);
        const resultRow = document.createElement("div");
        resultRow.style = "background: var(--bg-2); border-radius: 12px; padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px;";
        
        const info = document.createElement("div");
        info.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">${currentFile.name}</div>
            <div style="font-size: 12px; color: var(--ink-4);">
                ${formatSize(originalSize)} → <strong>${formatSize(compressedSize)}</strong> 
                ${savedPct > 0 ? `<span style="color: var(--accent); margin-left: 8px;">-${savedPct}%</span>` : ""}
            </div>
        `;

        const downloadBtn = document.createElement("button");
        downloadBtn.className = "btn btn-accent";
        downloadBtn.textContent = "Download";
        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = `compressed-${currentFile.name}`;
            a.click();
        };

        resultRow.appendChild(info);
        resultRow.appendChild(downloadBtn);
        fileListEl.appendChild(resultRow);

        if (savedPct <= 0) {
            statusEl.textContent = "Optimization complete. This PDF was already highly optimized, so size remained similar.";
        } else {
            statusEl.textContent = `Done! Reduced file size by ${savedPct}%.`;
        }
        
        if (typeof window.cuTrack === "function") window.cuTrack("pdf_action_completed", { 
            total_in_bytes: originalSize, 
            total_out_bytes: compressedSize
        });

    } catch (err) {
      console.error("Compression failed:", err);
      statusEl.textContent = "Error processing PDF. Ensure it is not password protected.";
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "corrupt_input" });
    } finally {
      isCompressing = false;
      compressBtn.disabled = false;
    }
  }

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) loadPdf(e.target.files[0]);
    e.target.value = "";
  });

  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("drag"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag");
    if (e.dataTransfer.files.length > 0) loadPdf(e.dataTransfer.files[0]);
  });

  compressBtn.addEventListener("click", compressPdf);

})();
