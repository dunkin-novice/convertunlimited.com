const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'URL Encoder Decoder - Encode & Decode URLs Online | ConvertUnlimited',
    description: 'Encode and decode URLs locally in your browser. Supports Unicode, query strings, encodeURI, encodeURIComponent, and copy output.',
    hero: 'URL Encoder / Decoder', sub: 'Encode and decode URLs, query strings, and text locally in your browser.',
    eyebrow: 'Local developer URL tool', panelTitle: 'Convert URLs and encoded strings safely.', panelText: 'Encode reserved characters for URLs or decode percent-encoded strings with selected inputs processed locally in your browser.',
    input: 'Input', output: 'Output', mode: 'Encoding mode', full: 'Full URL', component: 'URL component', encode: 'Encode URL', decode: 'Decode URL', copy: 'Copy output', clear: 'Clear', sample: 'Sample URL',
    chars: 'Characters', bytes: 'Bytes', trustTitle: 'Private by design', trustOne: '<b>Local processing.</b> URL encoding and decoding run in your browser.', trustTwo: '<b>Local processing.</b> Text is processed locally in your browser.',
    articleTitle: 'When should you encode URLs?', articleP1: 'URL encoding is useful for query strings, API calls, redirects, search parameters, and debugging links that contain spaces, Unicode, or reserved characters.', articleP2: 'Use full URL mode when the URL structure should stay readable. Use component mode when encoding a single query value or path segment.',
    faqTitle: 'Frequently Asked Questions',
    faq: [['Is this URL Encoder free?', 'Yes. You can encode, decode, copy, and clear text without signup.'], ['Is my URL uploaded?', 'No. All URL encoding and decoding happens locally in your browser.'], ['What is the difference between full URL and component mode?', 'Full URL mode keeps URL separators such as : / ? and & readable. Component mode encodes those reserved characters too.'], ['Does it support Unicode and emojis?', 'Yes. UTF-8 text, emojis, accents, and non-Latin scripts are supported.'], ['What happens with malformed percent-encoding?', 'The tool shows a friendly warning and keeps your original input.']],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this URL encoding and decoding flow. Text input is processed locally in your browser.', termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Review encoded or decoded output before using it in production systems.',
  },
  th: {
    title: 'ตัวเข้ารหัสและถอดรหัส URL ออนไลน์ | ConvertUnlimited', description: 'เข้ารหัสและถอดรหัส URL ในเบราว์เซอร์ รองรับ Unicode, query string, encodeURI, encodeURIComponent และไม่อัปโหลด',
    hero: 'ตัวเข้ารหัส / ถอดรหัส URL', sub: 'เข้ารหัสและถอดรหัส URL, query string และข้อความในเบราว์เซอร์',
    eyebrow: 'เครื่องมือ URL ในเครื่อง', panelTitle: 'แปลง URL และข้อความเข้ารหัสอย่างปลอดภัย', panelText: 'เข้ารหัสอักขระพิเศษสำหรับ URL หรือถอด percent-encoding โดยไม่อัปโหลดข้อมูล',
    input: 'ขาเข้า', output: 'ผลลัพธ์', mode: 'โหมดเข้ารหัส', full: 'URL เต็ม', component: 'URL component', encode: 'เข้ารหัส URL', decode: 'ถอดรหัส URL', copy: 'คัดลอกผลลัพธ์', clear: 'ล้าง', sample: 'URL ตัวอย่าง',
    chars: 'อักขระ', bytes: 'ไบต์', trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>ประมวลผลในเครื่อง</b> URL encoding ทำในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ข้อความอยู่บนอุปกรณ์ของคุณ',
    articleTitle: 'ควรเข้ารหัส URL เมื่อใด?', articleP1: 'URL encoding ใช้กับ query string, API, redirect, search parameter และลิงก์ที่มีช่องว่างหรือ Unicode', articleP2: 'ใช้โหมด URL เต็มเมื่ออยากรักษาโครงสร้าง URL และใช้ component เมื่อเข้ารหัสค่า query หรือ path segment',
    faqTitle: 'คำถามที่พบบ่อย', faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี เข้ารหัส ถอดรหัส คัดลอก และล้างได้โดยไม่ต้องสมัคร'], ['URL ถูกอัปโหลดไหม?', 'ไม่ ทุกอย่างทำในเบราว์เซอร์'], ['URL เต็มต่างจาก component อย่างไร?', 'URL เต็มเก็บตัวคั่นเช่น : / ? และ & ส่วน component จะเข้ารหัสอักขระเหล่านั้นด้วย'], ['รองรับ Unicode ไหม?', 'รองรับ UTF-8 อีโมจิ เครื่องหมาย และภาษาที่ไม่ใช่ละติน'], ['ถ้า percent-encoding ผิดจะเกิดอะไร?', 'จะแสดงคำเตือนและเก็บข้อมูลเดิมไว้']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่งข้อความที่ใส่ในเครื่องมือนี้', termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจผลลัพธ์ก่อนใช้ในระบบจริง',
  },
  vi: {
    title: 'Trình mã hóa và giải mã URL online | ConvertUnlimited', description: 'Mã hóa và giải mã URL trong trình duyệt. Hỗ trợ Unicode, query string, encodeURI, encodeURIComponent và không upload.',
    hero: 'Trình mã hóa / giải mã URL', sub: 'Mã hóa và giải mã URL, query string và văn bản ngay trong trình duyệt.',
    eyebrow: 'Công cụ URL cục bộ', panelTitle: 'Chuyển URL và chuỗi mã hóa an toàn.', panelText: 'Mã hóa ký tự đặc biệt cho URL hoặc giải mã percent-encoding mà không upload dữ liệu.',
    input: 'Đầu vào', output: 'Đầu ra', mode: 'Chế độ mã hóa', full: 'URL đầy đủ', component: 'URL component', encode: 'Mã hóa URL', decode: 'Giải mã URL', copy: 'Sao chép đầu ra', clear: 'Xóa', sample: 'URL mẫu',
    chars: 'Ký tự', bytes: 'Byte', trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Xử lý cục bộ.</b> URL encoding chạy trong trình duyệt.', trustTwo: '<b>Không upload.</b> Văn bản ở lại trên thiết bị.',
    articleTitle: 'Khi nào nên mã hóa URL?', articleP1: 'URL encoding hữu ích cho query string, API, redirect, tham số tìm kiếm và debug liên kết có khoảng trắng hoặc Unicode.', articleP2: 'Dùng URL đầy đủ để giữ cấu trúc URL dễ đọc. Dùng component để mã hóa một giá trị query hoặc đoạn path.',
    faqTitle: 'Câu hỏi thường gặp', faq: [['Công cụ URL này miễn phí không?', 'Có. Bạn có thể mã hóa, giải mã, sao chép và xóa không cần đăng ký.'], ['URL có được upload không?', 'Không. Tất cả chạy cục bộ trong trình duyệt.'], ['URL đầy đủ khác component thế nào?', 'URL đầy đủ giữ : / ? và &, còn component mã hóa cả ký tự dành riêng đó.'], ['Có hỗ trợ Unicode không?', 'Có. UTF-8, emoji, dấu và chữ không Latin được hỗ trợ.'], ['Percent-encoding lỗi thì sao?', 'Công cụ hiển thị cảnh báo và giữ nguyên đầu vào.']],
    privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền văn bản nhập vào công cụ này.', termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy kiểm tra đầu ra trước khi dùng trong production.',
  },
  zh: {
    title: 'URL 编码解码工具 - 在线 URL 转换 | ConvertUnlimited', description: '在浏览器中本地编码和解码 URL。支持 Unicode、查询字符串、encodeURI、encodeURIComponent，无需上传。',
    hero: 'URL 编码 / 解码工具', sub: '在浏览器中本地编码和解码 URL、查询字符串和文本。',
    eyebrow: '本地开发 URL 工具', panelTitle: '安全转换 URL 和编码字符串。', panelText: '为 URL 编码保留字符，或解码百分号编码字符串，无需上传数据。',
    input: '输入', output: '输出', mode: '编码模式', full: '完整 URL', component: 'URL 组件', encode: '编码 URL', decode: '解码 URL', copy: '复制输出', clear: '清空', sample: '示例 URL',
    chars: '字符', bytes: '字节', trustTitle: '隐私优先设计', trustOne: '<b>本地处理。</b> URL 编码和解码在浏览器中运行。', trustTwo: '<b>无需上传。</b> 文本留在你的设备上。',
    articleTitle: '什么时候需要 URL 编码？', articleP1: 'URL 编码适用于查询字符串、API、重定向、搜索参数，以及包含空格、Unicode 或保留字符的链接调试。', articleP2: '完整 URL 模式会保留 URL 结构。组件模式适合编码单个查询值或路径片段。',
    faqTitle: '常见问题', faq: [['这个 URL 工具免费吗？', '免费。无需注册即可编码、解码、复制和清空。'], ['URL 会上传吗？', '不会。所有处理都在浏览器本地完成。'], ['完整 URL 和组件模式有什么区别？', '完整 URL 保留 : / ? 和 & 等分隔符。组件模式也会编码这些保留字符。'], ['支持 Unicode 吗？', '支持。UTF-8、emoji、重音和非拉丁文字都支持。'], ['百分号编码错误怎么办？', '工具会显示友好警告并保留原始输入。']],
    privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输输入到此工具的文本。', termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产系统使用前请检查输出。',
  },
  ja: {
    title: 'URL エンコード / デコードツール | ConvertUnlimited', description: 'ブラウザ内で URL をエンコード・デコード。Unicode、クエリ文字列、encodeURI、encodeURIComponent に対応。アップロード不要。',
    hero: 'URL エンコード / デコード', sub: 'URL、クエリ文字列、テキストをブラウザ内でローカルに変換します。',
    eyebrow: 'ローカル開発 URL ツール', panelTitle: 'URL とエンコード文字列を安全に変換。', panelText: 'URL 用に予約文字をエンコードし、percent-encoding をデコードします。データはアップロードされません。',
    input: '入力', output: '出力', mode: 'エンコード方式', full: '完全な URL', component: 'URL コンポーネント', encode: 'URL をエンコード', decode: 'URL をデコード', copy: '出力をコピー', clear: 'クリア', sample: 'サンプル URL',
    chars: '文字', bytes: 'バイト', trustTitle: 'プライバシー重視', trustOne: '<b>ローカル処理。</b> URL 変換はブラウザ内で行われます。', trustTwo: '<b>アップロードなし。</b> テキストは端末内に留まります。',
    articleTitle: 'URL エンコードを使う場面', articleP1: 'URL エンコードはクエリ文字列、API、リダイレクト、検索パラメータ、空白や Unicode を含むリンクの確認に便利です。', articleP2: 'URL 構造を残すなら完全な URL、単一のクエリ値やパス片ならコンポーネントを使います。',
    faqTitle: 'よくある質問', faq: [['この URL ツールは無料ですか？', 'はい。登録なしでエンコード、デコード、コピー、クリアできます。'], ['URL はアップロードされますか？', 'いいえ。すべてブラウザ内で処理されます。'], ['完全な URL とコンポーネントの違いは？', '完全な URL は : / ? や & を残し、コンポーネントはそれらもエンコードします。'], ['Unicode に対応していますか？', 'はい。UTF-8、絵文字、アクセント、非ラテン文字に対応します。'], ['不正な percent-encoding は？', '警告を表示し、元の入力を保持します。']],
    privacyTitle: 'プライバシーポリシー', privacy: 'このツールに入力したテキストを収集、保存、アップロード、送信しません。', termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番システムで使う前に出力を確認してください。',
  },
  ko: {
    title: 'URL 인코더 / 디코더 온라인 | ConvertUnlimited', description: '브라우저에서 URL을 인코딩하고 디코딩하세요. Unicode, query string, encodeURI, encodeURIComponent 지원, 업로드 없음.',
    hero: 'URL 인코더 / 디코더', sub: '브라우저에서 URL, 쿼리 문자열, 텍스트를 로컬로 인코딩하고 디코딩합니다.',
    eyebrow: '로컬 개발 URL 도구', panelTitle: 'URL과 인코딩 문자열을 안전하게 변환하세요.', panelText: 'URL용 예약 문자를 인코딩하거나 percent-encoding 문자열을 디코딩하며 데이터를 업로드하지 않습니다.',
    input: '입력', output: '출력', mode: '인코딩 모드', full: '전체 URL', component: 'URL 컴포넌트', encode: 'URL 인코딩', decode: 'URL 디코딩', copy: '출력 복사', clear: '지우기', sample: '샘플 URL',
    chars: '문자', bytes: '바이트', trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 처리.</b> URL 변환은 브라우저에서 실행됩니다.', trustTwo: '<b>업로드 없음.</b> 텍스트는 기기에 남아 있습니다.',
    articleTitle: 'URL 인코딩은 언제 사용하나요?', articleP1: 'URL 인코딩은 쿼리 문자열, API, 리디렉션, 검색 매개변수, 공백이나 Unicode가 포함된 링크 디버깅에 유용합니다.', articleP2: 'URL 구조를 유지하려면 전체 URL 모드, 단일 쿼리 값이나 경로 조각에는 컴포넌트 모드를 사용하세요.',
    faqTitle: '자주 묻는 질문', faq: [['이 URL 도구는 무료인가요?', '네. 가입 없이 인코딩, 디코딩, 복사, 지우기를 할 수 있습니다.'], ['URL이 업로드되나요?', '아니요. 모든 처리는 브라우저에서 로컬로 실행됩니다.'], ['전체 URL과 컴포넌트의 차이는?', '전체 URL은 : / ? 및 &를 유지하고 컴포넌트는 그 예약 문자도 인코딩합니다.'], ['Unicode를 지원하나요?', '네. UTF-8, 이모지, 악센트, 비라틴 문자를 지원합니다.'], ['잘못된 percent-encoding은 어떻게 되나요?', '친절한 경고를 표시하고 원본 입력을 유지합니다.']],
    privacyTitle: '개인정보 처리방침', privacy: '이 도구에 입력한 텍스트를 수집, 저장, 업로드 또는 전송하지 않습니다.', termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 시스템에서 사용하기 전에 출력을 검토하세요.',
  },
  es: {
    title: 'Codificador y decodificador URL online | ConvertUnlimited', description: 'Codifica y decodifica URLs en tu navegador. Soporta Unicode, query strings, encodeURI, encodeURIComponent y sin subidas.',
    hero: 'Codificador / decodificador URL', sub: 'Codifica y decodifica URLs, query strings y texto localmente en tu navegador.',
    eyebrow: 'Herramienta local de URL', panelTitle: 'Convierte URLs y cadenas codificadas con seguridad.', panelText: 'Codifica caracteres reservados para URLs o decodifica percent-encoding sin subir datos.',
    input: 'Entrada', output: 'Salida', mode: 'Modo de codificación', full: 'URL completa', component: 'Componente URL', encode: 'Codificar URL', decode: 'Decodificar URL', copy: 'Copiar salida', clear: 'Limpiar', sample: 'URL de ejemplo',
    chars: 'Caracteres', bytes: 'Bytes', trustTitle: 'Privado por diseño', trustOne: '<b>Procesamiento local.</b> La codificación URL ocurre en tu navegador.', trustTwo: '<b>Sin subidas.</b> El texto permanece en tu dispositivo.',
    articleTitle: '¿Cuándo codificar URLs?', articleP1: 'La codificación URL ayuda con query strings, APIs, redirecciones, parámetros de búsqueda y enlaces con espacios, Unicode o caracteres reservados.', articleP2: 'Usa URL completa para mantener la estructura legible. Usa componente para un valor de query o segmento de ruta.',
    faqTitle: 'Preguntas frecuentes', faq: [['¿Esta herramienta URL es gratis?', 'Sí. Puedes codificar, decodificar, copiar y limpiar sin registro.'], ['¿Mi URL se sube?', 'No. Todo ocurre localmente en tu navegador.'], ['¿Diferencia entre URL completa y componente?', 'URL completa mantiene : / ? y &, componente también codifica esos caracteres reservados.'], ['¿Soporta Unicode?', 'Sí. Soporta UTF-8, emojis, acentos y escrituras no latinas.'], ['¿Qué pasa con percent-encoding inválido?', 'Muestra una advertencia clara y conserva la entrada original.']],
    privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos el texto introducido en esta herramienta.', termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa la salida antes de usarla en sistemas de producción.',
  },
  fr: {
    title: 'Encodeur et décodeur URL en ligne | ConvertUnlimited', description: 'Encodez et décodez des URLs dans votre navigateur. Unicode, query strings, encodeURI, encodeURIComponent, aucun envoi.',
    hero: 'Encodeur / décodeur URL', sub: 'Encodez et décodez URLs, query strings et texte localement dans votre navigateur.',
    eyebrow: 'Outil local URL', panelTitle: 'Convertissez URLs et chaînes encodées en sécurité.', panelText: 'Encodez les caractères réservés pour les URLs ou décodez percent-encoding sans envoyer de données.',
    input: 'Entrée', output: 'Sortie', mode: 'Mode d’encodage', full: 'URL complète', component: 'Composant URL', encode: 'Encoder URL', decode: 'Décoder URL', copy: 'Copier la sortie', clear: 'Effacer', sample: 'URL exemple',
    chars: 'Caractères', bytes: 'Octets', trustTitle: 'Privé par conception', trustOne: '<b>Traitement local.</b> L’encodage URL se fait dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Le texte reste sur votre appareil.',
    articleTitle: 'Quand encoder des URLs ?', articleP1: 'L’encodage URL est utile pour query strings, API, redirections, paramètres de recherche et liens avec espaces, Unicode ou caractères réservés.', articleP2: 'Utilisez URL complète pour garder la structure lisible. Utilisez composant pour une valeur de query ou un segment de chemin.',
    faqTitle: 'Foire aux questions', faq: [['Cet outil URL est-il gratuit ?', 'Oui. Vous pouvez encoder, décoder, copier et effacer sans inscription.'], ['Mon URL est-elle envoyée ?', 'Non. Tout se passe localement dans votre navigateur.'], ['Différence entre URL complète et composant ?', 'URL complète garde : / ? et &, composant encode aussi ces caractères réservés.'], ['Unicode est-il pris en charge ?', 'Oui. UTF-8, emojis, accents et écritures non latines sont pris en charge.'], ['Que faire avec un percent-encoding invalide ?', 'L’outil affiche un avertissement clair et conserve l’entrée originale.']],
    privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons le texte saisi dans cet outil.', termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Relisez la sortie avant de l’utiliser dans des systèmes de production.',
  },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/url-encoder-decoder/`;
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
    ${schemaScripts(t, locale, { url: abs(locale) })}
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>
</head>
<body>
    <div class="app">
        <header class="topbar">
            <a href="${home(locale)}" class="brand" aria-label="ConvertUnlimited home"><span class="mark" aria-hidden="true"></span><span class="word"><b>Convert</b><span>Unlimited</span></span></a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>100% free, no signup</span>
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'url-encoder-decoder')}" aria-current="page">URL Encoder</a><a href="${link(locale, 'base64-encoder-decoder')}">Base64</a><a href="${link(locale, 'json-formatter')}">JSON Formatter</a><a href="${link(locale, 'csv-to-json')}">CSV to JSON</a></div></details>
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
                                <label class="range-field" for="urlenc-input"><span>${esc(t.input)}</span><textarea id="urlenc-input" rows="14" spellcheck="false" class="mono" style="width:100%;resize:vertical;overflow-wrap:anywhere;" placeholder="https://example.com/search?q=hello world"></textarea></label>
                                <label class="range-field" for="urlenc-mode"><span>${esc(t.mode)}</span><select id="urlenc-mode"><option value="full">${esc(t.full)}</option><option value="component">${esc(t.component)}</option></select></label>
                                <button class="btn btn-accent" id="urlenc-encode" type="button">${esc(t.encode)}</button>
                                <button class="btn btn-ghost" id="urlenc-decode" type="button">${esc(t.decode)}</button>
                                <button class="btn btn-ghost" id="urlenc-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="urlenc-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.chars)}:</b> <span id="urlenc-char-count" class="mono num">0</span> · <b>${esc(t.bytes)}:</b> <span id="urlenc-byte-count" class="mono num">0</span></p>
                            <p class="bg-status" id="urlenc-status"></p>
                            <p class="bg-status" id="urlenc-warning" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="urlenc-output"><span>${esc(t.output)}</span><textarea id="urlenc-output" rows="18" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;overflow-wrap:anywhere;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="urlenc-copy" type="button">${esc(t.copy)}</button></div>
                        </div>
                    </div>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_URL_ENCODER_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_URL_ENCODER_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
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
        <footer class="footer"><div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — runs entirely in your browser.</div><nav class="links" aria-label="Footer"><a href="${link(locale, 'tools')}">Tools</a><a href="${route(locale)}#how">Guide</a><a href="${route(locale)}#faq">FAQ</a><a href="${route(locale)}#privacy">Privacy</a><a href="${route(locale)}#terms">Terms</a></nav></footer>
    </div>
    <script src="/url-encoder-decoder/url-encoder-decoder.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'url-encoder-decoder');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized URL encoder pages');
