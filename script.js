/* ConvertUnlimited — vanilla JS port of the design's converter logic */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const layout = $("layout");
  const formatSeg = $("format-seg");
  const qualityField = $("quality-field");
  const qualitySelect = $("quality-select");
  const viewSeg = $("view-seg");
  const emptyState = $("empty-state");
  const filledState = $("filled-state");
  const dropzone = $("dropzone");
  const fileInput = $("file-input");
  const dragOverlay = $("drag-overlay");
  const summaryCount = $("summary-count");
  const summaryNoun = $("summary-noun");
  const summarySavings = $("summary-savings");
  const addMoreBtn = $("add-more-btn");
  const primaryBtn = $("primary-btn");
  const primaryBtnLabel = $("primary-btn-label");
  const primaryBtnIcon = $("primary-btn-icon");
  const clearBtn = $("clear-btn");
  const listView = $("list-view");
  const listRows = $("list-rows");
  const gridView = $("grid-view");
  const statTotal = $("stat-total");
  const statDone = $("stat-done");
  const statSrc = $("stat-src");
  const statOut = $("stat-out");
  const statSaved = $("stat-saved");

  let items = [];
  let format = "webp";
  let quality = 0.75;
  let view = "list";
  let bulkBusy = false;
  let dragCount = 0;
  let _idCounter = 0;
  const nextId = () => ++_idCounter;

  // GA4 event helper — silently no-ops if gtag is unavailable (ad-blocker, offline).
  function track(name, params) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, params || {});
      }
    } catch (_) { /* noop */ }
  }

  // ---- i18n: dynamic strings rendered by JS. Static page text is translated in each /<lang>/index.html. ----
  const STRINGS = {
    en: {
      status_ready: "Ready", status_busy: "Converting…", status_done: "Converted", status_err: "Failed",
      file_one: "file", file_other: "files",
      save: "Save", saved: "Saved", convert: "Convert", converting: "Converting…",
      convert_all_to: "Convert all to {fmt}", download_all_zip: "Download all as ZIP", download_format: "Download {fmt}",
      saved_summary: "· saved {bytes} ({pct}%)", n_converted: "· {n} converted",
    },
    th: {
      status_ready: "พร้อม", status_busy: "กำลังแปลง…", status_done: "เสร็จแล้ว", status_err: "ล้มเหลว",
      file_one: "ไฟล์", file_other: "ไฟล์",
      save: "บันทึก", saved: "บันทึกแล้ว", convert: "แปลง", converting: "กำลังแปลง…",
      convert_all_to: "แปลงทั้งหมดเป็น {fmt}", download_all_zip: "ดาวน์โหลดเป็น ZIP", download_format: "ดาวน์โหลด {fmt}",
      saved_summary: "· ประหยัด {bytes} ({pct}%)", n_converted: "· แปลงแล้ว {n}",
    },
    vi: {
      status_ready: "Sẵn sàng", status_busy: "Đang chuyển…", status_done: "Đã chuyển", status_err: "Thất bại",
      file_one: "tệp", file_other: "tệp",
      save: "Lưu", saved: "Đã lưu", convert: "Chuyển", converting: "Đang chuyển…",
      convert_all_to: "Chuyển tất cả sang {fmt}", download_all_zip: "Tải về dạng ZIP", download_format: "Tải {fmt}",
      saved_summary: "· tiết kiệm {bytes} ({pct}%)", n_converted: "· đã chuyển {n}",
    },
    zh: {
      status_ready: "就绪", status_busy: "转换中…", status_done: "已完成", status_err: "失败",
      file_one: "个文件", file_other: "个文件",
      save: "保存", saved: "已保存", convert: "转换", converting: "转换中…",
      convert_all_to: "全部转换为 {fmt}", download_all_zip: "下载为 ZIP", download_format: "下载 {fmt}",
      saved_summary: "· 节省 {bytes}（{pct}%）", n_converted: "· 已转换 {n}",
    },
    ja: {
      status_ready: "準備完了", status_busy: "変換中…", status_done: "完了", status_err: "失敗",
      file_one: "ファイル", file_other: "ファイル",
      save: "保存", saved: "保存済み", convert: "変換", converting: "変換中…",
      convert_all_to: "すべて {fmt} に変換", download_all_zip: "ZIP でダウンロード", download_format: "{fmt} をダウンロード",
      saved_summary: "· {bytes} 節約（{pct}%）", n_converted: "· {n} 件変換済み",
    },
    es: {
      status_ready: "Listo", status_busy: "Convirtiendo…", status_done: "Convertido", status_err: "Falló",
      file_one: "archivo", file_other: "archivos",
      save: "Guardar", saved: "Guardado", convert: "Convertir", converting: "Convirtiendo…",
      convert_all_to: "Convertir todo a {fmt}", download_all_zip: "Descargar como ZIP", download_format: "Descargar {fmt}",
      saved_summary: "· ahorraste {bytes} ({pct}%)", n_converted: "· {n} convertido",
    },
    ko: {
      status_ready: "준비됨", status_busy: "변환 중…", status_done: "완료", status_err: "실패",
      file_one: "개 파일", file_other: "개 파일",
      save: "저장", saved: "저장됨", convert: "변환", converting: "변환 중…",
      convert_all_to: "전체 {fmt}로 변환", download_all_zip: "ZIP으로 다운로드", download_format: "{fmt} 다운로드",
      saved_summary: "· {bytes} 절약 ({pct}%)", n_converted: "· {n}개 변환됨",
    },
    fr: {
      status_ready: "Prêt", status_busy: "Conversion…", status_done: "Converti", status_err: "Échec",
      file_one: "fichier", file_other: "fichiers",
      save: "Enregistrer", saved: "Enregistré", convert: "Convertir", converting: "Conversion…",
      convert_all_to: "Tout convertir en {fmt}", download_all_zip: "Télécharger en ZIP", download_format: "Télécharger {fmt}",
      saved_summary: "· {bytes} économisés ({pct}%)", n_converted: "· {n} converti",
    },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  const fmtStr = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] != null ? vars[k] : ""));

  const ICON_DOWNLOAD = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  const ICON_REFRESH = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15A9 9 0 1 1 17 4.6L23 10"/></svg>';
  const ICON_X = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const ICON_BOLT = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
  const ICON_ARCHIVE = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="4" rx="1"/><path d="M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7"/><line x1="10" y1="12" x2="14" y2="12"/></svg>';
  const ICON_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>';

  function formatBytes(b) {
    if (b == null || isNaN(b)) return "—";
    if (b < 1024) return b + " B";
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
    return (b / 1024 / 1024).toFixed(2) + " MB";
  }
  function extOf(name) {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
  }
  function baseOf(name) {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(0, i) : name;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function readPreview(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
  }

  function convertFile(file, fmt, q) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        try {
          // SVG without intrinsic width/height can report 0 in some browsers; fall back so it still renders.
          const w = img.naturalWidth || img.width || 1024;
          const h = img.naturalHeight || img.height || 1024;
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (fmt === "jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objUrl);
              if (!blob) { reject(new Error("Encode failed")); return; }
              resolve({ blob });
            },
            "image/" + fmt,
            fmt === "png" ? undefined : q
          );
        } catch (e) {
          URL.revokeObjectURL(objUrl);
          reject(e);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        reject(new Error("Cannot read image"));
      };
      img.src = objUrl;
    });
  }

  async function addFiles(filelist, source) {
    const arr = Array.from(filelist || []).filter(
      (f) => f.type.startsWith("image/") || /\.(jpe?g|png|gif|svg|webp|bmp)$/i.test(f.name)
    );
    if (!arr.length) return;
    const newItems = await Promise.all(
      arr.map(async (file) => {
        let previewUrl = null;
        try { previewUrl = await readPreview(file); } catch (e) { /* ignore */ }
        return {
          id: nextId(),
          file,
          name: file.name,
          ext: extOf(file.name) || (file.type.split("/")[1] || ""),
          srcSize: file.size,
          previewUrl,
          status: "ready",
          outBlob: null,
          outUrl: null,
          outSize: 0,
          downloaded: false,
          error: null,
        };
      })
    );
    items = items.concat(newItems);
    render();
    track("add_files", {
      count: arr.length,
      source: source || "picker",
      total_bytes: arr.reduce((a, b) => a + (b.size || 0), 0),
    });
  }

  function removeItem(id) {
    const it = items.find((x) => x.id === id);
    if (it && it.outUrl) URL.revokeObjectURL(it.outUrl);
    items = items.filter((x) => x.id !== id);
    render();
  }

  function clearAll() {
    items.forEach((it) => { if (it.outUrl) URL.revokeObjectURL(it.outUrl); });
    items = [];
    render();
  }

  async function convertOne(id) {
    const target = items.find((x) => x.id === id);
    if (!target) return;
    target.status = "busy";
    target.error = null;
    render();
    track("convert_started", {
      count: 1,
      format,
      quality,
      total_bytes: target.srcSize || 0,
    });
    try {
      const { blob } = await convertFile(target.file, format, quality);
      target.status = "done";
      target.outBlob = blob;
      target.outUrl = URL.createObjectURL(blob);
      target.outSize = blob.size;
      target.downloaded = false;
      const inB = target.srcSize || 0;
      const outB = blob.size || 0;
      track("convert_completed", {
        count: 1,
        format,
        quality,
        total_in_bytes: inB,
        total_out_bytes: outB,
        saved_pct: inB > 0 ? Math.round(((inB - outB) / inB) * 100) : 0,
        errors: 0,
      });
    } catch (e) {
      target.status = "err";
      target.error = String(e && e.message || e);
      track("convert_completed", {
        count: 0,
        format,
        quality,
        total_in_bytes: target.srcSize || 0,
        total_out_bytes: 0,
        saved_pct: 0,
        errors: 1,
      });
    }
    render();
  }

  async function convertAll() {
    const targets = items.filter((it) => it.status === "ready" || it.status === "err");
    if (!targets.length) return;
    bulkBusy = true;
    targets.forEach((t) => { t.status = "busy"; t.error = null; });
    render();
    const startedBytes = targets.reduce((a, b) => a + (b.srcSize || 0), 0);
    track("convert_started", {
      count: targets.length,
      format,
      quality,
      total_bytes: startedBytes,
    });
    let successCount = 0;
    let errorCount = 0;
    let totalInBytes = 0;
    let totalOutBytes = 0;
    const BATCH = 3;
    for (let i = 0; i < targets.length; i += BATCH) {
      const slice = targets.slice(i, i + BATCH);
      await Promise.all(slice.map(async (target) => {
        try {
          const { blob } = await convertFile(target.file, format, quality);
          target.status = "done";
          target.outBlob = blob;
          target.outUrl = URL.createObjectURL(blob);
          target.outSize = blob.size;
          target.downloaded = false;
          successCount++;
          totalInBytes += target.srcSize || 0;
          totalOutBytes += blob.size || 0;
        } catch (e) {
          target.status = "err";
          target.error = String(e && e.message || e);
          errorCount++;
        }
        render();
      }));
    }
    bulkBusy = false;
    render();
    const savedPct = totalInBytes > 0
      ? Math.round(((totalInBytes - totalOutBytes) / totalInBytes) * 100)
      : 0;
    track("convert_completed", {
      count: successCount,
      format,
      quality,
      total_in_bytes: totalInBytes,
      total_out_bytes: totalOutBytes,
      saved_pct: savedPct,
      errors: errorCount,
    });
  }

  function downloadOne(it) {
    if (!it.outUrl) return;
    const a = document.createElement("a");
    a.href = it.outUrl;
    a.download = baseOf(it.name) + "." + format;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    it.downloaded = true;
    render();
    track("download_single", { format, bytes: it.outSize || 0 });
  }

  async function downloadAllZip() {
    const dones = items.filter((x) => x.status === "done" && x.outBlob);
    if (!dones.length || !window.JSZip) return;
    const zip = new window.JSZip();
    dones.forEach((it) => {
      zip.file(baseOf(it.name) + "." + format, it.outBlob);
    });
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "convertunlimited_" + format + ".zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    dones.forEach((it) => { it.downloaded = true; });
    render();
    track("download_zip", {
      count: dones.length,
      format,
      bytes: content.size || 0,
    });
  }

  function statsOf() {
    const done = items.filter((x) => x.status === "done");
    const totalSrc = items.reduce((a, b) => a + (b.srcSize || 0), 0);
    const totalOut = done.reduce((a, b) => a + (b.outSize || 0), 0);
    const doneSrc = done.reduce((a, b) => a + (b.srcSize || 0), 0);
    const savedBytes = doneSrc - totalOut;
    const savedPct = doneSrc > 0 ? (savedBytes / doneSrc) * 100 : 0;
    return {
      total: items.length,
      done: done.length,
      ready: items.filter((x) => x.status === "ready").length,
      busy: items.filter((x) => x.status === "busy").length,
      err: items.filter((x) => x.status === "err").length,
      totalSrc, totalOut, savedBytes, savedPct,
    };
  }

  function rowHtml(it) {
    const saved = it.outSize ? it.srcSize - it.outSize : 0;
    const savedPct = it.outSize ? (saved / it.srcSize) * 100 : 0;
    const statusLabel = { ready: t.status_ready, busy: t.status_busy, done: t.status_done, err: t.status_err }[it.status];
    const meta =
      (it.ext ? it.ext.toUpperCase() : "—") +
      " → " + format.toUpperCase() +
      (it.error ? " · " + escapeHtml(it.error) : "");

    let actionMain = "";
    if (it.status === "done") {
      actionMain = `<button class="dlbtn ${it.downloaded ? "done" : ""}" data-act="download" data-id="${it.id}" ${it.downloaded ? "disabled" : ""}>${ICON_DOWNLOAD} ${it.downloaded ? t.saved : t.save}</button>`;
    } else if (it.status !== "busy") {
      actionMain = `<button class="iconbtn" data-act="convert" data-id="${it.id}" title="${t.convert}">${ICON_REFRESH}</button>`;
    }
    const removeBtn = `<button class="iconbtn danger" data-act="remove" data-id="${it.id}" title="Remove">${ICON_X}</button>`;

    const thumb = it.previewUrl
      ? `<img src="${it.previewUrl}" alt="">`
      : `<span class="ext">${escapeHtml(it.ext)}</span>`;

    return `
      <div class="row" data-id="${it.id}">
        <div class="thumb">${thumb}</div>
        <div class="name">
          <span class="fn" title="${escapeHtml(it.name)}">${escapeHtml(it.name)}</span>
          <span class="meta">${meta}</span>
        </div>
        <div class="size before num">${formatBytes(it.srcSize)}</div>
        <div class="arrow">→</div>
        <div class="size after num">${it.outSize ? formatBytes(it.outSize) : "—"}</div>
        <div class="save num ${saved <= 0 ? "zero" : ""}">${
          it.status === "done" ? (saved > 0 ? "−" + savedPct.toFixed(0) + "%" : "—") : ""
        }</div>
        <div class="status ${it.status}"><span class="stdot"></span>${statusLabel}</div>
        <div class="actions">${actionMain}${removeBtn}</div>
      </div>
    `;
  }

  function cardHtml(it) {
    const saved = it.outSize ? it.srcSize - it.outSize : 0;
    const savedPct = it.outSize ? (saved / it.srcSize) * 100 : 0;
    const meta =
      formatBytes(it.srcSize) +
      (it.outSize ? " → " + formatBytes(it.outSize) : "");
    let actionBtn;
    if (it.status === "done") {
      actionBtn = `<button class="dlbtn ${it.downloaded ? "done" : ""}" data-act="download" data-id="${it.id}" ${it.downloaded ? "disabled" : ""}>${it.downloaded ? t.saved : fmtStr(t.download_format, { fmt: format.toUpperCase() })}</button>`;
    } else if (it.status === "busy") {
      actionBtn = `<button class="dlbtn" disabled>${t.converting}</button>`;
    } else {
      actionBtn = `<button class="dlbtn" data-act="convert" data-id="${it.id}">${t.convert}</button>`;
    }
    const imgwrap = it.previewUrl
      ? `<img src="${it.previewUrl}" alt="">`
      : ICON_IMAGE;
    return `
      <div class="card" data-id="${it.id}">
        <button class="remove" data-act="remove" data-id="${it.id}" aria-label="Remove">×</button>
        <div class="imgwrap">${imgwrap}</div>
        <div class="info">
          <span class="fn" title="${escapeHtml(it.name)}">${escapeHtml(it.name)}</span>
          <span class="meta">
            <span>${meta}</span>
            ${it.status === "done" && saved > 0 ? `<span class="save">−${savedPct.toFixed(0)}%</span>` : ""}
          </span>
          <div class="actions">${actionBtn}</div>
        </div>
      </div>
    `;
  }

  function render() {
    const s = statsOf();
    const hasItems = s.total > 0;
    const allDone = hasItems && s.done === s.total;
    const fmt = format.toUpperCase();

    emptyState.classList.toggle("hidden", hasItems);
    filledState.classList.toggle("hidden", !hasItems);
    viewSeg.classList.toggle("hidden", !hasItems);

    Array.from(formatSeg.querySelectorAll("button")).forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.format === format));
    });
    Array.from(viewSeg.querySelectorAll("button")).forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.view === view));
    });

    qualityField.classList.toggle("disabled", format === "png");
    qualitySelect.disabled = format === "png";

    summaryCount.textContent = String(s.total);
    summaryNoun.textContent = s.total === 1 ? t.file_one : t.file_other;
    if (s.done > 0) {
      summarySavings.classList.remove("hidden");
      summarySavings.textContent = s.savedBytes > 0
        ? fmtStr(t.saved_summary, { bytes: formatBytes(s.savedBytes), pct: s.savedPct.toFixed(0) })
        : fmtStr(t.n_converted, { n: s.done });
    } else {
      summarySavings.classList.add("hidden");
      summarySavings.textContent = "";
    }

    if (allDone) {
      primaryBtn.disabled = false;
      primaryBtn.dataset.action = "download-all";
      primaryBtnIcon.innerHTML = ICON_ARCHIVE;
      primaryBtnLabel.textContent = t.download_all_zip;
    } else if (bulkBusy) {
      primaryBtn.disabled = true;
      primaryBtnIcon.innerHTML = "";
      primaryBtnLabel.innerHTML = `${t.converting} <span class="num mono">${s.done}/${s.total}</span>`;
    } else {
      primaryBtn.disabled = (s.ready + s.err) === 0;
      primaryBtn.dataset.action = "convert-all";
      primaryBtnIcon.innerHTML = ICON_BOLT;
      primaryBtnLabel.textContent = fmtStr(t.convert_all_to, { fmt });
    }

    statTotal.textContent = String(s.total);
    statDone.textContent = String(s.done);
    statSrc.textContent = s.totalSrc > 0 ? formatBytes(s.totalSrc) : "—";
    statOut.textContent = s.totalOut > 0 ? formatBytes(s.totalOut) : "—";
    if (s.savedBytes > 0) {
      statSaved.textContent = `${formatBytes(s.savedBytes)} · ${s.savedPct.toFixed(0)}%`;
      statSaved.classList.add("green");
    } else {
      statSaved.textContent = "—";
      statSaved.classList.remove("green");
    }

    if (view === "list") {
      listView.classList.remove("hidden");
      gridView.classList.add("hidden");
      listRows.innerHTML = items.map(rowHtml).join("");
    } else {
      listView.classList.add("hidden");
      gridView.classList.remove("hidden");
      gridView.innerHTML = items.map(cardHtml).join("");
    }
  }

  formatSeg.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-format]");
    if (!btn) return;
    if (btn.dataset.format !== format) {
      track("select_format", { format: btn.dataset.format });
    }
    format = btn.dataset.format;
    render();
  });

  qualitySelect.addEventListener("change", () => {
    quality = parseFloat(qualitySelect.value);
  });

  viewSeg.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-view]");
    if (!btn) return;
    view = btn.dataset.view;
    render();
  });

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
  });
  dropzone.addEventListener("dragenter", () => dropzone.classList.add("drag"));
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
  dropzone.addEventListener("drop", () => dropzone.classList.remove("drag"));

  fileInput.addEventListener("change", (e) => {
    addFiles(e.target.files, "picker");
    e.target.value = "";
  });

  addMoreBtn.addEventListener("click", () => fileInput.click());

  primaryBtn.addEventListener("click", () => {
    if (primaryBtn.disabled) return;
    if (primaryBtn.dataset.action === "download-all") downloadAllZip();
    else convertAll();
  });

  clearBtn.addEventListener("click", clearAll);

  function delegate(e) {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    const it = items.find((x) => x.id === id);
    const act = btn.dataset.act;
    if (act === "remove") removeItem(id);
    else if (act === "convert") convertOne(id);
    else if (act === "download" && it) downloadOne(it);
  }
  listRows.addEventListener("click", delegate);
  gridView.addEventListener("click", delegate);

  window.addEventListener("dragenter", (e) => {
    if (!e.dataTransfer || !Array.from(e.dataTransfer.types || []).includes("Files")) return;
    e.preventDefault();
    dragCount++;
    if (dragCount === 1) dragOverlay.classList.add("active");
  });
  window.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragCount = Math.max(0, dragCount - 1);
    if (dragCount === 0) dragOverlay.classList.remove("active");
  });
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("drop", (e) => {
    e.preventDefault();
    dragCount = 0;
    dragOverlay.classList.remove("active");
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files, "drop");
    }
  });

  // Initialise each AdSense <ins> on the page (one push() per slot).
  // Manual slots coexist with Auto Ads — Auto Ads will fill remaining
  // opportunities (incl. vignette/popup) once enabled in your AdSense dashboard.
  try {
    const adUnits = document.querySelectorAll("ins.adsbygoogle");
    adUnits.forEach(() => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  } catch (_) { /* noop */ }

  const yearEl = document.getElementById("copyright-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  render();
})();
