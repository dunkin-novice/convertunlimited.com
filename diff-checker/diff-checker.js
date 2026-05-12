(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const leftEl = $("diff-left");
  const rightEl = $("diff-right");
  const ignoreCaseEl = $("diff-ignore-case");
  const ignoreWhitespaceEl = $("diff-ignore-whitespace");
  const outputEl = $("diff-output");
  const summaryEl = $("diff-summary");
  const statusEl = $("diff-status");
  const compareBtn = $("diff-compare");
  const copyBtn = $("diff-copy");
  const sampleBtn = $("diff-sample");
  const clearBtn = $("diff-clear");

  const STRINGS = {
    en: { empty: "Add text on both sides to compare.", compared: "Diff generated locally.", copied: "Diff copied.", cleared: "Cleared.", long: "This comparison is too large for the browser preview. Try fewer lines or split the text into smaller sections.", added: "added", removed: "removed", unchanged: "unchanged" },
    th: { empty: "ใส่ข้อความทั้งสองฝั่งเพื่อเปรียบเทียบ", compared: "สร้าง diff ในเครื่องแล้ว", copied: "คัดลอก diff แล้ว", cleared: "ล้างแล้ว", long: "ข้อความนี้ใหญ่เกินไปสำหรับการแสดง diff ในเบราว์เซอร์ ลองลดจำนวนบรรทัดหรือแบ่งข้อความเป็นส่วนเล็กลง", added: "เพิ่ม", removed: "ลบ", unchanged: "ไม่เปลี่ยน" },
    vi: { empty: "Thêm văn bản ở cả hai bên để so sánh.", compared: "Đã tạo diff cục bộ.", copied: "Đã sao chép diff.", cleared: "Đã xóa.", long: "Phần so sánh này quá lớn cho bản xem trước trong trình duyệt. Hãy thử ít dòng hơn hoặc chia văn bản nhỏ hơn.", added: "thêm", removed: "xóa", unchanged: "không đổi" },
    zh: { empty: "在两侧添加文本以比较。", compared: "Diff 已在本地生成。", copied: "已复制 diff。", cleared: "已清空。", long: "此比较对于浏览器预览来说过大。请减少行数或把文本拆成更小的部分。", added: "新增", removed: "删除", unchanged: "未变" },
    ja: { empty: "比較するには両側にテキストを入力してください。", compared: "Diff をローカルで生成しました。", copied: "Diff をコピーしました。", cleared: "クリアしました。", long: "この比較はブラウザのプレビューには大きすぎます。行数を減らすか、テキストを小さく分けてください。", added: "追加", removed: "削除", unchanged: "変更なし" },
    ko: { empty: "비교하려면 양쪽에 텍스트를 입력하세요.", compared: "Diff가 로컬에서 생성되었습니다.", copied: "Diff가 복사되었습니다.", cleared: "지웠습니다.", long: "이 비교는 브라우저 미리보기에는 너무 큽니다. 줄 수를 줄이거나 텍스트를 더 작은 부분으로 나누세요.", added: "추가", removed: "삭제", unchanged: "변경 없음" },
    es: { empty: "Añade texto en ambos lados para comparar.", compared: "Diff generado localmente.", copied: "Diff copiado.", cleared: "Limpiado.", long: "Esta comparación es demasiado grande para la vista previa del navegador. Prueba con menos líneas o divide el texto en secciones más pequeñas.", added: "añadidas", removed: "eliminadas", unchanged: "sin cambios" },
    fr: { empty: "Ajoutez du texte des deux côtés pour comparer.", compared: "Diff généré localement.", copied: "Diff copié.", cleared: "Effacé.", long: "Cette comparaison est trop volumineuse pour l’aperçu du navigateur. Essayez moins de lignes ou divisez le texte en sections plus petites.", added: "ajoutées", removed: "supprimées", unchanged: "inchangées" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;

  let lastDiffText = "";
  const CHAR_LIMIT = 200000;
  const CELL_LIMIT = 250000;

  function normalize(line) {
    let value = line;
    if (ignoreWhitespaceEl.checked) value = value.trim().replace(/\s+/g, " ");
    if (ignoreCaseEl.checked) value = value.toLowerCase();
    return value;
  }

  function lines(value) {
    return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  }

  function diff(left, right) {
    const a = lines(left);
    const b = lines(right);
    const an = a.map(normalize);
    const bn = b.map(normalize);
    const dp = Array.from({ length: an.length + 1 }, () => Array(bn.length + 1).fill(0));
    for (let i = an.length - 1; i >= 0; i -= 1) {
      for (let j = bn.length - 1; j >= 0; j -= 1) {
        dp[i][j] = an[i] === bn[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const rows = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      if (an[i] === bn[j]) {
        rows.push({ type: "same", text: a[i] });
        i += 1;
        j += 1;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        rows.push({ type: "removed", text: a[i] });
        i += 1;
      } else {
        rows.push({ type: "added", text: b[j] });
        j += 1;
      }
    }
    while (i < a.length) rows.push({ type: "removed", text: a[i++] });
    while (j < b.length) rows.push({ type: "added", text: b[j++] });
    return rows;
  }

  function rowLabel(type) {
    if (type === "added") return "+";
    if (type === "removed") return "-";
    return " ";
  }

  function render(rows) {
    outputEl.innerHTML = "";
    const counts = { added: 0, removed: 0, same: 0 };
    lastDiffText = rows.map((row) => `${rowLabel(row.type)} ${row.text}`).join("\n");
    rows.forEach((row) => {
      counts[row.type] += 1;
      const div = document.createElement("div");
      div.className = `diff-row diff-${row.type}`;
      const sign = document.createElement("span");
      sign.className = "diff-sign";
      sign.textContent = rowLabel(row.type);
      const text = document.createElement("span");
      text.textContent = row.text || " ";
      div.appendChild(sign);
      div.appendChild(text);
      outputEl.appendChild(div);
    });
    summaryEl.textContent = `${counts.added} ${t.added} · ${counts.removed} ${t.removed} · ${counts.same} ${t.unchanged}`;
  }

  function compare() {
    if (!leftEl.value && !rightEl.value) {
      outputEl.innerHTML = "";
      summaryEl.textContent = "";
      statusEl.textContent = t.empty;
      lastDiffText = "";
      return;
    }
    const leftLines = lines(leftEl.value).length;
    const rightLines = lines(rightEl.value).length;
    if (leftEl.value.length + rightEl.value.length > CHAR_LIMIT || leftLines * rightLines > CELL_LIMIT) {
      outputEl.innerHTML = "";
      summaryEl.textContent = "";
      statusEl.textContent = t.long;
      lastDiffText = "";
      return;
    }
    render(diff(leftEl.value, rightEl.value));
    statusEl.textContent = t.compared;
  }

  async function copyDiff() {
    if (!lastDiffText) return;
    try {
      await navigator.clipboard.writeText(lastDiffText);
      statusEl.textContent = t.copied;
    } catch (_) {
      const area = document.createElement("textarea");
      area.value = lastDiffText;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      statusEl.textContent = t.copied;
    }
  }

  function sample() {
    leftEl.value = "name: ConvertUnlimited\nstatus: draft\nlocale: en\nemoji: hello 👋\ncity: Bangkok";
    rightEl.value = "name: ConvertUnlimited\nstatus: live\nlocale: en\nemoji: hello 👋\ncity: Bangkok\nupdated: 2026-05-12";
    compare();
  }

  function clearAll() {
    leftEl.value = "";
    rightEl.value = "";
    outputEl.innerHTML = "";
    summaryEl.textContent = "";
    lastDiffText = "";
    statusEl.textContent = t.cleared;
  }

  compareBtn.addEventListener("click", compare);
  copyBtn.addEventListener("click", copyDiff);
  sampleBtn.addEventListener("click", sample);
  clearBtn.addEventListener("click", clearAll);
  ignoreCaseEl.addEventListener("change", compare);
  ignoreWhitespaceEl.addEventListener("change", compare);
  sample();
})();
