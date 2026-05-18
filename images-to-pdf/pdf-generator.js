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

  const STRINGS = {
    en: { ready: "Ready", invalid: "Unsupported file", failed: "Could not load image", added: "Files are processed in your browser and never uploaded.", none: "Choose JPG, PNG, or WebP images first.", generating: "Generating PDF locally...", done: "Done. PDF downloaded.", error: "Error generating PDF. Please try again.", remove: "Remove", up: "Move up", down: "Move down", rotate: "Rotate" },
    th: { ready: "พร้อม", invalid: "ไฟล์ไม่รองรับ", failed: "โหลดรูปภาพไม่ได้", added: "Files are processed in your browser and never uploaded.", none: "เลือกภาพ JPG, PNG หรือ WebP ก่อน", generating: "กำลังสร้าง PDF ในเครื่อง...", done: "เสร็จแล้ว ดาวน์โหลด PDF แล้ว", error: "สร้าง PDF ไม่สำเร็จ ลองอีกครั้ง", remove: "ลบ", up: "เลื่อนขึ้น", down: "เลื่อนลง", rotate: "หมุน" },
    vi: { ready: "Sẵn sàng", invalid: "Tệp không hỗ trợ", failed: "Không thể tải ảnh", added: "Files are processed in your browser and never uploaded.", none: "Hãy chọn ảnh JPG, PNG hoặc WebP trước.", generating: "Đang tạo PDF cục bộ...", done: "Xong. PDF đã được tải xuống.", error: "Lỗi khi tạo PDF. Vui lòng thử lại.", remove: "Xóa", up: "Di chuyển lên", down: "Di chuyển xuống", rotate: "Xoay" },
    zh: { ready: "就绪", invalid: "不支持的文件", failed: "无法加载图片", added: "Files are processed in your browser and never uploaded.", none: "请先选择 JPG、PNG 或 WebP 图片。", generating: "正在本地生成 PDF...", done: "完成。PDF 已下载。", error: "生成 PDF 出错，请重试。", remove: "移除", up: "上移", down: "下移", rotate: "旋转" },
    ja: { ready: "準備完了", invalid: "未対応ファイル", failed: "画像を読み込めません", added: "Files are processed in your browser and never uploaded.", none: "JPG、PNG、WebP 画像を先に選択してください。", generating: "PDF をローカルで生成しています...", done: "完了。PDF をダウンロードしました。", error: "PDF 生成に失敗しました。もう一度試してください。", remove: "削除", up: "上へ", down: "下へ", rotate: "回転" },
    ko: { ready: "준비됨", invalid: "지원하지 않는 파일", failed: "이미지를 불러올 수 없음", added: "Files are processed in your browser and never uploaded.", none: "먼저 JPG, PNG 또는 WebP 이미지를 선택하세요.", generating: "PDF를 로컬에서 생성하는 중...", done: "완료. PDF가 다운로드되었습니다.", error: "PDF 생성 오류. 다시 시도하세요.", remove: "삭제", up: "위로", down: "아래로", rotate: "회전" },
    es: { ready: "Listo", invalid: "Archivo no compatible", failed: "No se pudo cargar la imagen", added: "Files are processed in your browser and never uploaded.", none: "Elige imágenes JPG, PNG o WebP primero.", generating: "Generando PDF localmente...", done: "Listo. PDF descargado.", error: "Error al generar PDF. Inténtalo de nuevo.", remove: "Eliminar", up: "Subir", down: "Bajar", rotate: "Rotar" },
    fr: { ready: "Prêt", invalid: "Fichier non pris en charge", failed: "Impossible de charger l’image", added: "Files are processed in your browser and never uploaded.", none: "Choisissez d’abord des images JPG, PNG ou WebP.", generating: "Génération du PDF localement...", done: "Terminé. PDF téléchargé.", error: "Erreur lors de la génération du PDF. Réessayez.", remove: "Supprimer", up: "Monter", down: "Descendre", rotate: "Pivoter" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  let filesToProcess = [];
  let isGenerating = false;

  function formatSize(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${parseFloat((bytes / Math.pow(1024, index)).toFixed(1))} ${units[index]}`;
  }

  function isSupportedImage(file) {
    return ["image/jpeg", "image/png", "image/webp"].includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("image load failed"));
      img.src = src;
    });
  }

  async function addFiles(files) {
    let accepted = 0;
    let rejected = 0;
    for (const file of Array.from(files)) {
      if (!isSupportedImage(file)) {
        filesToProcess.push({
          id: Math.random().toString(36).slice(2, 11),
          name: file.name,
          size: file.size,
          status: "invalid",
          error: t.invalid,
        });
        rejected += 1;
        continue;
      }
      try {
        const previewUrl = await readAsDataUrl(file);
        const img = await loadImage(previewUrl);
        filesToProcess.push({
          file,
          id: Math.random().toString(36).slice(2, 11),
          name: file.name,
          size: file.size,
          previewUrl,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          rotation: 0,
          status: "ready",
        });
        accepted += 1;
      } catch (_) {
        filesToProcess.push({
          id: Math.random().toString(36).slice(2, 11),
          name: file.name,
          size: file.size,
          status: "failed",
          error: t.failed,
        });
        rejected += 1;
      }
    }
    renderFileList();
    updateGenerateState();
    statusEl.textContent = rejected ? `${t.added} ${rejected} ${t.invalid.toLowerCase()}.` : t.added;
    if (typeof window.cuTrack === "function") window.cuTrack("file_selected", { file_count: accepted });
  }

  function updateGenerateState() {
    generateBtn.disabled = isGenerating || filesToProcess.every((item) => item.status !== "ready");
  }

  function movePage(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= filesToProcess.length) return;
    const current = filesToProcess[index];
    filesToProcess[index] = filesToProcess[target];
    filesToProcess[target] = current;
    renderFileList();
  }

  function rotatePage(index) {
    const item = filesToProcess[index];
    if (!item || item.status !== "ready") return;
    item.rotation = (item.rotation + 90) % 360;
    renderFileList();
  }

  function removePage(index) {
    filesToProcess.splice(index, 1);
    renderFileList();
    updateGenerateState();
  }

  function renderButton(label, title, disabled, onClick) {
    const button = createEl("button", "btn btn-sm btn-ghost", label);
    button.type = "button";
    button.title = title;
    button.disabled = disabled;
    button.addEventListener("click", onClick);
    return button;
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    filesToProcess.forEach((item, index) => {
      const card = createEl("div", "file-card");
      card.style = "background:var(--bg-2);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px;position:relative;min-width:0;";

      const preview = createEl("div");
      preview.style = "position:relative;aspect-ratio:1;background:var(--bg-3);border-radius:8px;overflow:hidden;display:grid;place-items:center;";
      if (item.previewUrl) {
        const img = createEl("img");
        img.src = item.previewUrl;
        img.alt = item.name;
        img.style = `width:100%;height:100%;object-fit:contain;transform:rotate(${item.rotation}deg);`;
        preview.appendChild(img);
      } else {
        const state = createEl("span", "", item.error || t.invalid);
        state.style = "font-size:12px;color:var(--ink-3);text-align:center;padding:8px;";
        preview.appendChild(state);
      }

      const info = createEl("div");
      info.style = "display:flex;flex-direction:column;gap:2px;min-width:0;";
      const name = createEl("strong", "", item.name || "image");
      name.style = "font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
      const meta = createEl("span", "", item.status === "ready" ? `${item.width}x${item.height} · ${formatSize(item.size)}` : `${formatSize(item.size)} · ${item.error || t.invalid}`);
      meta.style = "font-size:11px;color:var(--ink-4);";
      info.appendChild(name);
      info.appendChild(meta);

      const controls = createEl("div");
      controls.style = "display:flex;gap:4px;flex-wrap:wrap;";
      controls.appendChild(renderButton("↑", t.up, index === 0, () => movePage(index, -1)));
      controls.appendChild(renderButton("↓", t.down, index === filesToProcess.length - 1, () => movePage(index, 1)));
      controls.appendChild(renderButton("⟳", t.rotate, item.status !== "ready", () => rotatePage(index)));
      const remove = renderButton("×", t.remove, false, () => removePage(index));
      remove.style = "color:var(--accent);";
      controls.appendChild(remove);

      card.appendChild(preview);
      card.appendChild(info);
      card.appendChild(controls);
      fileListEl.appendChild(card);
    });
  }

  function pageImageData(item) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const rotated = item.rotation % 180 !== 0;
        const sourceWidth = img.naturalWidth || img.width;
        const sourceHeight = img.naturalHeight || img.height;
        const canvas = document.createElement("canvas");
        canvas.width = rotated ? sourceHeight : sourceWidth;
        canvas.height = rotated ? sourceWidth : sourceHeight;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.drawImage(img, -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight);
        ctx.restore();
        resolve({
          dataUrl: canvas.toDataURL("image/jpeg", 0.95),
          width: canvas.width,
          height: canvas.height,
        });
      };
      img.onerror = () => reject(new Error("image load failed"));
      img.src = item.previewUrl;
    });
  }

  async function generatePdf() {
    const items = filesToProcess.filter((item) => item.status === "ready");
    if (!items.length) {
      statusEl.textContent = t.none;
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      statusEl.textContent = t.error;
      return;
    }
    isGenerating = true;
    updateGenerateState();
    statusEl.textContent = t.generating;

    try {
      const { jsPDF } = window.jspdf;
      const orientation = orientationSelect.value;
      const pageSize = sizeSelect.value === "auto" ? "a4" : sizeSelect.value;
      const margin = Number.parseInt(marginSelect.value, 10) || 0;
      const doc = new jsPDF({ orientation, unit: "mm", format: pageSize });

      for (let i = 0; i < items.length; i += 1) {
        if (i > 0) doc.addPage(pageSize, orientation);
        const image = await pageImageData(items[i]);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const printableWidth = Math.max(10, pageWidth - margin * 2);
        const printableHeight = Math.max(10, pageHeight - margin * 2);
        const ratio = Math.min(printableWidth / image.width, printableHeight / image.height);
        const finalWidth = image.width * ratio;
        const finalHeight = image.height * ratio;
        const x = margin + (printableWidth - finalWidth) / 2;
        const y = margin + (printableHeight - finalHeight) / 2;
        doc.addImage(image.dataUrl, "JPEG", x, y, finalWidth, finalHeight, undefined, "FAST");
      }

      doc.save("convertunlimited-images.pdf");
      statusEl.textContent = t.done;
      if (typeof window.cuTrack === "function") window.cuTrack("pdf_action_completed", { file_count: items.length });
    } catch (error) {
      console.error("PDF generation failed:", error);
      statusEl.textContent = t.error;
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unknown" });
    } finally {
      isGenerating = false;
      updateGenerateState();
    }
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
  generateBtn.addEventListener("click", generatePdf);
  statusEl.textContent = t.added;
})();
