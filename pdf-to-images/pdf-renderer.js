(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const dropzone = $("pdf-to-img-dropzone");
  const fileInput = $("pdf-to-img-file-input");
  const formatSelect = $("pdf-to-img-format");
  const scaleSelect = $("pdf-to-img-scale");
  const pageStartInput = $("pdf-page-start");
  const pageEndInput = $("pdf-page-end");
  const renderBtn = $("render-pdf-btn");
  const downloadAllBtn = $("download-all-btn");
  const fileListEl = $("file-list");
  const statusEl = $("pdf-to-img-status");

  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
  }

  const STRINGS = {
    en: { added: "Files are processed in your browser and never uploaded.", invalid: "Choose a valid PDF file.", loaded: "PDF loaded", pages: "pages", convert: "Click Convert PDF to extract images.", rendering: "Rendering page", of: "of", done: "Done. Pages converted to images.", failed: "Failed to load PDF. It may be corrupted or password protected.", pageFailed: "Page render failed", noPages: "No pages match that range.", noZip: "ZIP export is unavailable in this browser session.", saved: "Download started.", save: "Save" },
    th: { added: "Files are processed in your browser and never uploaded.", invalid: "เลือกไฟล์ PDF ที่ถูกต้อง", loaded: "โหลด PDF แล้ว", pages: "หน้า", convert: "กด Convert PDF เพื่อแยกรูปภาพ", rendering: "กำลังแสดงหน้า", of: "จาก", done: "เสร็จแล้ว แปลงหน้าเป็นรูปภาพแล้ว", failed: "โหลด PDF ไม่สำเร็จ ไฟล์อาจเสียหายหรือติดรหัสผ่าน", pageFailed: "แสดงหน้านี้ไม่สำเร็จ", noPages: "ไม่มีหน้าที่ตรงกับช่วงนี้", noZip: "ไม่สามารถส่งออก ZIP ในเบราว์เซอร์นี้ได้", saved: "เริ่มดาวน์โหลดแล้ว", save: "บันทึก" },
    vi: { added: "Files are processed in your browser and never uploaded.", invalid: "Chọn tệp PDF hợp lệ.", loaded: "Đã tải PDF", pages: "trang", convert: "Bấm Convert PDF để xuất ảnh.", rendering: "Đang render trang", of: "trên", done: "Xong. Các trang đã được chuyển thành ảnh.", failed: "Không thể tải PDF. Tệp có thể hỏng hoặc được bảo vệ bằng mật khẩu.", pageFailed: "Không thể render trang", noPages: "Không có trang nào khớp với phạm vi đó.", noZip: "Không thể xuất ZIP trong phiên trình duyệt này.", saved: "Đã bắt đầu tải xuống.", save: "Lưu" },
    zh: { added: "Files are processed in your browser and never uploaded.", invalid: "请选择有效的 PDF 文件。", loaded: "PDF 已加载", pages: "页", convert: "点击 Convert PDF 提取图片。", rendering: "正在渲染第", of: "页，共", done: "完成。页面已转换为图片。", failed: "无法加载 PDF。文件可能已损坏或受密码保护。", pageFailed: "页面渲染失败", noPages: "没有页面符合该范围。", noZip: "此浏览器会话无法导出 ZIP。", saved: "已开始下载。", save: "保存" },
    ja: { added: "Files are processed in your browser and never uploaded.", invalid: "有効な PDF ファイルを選択してください。", loaded: "PDF を読み込みました", pages: "ページ", convert: "Convert PDF を押して画像を抽出します。", rendering: "ページをレンダリング中", of: "/", done: "完了。ページを画像に変換しました。", failed: "PDF を読み込めません。破損またはパスワード保護されている可能性があります。", pageFailed: "ページのレンダリングに失敗", noPages: "指定範囲に該当するページがありません。", noZip: "このブラウザセッションでは ZIP 書き出しを利用できません。", saved: "ダウンロードを開始しました。", save: "保存" },
    ko: { added: "Files are processed in your browser and never uploaded.", invalid: "올바른 PDF 파일을 선택하세요.", loaded: "PDF 로드됨", pages: "페이지", convert: "Convert PDF를 눌러 이미지를 추출하세요.", rendering: "페이지 렌더링 중", of: "/", done: "완료. 페이지가 이미지로 변환되었습니다.", failed: "PDF를 불러올 수 없습니다. 파일이 손상되었거나 비밀번호로 보호되었을 수 있습니다.", pageFailed: "페이지 렌더링 실패", noPages: "해당 범위에 맞는 페이지가 없습니다.", noZip: "이 브라우저 세션에서는 ZIP 내보내기를 사용할 수 없습니다.", saved: "다운로드가 시작되었습니다.", save: "저장" },
    es: { added: "Files are processed in your browser and never uploaded.", invalid: "Elige un archivo PDF válido.", loaded: "PDF cargado", pages: "páginas", convert: "Pulsa Convert PDF para extraer imágenes.", rendering: "Renderizando página", of: "de", done: "Listo. Páginas convertidas a imágenes.", failed: "No se pudo cargar el PDF. Puede estar dañado o protegido con contraseña.", pageFailed: "Error al renderizar página", noPages: "Ninguna página coincide con ese rango.", noZip: "La exportación ZIP no está disponible en esta sesión.", saved: "Descarga iniciada.", save: "Guardar" },
    fr: { added: "Files are processed in your browser and never uploaded.", invalid: "Choisissez un fichier PDF valide.", loaded: "PDF chargé", pages: "pages", convert: "Cliquez sur Convert PDF pour extraire les images.", rendering: "Rendu de la page", of: "sur", done: "Terminé. Pages converties en images.", failed: "Impossible de charger le PDF. Il est peut-être corrompu ou protégé par mot de passe.", pageFailed: "Échec du rendu de la page", noPages: "Aucune page ne correspond à cette plage.", noZip: "L’export ZIP est indisponible dans cette session.", saved: "Téléchargement lancé.", save: "Enregistrer" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  let currentPdf = null;
  let sourceName = "pdf";
  let pages = [];
  let isRendering = false;

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function ext() {
    return formatSelect.value === "jpeg" ? "jpg" : formatSelect.value;
  }

  function outputType() {
    return `image/${formatSelect.value}`;
  }

  function safeBaseName(name) {
    return (name || "pdf").replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "pdf";
  }

  function setBusy(value) {
    isRendering = value;
    renderBtn.disabled = value || !currentPdf;
    downloadAllBtn.disabled = value || pages.length === 0;
  }

  function resetOutput() {
    pages.forEach((page) => URL.revokeObjectURL(page.url));
    pages = [];
    fileListEl.innerHTML = "";
    downloadAllBtn.disabled = true;
  }

  function pageRange() {
    const total = currentPdf ? currentPdf.numPages : 0;
    const start = Math.max(1, Math.min(total, Number.parseInt(pageStartInput.value, 10) || 1));
    const end = Math.max(start, Math.min(total, Number.parseInt(pageEndInput.value, 10) || total));
    const result = [];
    for (let i = start; i <= end; i += 1) result.push(i);
    return result;
  }

  async function loadPdf(file) {
    if (!file || (file.type && file.type !== "application/pdf" && !/\.pdf$/i.test(file.name))) {
      statusEl.textContent = t.invalid;
      return;
    }
    if (!window.pdfjsLib) {
      statusEl.textContent = t.failed;
      return;
    }
    resetOutput();
    currentPdf = null;
    renderBtn.disabled = true;
    statusEl.textContent = t.added;
    sourceName = safeBaseName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      currentPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      pageStartInput.value = "1";
      pageEndInput.value = String(currentPdf.numPages);
      pageStartInput.max = String(currentPdf.numPages);
      pageEndInput.max = String(currentPdf.numPages);
      renderBtn.disabled = false;
      statusEl.textContent = `${t.loaded}: ${currentPdf.numPages} ${t.pages}. ${t.convert}`;
      if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded", { page_count: currentPdf.numPages });
    } catch (error) {
      console.error("PDF load failed:", error);
      statusEl.textContent = t.failed;
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "corrupt_input" });
    }
  }

  function renderPageCard(page) {
    const card = createEl("div", "file-card");
    card.style = "background:var(--bg-2);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0;";

    const preview = createEl("div");
    preview.style = "aspect-ratio:1;background:var(--bg-3);border-radius:8px;overflow:hidden;display:grid;place-items:center;";
    const img = createEl("img");
    img.src = page.url;
    img.alt = `Page ${page.id}`;
    img.style = "width:100%;height:100%;object-fit:contain;";
    preview.appendChild(img);

    const row = createEl("div");
    row.style = "display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;";
    const label = createEl("span", "", `Page ${page.id}`);
    label.style = "font-size:12px;font-weight:600;";
    const button = createEl("button", "btn btn-sm btn-ghost", t.save);
    button.type = "button";
    button.addEventListener("click", () => downloadPage(page));
    row.appendChild(label);
    row.appendChild(button);

    card.appendChild(preview);
    card.appendChild(row);
    fileListEl.appendChild(card);
  }

  async function renderPages() {
    if (!currentPdf || isRendering) return;
    const selectedPages = pageRange();
    if (!selectedPages.length) {
      statusEl.textContent = t.noPages;
      return;
    }
    resetOutput();
    setBusy(true);
    const scale = Number.parseFloat(scaleSelect.value) || 2;
    const type = outputType();

    for (let index = 0; index < selectedPages.length; index += 1) {
      const pageNumber = selectedPages[index];
      statusEl.textContent = `${t.rendering} ${pageNumber} ${t.of} ${currentPdf.numPages}...`;
      try {
        const page = await currentPdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, type, type === "image/png" ? undefined : 0.92);
        });
        if (!blob) throw new Error("canvas export failed");
        const url = URL.createObjectURL(blob);
        const record = { id: pageNumber, blob, url };
        pages.push(record);
        renderPageCard(record);
      } catch (error) {
        console.error(`Page ${pageNumber} render failed:`, error);
        const card = createEl("div", "file-card", `${t.pageFailed}: ${pageNumber}`);
        card.style = "background:var(--bg-2);border-radius:12px;padding:12px;color:var(--ink-3);";
        fileListEl.appendChild(card);
        if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unknown" });
      }
    }

    statusEl.textContent = pages.length ? t.done : t.noPages;
    setBusy(false);
    if (typeof window.cuTrack === "function") window.cuTrack("pdf_action_completed", { page_count: pages.length, format: formatSelect.value });
  }

  function downloadPage(page) {
    const url = URL.createObjectURL(page.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sourceName}-page-${page.id}.${ext()}`;
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = t.saved;
  }

  async function downloadAllZip() {
    if (!pages.length) return;
    if (typeof JSZip === "undefined") {
      statusEl.textContent = t.noZip;
      return;
    }
    const zip = new JSZip();
    pages.forEach((page) => {
      zip.file(`${sourceName}-page-${page.id}.${ext()}`, page.blob);
    });
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sourceName}-images.zip`;
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = t.saved;
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", (event) => {
    if (event.target.files.length > 0) loadPdf(event.target.files[0]);
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
    if (event.dataTransfer.files.length > 0) loadPdf(event.dataTransfer.files[0]);
  });
  renderBtn.addEventListener("click", renderPages);
  downloadAllBtn.addEventListener("click", downloadAllZip);
  statusEl.textContent = t.added;
})();
