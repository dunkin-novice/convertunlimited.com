(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const modeEl = $("qr-mode");
  const valueEl = $("qr-value");
  const sizeEl = $("qr-size");
  const marginEl = $("qr-margin");
  const darkEl = $("qr-dark");
  const lightEl = $("qr-light");
  const transparentEl = $("qr-transparent");
  const canvas = $("qr-canvas");
  const statusEl = $("qr-status");
  const downloadPngBtn = $("qr-download-png");
  const downloadSvgBtn = $("qr-download-svg");

  const STRINGS = {
    en: { empty: "Enter a URL or text to generate a QR code.", tooLong: "This text is too long for the lightweight QR generator. Shorten it and try again.", ready: "QR code generated locally.", invalidUrl: "Enter a complete URL, such as https://example.com." },
    th: { empty: "ป้อน URL หรือข้อความเพื่อสร้าง QR", tooLong: "ข้อความยาวเกินไปสำหรับตัวสร้าง QR แบบเบา โปรดย่อแล้วลองใหม่", ready: "สร้าง QR ในเบราว์เซอร์แล้ว", invalidUrl: "ป้อน URL แบบเต็ม เช่น https://example.com" },
    vi: { empty: "Nhập URL hoặc văn bản để tạo mã QR.", tooLong: "Nội dung quá dài cho trình tạo QR gọn nhẹ. Hãy rút ngắn và thử lại.", ready: "Mã QR đã được tạo cục bộ.", invalidUrl: "Nhập URL đầy đủ, ví dụ https://example.com." },
    zh: { empty: "输入网址或文本以生成二维码。", tooLong: "文本过长，轻量二维码生成器无法处理。请缩短后重试。", ready: "二维码已在本地生成。", invalidUrl: "请输入完整网址，例如 https://example.com。" },
    ja: { empty: "URL またはテキストを入力して QR コードを作成します。", tooLong: "テキストが長すぎます。短くしてもう一度お試しください。", ready: "QR コードをローカルで生成しました。", invalidUrl: "https://example.com のような完全な URL を入力してください。" },
    ko: { empty: "URL 또는 텍스트를 입력해 QR 코드를 생성하세요.", tooLong: "텍스트가 너무 깁니다. 짧게 줄인 뒤 다시 시도하세요.", ready: "QR 코드가 로컬에서 생성되었습니다.", invalidUrl: "https://example.com 같은 전체 URL을 입력하세요." },
    es: { empty: "Introduce una URL o texto para generar un QR.", tooLong: "El texto es demasiado largo para este generador ligero. Acórtalo e inténtalo de nuevo.", ready: "Código QR generado localmente.", invalidUrl: "Introduce una URL completa, como https://example.com." },
    fr: { empty: "Saisissez une URL ou un texte pour générer un QR code.", tooLong: "Ce texte est trop long pour ce générateur QR léger. Raccourcissez-le et réessayez.", ready: "QR code généré localement.", invalidUrl: "Saisissez une URL complète, par exemple https://example.com." },
  };

  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  const DATA_CODEWORDS = [0, 19, 34, 55, 80, 108];
  const EC_CODEWORDS = [0, 7, 10, 15, 20, 26];
  const ALIGNMENT = [[], [], [6, 18], [6, 22], [6, 26], [6, 30]];
  let latestMatrix = null;
  let textStarted = false;
  let userActionReady = false;

  function gfMul(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      if (((y >>> i) & 1) !== 0) z ^= x;
    }
    return z & 0xFF;
  }

  function rsDivisor(degree) {
    let result = [1];
    let root = 1;
    for (let i = 0; i < degree; i++) {
      const next = new Array(result.length + 1).fill(0);
      for (let j = 0; j < result.length; j++) {
        next[j] ^= gfMul(result[j], root);
        next[j + 1] ^= result[j];
      }
      result = next;
      root = gfMul(root, 2);
    }
    return result.slice(1);
  }

  function rsRemainder(data, degree) {
    const divisor = rsDivisor(degree);
    const result = new Array(degree).fill(0);
    for (const byte of data) {
      const factor = byte ^ result.shift();
      result.push(0);
      for (let i = 0; i < degree; i++) result[i] ^= gfMul(divisor[i], factor);
    }
    return result;
  }

  function appendBits(bits, value, length) {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  }

  function makeCodewords(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let version = 1;
    while (version <= 5 && bytes.length + 2 > DATA_CODEWORDS[version]) version++;
    if (version > 5) throw new Error(t.tooLong);

    const bits = [];
    appendBits(bits, 0x4, 4);
    appendBits(bits, bytes.length, 8);
    bytes.forEach((byte) => appendBits(bits, byte, 8));
    const capacityBits = DATA_CODEWORDS[version] * 8;
    appendBits(bits, 0, Math.min(4, capacityBits - bits.length));
    while (bits.length % 8) bits.push(0);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) {
      data.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0));
    }
    for (let pad = 0xEC; data.length < DATA_CODEWORDS[version]; pad ^= 0xEC ^ 0x11) data.push(pad);
    return { version, codewords: data.concat(rsRemainder(data, EC_CODEWORDS[version])) };
  }

  function setModule(matrix, reserved, x, y, value, isReserved = true) {
    matrix[y][x] = value;
    if (isReserved) reserved[y][x] = true;
  }

  function drawFinder(matrix, reserved, x, y) {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || yy >= matrix.length || xx >= matrix.length) continue;
        const dark = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
        setModule(matrix, reserved, xx, yy, dark);
      }
    }
  }

  function drawAlignment(matrix, reserved, cx, cy) {
    if (reserved[cy][cx]) return;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setModule(matrix, reserved, cx + dx, cy + dy, dist !== 1);
      }
    }
  }

  function formatBits(mask) {
    let data = (1 << 3) | mask; // ECC level L is 01.
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ (((rem >>> 9) & 1) * 0x537);
    return ((data << 10) | rem) ^ 0x5412;
  }

  function makeMatrix(text) {
    const { version, codewords } = makeCodewords(text);
    const size = version * 4 + 17;
    const matrix = Array.from({ length: size }, () => new Array(size).fill(false));
    const reserved = Array.from({ length: size }, () => new Array(size).fill(false));

    drawFinder(matrix, reserved, 0, 0);
    drawFinder(matrix, reserved, size - 7, 0);
    drawFinder(matrix, reserved, 0, size - 7);
    for (let i = 0; i < size; i++) {
      setModule(matrix, reserved, 6, i, i % 2 === 0);
      setModule(matrix, reserved, i, 6, i % 2 === 0);
    }
    for (const pos of ALIGNMENT[version]) {
      for (const pos2 of ALIGNMENT[version]) drawAlignment(matrix, reserved, pos, pos2);
    }
    setModule(matrix, reserved, 8, size - 8, true);
    for (let i = 0; i < 9; i++) {
      if (i !== 6) {
        reserved[8][i] = true;
        reserved[i][8] = true;
      }
    }
    for (let i = 0; i < 8; i++) {
      reserved[8][size - 1 - i] = true;
      reserved[size - 1 - i][8] = true;
    }

    const bits = [];
    codewords.forEach((byte) => appendBits(bits, byte, 8));
    let bitIndex = 0;
    let upward = true;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right--;
      for (let vert = 0; vert < size; vert++) {
        const y = upward ? size - 1 - vert : vert;
        for (let dx = 0; dx < 2; dx++) {
          const x = right - dx;
          if (reserved[y][x]) continue;
          const bit = bitIndex < bits.length ? bits[bitIndex++] === 1 : false;
          matrix[y][x] = bit ^ ((x + y) % 2 === 0);
        }
      }
      upward = !upward;
    }

    const format = formatBits(0);
    for (let i = 0; i <= 5; i++) setModule(matrix, reserved, 8, i, ((format >>> i) & 1) !== 0);
    setModule(matrix, reserved, 8, 7, ((format >>> 6) & 1) !== 0);
    setModule(matrix, reserved, 8, 8, ((format >>> 7) & 1) !== 0);
    setModule(matrix, reserved, 7, 8, ((format >>> 8) & 1) !== 0);
    for (let i = 9; i < 15; i++) setModule(matrix, reserved, 14 - i, 8, ((format >>> i) & 1) !== 0);
    for (let i = 0; i < 8; i++) setModule(matrix, reserved, size - 1 - i, 8, ((format >>> i) & 1) !== 0);
    for (let i = 8; i < 15; i++) setModule(matrix, reserved, 8, size - 15 + i, ((format >>> i) & 1) !== 0);

    return matrix;
  }

  function currentText() {
    const raw = valueEl.value.trim();
    if (modeEl.value === "url" && raw && !/^https?:\/\//i.test(raw)) throw new Error(t.invalidUrl);
    return raw;
  }

  function draw() {
    let text;
    try {
      text = currentText();
    } catch (error) {
      statusEl.textContent = error.message;
      latestMatrix = null;
      clearCanvas();
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unsupported_format" });
      return;
    }
    if (!text) {
      statusEl.textContent = t.empty;
      latestMatrix = null;
      clearCanvas();
      return;
    }
    try {
      latestMatrix = makeMatrix(text);
      renderCanvas();
      statusEl.textContent = t.ready;
      downloadPngBtn.disabled = false;
      downloadSvgBtn.disabled = false;
      if (userActionReady && typeof window.cuTrack === "function") window.cuTrack("tool_completed", { output_format: "png", option_name: "mode", option_value: modeEl.value });
    } catch (error) {
      latestMatrix = null;
      clearCanvas();
      statusEl.textContent = error.message || t.tooLong;
      downloadPngBtn.disabled = true;
      downloadSvgBtn.disabled = true;
      if (typeof window.cuTrack === "function") window.cuTrack("error_shown", { error_type: "unsupported_format" });
    }
  }

  function clearCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function renderCanvas() {
    if (!latestMatrix) return;
    const size = parseInt(sizeEl.value, 10);
    const margin = parseInt(marginEl.value, 10);
    const transparent = transparentEl.checked;
    const dark = darkEl.value || "#111111";
    const light = lightEl.value || "#ffffff";
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!transparent) {
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, size, size);
    } else {
      ctx.clearRect(0, 0, size, size);
    }
    const modules = latestMatrix.length;
    const quiet = margin;
    const cell = size / (modules + quiet * 2);
    ctx.fillStyle = dark;
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) {
        if (latestMatrix[y][x]) {
          ctx.fillRect(Math.round((x + quiet) * cell), Math.round((y + quiet) * cell), Math.ceil(cell), Math.ceil(cell));
        }
      }
    }
  }

  function svgString() {
    const size = parseInt(sizeEl.value, 10);
    const margin = parseInt(marginEl.value, 10);
    const dark = darkEl.value || "#111111";
    const light = lightEl.value || "#ffffff";
    const transparent = transparentEl.checked;
    const modules = latestMatrix.length;
    const view = modules + margin * 2;
    const paths = [];
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) if (latestMatrix[y][x]) paths.push(`M${x + margin},${y + margin}h1v1h-1z`);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${view} ${view}" shape-rendering="crispEdges">${transparent ? "" : `<path fill="${light}" d="M0 0h${view}v${view}H0z"/>`}<path fill="${dark}" d="${paths.join("")}"/></svg>`;
  }

  function download(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  function downloadPng() {
    if (!latestMatrix) return;
    renderCanvas();
    download(canvas.toDataURL("image/png"), "qr-code.png");
    if (typeof window.cuTrack === "function") window.cuTrack("download_clicked", { output_format: "png" });
  }

  function downloadSvg() {
    if (!latestMatrix) return;
    const blob = new Blob([svgString()], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    download(url, "qr-code.svg");
    URL.revokeObjectURL(url);
    if (typeof window.cuTrack === "function") window.cuTrack("download_clicked", { output_format: "svg" });
  }

  [modeEl, valueEl, sizeEl, marginEl, darkEl, lightEl, transparentEl].forEach((el) => {
    el.addEventListener("input", () => {
      if (el === valueEl && !textStarted && valueEl.value) {
        textStarted = true;
        if (typeof window.cuTrack === "function") window.cuTrack("text_input_started", { option_name: "mode", option_value: modeEl.value });
      }
      draw();
    });
    el.addEventListener("change", () => {
      if (el === modeEl && typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "mode", option_value: modeEl.value });
      else if (el === transparentEl && typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: "transparent", option_value: transparentEl.checked ? "enabled" : "disabled" });
      else if ((el === sizeEl || el === marginEl) && typeof window.cuTrack === "function") window.cuTrack("option_changed", { option_name: el === sizeEl ? "size" : "margin" });
      draw();
    });
  });
  downloadPngBtn.addEventListener("click", downloadPng);
  downloadSvgBtn.addEventListener("click", downloadSvg);
  draw();
  userActionReady = true;
  if (typeof window.cuTrack === "function") window.cuTrack("tool_loaded");
})();
