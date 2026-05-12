(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const inputEl = $("jsoncsv-input");
  const outputEl = $("jsoncsv-output");
  const delimiterEl = $("jsoncsv-delimiter");
  const headersEl = $("jsoncsv-headers");
  const fileEl = $("jsoncsv-file");
  const statusEl = $("jsoncsv-status");
  const warningEl = $("jsoncsv-warning");
  const rowCountEl = $("jsoncsv-row-count");
  const fieldCountEl = $("jsoncsv-field-count");
  const fileSizeEl = $("jsoncsv-file-size");
  const convertBtn = $("jsoncsv-convert");
  const copyBtn = $("jsoncsv-copy");
  const clearBtn = $("jsoncsv-clear");
  const sampleBtn = $("jsoncsv-sample");
  const downloadBtn = $("jsoncsv-download");

  const STRINGS = {
    en: { empty: "Paste JSON to begin.", converted: "JSON converted to CSV locally.", copied: "CSV copied.", cleared: "Cleared.", loaded: "File loaded locally.", invalid: "Invalid JSON: {message}. Original input was preserved.", array: "Use a JSON object or an array of objects.", nested: "Nested values were flattened with dot notation.", rows: "rows", fields: "fields", download: "converted.csv" },
    th: { empty: "วาง JSON เพื่อเริ่ม", converted: "แปลง JSON เป็น CSV ในเครื่องแล้ว", copied: "คัดลอก CSV แล้ว", cleared: "ล้างแล้ว", loaded: "โหลดไฟล์ในเครื่องแล้ว", invalid: "JSON ไม่ถูกต้อง: {message} ข้อมูลเดิมยังถูกเก็บไว้", array: "ใช้ JSON object หรือ array ของ object", nested: "ค่าซ้อนถูก flatten ด้วย dot notation", rows: "แถว", fields: "ฟิลด์", download: "converted.csv" },
    vi: { empty: "Dán JSON để bắt đầu.", converted: "Đã chuyển JSON sang CSV cục bộ.", copied: "Đã sao chép CSV.", cleared: "Đã xóa.", loaded: "Đã tải tệp cục bộ.", invalid: "JSON không hợp lệ: {message}. Dữ liệu gốc được giữ nguyên.", array: "Hãy dùng object JSON hoặc mảng object.", nested: "Giá trị lồng nhau được làm phẳng bằng dot notation.", rows: "dòng", fields: "trường", download: "converted.csv" },
    zh: { empty: "粘贴 JSON 以开始。", converted: "JSON 已在本地转换为 CSV。", copied: "已复制 CSV。", cleared: "已清空。", loaded: "已在本地读取文件。", invalid: "JSON 无效：{message}。原始输入已保留。", array: "请使用 JSON 对象或对象数组。", nested: "嵌套值已使用点号路径展开。", rows: "行", fields: "字段", download: "converted.csv" },
    ja: { empty: "JSON を貼り付けて開始します。", converted: "JSON をローカルで CSV に変換しました。", copied: "CSV をコピーしました。", cleared: "クリアしました。", loaded: "ファイルをローカルで読み込みました。", invalid: "無効な JSON: {message}。元の入力は保持されました。", array: "JSON オブジェクトまたはオブジェクト配列を使用してください。", nested: "ネストした値はドット記法でフラット化しました。", rows: "行", fields: "フィールド", download: "converted.csv" },
    ko: { empty: "JSON을 붙여넣어 시작하세요.", converted: "JSON이 로컬에서 CSV로 변환되었습니다.", copied: "CSV가 복사되었습니다.", cleared: "지웠습니다.", loaded: "파일을 로컬에서 불러왔습니다.", invalid: "잘못된 JSON: {message}. 원본 입력은 유지되었습니다.", array: "JSON 객체 또는 객체 배열을 사용하세요.", nested: "중첩 값은 점 표기법으로 펼쳤습니다.", rows: "행", fields: "필드", download: "converted.csv" },
    es: { empty: "Pega JSON para empezar.", converted: "JSON convertido a CSV localmente.", copied: "CSV copiado.", cleared: "Limpiado.", loaded: "Archivo cargado localmente.", invalid: "JSON no válido: {message}. Se conservó la entrada original.", array: "Usa un objeto JSON o un array de objetos.", nested: "Los valores anidados se aplanaron con notación de puntos.", rows: "filas", fields: "campos", download: "converted.csv" },
    fr: { empty: "Collez du JSON pour commencer.", converted: "JSON converti en CSV localement.", copied: "CSV copié.", cleared: "Effacé.", loaded: "Fichier chargé localement.", invalid: "JSON invalide : {message}. L’entrée originale a été conservée.", array: "Utilisez un objet JSON ou un tableau d’objets.", nested: "Les valeurs imbriquées ont été aplaties avec la notation pointée.", rows: "lignes", fields: "champs", download: "converted.csv" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  function delimiter() {
    return delimiterEl.value === "tab" ? "\t" : delimiterEl.value;
  }

  function formatSize(bytes) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  function flatten(value, prefix, out, meta) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      meta.nested = meta.nested || Boolean(prefix);
      Object.keys(value).forEach((key) => {
        flatten(value[key], prefix ? `${prefix}.${key}` : key, out, meta);
      });
      return;
    }
    if (Array.isArray(value)) meta.nested = true;
    out[prefix] = Array.isArray(value) || (value && typeof value === "object") ? JSON.stringify(value) : value;
  }

  function normalizeRows(data) {
    const rows = Array.isArray(data) ? data : [data];
    if (!rows.length || rows.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
      throw new Error(t.array);
    }
    const meta = { nested: false };
    const flatRows = rows.map((item) => {
      const out = {};
      flatten(item, "", out, meta);
      return out;
    });
    const headers = [];
    const seen = new Set();
    flatRows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!seen.has(key)) {
          seen.add(key);
          headers.push(key);
        }
      });
    });
    return { rows: flatRows, headers, nested: meta.nested };
  }

  function serializeCell(value, delim) {
    if (value == null) return "";
    const text = String(value);
    if (text.includes('"') || text.includes("\n") || text.includes("\r") || text.includes(delim)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function toCsv(result) {
    const delim = delimiter();
    const lines = [];
    if (headersEl.checked) lines.push(result.headers.map((h) => serializeCell(h, delim)).join(delim));
    result.rows.forEach((row) => {
      lines.push(result.headers.map((header) => serializeCell(row[header], delim)).join(delim));
    });
    return lines.join("\n");
  }

  function convert() {
    warningEl.textContent = "";
    const raw = inputEl.value;
    if (!raw.trim()) {
      statusEl.textContent = t.empty;
      return;
    }
    try {
      const data = JSON.parse(raw);
      const result = normalizeRows(data);
      outputEl.value = toCsv(result);
      rowCountEl.textContent = `${result.rows.length} ${t.rows}`;
      fieldCountEl.textContent = `${result.headers.length} ${t.fields}`;
      statusEl.textContent = t.converted;
      if (result.nested) warningEl.textContent = t.nested;
    } catch (error) {
      const message = error instanceof SyntaxError ? t.invalid.replace("{message}", error.message) : error.message;
      warningEl.textContent = message;
      statusEl.textContent = message;
    }
  }

  async function copyOutput() {
    if (!outputEl.value) return;
    try {
      await navigator.clipboard.writeText(outputEl.value);
      statusEl.textContent = t.copied;
    } catch (_) {
      outputEl.select();
      document.execCommand("copy");
      statusEl.textContent = t.copied;
    }
  }

  function clearAll() {
    inputEl.value = "";
    outputEl.value = "";
    warningEl.textContent = "";
    rowCountEl.textContent = "0";
    fieldCountEl.textContent = "0";
    fileSizeEl.textContent = "0 B";
    statusEl.textContent = t.cleared;
  }

  function sample() {
    inputEl.value = JSON.stringify([
      { name: "Alice", city: "Bangkok", active: true, profile: { note: "hello 👋" } },
      { name: "Bob", city: "Paris", active: false, profile: { note: "café" } },
      { name: "Chao", city: "Taipei", active: true, profile: { note: "unicode 世界" } }
    ], null, 2);
    fileSizeEl.textContent = formatSize(new Blob([inputEl.value]).size);
    convert();
  }

  function downloadOutput() {
    if (!outputEl.value) return;
    const blob = new Blob([outputEl.value], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = t.download;
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadFile(file) {
    if (!file) return;
    fileSizeEl.textContent = formatSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      inputEl.value = String(reader.result || "");
      statusEl.textContent = t.loaded;
    };
    reader.onerror = () => {
      statusEl.textContent = reader.error ? reader.error.message : t.empty;
    };
    reader.readAsText(file);
  }

  convertBtn.addEventListener("click", convert);
  delimiterEl.addEventListener("change", convert);
  headersEl.addEventListener("change", convert);
  copyBtn.addEventListener("click", copyOutput);
  clearBtn.addEventListener("click", clearAll);
  sampleBtn.addEventListener("click", sample);
  downloadBtn.addEventListener("click", downloadOutput);
  fileEl.addEventListener("change", (event) => {
    loadFile(event.target.files[0]);
    event.target.value = "";
  });
  inputEl.addEventListener("input", () => {
    fileSizeEl.textContent = formatSize(new Blob([inputEl.value]).size);
  });
  statusEl.textContent = t.empty;
})();
