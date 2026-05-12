(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const inputEl = $("json-input");
  const outputEl = $("json-output");
  const indentEl = $("json-indent");
  const fileEl = $("json-file");
  const statusEl = $("json-status");
  const errorEl = $("json-error");
  const countEl = $("json-count");
  const formatBtn = $("json-format");
  const minifyBtn = $("json-minify");
  const validateBtn = $("json-validate");
  const copyBtn = $("json-copy");
  const clearBtn = $("json-clear");
  const sampleBtn = $("json-sample");
  const downloadBtn = $("json-download");

  const STRINGS = {
    en: { empty: "Paste JSON to begin.", valid: "Valid JSON.", formatted: "JSON formatted.", minified: "JSON minified.", copied: "Output copied.", cleared: "Cleared.", fileLoaded: "File loaded locally.", invalid: "Invalid JSON", line: "line", column: "column", downloadName: "formatted.json" },
    th: { empty: "วาง JSON เพื่อเริ่ม", valid: "JSON ถูกต้อง", formatted: "จัดรูปแบบ JSON แล้ว", minified: "ย่อ JSON แล้ว", copied: "คัดลอกผลลัพธ์แล้ว", cleared: "ล้างแล้ว", fileLoaded: "โหลดไฟล์ในเครื่องแล้ว", invalid: "JSON ไม่ถูกต้อง", line: "บรรทัด", column: "คอลัมน์", downloadName: "formatted.json" },
    vi: { empty: "Dán JSON để bắt đầu.", valid: "JSON hợp lệ.", formatted: "Đã định dạng JSON.", minified: "Đã rút gọn JSON.", copied: "Đã sao chép kết quả.", cleared: "Đã xóa.", fileLoaded: "Đã tải tệp cục bộ.", invalid: "JSON không hợp lệ", line: "dòng", column: "cột", downloadName: "formatted.json" },
    zh: { empty: "粘贴 JSON 以开始。", valid: "JSON 有效。", formatted: "JSON 已格式化。", minified: "JSON 已压缩。", copied: "已复制输出。", cleared: "已清空。", fileLoaded: "已在本地读取文件。", invalid: "JSON 无效", line: "行", column: "列", downloadName: "formatted.json" },
    ja: { empty: "JSON を貼り付けて開始します。", valid: "有効な JSON です。", formatted: "JSON を整形しました。", minified: "JSON を圧縮しました。", copied: "出力をコピーしました。", cleared: "クリアしました。", fileLoaded: "ファイルをローカルで読み込みました。", invalid: "JSON が無効です", line: "行", column: "列", downloadName: "formatted.json" },
    ko: { empty: "JSON을 붙여넣어 시작하세요.", valid: "유효한 JSON입니다.", formatted: "JSON이 포맷되었습니다.", minified: "JSON이 압축되었습니다.", copied: "출력이 복사되었습니다.", cleared: "지웠습니다.", fileLoaded: "파일을 로컬에서 불러왔습니다.", invalid: "잘못된 JSON", line: "줄", column: "열", downloadName: "formatted.json" },
    es: { empty: "Pega JSON para empezar.", valid: "JSON válido.", formatted: "JSON formateado.", minified: "JSON minificado.", copied: "Salida copiada.", cleared: "Limpiado.", fileLoaded: "Archivo cargado localmente.", invalid: "JSON no válido", line: "línea", column: "columna", downloadName: "formatted.json" },
    fr: { empty: "Collez du JSON pour commencer.", valid: "JSON valide.", formatted: "JSON formaté.", minified: "JSON minifié.", copied: "Sortie copiée.", cleared: "Effacé.", fileLoaded: "Fichier chargé localement.", invalid: "JSON invalide", line: "ligne", column: "colonne", downloadName: "formatted.json" },
  };

  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  function indentValue() {
    if (indentEl.value === "tab") return "\t";
    return Number(indentEl.value);
  }

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.style.color = isError ? "var(--warn)" : "var(--ink-3)";
  }

  function updateCount() {
    countEl.textContent = String(inputEl.value.length);
  }

  function lineColumnFromPosition(text, position) {
    const before = text.slice(0, position);
    const lines = before.split(/\n/);
    return { line: lines.length, column: lines[lines.length - 1].length + 1 };
  }

  function parseJson() {
    const raw = inputEl.value;
    if (!raw.trim()) throw new Error(t.empty);
    try {
      return JSON.parse(raw);
    } catch (error) {
      const match = String(error.message).match(/position\s+(\d+)/i);
      if (match) {
        const loc = lineColumnFromPosition(raw, Number(match[1]));
        throw new Error(`${t.invalid}: ${error.message} (${t.line} ${loc.line}, ${t.column} ${loc.column})`);
      }
      throw new Error(`${t.invalid}: ${error.message}`);
    }
  }

  function run(mode) {
    errorEl.textContent = "";
    try {
      const parsed = parseJson();
      if (mode === "validate") {
        setStatus(t.valid, false);
        return;
      }
      outputEl.value = mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indentValue());
      setStatus(mode === "minify" ? t.minified : t.formatted, false);
    } catch (error) {
      errorEl.textContent = error.message;
      setStatus(error.message, true);
    }
  }

  async function copyOutput() {
    if (!outputEl.value) return;
    try {
      await navigator.clipboard.writeText(outputEl.value);
      setStatus(t.copied, false);
    } catch (_) {
      outputEl.select();
      document.execCommand("copy");
      setStatus(t.copied, false);
    }
  }

  function clearAll() {
    inputEl.value = "";
    outputEl.value = "";
    errorEl.textContent = "";
    updateCount();
    setStatus(t.cleared, false);
  }

  function sample() {
    inputEl.value = JSON.stringify({
      name: "ConvertUnlimited",
      tools: ["JSON Formatter", "QR Generator", "Meta Preview Checker"],
      unicode: "Hello 世界 👋",
      settings: { localFirst: true, uploads: false, indent: 2 },
    });
    updateCount();
    run("format");
  }

  function downloadOutput() {
    if (!outputEl.value) return;
    const blob = new Blob([outputEl.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = t.downloadName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      inputEl.value = String(reader.result || "");
      updateCount();
      setStatus(t.fileLoaded, false);
    };
    reader.onerror = () => setStatus(reader.error ? reader.error.message : t.invalid, true);
    reader.readAsText(file);
  }

  inputEl.addEventListener("input", updateCount);
  fileEl.addEventListener("change", (event) => {
    loadFile(event.target.files[0]);
    event.target.value = "";
  });
  formatBtn.addEventListener("click", () => run("format"));
  minifyBtn.addEventListener("click", () => run("minify"));
  validateBtn.addEventListener("click", () => run("validate"));
  copyBtn.addEventListener("click", copyOutput);
  clearBtn.addEventListener("click", clearAll);
  sampleBtn.addEventListener("click", sample);
  downloadBtn.addEventListener("click", downloadOutput);
  updateCount();
  setStatus(t.empty, false);
})();
