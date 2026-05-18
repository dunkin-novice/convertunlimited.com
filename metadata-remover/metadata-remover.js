(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("remover-dropzone");
  const fileInput = $("remover-file-input");
  const removeAllBtn = $("remove-all-btn");
  const downloadAllBtn = $("download-all-btn");
  const fileListEl = $("file-list");
  const statusEl = $("remover-status");

  const STRINGS = {
    en: { ready: "Ready", processingFile: "Processing", cleaned: "Cleaned", failed: "Failed", invalid: "Unsupported file", download: "Download", added: "Files are processed in your browser and never uploaded.", processing: "Stripping metadata locally...", done: "Done. Metadata removed from cleaned files.", none: "Choose JPG, PNG, or WebP images first.", noZip: "ZIP export is unavailable in this browser session.", downloaded: "Download started.", loadError: "Could not load this image." },
    th: { ready: "พร้อม", processingFile: "กำลังทำงาน", cleaned: "ล้างแล้ว", failed: "ล้มเหลว", invalid: "ไฟล์ไม่รองรับ", download: "ดาวน์โหลด", added: "Files are processed in your browser and never uploaded.", processing: "กำลังลบ metadata ในเครื่อง...", done: "เสร็จแล้ว ลบ metadata จากไฟล์ที่ล้างได้แล้ว", none: "เลือกภาพ JPG, PNG หรือ WebP ก่อน", noZip: "ไม่สามารถส่งออก ZIP ในเบราว์เซอร์นี้ได้", downloaded: "เริ่มดาวน์โหลดแล้ว", loadError: "โหลดรูปภาพนี้ไม่ได้" },
    vi: { ready: "Sẵn sàng", processingFile: "Đang xử lý", cleaned: "Đã sạch", failed: "Lỗi", invalid: "Tệp không hỗ trợ", download: "Tải xuống", added: "Files are processed in your browser and never uploaded.", processing: "Đang xóa metadata cục bộ...", done: "Xong. Metadata đã được xóa khỏi các tệp đã làm sạch.", none: "Hãy chọn ảnh JPG, PNG hoặc WebP trước.", noZip: "Không thể xuất ZIP trong phiên trình duyệt này.", downloaded: "Đã bắt đầu tải xuống.", loadError: "Không thể tải ảnh này." },
    zh: { ready: "就绪", processingFile: "处理中", cleaned: "已清理", failed: "失败", invalid: "不支持的文件", download: "下载", added: "Files are processed in your browser and never uploaded.", processing: "正在本地移除 metadata...", done: "完成。已从可清理文件中移除 metadata。", none: "请先选择 JPG、PNG 或 WebP 图片。", noZip: "此浏览器会话无法导出 ZIP。", downloaded: "已开始下载。", loadError: "无法加载此图片。" },
    ja: { ready: "準備完了", processingFile: "処理中", cleaned: "削除済み", failed: "失敗", invalid: "未対応ファイル", download: "ダウンロード", added: "Files are processed in your browser and never uploaded.", processing: "metadata をローカルで削除しています...", done: "完了。処理できたファイルから metadata を削除しました。", none: "JPG、PNG、WebP 画像を先に選択してください。", noZip: "このブラウザセッションでは ZIP 書き出しを利用できません。", downloaded: "ダウンロードを開始しました。", loadError: "この画像を読み込めませんでした。" },
    ko: { ready: "준비됨", processingFile: "처리 중", cleaned: "정리됨", failed: "실패", invalid: "지원하지 않는 파일", download: "다운로드", added: "Files are processed in your browser and never uploaded.", processing: "metadata를 로컬에서 제거하는 중...", done: "완료. 정리된 파일에서 metadata를 제거했습니다.", none: "먼저 JPG, PNG 또는 WebP 이미지를 선택하세요.", noZip: "이 브라우저 세션에서는 ZIP 내보내기를 사용할 수 없습니다.", downloaded: "다운로드가 시작되었습니다.", loadError: "이 이미지를 불러올 수 없습니다." },
    es: { ready: "Listo", processingFile: "Procesando", cleaned: "Limpio", failed: "Error", invalid: "Archivo no compatible", download: "Descargar", added: "Files are processed in your browser and never uploaded.", processing: "Eliminando metadata localmente...", done: "Listo. Metadata eliminada de los archivos limpiados.", none: "Elige imágenes JPG, PNG o WebP primero.", noZip: "La exportación ZIP no está disponible en esta sesión.", downloaded: "Descarga iniciada.", loadError: "No se pudo cargar esta imagen." },
    fr: { ready: "Prêt", processingFile: "Traitement", cleaned: "Nettoyé", failed: "Échec", invalid: "Fichier non pris en charge", download: "Télécharger", added: "Files are processed in your browser and never uploaded.", processing: "Suppression des metadata localement...", done: "Terminé. Metadata supprimées des fichiers nettoyés.", none: "Choisissez d’abord des images JPG, PNG ou WebP.", noZip: "L’export ZIP est indisponible dans cette session.", downloaded: "Téléchargement lancé.", loadError: "Impossible de charger cette image." },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  let filesToProcess = [];
  let isStripping = false;

  function formatSize(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${parseFloat((bytes / Math.pow(1024, index)).toFixed(1))} ${units[index]}`;
  }

  function isSupportedImage(file) {
    return ["image/jpeg", "image/png", "image/webp"].includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
  }

  function outputTypeFor(file) {
    if (file.type === "image/png" || /\.png$/i.test(file.name)) return "image/png";
    if (file.type === "image/webp" || /\.webp$/i.test(file.name)) return "image/webp";
    return "image/jpeg";
  }

  function cleanName(file, type) {
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    const ext = type === "image/jpeg" ? "jpg" : type.split("/")[1] || "png";
    return `clean-${base}.${ext}`;
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  async function addFiles(files) {
    let accepted = 0;
    let rejected = 0;
    Array.from(files).forEach((file) => {
      const valid = isSupportedImage(file);
      filesToProcess.push({
        file,
        id: Math.random().toString(36).slice(2, 11),
        originalSize: file.size,
        outputType: valid ? outputTypeFor(file) : "",
        strippedBlob: null,
        status: valid ? "ready" : "invalid",
        error: valid ? "" : t.invalid,
      });
      if (valid) accepted += 1;
      else rejected += 1;
    });
    renderFileList();
    removeAllBtn.disabled = filesToProcess.every((item) => item.status !== "ready");
    downloadAllBtn.disabled = filesToProcess.every((item) => !item.strippedBlob);
    statusEl.textContent = rejected ? `${t.added} ${rejected} ${t.invalid.toLowerCase()}.` : t.added;
    if (typeof window.cuTrack === "function") window.cuTrack("file_selected", { file_count: accepted });
  }

  function statusText(item) {
    if (item.status === "cleaned") return t.cleaned;
    if (item.status === "processing") return t.processingFile;
    if (item.status === "failed") return item.error || t.failed;
    if (item.status === "invalid") return item.error || t.invalid;
    return t.ready;
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    filesToProcess.forEach((item) => {
      const row = createEl("div", "file-row");
      row.style = "display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;background:var(--bg-2);border-radius:8px;margin-bottom:8px;font-size:13px;overflow-wrap:anywhere;";

      const info = createEl("div");
      info.style = "display:flex;flex-direction:column;gap:2px;min-width:0;";
      const name = createEl("strong", "", item.file.name);
      const meta = createEl("span", "", `${formatSize(item.originalSize)} · ${item.file.type || t.invalid}`);
      meta.style = "color:var(--ink-3)";
      info.appendChild(name);
      info.appendChild(meta);

      const status = createEl("div");
      status.style = "text-align:right;display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end;";
      const statusStack = createEl("div");
      statusStack.style = "display:flex;flex-direction:column;";
      const state = createEl("span", "num", statusText(item));
      state.style = `font-weight:600;color:${item.status === "failed" || item.status === "invalid" ? "var(--danger, #b94a48)" : "inherit"}`;
      statusStack.appendChild(state);
      if (item.strippedBlob) {
        const size = createEl("span", "", `${formatSize(item.strippedBlob.size)}`);
        size.style = "color:var(--accent);font-weight:600;";
        statusStack.appendChild(size);
      }
      status.appendChild(statusStack);
      if (item.strippedBlob) {
        const button = createEl("button", "btn btn-sm btn-ghost", t.download);
        button.type = "button";
        button.addEventListener("click", () => downloadSingle(item.id));
        status.appendChild(button);
      }

      row.appendChild(info);
      row.appendChild(status);
      fileListEl.appendChild(row);
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = t.downloaded;
  }

  function downloadSingle(id) {
    const item = filesToProcess.find((entry) => entry.id === id);
    if (!item || !item.strippedBlob) return;
    downloadBlob(item.strippedBlob, cleanName(item.file, item.outputType));
  }

  async function stripFile(item) {
    if (item.status === "invalid") return;
    item.status = "processing";
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const quality = item.outputType === "image/png" ? undefined : 0.95;
          canvas.toBlob((blob) => {
            if (blob) {
              item.strippedBlob = blob;
              item.status = "cleaned";
              item.error = "";
            } else {
              item.status = "failed";
              item.error = t.failed;
            }
            resolve();
          }, item.outputType, quality);
        };
        img.onerror = () => {
          item.status = "failed";
          item.error = t.loadError;
          resolve();
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        item.status = "failed";
        item.error = t.loadError;
        resolve();
      };
      reader.readAsDataURL(item.file);
    });
  }

  async function stripAll() {
    if (isStripping) return;
    const processable = filesToProcess.filter((item) => item.status === "ready" || item.status === "failed");
    if (!processable.length) {
      statusEl.textContent = t.none;
      return;
    }
    isStripping = true;
    removeAllBtn.disabled = true;
    statusEl.textContent = t.processing;

    for (const item of processable) {
      await stripFile(item);
      renderFileList();
    }

    statusEl.textContent = t.done;
    downloadAllBtn.disabled = filesToProcess.every((item) => !item.strippedBlob);
    removeAllBtn.disabled = filesToProcess.every((item) => item.status !== "ready" && item.status !== "failed");
    isStripping = false;
    if (typeof window.cuTrack === "function") window.cuTrack("processing_completed", { file_count: processable.length });
  }

  async function downloadAll() {
    const cleaned = filesToProcess.filter((item) => item.strippedBlob);
    if (!cleaned.length) return;
    if (typeof JSZip === "undefined") {
      statusEl.textContent = t.noZip;
      return;
    }
    const zip = new JSZip();
    cleaned.forEach((item) => {
      zip.file(cleanName(item.file, item.outputType), item.strippedBlob);
    });
    const content = await zip.generateAsync({ type: "blob" });
    downloadBlob(content, "clean-images.zip");
    if (typeof window.cuTrack === "function") window.cuTrack("batch_download_clicked", { file_count: cleaned.length });
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", (event) => {
    if (event.target.files.length > 0) addFiles(event.target.files);
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
    if (event.dataTransfer.files.length > 0) addFiles(event.dataTransfer.files);
  });
  removeAllBtn.addEventListener("click", stripAll);
  downloadAllBtn.addEventListener("click", downloadAll);
  statusEl.textContent = t.added;
})();
