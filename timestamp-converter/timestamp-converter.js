(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const timestampEl = $("timestamp-input");
  const dateEl = $("timestamp-date");
  const unitEl = $("timestamp-unit");
  const outputEl = $("timestamp-output");
  const statusEl = $("timestamp-status");
  const warningEl = $("timestamp-warning");
  const toDateBtn = $("timestamp-to-date");
  const toTimestampBtn = $("timestamp-to-timestamp");
  const nowBtn = $("timestamp-now");
  const copyBtn = $("timestamp-copy");
  const clearBtn = $("timestamp-clear");

  const STRINGS = {
    en: { empty: "Enter a timestamp or date to begin.", converted: "Converted locally.", copied: "Output copied.", cleared: "Cleared.", invalidTimestamp: "Invalid timestamp. Original input was preserved.", invalidDate: "Invalid date. Original input was preserved.", now: "Current timestamp loaded.", unix: "Unix timestamp", iso: "ISO 8601", utc: "UTC", local: "Local time", relative: "Relative" },
    th: { empty: "ใส่ timestamp หรือวันที่เพื่อเริ่ม", converted: "แปลงในเครื่องแล้ว", copied: "คัดลอกผลลัพธ์แล้ว", cleared: "ล้างแล้ว", invalidTimestamp: "timestamp ไม่ถูกต้อง ข้อมูลเดิมยังถูกเก็บไว้", invalidDate: "วันที่ไม่ถูกต้อง ข้อมูลเดิมยังถูกเก็บไว้", now: "โหลด timestamp ปัจจุบันแล้ว", unix: "Unix timestamp", iso: "ISO 8601", utc: "UTC", local: "เวลาท้องถิ่น", relative: "เวลาเทียบปัจจุบัน" },
    vi: { empty: "Nhập timestamp hoặc ngày để bắt đầu.", converted: "Đã chuyển đổi cục bộ.", copied: "Đã sao chép đầu ra.", cleared: "Đã xóa.", invalidTimestamp: "Timestamp không hợp lệ. Dữ liệu gốc được giữ nguyên.", invalidDate: "Ngày không hợp lệ. Dữ liệu gốc được giữ nguyên.", now: "Đã tải timestamp hiện tại.", unix: "Unix timestamp", iso: "ISO 8601", utc: "UTC", local: "Giờ cục bộ", relative: "Tương đối" },
    zh: { empty: "输入时间戳或日期以开始。", converted: "已在本地转换。", copied: "已复制输出。", cleared: "已清空。", invalidTimestamp: "时间戳无效。原始输入已保留。", invalidDate: "日期无效。原始输入已保留。", now: "已加载当前时间戳。", unix: "Unix 时间戳", iso: "ISO 8601", utc: "UTC", local: "本地时间", relative: "相对时间" },
    ja: { empty: "タイムスタンプまたは日時を入力してください。", converted: "ローカルで変換しました。", copied: "出力をコピーしました。", cleared: "クリアしました。", invalidTimestamp: "無効なタイムスタンプです。元の入力は保持されました。", invalidDate: "無効な日時です。元の入力は保持されました。", now: "現在のタイムスタンプを読み込みました。", unix: "Unix タイムスタンプ", iso: "ISO 8601", utc: "UTC", local: "ローカル時刻", relative: "相対時間" },
    ko: { empty: "타임스탬프 또는 날짜를 입력하세요.", converted: "로컬에서 변환되었습니다.", copied: "출력이 복사되었습니다.", cleared: "지웠습니다.", invalidTimestamp: "잘못된 타임스탬프입니다. 원본 입력은 유지되었습니다.", invalidDate: "잘못된 날짜입니다. 원본 입력은 유지되었습니다.", now: "현재 타임스탬프를 불러왔습니다.", unix: "Unix 타임스탬프", iso: "ISO 8601", utc: "UTC", local: "로컬 시간", relative: "상대 시간" },
    es: { empty: "Introduce un timestamp o fecha para empezar.", converted: "Convertido localmente.", copied: "Salida copiada.", cleared: "Limpiado.", invalidTimestamp: "Timestamp no válido. Se conservó la entrada original.", invalidDate: "Fecha no válida. Se conservó la entrada original.", now: "Timestamp actual cargado.", unix: "Timestamp Unix", iso: "ISO 8601", utc: "UTC", local: "Hora local", relative: "Relativo" },
    fr: { empty: "Saisissez un timestamp ou une date pour commencer.", converted: "Converti localement.", copied: "Sortie copiée.", cleared: "Effacé.", invalidTimestamp: "Timestamp invalide. L’entrée originale a été conservée.", invalidDate: "Date invalide. L’entrée originale a été conservée.", now: "Timestamp actuel chargé.", unix: "Timestamp Unix", iso: "ISO 8601", utc: "UTC", local: "Heure locale", relative: "Relatif" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  function unitFactor() {
    return unitEl.value === "ms" ? 1 : 1000;
  }

  function formatRelative(date) {
    const diff = date.getTime() - Date.now();
    const abs = Math.abs(diff);
    const units = [
      ["day", 86400000],
      ["hour", 3600000],
      ["minute", 60000],
      ["second", 1000],
    ];
    const formatter = typeof Intl !== "undefined" && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat(lang, { numeric: "auto" }) : null;
    for (const [unit, size] of units) {
      if (abs >= size || unit === "second") {
        const value = Math.round(diff / size);
        return formatter ? formatter.format(value, unit) : `${value} ${unit}`;
      }
    }
    return "";
  }

  function render(date) {
    const timestamp = unitEl.value === "ms" ? String(date.getTime()) : String(Math.floor(date.getTime() / 1000));
    outputEl.value = [
      `${t.unix}: ${timestamp}`,
      `${t.iso}: ${date.toISOString()}`,
      `${t.utc}: ${date.toUTCString()}`,
      `${t.local}: ${date.toString()}`,
      `${t.relative}: ${formatRelative(date)}`,
    ].join("\n");
    statusEl.textContent = t.converted;
  }

  function timestampToDate() {
    warningEl.textContent = "";
    const raw = timestampEl.value.trim();
    if (!raw) {
      statusEl.textContent = t.empty;
      return;
    }
    if (!/^-?\d+(\.\d+)?$/.test(raw)) {
      warningEl.textContent = t.invalidTimestamp;
      statusEl.textContent = t.invalidTimestamp;
      return;
    }
    const value = Number(raw);
    const date = new Date(value * unitFactor());
    if (!Number.isFinite(value) || Number.isNaN(date.getTime())) {
      warningEl.textContent = t.invalidTimestamp;
      statusEl.textContent = t.invalidTimestamp;
      return;
    }
    dateEl.value = date.toISOString().slice(0, 19);
    render(date);
  }

  function dateToTimestamp() {
    warningEl.textContent = "";
    const raw = dateEl.value.trim();
    if (!raw) {
      statusEl.textContent = t.empty;
      return;
    }
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
      warningEl.textContent = t.invalidDate;
      statusEl.textContent = t.invalidDate;
      return;
    }
    timestampEl.value = unitEl.value === "ms" ? String(date.getTime()) : String(Math.floor(date.getTime() / 1000));
    render(date);
  }

  function setNow() {
    warningEl.textContent = "";
    const date = new Date();
    timestampEl.value = unitEl.value === "ms" ? String(date.getTime()) : String(Math.floor(date.getTime() / 1000));
    dateEl.value = date.toISOString().slice(0, 19);
    render(date);
    statusEl.textContent = t.now;
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
    timestampEl.value = "";
    dateEl.value = "";
    outputEl.value = "";
    warningEl.textContent = "";
    statusEl.textContent = t.cleared;
  }

  toDateBtn.addEventListener("click", timestampToDate);
  toTimestampBtn.addEventListener("click", dateToTimestamp);
  nowBtn.addEventListener("click", setNow);
  copyBtn.addEventListener("click", copyOutput);
  clearBtn.addEventListener("click", clearAll);
  unitEl.addEventListener("change", () => {
    if (timestampEl.value.trim()) timestampToDate();
    else if (dateEl.value.trim()) dateToTimestamp();
  });
  setNow();
})();
