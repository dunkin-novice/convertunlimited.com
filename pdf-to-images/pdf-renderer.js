(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("pdf-to-img-dropzone");
  const fileInput = $("pdf-to-img-file-input");
  const formatSelect = $("pdf-to-img-format");
  const scaleSelect = $("pdf-to-img-scale");
  const renderBtn = $("render-pdf-btn");
  const downloadAllBtn = $("download-all-btn");
  const fileListEl = $("file-list");
  const statusEl = $("pdf-to-img-status");

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

  let currentPdf = null;
  let pages = [];

  function formatSize(bytes) {
    if (!bytes) return "";
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
    const arrayBuffer = await file.arrayBuffer();
    try {
        currentPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        statusEl.textContent = `PDF loaded: ${currentPdf.numPages} pages. Click "Convert PDF" to extract images.`;
        renderBtn.disabled = false;
        pages = [];
        fileListEl.innerHTML = "";
        track("pdf_to_img_loaded", { pages: currentPdf.numPages });
    } catch (err) {
        console.error("PDF load failed:", err);
        statusEl.textContent = "Failed to load PDF. It might be encrypted or corrupted.";
    }
  }

  async function renderPages() {
    if (!currentPdf) return;
    renderBtn.disabled = true;
    statusEl.textContent = "Rendering pages...";
    fileListEl.innerHTML = "";
    pages = [];

    const scale = parseFloat(scaleSelect.value);
    const format = formatSelect.value;

    for (let i = 1; i <= currentPdf.numPages; i++) {
        try {
            const page = await currentPdf.getPage(i);
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: ctx, viewport }).promise;

            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, "image/" + format, 0.9);
            });

            const url = URL.createObjectURL(blob);
            pages.push({ id: i, blob, url });

            const card = document.createElement("div");
            card.className = "file-card";
            card.style = "background: var(--bg-2); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px;";
            card.innerHTML = `
                <div style="aspect-ratio: 1; background: var(--bg-3); border-radius: 8px; overflow: hidden;">
                    <img src="${url}" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; font-weight: 600;">Page ${i}</span>
                    <button class="btn btn-sm btn-ghost" onclick="window.downloadPage(${i-1})">Save</button>
                </div>
            `;
            fileListEl.appendChild(card);
            statusEl.textContent = `Rendering page ${i} of ${currentPdf.numPages}...`;
        } catch (err) {
            console.error(`Page ${i} render failed:`, err);
        }
    }

    statusEl.textContent = "Done. All pages extracted.";
    downloadAllBtn.disabled = false;
    renderBtn.disabled = false;
    track("pdf_to_img_completed", { pages: pages.length, format });
  }

  window.downloadPage = (index) => {
    const p = pages[index];
    if (!p) return;
    const a = document.createElement("a");
    const ext = formatSelect.value === 'jpeg' ? 'jpg' : formatSelect.value;
    a.href = p.url;
    a.download = `page-${p.id}.${ext}`;
    a.click();
  };

  async function downloadAllZip() {
    const zip = new JSZip();
    const ext = formatSelect.value === 'jpeg' ? 'jpg' : formatSelect.value;
    
    pages.forEach((p) => {
        zip.file(`page-${p.id}.${ext}`, p.blob);
    });
    
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf-extracted-pages.zip";
    a.click();
    URL.revokeObjectURL(url);
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

  renderBtn.addEventListener("click", renderPages);
  downloadAllBtn.addEventListener("click", downloadAllZip);

})();
