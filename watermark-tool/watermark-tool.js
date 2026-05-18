(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const fileInput = $("watermark-file-input");
  const dropzone = $("watermark-dropzone");
  const textInput = $("watermark-text");
  const positionSelect = $("watermark-position");
  const opacityRange = $("watermark-opacity");
  const opacityValue = $("watermark-opacity-value");
  const sizeRange = $("watermark-size");
  const sizeValue = $("watermark-size-value");
  const canvas = $("watermark-canvas");
  const emptyState = $("watermark-empty");
  const statusEl = $("watermark-status");
  const downloadBtn = $("watermark-download");
  const clearBtn = $("watermark-clear");
  const ctx = canvas.getContext("2d");

  const STRINGS = {
    en: { ready: "Choose an image to preview the watermark.", invalid: "Please choose a JPG, PNG, WebP, or other browser-supported image.", loadError: "The image could not be loaded. Try another file.", loaded: "Image loaded. Watermark preview updated locally.", updated: "Preview updated locally.", downloaded: "Watermarked image downloaded.", cleared: "Cleared.", noImage: "Choose an image first." },
    th: { ready: "เลือกรูปภาพเพื่อดูตัวอย่างลายน้ำ", invalid: "กรุณาเลือก JPG, PNG, WebP หรือไฟล์รูปภาพที่เบราว์เซอร์รองรับ", loadError: "โหลดรูปภาพไม่ได้ ลองไฟล์อื่น", loaded: "โหลดรูปภาพแล้ว อัปเดตตัวอย่างลายน้ำในเครื่อง", updated: "อัปเดตตัวอย่างในเครื่องแล้ว", downloaded: "ดาวน์โหลดรูปภาพที่มีลายน้ำแล้ว", cleared: "ล้างแล้ว", noImage: "เลือกรูปภาพก่อน" },
    vi: { ready: "Chọn ảnh để xem trước watermark.", invalid: "Hãy chọn JPG, PNG, WebP hoặc ảnh được trình duyệt hỗ trợ.", loadError: "Không thể tải ảnh. Hãy thử tệp khác.", loaded: "Đã tải ảnh. Bản xem trước watermark được cập nhật cục bộ.", updated: "Đã cập nhật xem trước cục bộ.", downloaded: "Đã tải ảnh có watermark.", cleared: "Đã xóa.", noImage: "Hãy chọn ảnh trước." },
    zh: { ready: "选择图片以预览水印。", invalid: "请选择 JPG、PNG、WebP 或浏览器支持的图片。", loadError: "无法加载图片，请尝试其他文件。", loaded: "图片已加载。水印预览已在本地更新。", updated: "预览已在本地更新。", downloaded: "已下载带水印图片。", cleared: "已清空。", noImage: "请先选择图片。" },
    ja: { ready: "画像を選択してウォーターマークをプレビューします。", invalid: "JPG、PNG、WebP、またはブラウザ対応の画像を選択してください。", loadError: "画像を読み込めませんでした。別のファイルを試してください。", loaded: "画像を読み込みました。ウォーターマークのプレビューをローカルで更新しました。", updated: "プレビューをローカルで更新しました。", downloaded: "ウォーターマーク付き画像をダウンロードしました。", cleared: "クリアしました。", noImage: "先に画像を選択してください。" },
    ko: { ready: "이미지를 선택해 워터마크를 미리 보세요.", invalid: "JPG, PNG, WebP 또는 브라우저가 지원하는 이미지 파일을 선택하세요.", loadError: "이미지를 불러올 수 없습니다. 다른 파일을 시도하세요.", loaded: "이미지를 불러왔습니다. 워터마크 미리보기를 로컬에서 업데이트했습니다.", updated: "미리보기가 로컬에서 업데이트되었습니다.", downloaded: "워터마크 이미지가 다운로드되었습니다.", cleared: "지웠습니다.", noImage: "먼저 이미지를 선택하세요." },
    es: { ready: "Elige una imagen para previsualizar la marca de agua.", invalid: "Elige JPG, PNG, WebP u otra imagen compatible con el navegador.", loadError: "No se pudo cargar la imagen. Prueba otro archivo.", loaded: "Imagen cargada. Vista previa actualizada localmente.", updated: "Vista previa actualizada localmente.", downloaded: "Imagen con marca de agua descargada.", cleared: "Limpiado.", noImage: "Elige una imagen primero." },
    fr: { ready: "Choisissez une image pour prévisualiser le filigrane.", invalid: "Choisissez un JPG, PNG, WebP ou une image prise en charge par le navigateur.", loadError: "L’image n’a pas pu être chargée. Essayez un autre fichier.", loaded: "Image chargée. Aperçu du filigrane mis à jour localement.", updated: "Aperçu mis à jour localement.", downloaded: "Image avec filigrane téléchargée.", cleared: "Effacé.", noImage: "Choisissez d’abord une image." },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  let image = null;
  let fileName = "watermarked-image";
  let textStarted = false;

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function draw() {
    if (!image) {
      canvas.hidden = true;
      emptyState.hidden = false;
      downloadBtn.disabled = true;
      return;
    }
    canvas.hidden = false;
    emptyState.hidden = true;
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const text = textInput.value.trim();
    if (text) {
      const fontSize = Math.max(12, Math.round(canvas.width * (Number(sizeRange.value) / 100)));
      const margin = Math.max(12, Math.round(fontSize * 0.9));
      ctx.save();
      ctx.globalAlpha = Number(opacityRange.value) / 100;
      ctx.font = `700 ${fontSize}px Inter, Arial, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = Math.max(2, Math.round(fontSize / 14));
      ctx.textBaseline = "middle";

      const metrics = ctx.measureText(text);
      let x = margin;
      let y = margin + fontSize / 2;
      const position = positionSelect.value;
      if (position.includes("right")) x = canvas.width - margin - metrics.width;
      if (position.includes("center")) x = (canvas.width - metrics.width) / 2;
      if (position.includes("middle")) y = canvas.height / 2;
      if (position.includes("bottom")) y = canvas.height - margin - fontSize / 2;

      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      ctx.restore();
    }
    downloadBtn.disabled = false;
  }

  function updatePreview() {
    draw();
    if (image) setStatus(t.updated);
  }

  function loadFile(file) {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      setStatus(t.invalid);
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unsupported_format" });
      return;
    }
    const url = URL.createObjectURL(file);
    const nextImage = new Image();
    nextImage.onload = () => {
      URL.revokeObjectURL(url);
      image = nextImage;
      fileName = file.name.replace(/\.[^.]+$/, "") || "watermarked-image";
      draw();
      setStatus(t.loaded);
      if (typeof window.cuTrack === "function") window.cuTrack("file_selected", { file_count: 1, input_format: file.type || "image" });
      if (typeof window.cuTrack === "function") window.cuTrack("processing_completed", { file_count: 1, output_format: "png" });
    };
    nextImage.onerror = () => {
      URL.revokeObjectURL(url);
      setStatus(t.loadError);
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "corrupt_input" });
    };
    nextImage.src = url;
  }

  function download() {
    if (!image) {
      setStatus(t.noImage);
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus(t.loadError);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}-watermarked.png`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus(t.downloaded);
      if (typeof window.cuTrack === "function") window.cuTrack("download_clicked", { output_format: "png", file_count: 1 });
    }, "image/png");
  }

  function clearAll() {
    image = null;
    fileInput.value = "";
    textInput.value = "ConvertUnlimited";
    positionSelect.value = "bottom-right";
    opacityRange.value = "70";
    opacityValue.textContent = "70%";
    sizeRange.value = "6";
    sizeValue.textContent = "6%";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    setStatus(t.cleared);
  }

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) loadFile(file);
  });
  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("drag");
  });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("drag");
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) loadFile(file);
  });
  textInput.addEventListener("input", () => {
    if (!textStarted && textInput.value) {
      textStarted = true;
      if (typeof window.cuTrack === "function") window.cuTrack("text_input_started");
    }
    updatePreview();
  });
  positionSelect.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "position", option_value: positionSelect.value });
    updatePreview();
  });
  opacityRange.addEventListener("input", () => {
    opacityValue.textContent = `${opacityRange.value}%`;
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "opacity" });
    updatePreview();
  });
  sizeRange.addEventListener("input", () => {
    sizeValue.textContent = `${sizeRange.value}%`;
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "size" });
    updatePreview();
  });
  downloadBtn.addEventListener("click", download);
  clearBtn.addEventListener("click", clearAll);

  textInput.value = textInput.value || "ConvertUnlimited";
  setStatus(t.ready);
  draw();
  if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded");
})();
