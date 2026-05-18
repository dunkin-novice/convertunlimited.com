(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const titleEl = $("meta-title");
  const descEl = $("meta-description");
  const urlEl = $("meta-url");
  const imageEl = $("meta-image");
  const siteEl = $("meta-site");
  const titleCountEl = $("meta-title-count");
  const descCountEl = $("meta-description-count");
  const titleHintEl = $("meta-title-hint");
  const descHintEl = $("meta-description-hint");
  const googleTitleEl = $("google-title");
  const googleUrlEl = $("google-url");
  const googleDescEl = $("google-description");
  const ogSiteEl = $("og-site");
  const ogTitleEl = $("og-title");
  const ogDescEl = $("og-description");
  const ogUrlEl = $("og-url");
  const ogImageEl = $("og-image");
  const xTitleEl = $("x-title");
  const xDescEl = $("x-description");
  const xUrlEl = $("x-url");
  const xImageEl = $("x-image");
  const fillBtn = $("meta-fill-sample");
  const clearBtn = $("meta-clear");
  const copyBtn = $("meta-copy");

  const STRINGS = {
    en: { titleOk: "Title length looks practical.", titleShort: "Title is short; add useful context.", titleLong: "Title may truncate in search results.", descOk: "Description length looks practical.", descShort: "Description is short; add a useful summary.", descLong: "Description may truncate in search results.", fallbackTitle: "Page title preview", fallbackDesc: "Meta description preview will appear here.", fallbackUrl: "https://www.example.com/page", fallbackSite: "Example Site", copied: "Preview text copied." },
    th: { titleOk: "ความยาวชื่อเหมาะสม", titleShort: "ชื่อสั้นไป ลองเพิ่มบริบท", titleLong: "ชื่ออาจถูกตัดในผลค้นหา", descOk: "ความยาวคำอธิบายเหมาะสม", descShort: "คำอธิบายสั้นไป ลองเพิ่มสรุป", descLong: "คำอธิบายอาจถูกตัดในผลค้นหา", fallbackTitle: "ตัวอย่างชื่อหน้า", fallbackDesc: "ตัวอย่าง meta description จะแสดงที่นี่", fallbackUrl: "https://www.example.com/page", fallbackSite: "เว็บไซต์ตัวอย่าง", copied: "คัดลอกข้อความตัวอย่างแล้ว" },
    vi: { titleOk: "Độ dài tiêu đề hợp lý.", titleShort: "Tiêu đề hơi ngắn; hãy thêm ngữ cảnh hữu ích.", titleLong: "Tiêu đề có thể bị cắt trong kết quả tìm kiếm.", descOk: "Độ dài mô tả hợp lý.", descShort: "Mô tả hơi ngắn; hãy thêm phần tóm tắt.", descLong: "Mô tả có thể bị cắt trong kết quả tìm kiếm.", fallbackTitle: "Bản xem trước tiêu đề", fallbackDesc: "Bản xem trước meta description sẽ hiển thị ở đây.", fallbackUrl: "https://www.example.com/page", fallbackSite: "Trang mẫu", copied: "Đã sao chép văn bản xem trước." },
    zh: { titleOk: "标题长度比较合适。", titleShort: "标题偏短，可添加有用信息。", titleLong: "标题可能在搜索结果中被截断。", descOk: "描述长度比较合适。", descShort: "描述偏短，可添加简洁摘要。", descLong: "描述可能在搜索结果中被截断。", fallbackTitle: "页面标题预览", fallbackDesc: "Meta 描述预览会显示在这里。", fallbackUrl: "https://www.example.com/page", fallbackSite: "示例网站", copied: "已复制预览文本。" },
    ja: { titleOk: "タイトルの長さは実用的です。", titleShort: "タイトルが短めです。文脈を追加してください。", titleLong: "検索結果でタイトルが省略される可能性があります。", descOk: "説明文の長さは実用的です。", descShort: "説明文が短めです。要約を追加してください。", descLong: "検索結果で説明文が省略される可能性があります。", fallbackTitle: "ページタイトルのプレビュー", fallbackDesc: "メタディスクリプションのプレビューがここに表示されます。", fallbackUrl: "https://www.example.com/page", fallbackSite: "サンプルサイト", copied: "プレビューテキストをコピーしました。" },
    ko: { titleOk: "제목 길이가 적절합니다.", titleShort: "제목이 짧습니다. 유용한 맥락을 추가하세요.", titleLong: "검색 결과에서 제목이 잘릴 수 있습니다.", descOk: "설명 길이가 적절합니다.", descShort: "설명이 짧습니다. 요약을 추가하세요.", descLong: "검색 결과에서 설명이 잘릴 수 있습니다.", fallbackTitle: "페이지 제목 미리보기", fallbackDesc: "메타 설명 미리보기가 여기에 표시됩니다.", fallbackUrl: "https://www.example.com/page", fallbackSite: "예시 사이트", copied: "미리보기 텍스트가 복사되었습니다." },
    es: { titleOk: "La longitud del título parece práctica.", titleShort: "El título es corto; añade contexto útil.", titleLong: "El título puede truncarse en los resultados.", descOk: "La longitud de la descripción parece práctica.", descShort: "La descripción es corta; añade un resumen útil.", descLong: "La descripción puede truncarse en los resultados.", fallbackTitle: "Vista previa del título", fallbackDesc: "La vista previa de la meta descripción aparecerá aquí.", fallbackUrl: "https://www.example.com/page", fallbackSite: "Sitio de ejemplo", copied: "Texto de vista previa copiado." },
    fr: { titleOk: "La longueur du titre semble adaptée.", titleShort: "Le titre est court; ajoutez du contexte utile.", titleLong: "Le titre peut être tronqué dans les résultats.", descOk: "La longueur de la description semble adaptée.", descShort: "La description est courte; ajoutez un résumé utile.", descLong: "La description peut être tronquée dans les résultats.", fallbackTitle: "Aperçu du titre de page", fallbackDesc: "L’aperçu de la méta description apparaîtra ici.", fallbackUrl: "https://www.example.com/page", fallbackSite: "Site d’exemple", copied: "Texte d’aperçu copié." },
  };

  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  let textStarted = false;
  let userActionReady = false;
  let previewTracked = false;

  function text(el, value) {
    el.textContent = value;
  }

  function normalizeUrl(value) {
    const trimmed = value.trim();
    if (!trimmed) return t.fallbackUrl;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  function hostOf(url) {
    try {
      return new URL(url).host || url;
    } catch (_) {
      return url;
    }
  }

  function imageAllowed(value) {
    return /^https?:\/\/[^\s]+$/i.test(value.trim());
  }

  function setPreviewImage(el, value) {
    const url = value.trim();
    el.innerHTML = "";
    if (imageAllowed(url)) {
      const img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.src = url;
      el.appendChild(img);
      el.classList.add("has-image");
    } else {
      text(el, "OG");
      el.classList.remove("has-image");
    }
  }

  function updateGuidance(title, description) {
    titleCountEl.textContent = `${title.length}`;
    descCountEl.textContent = `${description.length}`;
    titleHintEl.textContent = title.length < 30 ? t.titleShort : title.length > 60 ? t.titleLong : t.titleOk;
    descHintEl.textContent = description.length < 80 ? t.descShort : description.length > 160 ? t.descLong : t.descOk;
  }

  function update() {
    const title = titleEl.value.trim() || t.fallbackTitle;
    const description = descEl.value.trim() || t.fallbackDesc;
    const url = normalizeUrl(urlEl.value);
    const site = siteEl.value.trim() || t.fallbackSite;

    updateGuidance(titleEl.value.trim(), descEl.value.trim());
    text(googleTitleEl, title);
    text(googleUrlEl, hostOf(url));
    text(googleDescEl, description);
    text(ogSiteEl, site);
    text(ogTitleEl, title);
    text(ogDescEl, description);
    text(ogUrlEl, hostOf(url));
    text(xTitleEl, title);
    text(xDescEl, description);
    text(xUrlEl, hostOf(url));
    setPreviewImage(ogImageEl, imageEl.value);
    setPreviewImage(xImageEl, imageEl.value);
    if (userActionReady && !previewTracked && typeof window.cuTrack === "function") {
      previewTracked = true;
      window.cuTrack("tool_completed");
    }
  }

  function fillSample() {
    titleEl.value = "ConvertUnlimited - Free Browser-Based Utility Tools";
    descEl.value = "Convert, compress, preview, and generate useful web assets directly in your browser with no signup and no uploads.";
    urlEl.value = "https://www.convertunlimited.com/tools/";
    imageEl.value = "https://www.convertunlimited.com/og-image.svg";
    siteEl.value = "ConvertUnlimited";
    if (userActionReady && typeof window.cuTrack === "function") window.cuTrack("sample_used");
    update();
  }

  function clearAll() {
    [titleEl, descEl, urlEl, imageEl, siteEl].forEach((el) => { el.value = ""; });
    update();
  }

  async function copyPreview() {
    const title = titleEl.value.trim() || t.fallbackTitle;
    const description = descEl.value.trim() || t.fallbackDesc;
    const url = normalizeUrl(urlEl.value);
    const value = `${title}\n${description}\n${url}`;
    try {
      await navigator.clipboard.writeText(value);
      statusMessage(t.copied);
    } catch (_) {
      statusMessage(value);
    }
    if (typeof window.cuTrack === "function") window.cuTrack("copy_clicked");
  }

  function statusMessage(value) {
    const status = $("meta-copy-status");
    status.textContent = value;
  }

  [titleEl, descEl, urlEl, imageEl, siteEl].forEach((el) => el.addEventListener("input", () => {
    if (!textStarted && (titleEl.value || descEl.value || urlEl.value || imageEl.value || siteEl.value)) {
      textStarted = true;
      if (typeof window.cuTrack === "function") window.cuTrack("text_input_started");
    }
    update();
  }));
  fillBtn.addEventListener("click", fillSample);
  clearBtn.addEventListener("click", clearAll);
  copyBtn.addEventListener("click", copyPreview);
  update();
  userActionReady = true;
  if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded");
})();
