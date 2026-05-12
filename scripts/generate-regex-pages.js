const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = [
  { code: 'en', prefix: '', hreflang: 'en', label: 'EN', name: 'English' },
  { code: 'th', prefix: 'th', hreflang: 'th', label: 'TH', name: 'ไทย' },
  { code: 'vi', prefix: 'vi', hreflang: 'vi', label: 'VI', name: 'Tiếng Việt' },
  { code: 'zh', prefix: 'zh', hreflang: 'zh-Hans', label: 'ZH', name: '中文（简体）' },
  { code: 'ja', prefix: 'ja', hreflang: 'ja', label: 'JA', name: '日本語' },
  { code: 'ko', prefix: 'ko', hreflang: 'ko', label: 'KO', name: '한국어' },
  { code: 'es', prefix: 'es', hreflang: 'es', label: 'ES', name: 'Español' },
  { code: 'fr', prefix: 'fr', hreflang: 'fr', label: 'FR', name: 'Français' },
];

const TEXT = {
  en: { title: 'Regex Tester - Test JavaScript Regular Expressions Online | ConvertUnlimited', description: 'Test JavaScript regex patterns locally in your browser. Highlight matches, flags, capture groups, replace preview, Unicode support, and no uploads.', hero: 'Regex Tester', sub: 'Test JavaScript regular expressions locally for validation, parsing, and debugging workflows.', eyebrow: 'Local developer validation tool', panelTitle: 'Test regex patterns safely.', panelText: 'Enter a pattern and sample text to highlight matches, preview replacements, and inspect capture groups without sending data to a server.', pattern: 'Regex pattern', flags: 'Flags', text: 'Test text', replace: 'Replace with', output: 'Highlighted matches', results: 'Match results', preview: 'Replace preview', sample: 'Sample regex', clear: 'Clear', trustTitle: 'Private by design', trustOne: '<b>Local testing.</b> Regex matching runs in your browser.', trustTwo: '<b>No uploads.</b> Patterns and text stay on your device.', articleTitle: 'When should you test regex?', articleP1: 'Regex testing helps validate form input, parse logs, inspect API text, and debug extraction rules before using them in code.', articleP2: 'This tool uses native JavaScript RegExp behavior and renders user text as text, not HTML.', faqTitle: 'Frequently Asked Questions', faq: [['Is this Regex Tester free?', 'Yes. You can test patterns and preview replacements without signup.'], ['Is my text uploaded?', 'No. Regex testing happens locally in your browser.'], ['Which regex engine is used?', 'It uses the native JavaScript RegExp engine in your browser.'], ['Are invalid regex patterns handled?', 'Yes. The tool shows a friendly warning and preserves your input.'], ['Does it support Unicode regex?', 'Yes. Use the u flag for Unicode-aware patterns.']], privacyTitle: 'Privacy Policy', privacy: 'We do not collect, store, upload, or transmit regex patterns or test text entered into this tool.', termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Test expressions carefully before using them in production systems.' },
  th: { title: 'ตัวทดสอบ Regex - ทดสอบ Regular Expression ออนไลน์ | ConvertUnlimited', description: 'ทดสอบ JavaScript regex ในเบราว์เซอร์ highlight match, flags, capture groups, replace preview, Unicode และไม่อัปโหลด', hero: 'ตัวทดสอบ Regex', sub: 'ทดสอบ regular expression ในเครื่องสำหรับ validation, parsing และ debugging', eyebrow: 'เครื่องมือ validation ในเครื่อง', panelTitle: 'ทดสอบ regex pattern อย่างปลอดภัย', panelText: 'ใส่ pattern และข้อความตัวอย่างเพื่อ highlight match ดู replace preview และ capture group โดยไม่ส่งข้อมูลไปเซิร์ฟเวอร์', pattern: 'Regex pattern', flags: 'Flags', text: 'ข้อความทดสอบ', replace: 'แทนที่ด้วย', output: 'Match ที่ highlight', results: 'ผลลัพธ์ match', preview: 'Replace preview', sample: 'Regex ตัวอย่าง', clear: 'ล้าง', trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>ทดสอบในเครื่อง</b> Regex ทำงานในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> Pattern และข้อความอยู่บนอุปกรณ์ของคุณ', articleTitle: 'ควรทดสอบ regex เมื่อใด?', articleP1: 'Regex ช่วยตรวจ form input, parse log, ตรวจข้อความ API และ debug rule ก่อนใช้ในโค้ด', articleP2: 'เครื่องมือนี้ใช้ JavaScript RegExp ของเบราว์เซอร์และแสดงข้อความเป็น text ไม่ใช่ HTML', faqTitle: 'คำถามที่พบบ่อย', faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี ทดสอบ pattern และ preview replace ได้โดยไม่ต้องสมัคร'], ['ข้อความถูกอัปโหลดไหม?', 'ไม่ ทุกอย่างทำในเบราว์เซอร์'], ['ใช้ regex engine อะไร?', 'ใช้ JavaScript RegExp engine ในเบราว์เซอร์'], ['Pattern ผิดจัดการไหม?', 'จะแสดงคำเตือนและเก็บข้อมูลเดิมไว้'], ['รองรับ Unicode regex ไหม?', 'รองรับ ใช้ flag u สำหรับ Unicode']], privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่ง regex หรือข้อความทดสอบ', termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรทดสอบ expression ก่อนใช้จริง' },
  vi: { title: 'Trình kiểm tra Regex - Test regular expression online | ConvertUnlimited', description: 'Test JavaScript regex trong trình duyệt. Highlight match, flags, capture group, replace preview, Unicode và không upload.', hero: 'Trình kiểm tra Regex', sub: 'Test regular expression cục bộ cho validation, parsing và debugging.', eyebrow: 'Công cụ validation cục bộ', panelTitle: 'Test regex pattern an toàn.', panelText: 'Nhập pattern và văn bản mẫu để highlight match, xem replace preview và capture group mà không gửi dữ liệu lên server.', pattern: 'Regex pattern', flags: 'Flags', text: 'Văn bản test', replace: 'Thay bằng', output: 'Match được highlight', results: 'Kết quả match', preview: 'Replace preview', sample: 'Regex mẫu', clear: 'Xóa', trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Test cục bộ.</b> Regex chạy trong trình duyệt.', trustTwo: '<b>Không upload.</b> Pattern và văn bản ở lại trên thiết bị.', articleTitle: 'Khi nào nên test regex?', articleP1: 'Regex giúp validate form, parse log, kiểm tra text API và debug rule trước khi đưa vào code.', articleP2: 'Công cụ dùng JavaScript RegExp của trình duyệt và render text như văn bản, không phải HTML.', faqTitle: 'Câu hỏi thường gặp', faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể test pattern và preview replace không cần đăng ký.'], ['Văn bản có được upload không?', 'Không. Regex chạy cục bộ trong trình duyệt.'], ['Dùng engine regex nào?', 'Dùng JavaScript RegExp engine của trình duyệt.'], ['Pattern lỗi thì sao?', 'Công cụ cảnh báo thân thiện và giữ nguyên đầu vào.'], ['Có hỗ trợ Unicode regex không?', 'Có. Dùng flag u cho Unicode.']], privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền regex pattern hay văn bản test.', termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy test expression kỹ trước khi dùng production.' },
  zh: { title: 'Regex 测试工具 - 在线测试 JavaScript 正则 | ConvertUnlimited', description: '在浏览器中本地测试 JavaScript regex。高亮匹配、flags、捕获组、替换预览、Unicode 支持，无需上传。', hero: 'Regex 测试工具', sub: '为验证、解析和调试流程本地测试 JavaScript 正则表达式。', eyebrow: '本地开发验证工具', panelTitle: '安全测试 regex pattern。', panelText: '输入 pattern 和示例文本，高亮匹配、预览替换并查看捕获组，无需发送到服务器。', pattern: 'Regex pattern', flags: 'Flags', text: '测试文本', replace: '替换为', output: '高亮匹配', results: '匹配结果', preview: '替换预览', sample: '示例 Regex', clear: '清空', trustTitle: '隐私优先设计', trustOne: '<b>本地测试。</b> Regex 匹配在浏览器中运行。', trustTwo: '<b>无需上传。</b> Pattern 和文本留在你的设备上。', articleTitle: '什么时候测试 regex？', articleP1: 'Regex 测试可用于表单验证、日志解析、API 文本检查，以及在代码中使用前调试提取规则。', articleP2: '本工具使用浏览器原生 JavaScript RegExp，并把用户文本作为文本渲染，而不是 HTML。', faqTitle: '常见问题', faq: [['这个 Regex 工具免费吗？', '免费。无需注册即可测试 pattern 和预览替换。'], ['文本会上传吗？', '不会。Regex 测试在浏览器本地完成。'], ['使用哪个 regex 引擎？', '使用浏览器原生 JavaScript RegExp 引擎。'], ['无效 pattern 会怎样？', '工具会显示友好警告并保留输入。'], ['支持 Unicode regex 吗？', '支持。使用 u flag。']], privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输输入的 regex pattern 或测试文本。', termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产系统使用前请仔细测试表达式。' },
  ja: { title: 'Regex テスター - JavaScript 正規表現をオンラインテスト | ConvertUnlimited', description: 'ブラウザ内で JavaScript regex をテスト。ハイライト、flags、キャプチャグループ、置換プレビュー、Unicode 対応。アップロード不要。', hero: 'Regex テスター', sub: '検証、解析、デバッグ向けに JavaScript 正規表現をローカルでテストします。', eyebrow: 'ローカル開発検証ツール', panelTitle: 'Regex pattern を安全にテスト。', panelText: 'Pattern とサンプルテキストを入力し、match のハイライト、置換プレビュー、capture group を確認できます。', pattern: 'Regex pattern', flags: 'Flags', text: 'テストテキスト', replace: '置換後', output: 'ハイライト結果', results: 'Match 結果', preview: '置換プレビュー', sample: 'サンプル Regex', clear: 'クリア', trustTitle: 'プライバシー重視', trustOne: '<b>ローカルテスト。</b> Regex はブラウザ内で実行されます。', trustTwo: '<b>アップロードなし。</b> Pattern とテキストは端末内に留まります。', articleTitle: 'Regex をテストする場面', articleP1: 'Regex はフォーム検証、ログ解析、API テキスト確認、抽出ルールのデバッグに役立ちます。', articleP2: 'このツールはブラウザの JavaScript RegExp を使い、ユーザーテキストを HTML ではなくテキストとして表示します。', faqTitle: 'よくある質問', faq: [['この Regex ツールは無料ですか？', 'はい。登録なしで pattern テストと置換プレビューができます。'], ['テキストはアップロードされますか？', 'いいえ。ブラウザ内でローカルに実行されます。'], ['どの regex engine ですか？', 'ブラウザの JavaScript RegExp engine です。'], ['無効な pattern は？', '警告を表示し、元の入力を保持します。'], ['Unicode regex に対応しますか？', 'はい。u flag を使用してください。']], privacyTitle: 'プライバシーポリシー', privacy: '入力された regex pattern やテストテキストを収集、保存、アップロード、送信しません。', termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番使用前に expression を確認してください。' },
  ko: { title: 'Regex 테스터 - JavaScript 정규식 온라인 테스트 | ConvertUnlimited', description: '브라우저에서 JavaScript regex를 테스트하세요. 매치 하이라이트, flags, 캡처 그룹, replace preview, Unicode 지원, 업로드 없음.', hero: 'Regex 테스터', sub: '검증, 파싱, 디버깅 워크플로용 JavaScript 정규식을 로컬에서 테스트합니다.', eyebrow: '로컬 개발 검증 도구', panelTitle: 'Regex pattern을 안전하게 테스트하세요.', panelText: 'Pattern과 샘플 텍스트를 입력해 match 하이라이트, replace preview, capture group을 확인합니다.', pattern: 'Regex pattern', flags: 'Flags', text: '테스트 텍스트', replace: '바꿀 값', output: '하이라이트된 match', results: 'Match 결과', preview: 'Replace preview', sample: '샘플 Regex', clear: '지우기', trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 테스트.</b> Regex 매칭은 브라우저에서 실행됩니다.', trustTwo: '<b>업로드 없음.</b> Pattern과 텍스트는 기기에 남아 있습니다.', articleTitle: 'Regex는 언제 테스트하나요?', articleP1: 'Regex 테스트는 form validation, log parsing, API text 검사, 추출 규칙 디버깅에 유용합니다.', articleP2: '이 도구는 브라우저 JavaScript RegExp를 사용하고 사용자 텍스트를 HTML이 아닌 텍스트로 렌더링합니다.', faqTitle: '자주 묻는 질문', faq: [['이 Regex 도구는 무료인가요?', '네. 가입 없이 pattern 테스트와 replace preview를 할 수 있습니다.'], ['텍스트가 업로드되나요?', '아니요. 브라우저에서 로컬로 실행됩니다.'], ['어떤 regex engine을 사용하나요?', '브라우저의 JavaScript RegExp engine을 사용합니다.'], ['잘못된 pattern은 어떻게 되나요?', '친절한 경고를 표시하고 입력을 유지합니다.'], ['Unicode regex를 지원하나요?', '네. u flag를 사용하세요.']], privacyTitle: '개인정보 처리방침', privacy: '입력한 regex pattern이나 테스트 텍스트를 수집, 저장, 업로드 또는 전송하지 않습니다.', termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 사용 전 expression을 확인하세요.' },
  es: { title: 'Probador Regex - Test de expresiones regulares online | ConvertUnlimited', description: 'Prueba regex JavaScript en tu navegador. Resalta coincidencias, flags, grupos, replace preview, Unicode y sin subidas.', hero: 'Probador Regex', sub: 'Prueba expresiones regulares JavaScript localmente para validación, parsing y depuración.', eyebrow: 'Herramienta local de validación', panelTitle: 'Prueba patrones regex con seguridad.', panelText: 'Introduce un patrón y texto de ejemplo para resaltar matches, previsualizar reemplazos e inspeccionar grupos.', pattern: 'Patrón regex', flags: 'Flags', text: 'Texto de prueba', replace: 'Reemplazar con', output: 'Matches resaltados', results: 'Resultados', preview: 'Replace preview', sample: 'Regex de ejemplo', clear: 'Limpiar', trustTitle: 'Privado por diseño', trustOne: '<b>Prueba local.</b> Regex se ejecuta en tu navegador.', trustTwo: '<b>Sin subidas.</b> Patrones y texto permanecen en tu dispositivo.', articleTitle: '¿Cuándo probar regex?', articleP1: 'Regex ayuda a validar formularios, parsear logs, revisar texto API y depurar reglas antes de usarlas en código.', articleP2: 'La herramienta usa JavaScript RegExp nativo y renderiza el texto como texto, no como HTML.', faqTitle: 'Preguntas frecuentes', faq: [['¿Esta herramienta Regex es gratis?', 'Sí. Puedes probar patrones y previsualizar reemplazos sin registro.'], ['¿Mi texto se sube?', 'No. Todo ocurre localmente en tu navegador.'], ['¿Qué motor regex usa?', 'Usa el motor JavaScript RegExp del navegador.'], ['¿Maneja patrones inválidos?', 'Sí. Muestra una advertencia clara y conserva la entrada.'], ['¿Soporta Unicode regex?', 'Sí. Usa el flag u para Unicode.']], privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos patrones regex o texto de prueba.', termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Prueba las expresiones antes de usarlas en producción.' },
  fr: { title: 'Testeur Regex - Tester des expressions régulières en ligne | ConvertUnlimited', description: 'Testez des regex JavaScript dans votre navigateur. Surbrillance, flags, groupes, replace preview, Unicode, aucun envoi.', hero: 'Testeur Regex', sub: 'Testez des expressions régulières JavaScript localement pour validation, parsing et debug.', eyebrow: 'Outil local de validation', panelTitle: 'Testez les motifs regex en sécurité.', panelText: 'Saisissez un motif et un texte exemple pour surligner les correspondances, prévisualiser les remplacements et inspecter les groupes.', pattern: 'Motif regex', flags: 'Flags', text: 'Texte de test', replace: 'Remplacer par', output: 'Correspondances surlignées', results: 'Résultats', preview: 'Replace preview', sample: 'Regex exemple', clear: 'Effacer', trustTitle: 'Privé par conception', trustOne: '<b>Test local.</b> Regex s’exécute dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Motifs et texte restent sur votre appareil.', articleTitle: 'Quand tester une regex ?', articleP1: 'Regex aide à valider formulaires, parser logs, inspecter du texte API et déboguer les règles avant le code.', articleP2: 'Cet outil utilise JavaScript RegExp natif et rend le texte utilisateur comme texte, pas comme HTML.', faqTitle: 'Foire aux questions', faq: [['Ce testeur Regex est-il gratuit ?', 'Oui. Vous pouvez tester des motifs et prévisualiser les remplacements sans inscription.'], ['Mon texte est-il envoyé ?', 'Non. Tout se passe localement dans votre navigateur.'], ['Quel moteur regex est utilisé ?', 'Le moteur JavaScript RegExp natif du navigateur.'], ['Les motifs invalides sont-ils gérés ?', 'Oui. L’outil affiche un avertissement clair et conserve l’entrée.'], ['Unicode regex est-il pris en charge ?', 'Oui. Utilisez le flag u pour Unicode.']], privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons les motifs regex ou textes de test.', termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Testez vos expressions avant la production.' },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/regex-tester/`;
const home = (l) => l.prefix ? `/${l.prefix}/` : '/';
const abs = (l) => `${BASE_URL}${route(l)}`;
const link = (l, slug) => `${l.prefix ? `/${l.prefix}` : ''}${slug ? `/${slug}/` : '/'}`;
const alternates = () => `${LOCALES.map((l) => `    <link rel="alternate" hreflang="${l.hreflang}" href="${abs(l)}">`).join('\n')}\n    <link rel="alternate" hreflang="x-default" href="${abs(LOCALES[0])}">`;
const faqSchema = (t, l) => JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: l.hreflang, mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

function page(locale) {
  const t = TEXT[locale.code];
  return `<!DOCTYPE html>
<html lang="${locale.hreflang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(t.title)}</title>
    <meta name="description" content="${esc(t.description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="theme-color" content="#3aa17e">
    <meta name="google-adsense-account" content="${ADSENSE}">
    <link rel="canonical" href="${abs(locale)}">

${alternates()}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <script type="application/ld+json">${faqSchema(t, locale)}</script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-98HSCSEKBX"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-98HSCSEKBX');</script>
</head>
<body>
    <div class="app">
        <header class="topbar">
            <a href="${home(locale)}" class="brand" aria-label="ConvertUnlimited home"><span class="mark" aria-hidden="true"></span><span class="word"><b>Convert</b><span>Unlimited</span></span></a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>100% free, no signup</span>
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'regex-tester')}" aria-current="page">Regex Tester</a><a href="${link(locale, 'json-formatter')}">JSON Formatter</a><a href="${link(locale, 'url-encoder-decoder')}">URL Encoder</a><a href="${link(locale, 'timestamp-converter')}">Timestamp Converter</a></div></details>
                <details class="lang-switcher"><summary aria-label="Language"><span aria-hidden="true">🌐</span> ${locale.label}</summary><div class="lang-menu" role="menu">
