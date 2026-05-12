(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const patternEl = $("regex-pattern");
  const textEl = $("regex-text");
  const replaceEl = $("regex-replace");
  const outputEl = $("regex-output");
  const resultsEl = $("regex-results");
  const replacePreviewEl = $("regex-replace-preview");
  const statusEl = $("regex-status");
  const warningEl = $("regex-warning");
  const sampleBtn = $("regex-sample");
  const clearBtn = $("regex-clear");
  const flagIds = ["g", "i", "m", "s", "u"].map((flag) => [`regex-flag-${flag}`, flag]);

  const STRINGS = {
    en: { empty: "Enter a pattern and test text.", matched: "Matches found.", none: "No matches found.", invalid: "Invalid regex pattern. Original input was preserved.", long: "Input is large, so matching was skipped to keep the page responsive.", cleared: "Cleared.", matches: "matches", groups: "groups" },
    th: { empty: "ใส่ pattern และข้อความทดสอบ", matched: "พบ match", none: "ไม่พบ match", invalid: "regex pattern ไม่ถูกต้อง ข้อมูลเดิมยังถูกเก็บไว้", long: "ข้อมูลยาวมาก จึงข้ามการทดสอบเพื่อให้หน้าไม่ค้าง", cleared: "ล้างแล้ว", matches: "match", groups: "group" },
    vi: { empty: "Nhập pattern và văn bản kiểm thử.", matched: "Tìm thấy match.", none: "Không tìm thấy match.", invalid: "Regex pattern không hợp lệ. Dữ liệu gốc được giữ nguyên.", long: "Đầu vào lớn nên bỏ qua để giữ trang phản hồi.", cleared: "Đã xóa.", matches: "match", groups: "group" },
    zh: { empty: "输入 pattern 和测试文本。", matched: "找到匹配。", none: "未找到匹配。", invalid: "正则表达式无效。原始输入已保留。", long: "输入较大，已跳过匹配以保持页面响应。", cleared: "已清空。", matches: "匹配", groups: "分组" },
    ja: { empty: "パターンとテスト文字列を入力してください。", matched: "一致が見つかりました。", none: "一致はありません。", invalid: "無効な正規表現です。元の入力は保持されました。", long: "入力が大きいため、応答性を保つためにスキップしました。", cleared: "クリアしました。", matches: "件", groups: "グループ" },
    ko: { empty: "패턴과 테스트 텍스트를 입력하세요.", matched: "일치 항목을 찾았습니다.", none: "일치 항목이 없습니다.", invalid: "잘못된 정규식 패턴입니다. 원본 입력은 유지되었습니다.", long: "입력이 커서 페이지 응답성을 위해 매칭을 건너뛰었습니다.", cleared: "지웠습니다.", matches: "일치", groups: "그룹" },
    es: { empty: "Introduce un patrón y texto de prueba.", matched: "Coincidencias encontradas.", none: "No se encontraron coincidencias.", invalid: "Patrón regex no válido. Se conservó la entrada original.", long: "La entrada es grande, se omitió para mantener la página fluida.", cleared: "Limpiado.", matches: "coincidencias", groups: "grupos" },
    fr: { empty: "Saisissez un motif et un texte de test.", matched: "Correspondances trouvées.", none: "Aucune correspondance.", invalid: "Motif regex invalide. L’entrée originale a été conservée.", long: "L’entrée est volumineuse, le test a été ignoré pour garder la page réactive.", cleared: "Effacé.", matches: "correspondances", groups: "groupes" },
  };
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const t = STRINGS[lang] || STRINGS.en;
  const LIMIT = 200000;

  function flags() {
    const selected = flagIds.filter(([id]) => $(id).checked).map(([, flag]) => flag).join("");
    return selected.includes("g") ? selected : `${selected}g`;
  }

  function makeRegex() {
    return new RegExp(patternEl.value, flags());
  }

  function appendText(parent, text) {
    parent.appendChild(document.createTextNode(text));
  }

  function appendMark(parent, text) {
    const mark = document.createElement("mark");
    mark.textContent = text;
    parent.appendChild(mark);
  }

  function renderHighlights(text, matches) {
    outputEl.innerHTML = "";
    let pos = 0;
    matches.forEach((match) => {
      appendText(outputEl, text.slice(pos, match.index));
      appendMark(outputEl, text.slice(match.index, match.index + match.value.length));
      pos = match.index + match.value.length;
    });
    appendText(outputEl, text.slice(pos));
  }

  function testRegex() {
    warningEl.textContent = "";
    resultsEl.textContent = "";
    replacePreviewEl.value = "";
    outputEl.textContent = textEl.value;
    if (!patternEl.value || !textEl.value) {
      statusEl.textContent = t.empty;
      return;
    }
    if (textEl.value.length > LIMIT) {
      warningEl.textContent = t.long;
      statusEl.textContent = t.long;
      return;
    }
    let re;
    try {
      re = makeRegex();
    } catch (_) {
      warningEl.textContent = t.invalid;
      statusEl.textContent = t.invalid;
      return;
    }
    const matches = [];
    let match;
    let guard = 0;
    while ((match = re.exec(textEl.value)) && guard < 1000) {
      matches.push({ value: match[0], index: match.index, groups: match.slice(1) });
      if (match[0] === "") re.lastIndex += 1;
      guard += 1;
    }
    if (matches.length) {
      renderHighlights(textEl.value, matches);
      resultsEl.textContent = matches.map((item, idx) => `#${idx + 1} @ ${item.index}: ${item.value}${item.groups.length ? ` (${t.groups}: ${item.groups.join(", ")})` : ""}`).join("\n");
      statusEl.textContent = `${matches.length} ${t.matches}. ${t.matched}`;
    } else {
      statusEl.textContent = t.none;
    }
    try {
      replacePreviewEl.value = textEl.value.replace(makeRegex(), replaceEl.value);
    } catch (_) {
      replacePreviewEl.value = "";
    }
  }

  function sample() {
    patternEl.value = "\\b[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}\\b";
    textEl.value = "Contact alice@example.com, bob@convertunlimited.com, and สวัสดี@example.co.th.";
    replaceEl.value = "[email]";
    $("regex-flag-g").checked = true;
    $("regex-flag-i").checked = true;
    testRegex();
  }

  function clearAll() {
    patternEl.value = "";
    textEl.value = "";
    replaceEl.value = "";
    outputEl.textContent = "";
    resultsEl.textContent = "";
    replacePreviewEl.value = "";
    warningEl.textContent = "";
    statusEl.textContent = t.cleared;
  }

  [patternEl, textEl, replaceEl].forEach((el) => el.addEventListener("input", testRegex));
  flagIds.forEach(([id]) => $(id).addEventListener("change", testRegex));
  sampleBtn.addEventListener("click", sample);
  clearBtn.addEventListener("click", clearAll);
  sample();
})();
