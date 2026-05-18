(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const inputEl = $("csvjson-input");
  const outputEl = $("csvjson-output");
  const delimiterEl = $("csvjson-delimiter");
  const indentEl = $("csvjson-indent");
  const fileEl = $("csvjson-file");
  const statusEl = $("csvjson-status");
  const warningEl = $("csvjson-warning");
  const rowCountEl = $("csvjson-row-count");
  const fieldCountEl = $("csvjson-field-count");
  const fileSizeEl = $("csvjson-file-size");
  const convertBtn = $("csvjson-convert");
  const copyBtn = $("csvjson-copy");
  const clearBtn = $("csvjson-clear");
  const sampleBtn = $("csvjson-sample");
  const downloadBtn = $("csvjson-download");

  const STRINGS = {
    en: { empty: "Paste CSV to begin.", converted: "CSV converted to JSON locally.", copied: "JSON copied.", cleared: "Cleared.", loaded: "File loaded locally.", malformed: "Malformed CSV: unmatched quote near row {row}. Original input was preserved.", needHeaders: "Add a header row before converting.", duplicate: "Duplicate header names found: {headers}. Values were kept with numbered keys.", rows: "rows", fields: "fields", download: "converted.json" },
    th: { empty: "วาง CSV เพื่อเริ่ม", converted: "แปลง CSV เป็น JSON ในเครื่องแล้ว", copied: "คัดลอก JSON แล้ว", cleared: "ล้างแล้ว", loaded: "โหลดไฟล์ในเครื่องแล้ว", malformed: "CSV มีรูปแบบผิด: เครื่องหมายคำพูดไม่ครบใกล้แถว {row} ข้อมูลเดิมยังถูกเก็บไว้", needHeaders: "เพิ่มแถวหัวตารางก่อนแปลง", duplicate: "พบชื่อหัวตารางซ้ำ: {headers} ค่าเดิมถูกเก็บด้วยคีย์แบบมีหมายเลข", rows: "แถว", fields: "ฟิลด์", download: "converted.json" },
    vi: { empty: "Dán CSV để bắt đầu.", converted: "Đã chuyển CSV sang JSON cục bộ.", copied: "Đã sao chép JSON.", cleared: "Đã xóa.", loaded: "Đã tải tệp cục bộ.", malformed: "CSV lỗi: thiếu dấu ngoặc kép gần dòng {row}. Dữ liệu gốc được giữ nguyên.", needHeaders: "Thêm dòng tiêu đề trước khi chuyển đổi.", duplicate: "Phát hiện tiêu đề trùng: {headers}. Giá trị được giữ bằng khóa có số.", rows: "dòng", fields: "trường", download: "converted.json" },
    zh: { empty: "粘贴 CSV 以开始。", converted: "CSV 已在本地转换为 JSON。", copied: "已复制 JSON。", cleared: "已清空。", loaded: "已在本地读取文件。", malformed: "CSV 格式异常：第 {row} 行附近引号未闭合。原始输入已保留。", needHeaders: "转换前请添加标题行。", duplicate: "发现重复标题：{headers}。值已使用编号键保留。", rows: "行", fields: "字段", download: "converted.json" },
    ja: { empty: "CSV を貼り付けて開始します。", converted: "CSV をローカルで JSON に変換しました。", copied: "JSON をコピーしました。", cleared: "クリアしました。", loaded: "ファイルをローカルで読み込みました。", malformed: "CSV の形式エラー: {row} 行付近で引用符が閉じていません。元の入力は保持されました。", needHeaders: "変換前にヘッダー行を追加してください。", duplicate: "重複ヘッダーがあります: {headers}。値は番号付きキーで保持しました。", rows: "行", fields: "フィールド", download: "converted.json" },
    ko: { empty: "CSV를 붙여넣어 시작하세요.", converted: "CSV가 로컬에서 JSON으로 변환되었습니다.", copied: "JSON이 복사되었습니다.", cleared: "지웠습니다.", loaded: "파일을 로컬에서 불러왔습니다.", malformed: "CSV 형식 오류: {row}행 근처의 따옴표가 닫히지 않았습니다. 원본 입력은 유지되었습니다.", needHeaders: "변환 전에 헤더 행을 추가하세요.", duplicate: "중복 헤더 발견: {headers}. 값은 번호가 붙은 키로 유지되었습니다.", rows: "행", fields: "필드", download: "converted.json" },
    es: { empty: "Pega CSV para empezar.", converted: "CSV convertido a JSON localmente.", copied: "JSON copiado.", cleared: "Limpiado.", loaded: "Archivo cargado localmente.", malformed: "CSV malformado: comilla sin cerrar cerca de la fila {row}. Se conservó la entrada original.", needHeaders: "Añade una fila de encabezados antes de convertir.", duplicate: "Encabezados duplicados: {headers}. Los valores se conservaron con claves numeradas.", rows: "filas", fields: "campos", download: "converted.json" },
    fr: { empty: "Collez du CSV pour commencer.", converted: "CSV converti en JSON localement.", copied: "JSON copié.", cleared: "Effacé.", loaded: "Fichier chargé localement.", malformed: "CSV mal formé : guillemet non fermé près de la ligne {row}. L’entrée originale a été conservée.", needHeaders: "Ajoutez une ligne d’en-têtes avant de convertir.", duplicate: "En-têtes en double : {headers}. Les valeurs ont été conservées avec des clés numérotées.", rows: "lignes", fields: "champs", download: "converted.json" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  let textStarted = false;

  function delimiter() {
    return delimiterEl.value === "tab" ? "\t" : delimiterEl.value;
  }

  function indentation() {
    if (indentEl.value === "compact") return 0;
    if (indentEl.value === "tab") return "\t";
    return Number(indentEl.value || 2);
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
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (quoted) {
        if (char === '"' && next === '"') {
          field += '"';
          i += 1;
        } else if (char === '"') {
          quoted = false;
        } else {
          field += char;
          if (char === "\n") rowNumber += 1;
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
        rowNumber += 1;
      } else if (char === "\r") {
        if (next === "\n") continue;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        rowNumber += 1;
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

  function uniqueHeaders(headers) {
    const seen = new Map();
    const duplicates = new Set();
    const names = headers.map((header, index) => {
      const base = header.trim() || `field_${index + 1}`;
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      if (count > 0) {
        duplicates.add(base);
        return `${base}_${count + 1}`;
      }
      return base;
    });
    return { names, duplicates: Array.from(duplicates) };
  }

  function csvToJson(rows) {
    const nonBlank = rows
      .map((row) => row.map((cell) => cell.trim()))
      .filter((row) => row.some((cell) => cell !== ""));
    if (nonBlank.length < 1 || nonBlank[0].every((cell) => cell === "")) {
      throw new Error(t.needHeaders);
    }
    const headerResult = uniqueHeaders(nonBlank[0]);
    const objects = nonBlank.slice(1).map((row) => {
      const item = {};
      headerResult.names.forEach((header, index) => {
        item[header] = row[index] == null ? "" : row[index];
      });
      return item;
    });
    return { objects, headers: headerResult.names, duplicates: headerResult.duplicates };
  }

  function convert() {
    warningEl.textContent = "";
    const raw = inputEl.value;
    if (!raw.trim()) {
      statusEl.textContent = t.empty;
      return;
    }
    try {
      const parsed = parseCsv(raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n"), delimiter());
      const result = csvToJson(parsed);
      outputEl.value = JSON.stringify(result.objects, null, indentation());
      rowCountEl.textContent = `${result.objects.length} ${t.rows}`;
      fieldCountEl.textContent = `${result.headers.length} ${t.fields}`;
      statusEl.textContent = t.converted;
      if (result.duplicates.length) {
        warningEl.textContent = t.duplicate.replace("{headers}", result.duplicates.join(", "));
      }
      if (typeof window.cuTrack === "function") window.cuTrack("conversion_completed", { input_format: "csv", output_format: "json" });
    } catch (error) {
      warningEl.textContent = error.message;
      statusEl.textContent = error.message;
      if (typeof window.cuTrack === "function") window.cuTrack("conversion_failed", { input_format: "csv", output_format: "json", error_type: "unsupported_format" });
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
    if (typeof window.cuTrack === "function") window.cuTrack("copy_clicked", { output_format: "json" });
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
    inputEl.value = "name,city,active,note\nAlice,Bangkok,true,hello 👋\nBob,Paris,false,café\nChao,Taipei,true,unicode 世界";
    fileSizeEl.textContent = formatSize(new Blob([inputEl.value]).size);
    if (typeof window.cuTrack === "function") window.cuTrack("sample_used", { input_format: "csv" });
    convert();
  }

  function downloadOutput() {
    if (!outputEl.value) return;
    const blob = new Blob([outputEl.value], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = t.download;
    a.click();
    URL.revokeObjectURL(url);
    if (typeof window.cuTrack === "function") window.cuTrack("download_clicked", { output_format: "json" });
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

  convertBtn.addEventListener("click", convert);
  delimiterEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "delimiter", option_value: delimiterEl.value });
    convert();
  });
  indentEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "indent", option_value: indentEl.value });
    convert();
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
