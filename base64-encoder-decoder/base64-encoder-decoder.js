(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const inputEl = $("base64-input");
  const outputEl = $("base64-output");
  const urlSafeEl = $("base64-url-safe");
  const statusEl = $("base64-status");
  const warningEl = $("base64-warning");
  const charCountEl = $("base64-char-count");
  const byteCountEl = $("base64-byte-count");
  const encodeBtn = $("base64-encode");
  const decodeBtn = $("base64-decode");
  const copyBtn = $("base64-copy");
  const clearBtn = $("base64-clear");
  const sampleBtn = $("base64-sample");

  const STRINGS = {
    en: { empty: "Enter text or Base64 to begin.", encoded: "Encoded locally.", decoded: "Decoded locally.", copied: "Output copied.", cleared: "Cleared.", invalid: "Invalid Base64 input. Original input was preserved.", chars: "characters", bytes: "bytes" },
    th: { empty: "ใส่ข้อความหรือ Base64 เพื่อเริ่ม", encoded: "เข้ารหัสในเครื่องแล้ว", decoded: "ถอดรหัสในเครื่องแล้ว", copied: "คัดลอกผลลัพธ์แล้ว", cleared: "ล้างแล้ว", invalid: "Base64 ไม่ถูกต้อง ข้อมูลเดิมยังถูกเก็บไว้", chars: "อักขระ", bytes: "ไบต์" },
    vi: { empty: "Nhập văn bản hoặc Base64 để bắt đầu.", encoded: "Đã mã hóa cục bộ.", decoded: "Đã giải mã cục bộ.", copied: "Đã sao chép đầu ra.", cleared: "Đã xóa.", invalid: "Base64 không hợp lệ. Dữ liệu gốc được giữ nguyên.", chars: "ký tự", bytes: "byte" },
    zh: { empty: "输入文本或 Base64 以开始。", encoded: "已在本地编码。", decoded: "已在本地解码。", copied: "已复制输出。", cleared: "已清空。", invalid: "Base64 输入无效。原始输入已保留。", chars: "字符", bytes: "字节" },
    ja: { empty: "テキストまたは Base64 を入力してください。", encoded: "ローカルでエンコードしました。", decoded: "ローカルでデコードしました。", copied: "出力をコピーしました。", cleared: "クリアしました。", invalid: "無効な Base64 入力です。元の入力は保持されました。", chars: "文字", bytes: "バイト" },
    ko: { empty: "텍스트 또는 Base64를 입력하세요.", encoded: "로컬에서 인코딩되었습니다.", decoded: "로컬에서 디코딩되었습니다.", copied: "출력이 복사되었습니다.", cleared: "지웠습니다.", invalid: "잘못된 Base64 입력입니다. 원본 입력은 유지되었습니다.", chars: "문자", bytes: "바이트" },
    es: { empty: "Introduce texto o Base64 para empezar.", encoded: "Codificado localmente.", decoded: "Decodificado localmente.", copied: "Salida copiada.", cleared: "Limpiado.", invalid: "Entrada Base64 no válida. Se conservó la entrada original.", chars: "caracteres", bytes: "bytes" },
    fr: { empty: "Saisissez du texte ou du Base64 pour commencer.", encoded: "Encodé localement.", decoded: "Décodé localement.", copied: "Sortie copiée.", cleared: "Effacé.", invalid: "Entrée Base64 invalide. L’entrée originale a été conservée.", chars: "caractères", bytes: "octets" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let textStarted = false;

  function updateCounts() {
    const text = inputEl.value;
    charCountEl.textContent = `${text.length} ${t.chars}`;
    byteCountEl.textContent = `${encoder.encode(text).length} ${t.bytes}`;
  }

  function toBase64(text) {
    const bytes = encoder.encode(text);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
    let output = btoa(binary);
    if (urlSafeEl.checked) output = output.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    return output;
  }

  function normalizeBase64(text) {
    let value = text.trim().replace(/\s+/g, "");
    if (urlSafeEl.checked) value = value.replace(/-/g, "+").replace(/_/g, "/");
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 === 1) throw new Error(t.invalid);
    while (value.length % 4) value += "=";
    return value;
  }

  function fromBase64(text) {
    const normalized = normalizeBase64(text);
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return decoder.decode(bytes);
  }

  function encode() {
    warningEl.textContent = "";
    if (!inputEl.value) {
      statusEl.textContent = t.empty;
      return;
    }
    outputEl.value = toBase64(inputEl.value);
    statusEl.textContent = t.encoded;
    if (typeof window.cuTrack === "function") window.cuTrack("tool_completed", { option_name: "mode", option_value: "encode", output_format: "base64" });
  }

  function decode() {
    warningEl.textContent = "";
    if (!inputEl.value.trim()) {
      statusEl.textContent = t.empty;
      return;
    }
    try {
      outputEl.value = fromBase64(inputEl.value);
      statusEl.textContent = t.decoded;
      if (typeof window.cuTrack === "function") window.cuTrack("tool_completed", { option_name: "mode", option_value: "decode", input_format: "base64" });
    } catch (_) {
      warningEl.textContent = t.invalid;
      statusEl.textContent = t.invalid;
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
    if (typeof window.cuTrack === "function") window.cuTrack("copy_clicked");
  }

  function clearAll() {
    inputEl.value = "";
    outputEl.value = "";
    warningEl.textContent = "";
    updateCounts();
    statusEl.textContent = t.cleared;
  }

  function sample() {
    inputEl.value = "Hello ConvertUnlimited 👋 สวัสดี café 世界";
    updateCounts();
    if (typeof window.cuTrack === "function") window.cuTrack("sample_used");
    encode();
  }

  encodeBtn.addEventListener("click", encode);
  decodeBtn.addEventListener("click", decode);
  copyBtn.addEventListener("click", copyOutput);
  clearBtn.addEventListener("click", clearAll);
  sampleBtn.addEventListener("click", sample);
  urlSafeEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "format", option_value: urlSafeEl.checked ? "base64url" : "base64" });
    if (outputEl.value && inputEl.value) encode();
  });
  inputEl.addEventListener("input", () => {
    updateCounts();
    if (!textStarted && inputEl.value) {
      textStarted = true;
      if (typeof window.cuTrack === "function") window.cuTrack("text_input_started");
    }
  });
  updateCounts();
  statusEl.textContent = t.empty;
  if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded");
})();
