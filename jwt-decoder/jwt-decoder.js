(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const inputEl = $("jwt-input");
  const headerEl = $("jwt-header");
  const payloadEl = $("jwt-payload");
  const signatureEl = $("jwt-signature");
  const claimsEl = $("jwt-claims");
  const statusEl = $("jwt-status");
  const decodeBtn = $("jwt-decode");
  const copyHeaderBtn = $("jwt-copy-header");
  const copyPayloadBtn = $("jwt-copy-payload");
  const sampleBtn = $("jwt-sample");
  const clearBtn = $("jwt-clear");

  const STRINGS = {
    en: { empty: "Paste a JWT to decode.", malformed: "A standard JWT should have three parts separated by dots.", badBase64: "The token contains a part that is not valid Base64URL.", badJson: "The header or payload could not be parsed as JSON.", decoded: "JWT decoded locally. Signature is not verified.", copiedHeader: "Header copied.", copiedPayload: "Payload copied.", cleared: "Cleared.", expired: "Expired", active: "Not expired", noExp: "No exp claim", exp: "exp", iat: "iat", nbf: "nbf" },
    th: { empty: "วาง JWT เพื่อถอดรหัส", malformed: "JWT มาตรฐานควรมี 3 ส่วนคั่นด้วยจุด", badBase64: "โทเคนมีส่วนที่ไม่ใช่ Base64URL ที่ถูกต้อง", badJson: "ไม่สามารถแปลง header หรือ payload เป็น JSON ได้", decoded: "ถอดรหัส JWT ในเครื่องแล้ว ยังไม่ได้ตรวจสอบลายเซ็น", copiedHeader: "คัดลอก header แล้ว", copiedPayload: "คัดลอก payload แล้ว", cleared: "ล้างแล้ว", expired: "หมดอายุ", active: "ยังไม่หมดอายุ", noExp: "ไม่มี claim exp", exp: "exp", iat: "iat", nbf: "nbf" },
    vi: { empty: "Dán JWT để giải mã.", malformed: "JWT chuẩn cần có ba phần được phân tách bằng dấu chấm.", badBase64: "Token có phần không phải Base64URL hợp lệ.", badJson: "Không thể parse header hoặc payload thành JSON.", decoded: "JWT đã được giải mã cục bộ. Chữ ký không được xác minh.", copiedHeader: "Đã sao chép header.", copiedPayload: "Đã sao chép payload.", cleared: "Đã xóa.", expired: "Đã hết hạn", active: "Chưa hết hạn", noExp: "Không có claim exp", exp: "exp", iat: "iat", nbf: "nbf" },
    zh: { empty: "粘贴 JWT 以解码。", malformed: "标准 JWT 应由三个用点分隔的部分组成。", badBase64: "令牌包含无效的 Base64URL 部分。", badJson: "无法将 header 或 payload 解析为 JSON。", decoded: "JWT 已在本地解码。未验证签名。", copiedHeader: "已复制 header。", copiedPayload: "已复制 payload。", cleared: "已清空。", expired: "已过期", active: "未过期", noExp: "没有 exp claim", exp: "exp", iat: "iat", nbf: "nbf" },
    ja: { empty: "デコードする JWT を貼り付けてください。", malformed: "標準 JWT はドットで区切られた 3 つの部分が必要です。", badBase64: "トークンに有効な Base64URL ではない部分があります。", badJson: "ヘッダーまたはペイロードを JSON として解析できません。", decoded: "JWT をローカルでデコードしました。署名は検証していません。", copiedHeader: "ヘッダーをコピーしました。", copiedPayload: "ペイロードをコピーしました。", cleared: "クリアしました。", expired: "期限切れ", active: "期限内", noExp: "exp claim なし", exp: "exp", iat: "iat", nbf: "nbf" },
    ko: { empty: "디코드할 JWT를 붙여넣으세요.", malformed: "표준 JWT는 점으로 구분된 세 부분이어야 합니다.", badBase64: "토큰에 올바른 Base64URL이 아닌 부분이 있습니다.", badJson: "header 또는 payload를 JSON으로 파싱할 수 없습니다.", decoded: "JWT가 로컬에서 디코드되었습니다. 서명은 검증하지 않습니다.", copiedHeader: "Header가 복사되었습니다.", copiedPayload: "Payload가 복사되었습니다.", cleared: "지웠습니다.", expired: "만료됨", active: "만료되지 않음", noExp: "exp claim 없음", exp: "exp", iat: "iat", nbf: "nbf" },
    es: { empty: "Pega un JWT para decodificar.", malformed: "Un JWT estándar debe tener tres partes separadas por puntos.", badBase64: "El token contiene una parte que no es Base64URL válida.", badJson: "No se pudo parsear el header o payload como JSON.", decoded: "JWT decodificado localmente. La firma no se verifica.", copiedHeader: "Header copiado.", copiedPayload: "Payload copiado.", cleared: "Limpiado.", expired: "Expirado", active: "No expirado", noExp: "Sin claim exp", exp: "exp", iat: "iat", nbf: "nbf" },
    fr: { empty: "Collez un JWT à décoder.", malformed: "Un JWT standard doit avoir trois parties séparées par des points.", badBase64: "Le token contient une partie qui n’est pas un Base64URL valide.", badJson: "Le header ou payload n’a pas pu être analysé comme JSON.", decoded: "JWT décodé localement. La signature n’est pas vérifiée.", copiedHeader: "Header copié.", copiedPayload: "Payload copié.", cleared: "Effacé.", expired: "Expiré", active: "Non expiré", noExp: "Aucun claim exp", exp: "exp", iat: "iat", nbf: "nbf" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  let decodedHeader = "";
  let decodedPayload = "";
  let textStarted = false;
  let userActionReady = false;

  function base64UrlDecode(part) {
    if (!/^[A-Za-z0-9_-]*$/.test(part)) throw new Error("badBase64");
    let base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad === 1) throw new Error("badBase64");
    if (pad) base64 += "=".repeat(4 - pad);
    try {
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch (_) {
      throw new Error("badBase64");
    }
  }

  function pretty(value) {
    return JSON.stringify(value, null, 2);
  }

  function formatDate(seconds) {
    if (typeof seconds !== "number" || !Number.isFinite(seconds)) return null;
    const date = new Date(seconds * 1000);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  }

  function renderClaims(payload) {
    claimsEl.innerHTML = "";
    const claims = [
      [t.exp, payload.exp],
      [t.iat, payload.iat],
      [t.nbf, payload.nbf],
    ];
    claims.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "jwt-claim-row";
      const key = document.createElement("b");
      key.textContent = label;
      const val = document.createElement("span");
      const iso = formatDate(value);
      val.textContent = iso ? `${value} · ${iso}` : "-";
      row.appendChild(key);
      row.appendChild(val);
      claimsEl.appendChild(row);
    });
    const state = document.createElement("p");
    state.className = "bg-status";
    if (typeof payload.exp === "number" && Number.isFinite(payload.exp)) {
      state.textContent = payload.exp * 1000 < Date.now() ? t.expired : t.active;
    } else {
      state.textContent = t.noExp;
    }
    claimsEl.appendChild(state);
  }

  function resetOutputs() {
    headerEl.textContent = "";
    payloadEl.textContent = "";
    signatureEl.textContent = "";
    claimsEl.innerHTML = "";
    decodedHeader = "";
    decodedPayload = "";
  }

  function setError(message) {
    resetOutputs();
    statusEl.textContent = message;
  }

  function decode() {
    const token = inputEl.value.trim();
    if (!token) {
      setError(t.empty);
      return;
    }
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[0] || !parts[1]) {
      setError(t.malformed);
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unsupported_format" });
      return;
    }
    let headerText;
    let payloadText;
    try {
      headerText = base64UrlDecode(parts[0]);
      payloadText = base64UrlDecode(parts[1]);
    } catch (_) {
      setError(t.badBase64);
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unsupported_format" });
      return;
    }
    let headerJson;
    let payloadJson;
    try {
      headerJson = JSON.parse(headerText);
      payloadJson = JSON.parse(payloadText);
    } catch (_) {
      setError(t.badJson);
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unsupported_format" });
      return;
    }
    decodedHeader = pretty(headerJson);
    decodedPayload = pretty(payloadJson);
    headerEl.textContent = decodedHeader;
    payloadEl.textContent = decodedPayload;
    signatureEl.textContent = parts[2] || "-";
    renderClaims(payloadJson);
    statusEl.textContent = t.decoded;
    if (userActionReady && typeof window.cuTrack === "function") window.cuTrack("tool_completed", { input_format: "jwt", output_format: "json" });
  }

  async function copyText(value, message) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      const area = document.createElement("textarea");
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    statusEl.textContent = message;
    if (typeof window.cuTrack === "function") window.cuTrack("copy_clicked", { output_format: "json" });
  }

  function sample() {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: "user-123",
      name: "ConvertUnlimited 👋",
      locale: "th-TH",
      iat: 1778529600,
      nbf: 1778529600,
      exp: 1810065600,
    };
    const encode = (value) => btoa(unescape(encodeURIComponent(JSON.stringify(value))))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
    inputEl.value = `${encode(header)}.${encode(payload)}.sample-signature-not-verified`;
    if (userActionReady && typeof window.cuTrack === "function") window.cuTrack("sample_used", { input_format: "jwt" });
    decode();
  }

  function clearAll() {
    inputEl.value = "";
    resetOutputs();
    statusEl.textContent = t.cleared;
  }

  decodeBtn.addEventListener("click", decode);
  copyHeaderBtn.addEventListener("click", () => copyText(decodedHeader, t.copiedHeader));
  copyPayloadBtn.addEventListener("click", () => copyText(decodedPayload, t.copiedPayload));
  sampleBtn.addEventListener("click", sample);
  clearBtn.addEventListener("click", clearAll);
  inputEl.addEventListener("input", () => {
    if (!textStarted && inputEl.value) {
      textStarted = true;
      if (typeof window.cuTrack === "function") window.cuTrack("text_input_started", { input_format: "jwt" });
    }
  });
  sample();
  userActionReady = true;
  if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded");
})();