${LOCALES.map((l) => `                        <a href="${route(l)}" hreflang="${l.hreflang}" lang="${l.hreflang}"${l.code === locale.code ? ' aria-current="page"' : ''}>${l.name}</a>`).join('\n')}
                    </div></details>
            </nav>
        </header>
        <main>
            <section class="hero"><h1 class="hero-title">${esc(t.hero)}</h1><p class="sub hero-sub">${esc(t.sub)}</p></section>
            <div class="grid" id="layout">
                <section class="bg-tool" aria-label="${esc(t.hero)}">
                    <div class="bg-tool-head"><div><p class="section-eyebrow">${esc(t.eyebrow)}</p><h2>${esc(t.panelTitle)}</h2><p>${esc(t.panelText)}</p></div></div>
                    <div class="bg-workbench">
                        <div class="bg-panel">
                            <div class="bg-controls">
                                <label class="range-field" for="regex-pattern"><span>${esc(t.pattern)}</span><input id="regex-pattern" class="mono" type="text" spellcheck="false"></label>
                                <div class="range-field"><span>${esc(t.flags)}</span><div class="bg-controls" style="gap:8px;"><label><input id="regex-flag-g" type="checkbox" checked> g</label><label><input id="regex-flag-i" type="checkbox"> i</label><label><input id="regex-flag-m" type="checkbox"> m</label><label><input id="regex-flag-s" type="checkbox"> s</label><label><input id="regex-flag-u" type="checkbox"> u</label></div></div>
                                <label class="range-field" for="regex-text"><span>${esc(t.text)}</span><textarea id="regex-text" rows="10" spellcheck="false" class="mono" style="width:100%;resize:vertical;overflow-wrap:anywhere;"></textarea></label>
                                <label class="range-field" for="regex-replace"><span>${esc(t.replace)}</span><input id="regex-replace" class="mono" type="text" spellcheck="false"></label>
                                <button class="btn btn-ghost" id="regex-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="regex-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status" id="regex-status"></p>
                            <p class="bg-status" id="regex-warning" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <div class="range-field"><span>${esc(t.output)}</span><pre id="regex-output" class="mono" style="white-space:pre-wrap;overflow-wrap:anywhere;max-height:220px;overflow:auto;border:1px solid var(--line);padding:12px;border-radius:8px;"></pre></div>
                            <label class="range-field" for="regex-results"><span>${esc(t.results)}</span><textarea id="regex-results" rows="6" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;"></textarea></label>
                            <label class="range-field" for="regex-replace-preview"><span>${esc(t.preview)}</span><textarea id="regex-replace-preview" rows="6" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;"></textarea></label>
                        </div>
                    </div>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_REGEX_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_REGEX_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
            </div>
            <section id="how" class="article"><h2>${esc(t.articleTitle)}</h2><p>${esc(t.articleP1)}</p><p>${esc(t.articleP2)}</p></section>
            <section id="faq" class="article"><h2>${esc(t.faqTitle)}</h2>
${t.faq.map(([q, a]) => `                <h3>${esc(q)}</h3>\n                <p>${esc(a)}</p>`).join('\n')}
            </section>
            <section id="privacy" class="article"><h2>${esc(t.privacyTitle)}</h2><p>${esc(t.privacy)}</p></section>
            <section id="terms" class="article"><h2>${esc(t.termsTitle)}</h2><p>${esc(t.terms)}</p></section>
<!-- RELATED_TOOLS_START -->
<!-- RELATED_TOOLS_END -->
        </main>
        <footer class="footer"><div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — runs entirely in your browser.</div><nav class="links" aria-label="Footer"><a href="${link(locale, 'tools')}">Tools</a><a href="${route(locale)}#how">Guide</a><a href="${route(locale)}#faq">FAQ</a><a href="${route(locale)}#privacy">Privacy</a><a href="${route(locale)}#terms">Terms</a></nav></footer>
    </div>
    <script src="/regex-tester/regex-tester.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'regex-tester');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized Regex pages');
