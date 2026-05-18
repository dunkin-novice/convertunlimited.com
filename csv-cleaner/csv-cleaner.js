(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const inputEl = $("csv-input");
  const outputEl = $("csv-output");
  const delimiterEl = $("csv-delimiter");
  const fileEl = $("csv-file");
  const statusEl = $("csv-status");
  const warningEl = $("csv-warning");
  const previewEl = $("csv-preview");
  const rowCountEl = $("csv-row-count");
  const colCountEl = $("csv-col-count");
  const fileSizeEl = $("csv-file-size");
  const cleanBtn = $("csv-clean");
  const copyBtn = $("csv-copy");
  const clearBtn = $("csv-clear");
  const sampleBtn = $("csv-sample");
  const downloadBtn = $("csv-download");

  const STRINGS = {
    en: { empty: "Paste CSV to begin.", cleaned: "CSV cleaned locally.", copied: "Cleaned CSV copied.", cleared: "Cleared.", loaded: "File loaded locally.", malformed: "Malformed CSV: unmatched quote near row {row}. Original input was preserved.", rows: "rows", cols: "columns", download: "cleaned.csv" },
    th: { empty: "วาง CSV เพื่อเริ่ม", cleaned: "ล้าง CSV ในเครื่องแล้ว", copied: "คัดลอก CSV แล้ว", cleared: "ล้างแล้ว", loaded: "โหลดไฟล์ในเครื่องแล้ว", malformed: "CSV มีรูปแบบผิด: เครื่องหมายคำพูดไม่ครบใกล้แถว {row} ข้อมูลเดิมยังถูกเก็บไว้", rows: "แถว", cols: "คอลัมน์", download: "cleaned.csv" },
    vi: { empty: "Dán CSV để bắt đầu.", cleaned: "Đã làm sạch CSV cục bộ.", copied: "Đã sao chép CSV sạch.", cleared: "Đã xóa.", loaded: "Đã tải tệp cục bộ.", malformed: "CSV lỗi: thiếu dấu ngoặc kép gần dòng {row}. Dữ liệu gốc được giữ nguyên.", rows: "dòng", cols: "cột", download: "cleaned.csv" },
    zh: { empty: "粘贴 CSV 以开始。", cleaned: "CSV 已在本地清理。", copied: "已复制清理后的 CSV。", cleared: "已清空。", loaded: "已在本地读取文件。", malformed: "CSV 格式异常：第 {row} 行附近引号未闭合。原始输入已保留。", rows: "行", cols: "列", download: "cleaned.csv" },
    ja: { empty: "CSV を貼り付けて開始します。", cleaned: "CSV をローカルでクリーニングしました。", copied: "クリーニング済み CSV をコピーしました。", cleared: "クリアしました。", loaded: "ファイルをローカルで読み込みました。", malformed: "CSV の形式エラー: {row} 行付近で引用符が閉じていません。元の入力は保持されました。", rows: "行", cols: "列", download: "cleaned.csv" },
    ko: { empty: "CSV를 붙여넣어 시작하세요.", cleaned: "CSV가 로컬에서 정리되었습니다.", copied: "정리된 CSV가 복사되었습니다.", cleared: "지웠습니다.", loaded: "파일을 로컬에서 불러왔습니다.", malformed: "CSV 형식 오류: {row}행 근처의 따옴표가 닫히지 않았습니다. 원본 입력은 유지되었습니다.", rows: "행", cols: "열", download: "cleaned.csv" },
    es: { empty: "Pega CSV para empezar.", cleaned: "CSV limpiado localmente.", copied: "CSV limpio copiado.", cleared: "Limpiado.", loaded: "Archivo cargado localmente.", malformed: "CSV malformado: comilla sin cerrar cerca de la fila {row}. Se conservó la entrada original.", rows: "filas", cols: "columnas", download: "cleaned.csv" },
    fr: { empty: "Collez du CSV pour commencer.", cleaned: "CSV nettoyé localement.", copied: "CSV nettoyé copié.", cleared: "Effacé.", loaded: "Fichier chargé localement.", malformed: "CSV mal formé : guillemet non fermé près de la ligne {row}. L’entrée originale a été conservée.", rows: "lignes", cols: "colonnes", download: "cleaned.csv" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  let textStarted = false;

  function delimiter() {
    return delimiterEl.value === "tab" ? "\t" : delimiterEl.value;
  }

  function formatSize(bytes) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  function parseCsv(text, delim) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;
    let rowNumber = 1;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      if (quoted) {
        if (char === '"' && next === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          quoted = false;
        } else {
          field += char;
          if (char === "\n") rowNumber++;
        }
      } else if (char === '"') {
        if (field.length === 0) quoted = true;
        else field += char;
      } else if (char === delim) {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        rowNumber++;
      } else if (char === "\r") {
        if (next === "\n") continue;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        rowNumber++;
      } else {
        field += char;
      }
    }
    if (quoted) {
      const error = new Error(t.malformed.replace("{row}", rowNumber));
      error.malformed = true;
      throw error;
    }
    row.push(field);
    rows.push(row);
    return rows;
  }

  function serializeCsv(rows, delim) {
    return rows.map((row) => row.map((cell) => {
      const value = String(cell);
      if (value.includes('"') || value.includes("\n") || value.includes("\r") || value.includes(delim)) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(delim)).join("\n");
  }

  function cleanRows(rows) {
    const out = [];
    const seen = new Set();
    let expectedCols = null;
    let inconsistent = false;
    for (const row of rows) {
      const trimmed = row.map((cell) => cell.trim());
      if (trimmed.every((cell) => cell === "")) continue;
      if (expectedCols == null) expectedCols = trimmed.length;
      if (trimmed.length !== expectedCols) inconsistent = true;
      const key = JSON.stringify(trimmed);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(trimmed);
    }
    return { rows: out, inconsistent };
  }

  function renderPreview(rows) {
    previewEl.innerHTML = "";
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    rows.slice(0, 8).forEach((row) => {
      const tr = document.createElement("tr");
      row.slice(0, 8).forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell;
        td.style.border = "1px solid var(--line)";
        td.style.padding = "6px";
        td.style.overflowWrap = "anywhere";
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    previewEl.appendChild(table);
  }

  function clean() {
    warningEl.textContent = "";
    const raw = inputEl.value;
    if (!raw.trim()) {
      statusEl.textContent = t.empty;
      return;
    }
    try {
      const parsed = parseCsv(raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n"), delimiter());
      const result = cleanRows(parsed);
      outputEl.value = serializeCsv(result.rows, delimiter());
      rowCountEl.textContent = `${result.rows.length} ${t.rows}`;
      colCountEl.textContent = `${result.rows[0] ? result.rows[0].length : 0} ${t.cols}`;
      renderPreview(result.rows);
      statusEl.textContent = t.cleaned;
      if (result.inconsistent) warningEl.textContent = "Column count varies between rows.";
      if (typeof window.cuTrack === "function") window.cuTrack("processing_completed", { input_format: "csv", output_format: "csv" });
    } catch (error) {
      warningEl.textContent = error.message;
      statusEl.textContent = error.message;
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unsupported_format" });
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
    if (typeof window.cuTrack === "function") window.cuTrack("copy_clicked", { output_format: "csv" });
  }

  function clearAll() {
    inputEl.value = "";
    outputEl.value = "";
    previewEl.innerHTML = "";
    warningEl.textContent = "";
    rowCountEl.textContent = "0";
    colCountEl.textContent = "0";
    fileSizeEl.textContent = "0 B";
    statusEl.textContent = t.cleared;
  }

  function sample() {
    inputEl.value = "name, city, note\n Alice , Bangkok , hello 👋\nBob, Paris, café\nAlice , Bangkok , hello 👋\n\nChao, Taipei, unicode 世界";
    fileSizeEl.textContent = formatSize(new Blob([inputEl.value]).size);
    if (typeof window.cuTrack === "function") window.cuTrack("sample_used", { input_format: "csv" });
    clean();
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
    if (typeof window.cuTrack === "function") window.cuTrack("download_clicked", { output_format: "csv" });
  }

  function loadFile(file) {
    if (!file) return;
    fileSizeEl.textContent = formatSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      inputEl.value = String(reader.result || "");
      statusEl.textContent = t.loaded;
      if (typeof window.cuTrack === "function") window.cuTrack("file_selected", { file_count: 1, input_format: "csv" });
    };
    reader.onerror = () => {
      statusEl.textContent = reader.error ? reader.error.message : t.empty;
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unknown" });
    };
    reader.readAsText(file);
  }

  cleanBtn.addEventListener("click", clean);
  delimiterEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "delimiter", option_value: delimiterEl.value });
    clean();
  });
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
    if (!textStarted && inputEl.value) {
      textStarted = true;
      if (typeof window.cuTrack === "function") window.cuTrack("text_input_started", { input_format: "csv" });
    }
  });
  statusEl.textContent = t.empty;
  if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded");
})();
