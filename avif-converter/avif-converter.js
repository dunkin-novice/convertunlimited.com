(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("avif-dropzone");
  const fileInput = $("avif-file-input");
  const qualitySlider = $("avif-quality");
  const qualityValue = $("avif-quality-value");
  const convertAllBtn = $("avif-convert-all-btn");
  const downloadAllBtn = $("avif-download-all-btn");
  const fileListEl = $("avif-file-list");
  const statusEl = $("avif-status");
  const unsupportedEl = $("avif-unsupported");

  const STRINGS = {
    en: { ready: "Ready", converting: "Converting locally...", done: "Done", failed: "Could not convert", download: "Download", unsupported: "This browser cannot encode AVIF images. Try the latest Chrome, Edge, or Firefox.", zip: "avif-images.zip" },
    th: { ready: "พร้อม", converting: "กำลังแปลงในเบราว์เซอร์...", done: "เสร็จแล้ว", failed: "แปลงไม่ได้", download: "ดาวน์โหลด", unsupported: "เบราว์เซอร์นี้ยังเข้ารหัสภาพ AVIF ไม่ได้ ลองใช้ Chrome, Edge หรือ Firefox เวอร์ชันล่าสุด", zip: "avif-images.zip" },
    vi: { ready: "Sẵn sàng", converting: "Đang chuyển trong trình duyệt...", done: "Hoàn tất", failed: "Không thể chuyển đổi", download: "Tải xuống", unsupported: "Trình duyệt này chưa thể mã hóa ảnh AVIF. Hãy thử Chrome, Edge hoặc Firefox mới nhất.", zip: "avif-images.zip" },
    zh: { ready: "就绪", converting: "正在本地转换...", done: "完成", failed: "无法转换", download: "下载", unsupported: "此浏览器无法编码 AVIF 图片。请尝试最新版 Chrome、Edge 或 Firefox。", zip: "avif-images.zip" },
    ja: { ready: "準備完了", converting: "ブラウザ内で変換中...", done: "完了", failed: "変換できませんでした", download: "ダウンロード", unsupported: "このブラウザは AVIF 画像のエンコードに対応していません。最新の Chrome、Edge、Firefox をお試しください。", zip: "avif-images.zip" },
    ko: { ready: "준비됨", converting: "브라우저에서 변환 중...", done: "완료", failed: "변환할 수 없음", download: "다운로드", unsupported: "이 브라우저는 AVIF 이미지 인코딩을 지원하지 않습니다. 최신 Chrome, Edge 또는 Firefox를 사용해 보세요.", zip: "avif-images.zip" },
    es: { ready: "Listo", converting: "Convirtiendo localmente...", done: "Listo", failed: "No se pudo convertir", download: "Descargar", unsupported: "Este navegador no puede codificar imágenes AVIF. Prueba la versión más reciente de Chrome, Edge o Firefox.", zip: "imagenes-avif.zip" },
    fr: { ready: "Prêt", converting: "Conversion locale...", done: "Terminé", failed: "Conversion impossible", download: "Télécharger", unsupported: "Ce navigateur ne peut pas encoder les images AVIF. Essayez la dernière version de Chrome, Edge ou Firefox.", zip: "images-avif.zip" },
  };

  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  let filesToProcess = [];
  let avifSupported = false;

  function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, index)).toFixed(1))} ${units[index]}`;
  }

  function baseName(name) {
    const index = name.lastIndexOf(".");
    return index > -1 ? name.slice(0, index) : name;
  }

  function track(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
    } catch (_) { /* noop */ }
  }

  function detectAvifEncoding() {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      canvas.toBlob((blob) => resolve(Boolean(blob && blob.type === "image/avif")), "image/avif", 0.8);
    });
  }

  async function addFiles(files) {
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      filesToProcess.push({
        id: Math.random().toString(36).slice(2, 10),
        file,
        resultBlob: null,
        error: "",
      });
    }
    renderFileList();
    convertAllBtn.disabled = !avifSupported || filesToProcess.length === 0;
    track("avif_files_added", { count: files.length });
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    filesToProcess.forEach((item) => {
      const row = document.createElement("div");
      row.className = "file-row";
      row.style = "display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px; background: var(--bg-2); border-radius: 8px; margin-bottom: 8px; font-size: 13px;";

      const info = document.createElement("div");
      info.style = "display: flex; flex-direction: column; gap: 2px; min-width: 0;";
      info.innerHTML = `<strong style="overflow-wrap:anywhere;">${escapeHtml(item.file.name)}</strong><span style="color: var(--ink-3)">${formatSize(item.file.size)}</span>`;

      const status = document.createElement("div");
      status.style = "text-align: right; display: flex; align-items: center; gap: 12px; flex-shrink: 0;";

      if (item.resultBlob) {
        const reduction = Math.round((1 - item.resultBlob.size / item.file.size) * 100);
        const delta = Number.isFinite(reduction) ? `${reduction >= 0 ? "-" : "+"}${Math.abs(reduction)}%` : "";
        status.innerHTML = `
          <div style="display: flex; flex-direction: column;">
            <span class="num" style="font-weight: 600;">${formatSize(item.resultBlob.size)}</span>
            <span style="color: ${reduction >= 0 ? "var(--accent)" : "var(--warn)"}; font-weight: 600;">${delta}</span>
          </div>
          <button class="btn btn-sm btn-ghost" type="button" data-download="${item.id}">${t.download}</button>
        `;
      } else if (item.error) {
        status.innerHTML = `<span style="color: var(--warn); max-width: 180px;">${escapeHtml(item.error)}</span>`;
      } else {
        status.innerHTML = `<span style="color: var(--ink-4)">${t.ready}</span>`;
      }

      row.appendChild(info);
      row.appendChild(status);
      fileListEl.appendChild(row);
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));
  }

  function convertFile(item, quality) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(item.file);
      image.onload = () => {
        try {
          const width = image.naturalWidth || image.width;
          const height = image.naturalHeight || image.height;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, width, height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob || blob.type !== "image/avif") {
              reject(new Error(t.unsupported));
              return;
            }
            item.resultBlob = blob;
            item.error = "";
            resolve();
          }, "image/avif", quality);
        } catch (error) {
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(t.failed));
      };
      image.src = objectUrl;
    });
  }

  async function convertAll() {
    if (!avifSupported) return;
    const quality = parseInt(qualitySlider.value, 10) / 100;
    convertAllBtn.disabled = true;
    statusEl.textContent = t.converting;

    for (const item of filesToProcess) {
      try {
        await convertFile(item, quality);
      } catch (error) {
        item.error = error && error.message ? error.message : t.failed;
      }
      renderFileList();
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    statusEl.textContent = t.done;
    downloadAllBtn.disabled = filesToProcess.every((item) => !item.resultBlob);
    convertAllBtn.disabled = filesToProcess.length === 0;
    track("avif_convert_completed", { count: filesToProcess.length, quality: qualitySlider.value });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function downloadAll() {
    const converted = filesToProcess.filter((item) => item.resultBlob);
    if (!converted.length) return;
    if (converted.length === 1 || typeof JSZip === "undefined") {
      const item = converted[0];
      downloadBlob(item.resultBlob, `${baseName(item.file.name)}.avif`);
      return;
    }
    const zip = new JSZip();
    converted.forEach((item) => zip.file(`${baseName(item.file.name)}.avif`, item.resultBlob));
    const content = await zip.generateAsync({ type: "blob" });
    downloadBlob(content, t.zip);
    track("avif_download_zip", { count: converted.length });
  }

  qualitySlider.addEventListener("input", () => {
    qualityValue.textContent = `${qualitySlider.value}%`;
  });

  fileListEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-download]");
    if (!button) return;
    const item = filesToProcess.find((candidate) => candidate.id === button.dataset.download);
    if (item && item.resultBlob) downloadBlob(item.resultBlob, `${baseName(item.file.name)}.avif`);
  });

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (event) => {
    if (event.target.files.length) addFiles(event.target.files);
    event.target.value = "";
  });
  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("drag");
  });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("drag");
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  });
  convertAllBtn.addEventListener("click", convertAll);
  downloadAllBtn.addEventListener("click", downloadAll);

  detectAvifEncoding().then((supported) => {
    avifSupported = supported;
    if (!supported) {
      unsupportedEl.hidden = false;
      unsupportedEl.textContent = t.unsupported;
      statusEl.textContent = t.unsupported;
      convertAllBtn.disabled = true;
    }
  });
})();
