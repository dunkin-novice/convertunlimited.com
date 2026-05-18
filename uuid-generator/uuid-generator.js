(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const outputEl = $("uuid-output");
  const quantityEl = $("uuid-quantity");
  const uppercaseEl = $("uuid-uppercase");
  const separatorEl = $("uuid-separator");
  const statusEl = $("uuid-status");
  const countEl = $("uuid-count");
  const generateBtn = $("uuid-generate");
  const copyBtn = $("uuid-copy");
  const clearBtn = $("uuid-clear");

  const STRINGS = {
    en: { generated: "UUIDs generated locally.", copied: "UUIDs copied.", cleared: "Cleared.", count: "UUIDs" },
    th: { generated: "สร้าง UUID ในเครื่องแล้ว", copied: "คัดลอก UUID แล้ว", cleared: "ล้างแล้ว", count: "UUID" },
    vi: { generated: "Đã tạo UUID cục bộ.", copied: "Đã sao chép UUID.", cleared: "Đã xóa.", count: "UUID" },
    zh: { generated: "UUID 已在本地生成。", copied: "已复制 UUID。", cleared: "已清空。", count: "UUID" },
    ja: { generated: "UUID をローカルで生成しました。", copied: "UUID をコピーしました。", cleared: "クリアしました。", count: "UUID" },
    ko: { generated: "UUID가 로컬에서 생성되었습니다.", copied: "UUID가 복사되었습니다.", cleared: "지웠습니다.", count: "UUID" },
    es: { generated: "UUID generados localmente.", copied: "UUID copiados.", cleared: "Limpiado.", count: "UUID" },
    fr: { generated: "UUID générés localement.", copied: "UUID copiés.", cleared: "Effacé.", count: "UUID" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  let userActionReady = false;

  function fallbackUuid() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function createUuid() {
    if (crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return fallbackUuid();
  }

  function quantity() {
    const value = Number(quantityEl.value || 1);
    return Math.min(500, Math.max(1, Math.floor(value)));
  }

  function separator() {
    return separatorEl.value === "comma" ? ", " : "\n";
  }

  function render(items) {
    const values = uppercaseEl.checked ? items.map((item) => item.toUpperCase()) : items;
    outputEl.value = values.join(separator());
    countEl.textContent = `${values.length} ${t.count}`;
    statusEl.textContent = t.generated;
  }

  function generate() {
    const items = [];
    const total = quantity();
    quantityEl.value = String(total);
    for (let i = 0; i < total; i += 1) items.push(createUuid());
    render(items);
    if (userActionReady && typeof window.cuTrack === "function") window.cuTrack("tool_completed", { file_count: total, option_name: "format", option_value: uppercaseEl.checked ? "uppercase" : "lowercase" });
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
    outputEl.value = "";
    countEl.textContent = `0 ${t.count}`;
    statusEl.textContent = t.cleared;
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", copyOutput);
  clearBtn.addEventListener("click", clearAll);
  uppercaseEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "format", option_value: uppercaseEl.checked ? "uppercase" : "lowercase" });
    generate();
  });
  separatorEl.addEventListener("change", () => {
    if (typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "separator", option_value: separatorEl.value });
    generate();
  });
  generate();
  userActionReady = true;
  if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded");
})();
