const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: { title: 'Diff Checker - Compare Text Online | ConvertUnlimited', description: 'Compare two texts locally in your browser. Show added, removed, and unchanged lines with summary counts and copy diff output.', hero: 'Diff Checker', sub: 'Compare two texts locally and see added, removed, and unchanged lines.', eyebrow: 'Local developer comparison tool', panelTitle: 'Compare original and changed text.', panelText: 'Paste two versions, run a line-based diff, and copy the result with selected text processed locally in your browser.', left: 'Original text', right: 'Changed text', ignoreCase: 'Ignore case', ignoreWhitespace: 'Ignore whitespace', compare: 'Compare text', sample: 'Sample diff', clear: 'Clear', output: 'Diff output', copy: 'Copy diff', summary: 'Summary', trustTitle: 'Private by design', trustOne: '<b>Local comparison.</b> Text comparison runs in your browser.', trustTwo: '<b>Local processing.</b> Text is processed locally in your browser.', articleTitle: 'When should you use a diff checker?', articleP1: 'Diff checking helps review edits, compare snippets, inspect configuration changes, and debug text output before sharing or deploying.', articleP2: 'This tool uses a simple line-based comparison and renders text safely as text, not raw HTML.', faqTitle: 'Frequently Asked Questions', faq: [['Is this Diff Checker free?', 'Yes. You can compare, copy, and clear text without signup.'], ['Is my text sent to ConvertUnlimited servers?', 'No server-side upload endpoint is used for comparison; text is processed locally in your browser.'], ['What kind of diff is used?', 'The tool uses a line-based diff that marks added, removed, and unchanged lines.'], ['Can it ignore whitespace or case?', 'Yes. Use the toggles before comparing.'], ['Does it support Unicode?', 'Yes. Unicode text and emojis are handled as browser strings.']], privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this text comparison flow. Text is processed locally in your browser.', termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Review diff output before using it in production workflows.' },
  th: { title: 'ตัวตรวจ Diff - เปรียบเทียบข้อความออนไลน์ | ConvertUnlimited', description: 'เปรียบเทียบข้อความสองชุดในเบราว์เซอร์ แสดงบรรทัดเพิ่ม ลบ และไม่เปลี่ยน พร้อมสรุปและไม่อัปโหลด', hero: 'ตัวตรวจ Diff', sub: 'เปรียบเทียบข้อความสองชุดในเครื่องและดูบรรทัดที่เพิ่ม ลบ และไม่เปลี่ยน', eyebrow: 'เครื่องมือเปรียบเทียบในเครื่อง', panelTitle: 'เปรียบเทียบข้อความต้นฉบับและที่แก้ไข', panelText: 'วางสองเวอร์ชัน ทำ line-based diff และคัดลอกผลลัพธ์โดยไม่ส่งข้อความไปเซิร์ฟเวอร์', left: 'ข้อความต้นฉบับ', right: 'ข้อความที่แก้ไข', ignoreCase: 'ไม่สนตัวพิมพ์', ignoreWhitespace: 'ไม่สนช่องว่าง', compare: 'เปรียบเทียบ', sample: 'Diff ตัวอย่าง', clear: 'ล้าง', output: 'ผลลัพธ์ diff', copy: 'คัดลอก diff', summary: 'สรุป', trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>เปรียบเทียบในเครื่อง</b> ทำงานในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ข้อความอยู่บนอุปกรณ์ของคุณ', articleTitle: 'ควรใช้ Diff Checker เมื่อใด?', articleP1: 'Diff ช่วยตรวจการแก้ไข เปรียบเทียบ snippet ตรวจ config และ debug output', articleP2: 'เครื่องมือนี้เปรียบเทียบแบบรายบรรทัดและแสดงข้อความเป็น text ไม่ใช่ HTML', faqTitle: 'คำถามที่พบบ่อย', faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี เปรียบเทียบ คัดลอก และล้างได้โดยไม่ต้องสมัคร'], ['ข้อความถูกอัปโหลดไหม?', 'ไม่ ทุกอย่างทำในเบราว์เซอร์'], ['ใช้ diff แบบไหน?', 'เปรียบเทียบรายบรรทัดและทำเครื่องหมายเพิ่ม ลบ ไม่เปลี่ยน'], ['ไม่สนช่องว่างหรือตัวพิมพ์ได้ไหม?', 'ได้ ใช้ตัวเลือกก่อนเปรียบเทียบ'], ['รองรับ Unicode ไหม?', 'รองรับข้อความ Unicode และอีโมจิ']], privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่งข้อความที่ใส่ในเครื่องมือนี้', termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจ diff ก่อนใช้ในงานจริง' },
  vi: { title: 'Trình kiểm tra Diff - So sánh văn bản online | ConvertUnlimited', description: 'So sánh hai văn bản trong trình duyệt. Hiển thị dòng thêm, xóa, không đổi, tóm tắt, copy diff và không upload.', hero: 'Trình kiểm tra Diff', sub: 'So sánh hai văn bản cục bộ và xem dòng thêm, xóa, không đổi.', eyebrow: 'Công cụ so sánh cục bộ', panelTitle: 'So sánh văn bản gốc và đã sửa.', panelText: 'Dán hai phiên bản, chạy line-based diff và sao chép kết quả mà không gửi dữ liệu lên server.', left: 'Văn bản gốc', right: 'Văn bản đã sửa', ignoreCase: 'Bỏ qua hoa/thường', ignoreWhitespace: 'Bỏ qua khoảng trắng', compare: 'So sánh văn bản', sample: 'Diff mẫu', clear: 'Xóa', output: 'Diff đầu ra', copy: 'Sao chép diff', summary: 'Tóm tắt', trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>So sánh cục bộ.</b> Diff chạy trong trình duyệt.', trustTwo: '<b>Không upload.</b> Văn bản ở lại trên thiết bị.', articleTitle: 'Khi nào nên dùng Diff Checker?', articleP1: 'Diff giúp review chỉnh sửa, so sánh snippet, kiểm tra cấu hình và debug output văn bản.', articleP2: 'Công cụ dùng so sánh theo dòng và render văn bản an toàn như text, không phải HTML.', faqTitle: 'Câu hỏi thường gặp', faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể so sánh, sao chép và xóa không cần đăng ký.'], ['Văn bản có được upload không?', 'Không. So sánh chạy cục bộ trong trình duyệt.'], ['Diff kiểu gì?', 'Line-based diff đánh dấu dòng thêm, xóa và không đổi.'], ['Có bỏ qua khoảng trắng hoặc hoa/thường không?', 'Có. Bật toggle trước khi so sánh.'], ['Có hỗ trợ Unicode không?', 'Có. Unicode và emoji được xử lý như chuỗi trình duyệt.']], privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền văn bản nhập vào công cụ.', termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy kiểm tra diff trước khi dùng trong workflow production.' },
  zh: { title: 'Diff 检查器 - 在线文本比较 | ConvertUnlimited', description: '在浏览器中本地比较两段文本。显示新增、删除和未变行，包含统计、复制输出，无需上传。', hero: 'Diff 检查器', sub: '本地比较两段文本并查看新增、删除和未变行。', eyebrow: '本地开发比较工具', panelTitle: '比较原始文本和修改文本。', panelText: '粘贴两个版本，运行基于行的 diff，并复制结果，无需发送到服务器。', left: '原始文本', right: '修改文本', ignoreCase: '忽略大小写', ignoreWhitespace: '忽略空白', compare: '比较文本', sample: '示例 Diff', clear: '清空', output: 'Diff 输出', copy: '复制 Diff', summary: '摘要', trustTitle: '隐私优先设计', trustOne: '<b>本地比较。</b> 文本比较在浏览器中运行。', trustTwo: '<b>无需上传。</b> 文本留在你的设备上。', articleTitle: '什么时候使用 Diff Checker？', articleP1: 'Diff 可用于审查编辑、比较代码片段、检查配置变更和调试文本输出。', articleP2: '本工具使用简单的行级比较，并把文本安全渲染为文本，而不是 HTML。', faqTitle: '常见问题', faq: [['这个 Diff 工具免费吗？', '免费。无需注册即可比较、复制和清空。'], ['文本会上传吗？', '不会。比较在浏览器本地完成。'], ['使用哪种 diff？', '基于行的 diff，标记新增、删除和未变行。'], ['可以忽略空白或大小写吗？', '可以。比较前打开对应选项。'], ['支持 Unicode 吗？', '支持。Unicode 文本和 emoji 会作为浏览器字符串处理。']], privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输输入到此工具的文本。', termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产流程使用前请检查 diff 输出。' },
  ja: { title: 'Diff チェッカー - オンラインテキスト比較 | ConvertUnlimited', description: 'ブラウザ内で 2 つのテキストを比較。追加、削除、変更なしの行、集計、コピーに対応。アップロード不要。', hero: 'Diff チェッカー', sub: '2 つのテキストをローカルで比較し、追加、削除、変更なしの行を確認します。', eyebrow: 'ローカル開発比較ツール', panelTitle: '元テキストと変更後テキストを比較。', panelText: '2 つのバージョンを貼り付け、行ベースの diff を実行し、サーバーへ送信せずに結果をコピーできます。', left: '元テキスト', right: '変更後テキスト', ignoreCase: '大文字小文字を無視', ignoreWhitespace: '空白を無視', compare: 'テキストを比較', sample: 'サンプル Diff', clear: 'クリア', output: 'Diff 出力', copy: 'Diff をコピー', summary: '集計', trustTitle: 'プライバシー重視', trustOne: '<b>ローカル比較。</b> テキスト比較はブラウザ内で実行されます。', trustTwo: '<b>アップロードなし。</b> テキストは端末内に留まります。', articleTitle: 'Diff Checker を使う場面', articleP1: 'Diff は編集レビュー、スニペット比較、設定変更確認、テキスト出力のデバッグに役立ちます。', articleP2: 'このツールは行ベース比較を使い、テキストを HTML ではなく安全にテキストとして表示します。', faqTitle: 'よくある質問', faq: [['この Diff ツールは無料ですか？', 'はい。登録なしで比較、コピー、クリアできます。'], ['テキストはアップロードされますか？', 'いいえ。比較はブラウザ内でローカルに行われます。'], ['どの種類の diff ですか？', '追加、削除、変更なしの行を示す行ベース diff です。'], ['空白や大文字小文字を無視できますか？', 'はい。比較前にトグルを使用します。'], ['Unicode に対応していますか？', 'はい。Unicode と絵文字をブラウザ文字列として扱います。']], privacyTitle: 'プライバシーポリシー', privacy: 'このツールに入力したテキストを収集、保存、アップロード、送信しません。', termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番ワークフローで使う前に diff 出力を確認してください。' },
  ko: { title: 'Diff 체커 - 온라인 텍스트 비교 | ConvertUnlimited', description: '브라우저에서 두 텍스트를 비교하세요. 추가, 삭제, 변경 없음 라인, 요약, diff 복사 지원, 업로드 없음.', hero: 'Diff 체커', sub: '두 텍스트를 로컬에서 비교하고 추가, 삭제, 변경 없음 라인을 확인합니다.', eyebrow: '로컬 개발 비교 도구', panelTitle: '원본과 변경 텍스트를 비교하세요.', panelText: '두 버전을 붙여넣고 line-based diff를 실행하며 서버로 보내지 않고 결과를 복사합니다.', left: '원본 텍스트', right: '변경 텍스트', ignoreCase: '대소문자 무시', ignoreWhitespace: '공백 무시', compare: '텍스트 비교', sample: '샘플 Diff', clear: '지우기', output: 'Diff 출력', copy: 'Diff 복사', summary: '요약', trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 비교.</b> 텍스트 비교는 브라우저에서 실행됩니다.', trustTwo: '<b>업로드 없음.</b> 텍스트는 기기에 남아 있습니다.', articleTitle: 'Diff Checker는 언제 사용하나요?', articleP1: 'Diff는 편집 리뷰, snippet 비교, 설정 변경 확인, 텍스트 출력 디버깅에 유용합니다.', articleP2: '이 도구는 간단한 line-based 비교를 사용하고 텍스트를 HTML이 아닌 텍스트로 안전하게 렌더링합니다.', faqTitle: '자주 묻는 질문', faq: [['이 Diff 도구는 무료인가요?', '네. 가입 없이 비교, 복사, 지우기를 할 수 있습니다.'], ['텍스트가 업로드되나요?', '아니요. 비교는 브라우저에서 로컬로 실행됩니다.'], ['어떤 diff를 사용하나요?', '추가, 삭제, 변경 없음 라인을 표시하는 line-based diff입니다.'], ['공백이나 대소문자를 무시할 수 있나요?', '네. 비교 전에 토글을 사용하세요.'], ['Unicode를 지원하나요?', '네. Unicode와 이모지를 브라우저 문자열로 처리합니다.']], privacyTitle: '개인정보 처리방침', privacy: '이 도구에 입력한 텍스트를 수집, 저장, 업로드 또는 전송하지 않습니다.', termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 워크플로에서 사용하기 전에 diff 출력을 검토하세요.' },
  es: { title: 'Diff Checker - Comparar texto online | ConvertUnlimited', description: 'Compara dos textos localmente en tu navegador. Muestra líneas añadidas, eliminadas y sin cambios, resumen, copiar diff y sin subidas.', hero: 'Diff Checker', sub: 'Compara dos textos localmente y ve líneas añadidas, eliminadas y sin cambios.', eyebrow: 'Herramienta local de comparación', panelTitle: 'Compara texto original y modificado.', panelText: 'Pega dos versiones, ejecuta un diff por líneas y copia el resultado sin enviar texto a un servidor.', left: 'Texto original', right: 'Texto modificado', ignoreCase: 'Ignorar mayúsculas', ignoreWhitespace: 'Ignorar espacios', compare: 'Comparar texto', sample: 'Diff de ejemplo', clear: 'Limpiar', output: 'Salida diff', copy: 'Copiar diff', summary: 'Resumen', trustTitle: 'Privado por diseño', trustOne: '<b>Comparación local.</b> El texto se compara en tu navegador.', trustTwo: '<b>Sin subidas.</b> El texto permanece en tu dispositivo.', articleTitle: '¿Cuándo usar un Diff Checker?', articleP1: 'Un diff ayuda a revisar ediciones, comparar snippets, inspeccionar cambios de configuración y depurar salidas de texto.', articleP2: 'La herramienta usa comparación simple por líneas y renderiza el texto de forma segura como texto, no HTML.', faqTitle: 'Preguntas frecuentes', faq: [['¿Este Diff Checker es gratis?', 'Sí. Puedes comparar, copiar y limpiar texto sin registro.'], ['¿Mi texto se sube?', 'No. La comparación ocurre localmente en tu navegador.'], ['¿Qué tipo de diff usa?', 'Un diff por líneas que marca añadidas, eliminadas y sin cambios.'], ['¿Puede ignorar espacios o mayúsculas?', 'Sí. Usa los toggles antes de comparar.'], ['¿Soporta Unicode?', 'Sí. Unicode y emojis se manejan como cadenas del navegador.']], privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos texto introducido en esta herramienta.', termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa el diff antes de usarlo en flujos de producción.' },
  fr: { title: 'Diff Checker - Comparer du texte en ligne | ConvertUnlimited', description: 'Comparez deux textes localement dans votre navigateur. Lignes ajoutées, supprimées, inchangées, résumé, copie, aucun envoi.', hero: 'Diff Checker', sub: 'Comparez deux textes localement et voyez les lignes ajoutées, supprimées et inchangées.', eyebrow: 'Outil local de comparaison', panelTitle: 'Comparez texte original et modifié.', panelText: 'Collez deux versions, lancez un diff par lignes et copiez le résultat sans envoyer le texte à un serveur.', left: 'Texte original', right: 'Texte modifié', ignoreCase: 'Ignorer la casse', ignoreWhitespace: 'Ignorer les espaces', compare: 'Comparer le texte', sample: 'Diff exemple', clear: 'Effacer', output: 'Sortie diff', copy: 'Copier diff', summary: 'Résumé', trustTitle: 'Privé par conception', trustOne: '<b>Comparaison locale.</b> Le texte est comparé dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Le texte reste sur votre appareil.', articleTitle: 'Quand utiliser un Diff Checker ?', articleP1: 'Un diff aide à relire des modifications, comparer des snippets, inspecter des changements de configuration et déboguer des sorties texte.', articleP2: 'L’outil utilise une comparaison simple par lignes et rend le texte comme texte, pas comme HTML.', faqTitle: 'Foire aux questions', faq: [['Ce Diff Checker est-il gratuit ?', 'Oui. Vous pouvez comparer, copier et effacer du texte sans inscription.'], ['Mon texte est-il envoyé ?', 'Non. La comparaison se fait localement dans votre navigateur.'], ['Quel type de diff est utilisé ?', 'Un diff par lignes qui marque les lignes ajoutées, supprimées et inchangées.'], ['Peut-il ignorer les espaces ou la casse ?', 'Oui. Utilisez les options avant de comparer.'], ['Unicode est-il pris en charge ?', 'Oui. Unicode et emojis sont traités comme chaînes du navigateur.']], privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons le texte saisi dans cet outil.', termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Relisez le diff avant utilisation en production.' },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/diff-checker/`;
const home = (l) => l.prefix ? `/${l.prefix}/` : '/';
const abs = (l) => `${BASE_URL}${route(l)}`;
const link = (l, slug) => `${l.prefix ? `/${l.prefix}` : ''}${slug ? `/${slug}/` : '/'}`;
const alternates = () => `${LOCALES.map((l) => `    <link rel="alternate" hreflang="${l.hreflang}" href="${abs(l)}">`).join('\n')}\n    <link rel="alternate" hreflang="x-default" href="${abs(LOCALES[0])}">`;

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
<link rel="canonical" href="${abs(locale)}">

${alternates()}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <style>.diff-row{display:flex;gap:10px;padding:4px 8px;border-bottom:1px solid var(--line);white-space:pre-wrap;overflow-wrap:anywhere}.diff-added{background:rgba(58,161,126,.12)}.diff-removed{background:rgba(220,80,80,.12)}.diff-same{background:transparent}.diff-sign{font-weight:700;min-width:14px}</style>
    ${schemaScripts(t, locale, { url: abs(locale) })}
</head>
<body>
    <div class="app">
        <header class="topbar">
            <a href="${home(locale)}" class="brand" aria-label="ConvertUnlimited home"><span class="mark" aria-hidden="true"></span><span class="word"><b>Convert</b><span>Unlimited</span></span></a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>100% free, no signup</span>
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'diff-checker')}" aria-current="page">Diff Checker</a><a href="${link(locale, 'regex-tester')}">Regex Tester</a><a href="${link(locale, 'json-formatter')}">JSON Formatter</a><a href="${link(locale, 'timestamp-converter')}">Timestamp Converter</a></div></details>
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
                                <label class="range-field" for="diff-left"><span>${esc(t.left)}</span><textarea id="diff-left" rows="12" spellcheck="false" class="mono" style="width:100%;resize:vertical;overflow-wrap:anywhere;"></textarea></label>
                                <label class="range-field" for="diff-right"><span>${esc(t.right)}</span><textarea id="diff-right" rows="12" spellcheck="false" class="mono" style="width:100%;resize:vertical;overflow-wrap:anywhere;"></textarea></label>
                                <label><input id="diff-ignore-case" type="checkbox"> ${esc(t.ignoreCase)}</label>
                                <label><input id="diff-ignore-whitespace" type="checkbox"> ${esc(t.ignoreWhitespace)}</label>
                                <button class="btn btn-accent" id="diff-compare" type="button">${esc(t.compare)}</button>
                                <button class="btn btn-ghost" id="diff-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="diff-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.summary)}:</b> <span id="diff-summary" class="mono num"></span></p>
                            <p class="bg-status" id="diff-status"></p>
                        </div>
                        <div class="bg-panel">
                            <div class="range-field"><span>${esc(t.output)}</span><div id="diff-output" class="mono" style="max-height:360px;overflow:auto;border:1px solid var(--line);border-radius:8px;"></div></div>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="diff-copy" type="button">${esc(t.copy)}</button></div>
                        </div>
                    </div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
            </div>
${aeoSummary(t, esc)}
            <section id="how" class="article"><h2>${esc(t.articleTitle)}</h2><p>${esc(t.articleP1)}</p><p>${esc(t.articleP2)}</p></section>
            <section id="faq" class="article"><h2>${esc(t.faqTitle)}</h2>
${t.faq.map(([q, a]) => `                <h3>${esc(q)}</h3>\n                <p>${esc(a)}</p>`).join('\n')}
            </section>
            <section id="privacy" class="article"><h2>${esc(t.privacyTitle)}</h2><p>${esc(t.privacy)}</p></section>
            <section id="terms" class="article"><h2>${esc(t.termsTitle)}</h2><p>${esc(t.terms)}</p></section>
<!-- RELATED_TOOLS_START -->
<!-- RELATED_TOOLS_END -->
        </main>
        <footer class="footer"><div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — ${locale.footerProcessing || 'supported processing runs in your browser'}.</div><nav class="links" aria-label="Footer"><a href="${link(locale, 'tools')}">${locale.toolsLabel || 'Tools'}</a><a href="${route(locale)}#how">${locale.guideLabel || 'Guide'}</a><a href="${route(locale)}#faq">${locale.faqLabel || 'FAQ'}</a><a href="${route(locale)}#privacy">${locale.privacyLabel || 'Privacy'}</a><a href="${route(locale)}#terms">${locale.termsLabel || 'Terms'}</a></nav></footer>
    </div>
    <script src="/diff-checker/diff-checker.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'diff-checker');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized Diff Checker pages');
