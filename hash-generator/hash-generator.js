(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const inputEl = $("hash-input");
  const outputEl = $("hash-output");
  const algorithmEl = $("hash-algorithm");
  const uppercaseEl = $("hash-uppercase");
  const statusEl = $("hash-status");
  const warningEl = $("hash-warning");
  const charCountEl = $("hash-char-count");
  const byteCountEl = $("hash-byte-count");
  const generateBtn = $("hash-generate");
  const copyBtn = $("hash-copy");
  const clearBtn = $("hash-clear");
  const sampleBtn = $("hash-sample");

  const STRINGS = {
    en: { empty: "Enter text to hash.", generated: "Hash generated locally.", copied: "Hash copied.", cleared: "Cleared.", unsupported: "Web Crypto is not available in this browser.", failed: "Hash generation failed.", chars: "characters", bytes: "bytes" },
    th: { empty: "ใส่ข้อความเพื่อสร้าง hash", generated: "สร้าง hash ในเครื่องแล้ว", copied: "คัดลอก hash แล้ว", cleared: "ล้างแล้ว", unsupported: "เบราว์เซอร์นี้ไม่รองรับ Web Crypto", failed: "สร้าง hash ไม่สำเร็จ", chars: "อักขระ", bytes: "ไบต์" },
    vi: { empty: "Nhập văn bản để tạo hash.", generated: "Đã tạo hash cục bộ.", copied: "Đã sao chép hash.", cleared: "Đã xóa.", unsupported: "Trình duyệt này không hỗ trợ Web Crypto.", failed: "Tạo hash thất bại.", chars: "ký tự", bytes: "byte" },
    zh: { empty: "输入文本以生成哈希。", generated: "哈希已在本地生成。", copied: "已复制哈希。", cleared: "已清空。", unsupported: "此浏览器不支持 Web Crypto。", failed: "哈希生成失败。", chars: "字符", bytes: "字节" },
    ja: { empty: "ハッシュ化するテキストを入力してください。", generated: "ハッシュをローカルで生成しました。", copied: "ハッシュをコピーしました。", cleared: "クリアしました。", unsupported: "このブラウザでは Web Crypto を利用できません。", failed: "ハッシュ生成に失敗しました。", chars: "文字", bytes: "バイト" },
    ko: { empty: "해시할 텍스트를 입력하세요.", generated: "해시가 로컬에서 생성되었습니다.", copied: "해시가 복사되었습니다.", cleared: "지웠습니다.", unsupported: "이 브라우저에서 Web Crypto를 사용할 수 없습니다.", failed: "해시 생성에 실패했습니다.", chars: "문자", bytes: "바이트" },
    es: { empty: "Introduce texto para generar hash.", generated: "Hash generado localmente.", copied: "Hash copiado.", cleared: "Limpiado.", unsupported: "Web Crypto no está disponible en este navegador.", failed: "No se pudo generar el hash.", chars: "caracteres", bytes: "bytes" },
    fr: { empty: "Saisissez du texte à hacher.", generated: "Hash généré localement.", copied: "Hash copié.", cleared: "Effacé.", unsupported: "Web Crypto n’est pas disponible dans ce navigateur.", failed: "La génération du hash a échoué.", chars: "caractères", bytes: "octets" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  const encoder = new TextEncoder();
  let textStarted = false;

  function updateCounts() {
    const text = inputEl.value;
    charCountEl.textContent = `${text.length} ${t.chars}`;
    byteCountEl.textContent = `${encoder.encode(text).length} ${t.bytes}`;
  }

  function supported() {
    return Boolean(window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === "function");
  }

  function toHex(buffer) {
    const hex = Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
    return uppercaseEl.checked ? hex.toUpperCase() : hex;
  }

  async function generate() {
    warningEl.textContent = "";
    outputEl.value = "";
    if (!supported()) {
      warningEl.textContent = t.unsupported;
      statusEl.textContent = t.unsupported;
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unsupported_format" });
      return;
    }
    if (!inputEl.value) {
      statusEl.textContent = t.empty;
      return;
    }
    try {
      const digest = await window.crypto.subtle.digest(algorithmEl.value, encoder.encode(inputEl.value));
      outputEl.value = toHex(digest);
      statusEl.textContent = t.generated;
      if (typeof window.cuTrack === "function") window.cuTrack("tool_completed", { option_name: "algorithm", option_value: algorithmEl.value });
    } catch (_) {
      warningEl.textContent = t.failed;
      statusEl.textContent = t.failed;
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unknown" });
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
    inputEl.value = "ConvertUnlimited hash sample 👋 สวัสดี café 世界";
    updateCounts();
    if (typeof window.cuTrack === "function") window.cuTrack("sample_used");
    generate();
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", copyOutput);
  clearBtn.addEventListener("click", clearAll);
  sampleBtn.addEventListener("click", sample);
  algorithmEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "algorithm", option_value: algorithmEl.value });
    generate();
  });
  uppercaseEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "format", option_value: uppercaseEl.checked ? "uppercase" : "lowercase" });
    generate();
  });
  inputEl.addEventListener("input", () => {
    updateCounts();
    if (!textStarted && inputEl.value) {
      textStarted = true;
      if (typeof window.cuTrack === "function") window.cuTrack("text_input_started");
    }
  });
  updateCounts();
  statusEl.textContent = supported() ? t.empty : t.unsupported;
  if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded");
})();
