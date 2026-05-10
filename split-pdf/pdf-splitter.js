(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("split-dropzone");
  const fileInput = $("split-file-input");
  const rangeInput = $("split-range");
  const splitBtn = $("split-btn");
  const splitAllBtn = $("split-all-btn");
  const fileListEl = $("file-list");
  const statusEl = $("split-status");

  let currentFile = null;

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

  async function loadPdf(file) {
    if (file.type !== "application/pdf") return;
    currentFile = file;
    
    const { PDFDocument } = PDFLib;
    try {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const pageCount = pdf.getPageCount();
        
        statusEl.textContent = `PDF loaded: ${pageCount} pages. Enter a range or split all.`;
        splitBtn.disabled = false;
        splitAllBtn.disabled = false;
        fileListEl.innerHTML = `<strong>Selected:</strong> ${file.name} (${formatSize(file.size)})`;
        track("pdf_split_loaded", { pages: pageCount });
    } catch (err) {
        console.error("Load failed:", err);
        statusEl.textContent = "Error loading PDF. Ensure it's not encrypted.";
    }
  }

  function parseRanges(input, maxPages) {
    const pages = new Set();
    const parts = input.split(",");
    
    parts.forEach(part => {
        const range = part.trim().split("-");
        if (range.length === 1) {
            const p = parseInt(range[0]);
            if (p >= 1 && p <= maxPages) pages.add(p - 1);
        } else if (range.length === 2) {
            const start = parseInt(range[0]);
            const end = parseInt(range[1]);
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                    if (i >= 1 && i <= maxPages) pages.add(i - 1);
                }
            }
        }
    });
    return Array.from(pages).sort((a, b) => a - b);
  }

  async function splitPdf(all = false) {
    if (!currentFile) return;
    const { PDFDocument } = PDFLib;
    
    statusEl.textContent = "Processing split...";
    splitBtn.disabled = true;
    splitAllBtn.disabled = true;

    try {
        const pdfBytes = await currentFile.arrayBuffer();
        const srcDoc = await PDFDocument.load(pdfBytes);
        const maxPages = srcDoc.getPageCount();

        if (all) {
            const zip = new JSZip();
            for (let i = 0; i < maxPages; i++) {
                const newDoc = await PDFDocument.create();
                const [page] = await newDoc.copyPages(srcDoc, [i]);
                newDoc.addPage(page);
                const bytes = await newDoc.save();
                zip.file(`page-${i+1}.pdf`, bytes);
            }
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `split-${currentFile.name.split('.')[0]}.zip`;
            a.click();
            statusEl.textContent = `Done. Every page exported to ZIP.`;
        } else {
            const rangeStr = rangeInput.value;
            if (!rangeStr) {
                statusEl.textContent = "Please enter a page range (e.g., 1-3).";
                return;
            }
            const indices = parseRanges(rangeStr, maxPages);
            if (indices.length === 0) {
                statusEl.textContent = "Invalid page range.";
                return;
            }

            const newDoc = await PDFDocument.create();
            const copiedPages = await newDoc.copyPages(srcDoc, indices);
            copiedPages.forEach(p => newDoc.addPage(p));
            
            const bytes = await newDoc.save();
            const blob = new Blob([bytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `extracted-${currentFile.name}`;
            a.click();
            statusEl.textContent = `Done. ${indices.length} pages extracted.`;
        }
        track("pdf_split_completed", { mode: all ? "all" : "range" });
    } catch (err) {
        console.error("Split failed:", err);
        statusEl.textContent = "Error splitting PDF.";
    } finally {
        splitBtn.disabled = false;
        splitAllBtn.disabled = false;
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

  splitBtn.addEventListener("click", () => splitPdf(false));
  splitAllBtn.addEventListener("click", () => splitPdf(true));

})();
