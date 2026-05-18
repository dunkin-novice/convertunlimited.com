(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const inputEl = $("urlenc-input");
  const outputEl = $("urlenc-output");
  const modeEl = $("urlenc-mode");
  const statusEl = $("urlenc-status");
  const warningEl = $("urlenc-warning");
  const charCountEl = $("urlenc-char-count");
  const byteCountEl = $("urlenc-byte-count");
  const encodeBtn = $("urlenc-encode");
  const decodeBtn = $("urlenc-decode");
  const copyBtn = $("urlenc-copy");
  const clearBtn = $("urlenc-clear");
  const sampleBtn = $("urlenc-sample");

  const STRINGS = {
    en: { empty: "Enter a URL or text to begin.", encoded: "Encoded locally.", decoded: "Decoded locally.", copied: "Output copied.", cleared: "Cleared.", invalid: "Malformed percent-encoding. Original input was preserved.", chars: "characters", bytes: "bytes" },
    th: { empty: "ใส่ URL หรือข้อความเพื่อเริ่ม", encoded: "เข้ารหัสในเครื่องแล้ว", decoded: "ถอดรหัสในเครื่องแล้ว", copied: "คัดลอกผลลัพธ์แล้ว", cleared: "ล้างแล้ว", invalid: "percent-encoding ไม่ถูกต้อง ข้อมูลเดิมยังถูกเก็บไว้", chars: "อักขระ", bytes: "ไบต์" },
    vi: { empty: "Nhập URL hoặc văn bản để bắt đầu.", encoded: "Đã mã hóa cục bộ.", decoded: "Đã giải mã cục bộ.", copied: "Đã sao chép đầu ra.", cleared: "Đã xóa.", invalid: "Percent-encoding không hợp lệ. Dữ liệu gốc được giữ nguyên.", chars: "ký tự", bytes: "byte" },
    zh: { empty: "输入 URL 或文本以开始。", encoded: "已在本地编码。", decoded: "已在本地解码。", copied: "已复制输出。", cleared: "已清空。", invalid: "百分号编码格式错误。原始输入已保留。", chars: "字符", bytes: "字节" },
    ja: { empty: "URL またはテキストを入力してください。", encoded: "ローカルでエンコードしました。", decoded: "ローカルでデコードしました。", copied: "出力をコピーしました。", cleared: "クリアしました。", invalid: "不正なパーセントエンコードです。元の入力は保持されました。", chars: "文字", bytes: "バイト" },
    ko: { empty: "URL 또는 텍스트를 입력하세요.", encoded: "로컬에서 인코딩되었습니다.", decoded: "로컬에서 디코딩되었습니다.", copied: "출력이 복사되었습니다.", cleared: "지웠습니다.", invalid: "잘못된 퍼센트 인코딩입니다. 원본 입력은 유지되었습니다.", chars: "문자", bytes: "바이트" },
    es: { empty: "Introduce una URL o texto para empezar.", encoded: "Codificado localmente.", decoded: "Decodificado localmente.", copied: "Salida copiada.", cleared: "Limpiado.", invalid: "Percent-encoding malformado. Se conservó la entrada original.", chars: "caracteres", bytes: "bytes" },
    fr: { empty: "Saisissez une URL ou du texte pour commencer.", encoded: "Encodé localement.", decoded: "Décodé localement.", copied: "Sortie copiée.", cleared: "Effacé.", invalid: "Encodage en pourcentage mal formé. L’entrée originale a été conservée.", chars: "caractères", bytes: "octets" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  const encoder = new TextEncoder();
  let textStarted = false;

  function useComponentMode() {
    return modeEl.value === "component";
  }

  function updateCounts() {
    const text = inputEl.value;
    charCountEl.textContent = `${text.length} ${t.chars}`;
    byteCountEl.textContent = `${encoder.encode(text).length} ${t.bytes}`;
  }

  function encode() {
    warningEl.textContent = "";
    if (!inputEl.value) {
      statusEl.textContent = t.empty;
      return;
    }
    outputEl.value = useComponentMode() ? encodeURIComponent(inputEl.value) : encodeURI(inputEl.value);
    statusEl.textContent = t.encoded;
    if (typeof window.cuTrack === "function") window.cuTrack("tool_completed", { option_name: "mode", option_value: "encode", output_format: modeEl.value });
  }

  function decode() {
    warningEl.textContent = "";
    if (!inputEl.value) {
      statusEl.textContent = t.empty;
      return;
    }
    try {
      outputEl.value = useComponentMode() ? decodeURIComponent(inputEl.value) : decodeURI(inputEl.value);
      statusEl.textContent = t.decoded;
      if (typeof window.cuTrack === "function") window.cuTrack("tool_completed", { option_name: "mode", option_value: "decode", input_format: modeEl.value });
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
    inputEl.value = "https://www.convertunlimited.com/search?q=hello world 👋&city=กรุงเทพ&note=café 世界";
    updateCounts();
    if (typeof window.cuTrack === "function") window.cuTrack("sample_used");
    encode();
  }

  encodeBtn.addEventListener("click", encode);
  decodeBtn.addEventListener("click", decode);
  copyBtn.addEventListener("click", copyOutput);
  clearBtn.addEventListener("click", clearAll);
  sampleBtn.addEventListener("click", sample);
  modeEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "mode", option_value: modeEl.value });
    if (inputEl.value) encode();
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
