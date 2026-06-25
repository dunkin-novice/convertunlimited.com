const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'Base64 Encoder Decoder - Encode & Decode Base64 Online | ConvertUnlimited',
    description: 'Encode and decode Base64 locally in your browser. Supports Unicode text, URL-safe Base64, and copy output.',
    hero: 'Base64 Encoder / Decoder', sub: 'Encode and decode Base64 text locally in your browser.',
    eyebrow: 'Local developer encoding tool', panelTitle: 'Convert text and Base64 safely.', panelText: 'Encode Unicode text to Base64 or decode Base64 back to readable text with selected inputs processed locally in your browser.',
    input: 'Input', output: 'Output', urlSafe: 'URL-safe Base64', encode: 'Encode Base64', decode: 'Decode Base64', copy: 'Copy output', clear: 'Clear', sample: 'Sample text',
    chars: 'Characters', bytes: 'Bytes', trustTitle: 'Private by design', trustOne: '<b>Local processing.</b> Base64 encoding and decoding run in your browser.', trustTwo: '<b>Local processing.</b> Text is processed locally in your browser.',
    articleTitle: 'When should you use Base64?', articleP1: 'Base64 is commonly used to represent text or binary data in APIs, embeds, tokens, and data transfer workflows where plain text transport is needed.', articleP2: 'This tool validates Base64 before decoding and supports URL-safe variants that use hyphens and underscores.',
    faqTitle: 'Frequently Asked Questions',
    faq: [['Is this Base64 tool free?', 'Yes. You can encode, decode, copy, and clear text without signup.'], ['Is my text sent to ConvertUnlimited servers?', 'No. All encoding and decoding happens locally in your browser.'], ['Does it support Unicode?', 'Yes. UTF-8 text, emojis, accents, and non-Latin scripts are preserved.'], ['What is URL-safe Base64?', 'URL-safe Base64 replaces + and / with - and _ so encoded text is easier to use in URLs.'], ['What happens with invalid Base64?', 'The tool shows a friendly warning and keeps your original input.']],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this Base64 encoding and decoding flow. Text input is processed locally in your browser.', termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Review encoded or decoded output before using it in production systems.',
  },
  th: {
    title: 'ตัวเข้ารหัสและถอดรหัส Base64 ออนไลน์ | ConvertUnlimited', description: 'เข้ารหัสและถอดรหัส Base64 ในเบราว์เซอร์ รองรับ Unicode, URL-safe Base64, คัดลอกผลลัพธ์ และไม่อัปโหลด',
    hero: 'ตัวเข้ารหัส / ถอดรหัส Base64', sub: 'เข้ารหัสและถอดรหัสข้อความ Base64 ในเบราว์เซอร์',
    eyebrow: 'เครื่องมือเข้ารหัสในเครื่อง', panelTitle: 'แปลงข้อความและ Base64 อย่างปลอดภัย', panelText: 'เข้ารหัสข้อความ Unicode เป็น Base64 หรือถอด Base64 กลับเป็นข้อความโดยไม่อัปโหลดข้อมูล',
    input: 'ขาเข้า', output: 'ผลลัพธ์', urlSafe: 'Base64 แบบ URL-safe', encode: 'เข้ารหัส Base64', decode: 'ถอดรหัส Base64', copy: 'คัดลอกผลลัพธ์', clear: 'ล้าง', sample: 'ข้อความตัวอย่าง',
    chars: 'อักขระ', bytes: 'ไบต์', trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>ประมวลผลในเครื่อง</b> Base64 ทำงานในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ข้อความอยู่บนอุปกรณ์ของคุณ',
    articleTitle: 'ควรใช้ Base64 เมื่อใด?', articleP1: 'Base64 ใช้แทนข้อความหรือข้อมูลใน API, embeds, token และงานส่งข้อมูลที่ต้องการข้อความล้วน', articleP2: 'เครื่องมือนี้ตรวจ Base64 ก่อนถอดรหัสและรองรับ URL-safe ที่ใช้ - และ _',
    faqTitle: 'คำถามที่พบบ่อย', faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี เข้ารหัส ถอดรหัส คัดลอก และล้างได้โดยไม่ต้องสมัคร'], ['ข้อความถูกอัปโหลดไหม?', 'ไม่ ทุกอย่างทำในเบราว์เซอร์'], ['รองรับ Unicode ไหม?', 'รองรับ UTF-8 อีโมจิ เครื่องหมาย และภาษาที่ไม่ใช่ละติน'], ['URL-safe Base64 คืออะไร?', 'เป็น Base64 ที่แทน + และ / ด้วย - และ _ เพื่อใช้ใน URL ง่ายขึ้น'], ['ถ้า Base64 ไม่ถูกต้องจะเกิดอะไร?', 'จะแสดงคำเตือนและเก็บข้อมูลเดิมไว้']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่งข้อความที่ใส่ในเครื่องมือนี้', termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจผลลัพธ์ก่อนใช้ในระบบจริง',
  },
  vi: {
    title: 'Trình mã hóa và giải mã Base64 online | ConvertUnlimited', description: 'Mã hóa và giải mã Base64 trong trình duyệt. Hỗ trợ Unicode, Base64 URL-safe, sao chép đầu ra và không upload.',
    hero: 'Trình mã hóa / giải mã Base64', sub: 'Mã hóa và giải mã văn bản Base64 ngay trong trình duyệt.',
    eyebrow: 'Công cụ mã hóa cục bộ', panelTitle: 'Chuyển văn bản và Base64 an toàn.', panelText: 'Mã hóa Unicode sang Base64 hoặc giải mã Base64 thành văn bản đọc được mà không upload dữ liệu.',
    input: 'Đầu vào', output: 'Đầu ra', urlSafe: 'Base64 URL-safe', encode: 'Mã hóa Base64', decode: 'Giải mã Base64', copy: 'Sao chép đầu ra', clear: 'Xóa', sample: 'Văn bản mẫu',
    chars: 'Ký tự', bytes: 'Byte', trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Xử lý cục bộ.</b> Base64 chạy trong trình duyệt.', trustTwo: '<b>Không upload.</b> Văn bản ở lại trên thiết bị.',
    articleTitle: 'Khi nào nên dùng Base64?', articleP1: 'Base64 thường dùng để biểu diễn dữ liệu trong API, embed, token và luồng truyền dữ liệu cần dạng văn bản.', articleP2: 'Công cụ kiểm tra Base64 trước khi giải mã và hỗ trợ biến thể URL-safe dùng - và _.',
    faqTitle: 'Câu hỏi thường gặp', faq: [['Công cụ Base64 này miễn phí không?', 'Có. Bạn có thể mã hóa, giải mã, sao chép và xóa không cần đăng ký.'], ['Văn bản có được upload không?', 'Không. Tất cả chạy cục bộ trong trình duyệt.'], ['Có hỗ trợ Unicode không?', 'Có. UTF-8, emoji, dấu và chữ không Latin được giữ nguyên.'], ['Base64 URL-safe là gì?', 'Nó thay + và / bằng - và _ để dễ dùng trong URL.'], ['Base64 lỗi thì sao?', 'Công cụ hiển thị cảnh báo thân thiện và giữ nguyên đầu vào.']],
    privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền văn bản nhập vào công cụ này.', termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy kiểm tra đầu ra trước khi dùng trong hệ thống production.',
  },
  zh: {
    title: 'Base64 编码解码工具 - 在线 Base64 转换 | ConvertUnlimited', description: '在浏览器中本地编码和解码 Base64。支持 Unicode、URL-safe Base64、复制输出，无需上传。',
    hero: 'Base64 编码 / 解码工具', sub: '在浏览器中本地编码和解码 Base64 文本。',
    eyebrow: '本地开发编码工具', panelTitle: '安全转换文本和 Base64。', panelText: '将 Unicode 文本编码为 Base64，或将 Base64 解码为可读文本，无需上传数据。',
    input: '输入', output: '输出', urlSafe: 'URL-safe Base64', encode: '编码 Base64', decode: '解码 Base64', copy: '复制输出', clear: '清空', sample: '示例文本',
    chars: '字符', bytes: '字节', trustTitle: '隐私优先设计', trustOne: '<b>本地处理。</b> Base64 编码和解码在浏览器中运行。', trustTwo: '<b>无需上传。</b> 文本留在你的设备上。',
    articleTitle: '什么时候使用 Base64？', articleP1: 'Base64 常用于 API、嵌入、令牌和需要纯文本传输的数据流程。', articleP2: '本工具在解码前验证 Base64，并支持使用 - 和 _ 的 URL-safe 变体。',
    faqTitle: '常见问题', faq: [['这个 Base64 工具免费吗？', '免费。无需注册即可编码、解码、复制和清空。'], ['文本会上传吗？', '不会。所有处理都在浏览器本地完成。'], ['支持 Unicode 吗？', '支持。UTF-8、emoji、重音和非拉丁文字会保留。'], ['什么是 URL-safe Base64？', '它用 - 和 _ 替换 + 和 /，更适合在 URL 中使用。'], ['Base64 无效怎么办？', '工具会显示友好警告并保留原始输入。']],
    privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输输入到此工具的文本。', termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产系统使用前请检查输出。',
  },
  ja: {
    title: 'Base64 エンコード / デコードツール | ConvertUnlimited', description: 'ブラウザ内で Base64 をエンコード・デコード。Unicode、URL-safe Base64、コピーに対応。アップロード不要。',
    hero: 'Base64 エンコード / デコード', sub: 'Base64 テキストをブラウザ内でローカルに変換します。',
    eyebrow: 'ローカル開発エンコードツール', panelTitle: 'テキストと Base64 を安全に変換。', panelText: 'Unicode テキストを Base64 に変換し、Base64 を読みやすいテキストに戻します。データはアップロードされません。',
    input: '入力', output: '出力', urlSafe: 'URL-safe Base64', encode: 'Base64 にエンコード', decode: 'Base64 をデコード', copy: '出力をコピー', clear: 'クリア', sample: 'サンプルテキスト',
    chars: '文字', bytes: 'バイト', trustTitle: 'プライバシー重視', trustOne: '<b>ローカル処理。</b> Base64 変換はブラウザ内で行われます。', trustTwo: '<b>アップロードなし。</b> テキストは端末内に留まります。',
    articleTitle: 'Base64 はいつ使う？', articleP1: 'Base64 は API、埋め込み、トークン、テキスト転送が必要なデータ処理でよく使われます。', articleP2: 'このツールはデコード前に Base64 を検証し、- と _ を使う URL-safe 形式にも対応します。',
    faqTitle: 'よくある質問', faq: [['この Base64 ツールは無料ですか？', 'はい。登録なしでエンコード、デコード、コピー、クリアできます。'], ['テキストはアップロードされますか？', 'いいえ。すべてブラウザ内で処理されます。'], ['Unicode に対応していますか？', 'はい。UTF-8、絵文字、アクセント、非ラテン文字を保持します。'], ['URL-safe Base64 とは？', '+ と / を - と _ に置き換え、URL で使いやすくした形式です。'], ['無効な Base64 は？', '警告を表示し、元の入力を保持します。']],
    privacyTitle: 'プライバシーポリシー', privacy: 'このツールに入力したテキストを収集、保存、アップロード、送信しません。', termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番システムで使う前に出力を確認してください。',
  },
  ko: {
    title: 'Base64 인코더 / 디코더 온라인 | ConvertUnlimited', description: '브라우저에서 Base64를 인코딩하고 디코딩하세요. Unicode, URL-safe Base64, 출력 복사 지원, 업로드 없음.',
    hero: 'Base64 인코더 / 디코더', sub: '브라우저에서 Base64 텍스트를 로컬로 인코딩하고 디코딩합니다.',
    eyebrow: '로컬 개발 인코딩 도구', panelTitle: '텍스트와 Base64를 안전하게 변환하세요.', panelText: 'Unicode 텍스트를 Base64로 인코딩하거나 Base64를 읽을 수 있는 텍스트로 디코딩하며 데이터를 업로드하지 않습니다.',
    input: '입력', output: '출력', urlSafe: 'URL-safe Base64', encode: 'Base64 인코딩', decode: 'Base64 디코딩', copy: '출력 복사', clear: '지우기', sample: '샘플 텍스트',
    chars: '문자', bytes: '바이트', trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 처리.</b> Base64 변환은 브라우저에서 실행됩니다.', trustTwo: '<b>업로드 없음.</b> 텍스트는 기기에 남아 있습니다.',
    articleTitle: 'Base64는 언제 사용하나요?', articleP1: 'Base64는 API, 임베드, 토큰, 텍스트 기반 데이터 전송 흐름에서 자주 사용됩니다.', articleP2: '이 도구는 디코딩 전에 Base64를 검증하고 - 및 _ 를 사용하는 URL-safe 형식을 지원합니다.',
    faqTitle: '자주 묻는 질문', faq: [['이 Base64 도구는 무료인가요?', '네. 가입 없이 인코딩, 디코딩, 복사, 지우기를 할 수 있습니다.'], ['텍스트가 업로드되나요?', '아니요. 모든 처리는 브라우저에서 로컬로 실행됩니다.'], ['Unicode를 지원하나요?', '네. UTF-8, 이모지, 악센트, 비라틴 문자를 보존합니다.'], ['URL-safe Base64란 무엇인가요?', '+ 와 / 를 - 와 _ 로 바꿔 URL에서 사용하기 쉽게 한 형식입니다.'], ['잘못된 Base64는 어떻게 되나요?', '친절한 경고를 표시하고 원본 입력을 유지합니다.']],
    privacyTitle: '개인정보 처리방침', privacy: '이 도구에 입력한 텍스트를 수집, 저장, 업로드 또는 전송하지 않습니다.', termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 시스템에서 사용하기 전에 출력을 검토하세요.',
  },
  es: {
    title: 'Codificador y decodificador Base64 online | ConvertUnlimited', description: 'Codifica y decodifica Base64 en tu navegador. Soporta Unicode, Base64 URL-safe, copia de salida y sin subidas.',
    hero: 'Codificador / decodificador Base64', sub: 'Codifica y decodifica texto Base64 localmente en tu navegador.',
    eyebrow: 'Herramienta local de codificación', panelTitle: 'Convierte texto y Base64 con seguridad.', panelText: 'Codifica texto Unicode a Base64 o decodifica Base64 a texto legible sin subir datos.',
    input: 'Entrada', output: 'Salida', urlSafe: 'Base64 URL-safe', encode: 'Codificar Base64', decode: 'Decodificar Base64', copy: 'Copiar salida', clear: 'Limpiar', sample: 'Texto de ejemplo',
    chars: 'Caracteres', bytes: 'Bytes', trustTitle: 'Privado por diseño', trustOne: '<b>Procesamiento local.</b> Base64 se codifica y decodifica en tu navegador.', trustTwo: '<b>Sin subidas.</b> El texto permanece en tu dispositivo.',
    articleTitle: '¿Cuándo usar Base64?', articleP1: 'Base64 se usa a menudo para representar datos en APIs, embeds, tokens y flujos de transferencia que necesitan texto plano.', articleP2: 'La herramienta valida Base64 antes de decodificar y soporta variantes URL-safe con - y _.',
    faqTitle: 'Preguntas frecuentes', faq: [['¿Esta herramienta Base64 es gratis?', 'Sí. Puedes codificar, decodificar, copiar y limpiar sin registro.'], ['¿Mi texto se sube?', 'No. Todo ocurre localmente en tu navegador.'], ['¿Soporta Unicode?', 'Sí. Conserva UTF-8, emojis, acentos y escrituras no latinas.'], ['¿Qué es Base64 URL-safe?', 'Reemplaza + y / por - y _ para facilitar su uso en URLs.'], ['¿Qué pasa con Base64 inválido?', 'Muestra una advertencia clara y conserva la entrada original.']],
    privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos el texto introducido en esta herramienta.', termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa la salida antes de usarla en sistemas de producción.',
  },
  fr: {
    title: 'Encodeur et décodeur Base64 en ligne | ConvertUnlimited', description: 'Encodez et décodez Base64 dans votre navigateur. Unicode, Base64 URL-safe, copie de sortie, aucun envoi.',
    hero: 'Encodeur / décodeur Base64', sub: 'Encodez et décodez du texte Base64 localement dans votre navigateur.',
    eyebrow: 'Outil local d’encodage', panelTitle: 'Convertissez texte et Base64 en sécurité.', panelText: 'Encodez du texte Unicode en Base64 ou décodez Base64 en texte lisible sans envoyer de données.',
    input: 'Entrée', output: 'Sortie', urlSafe: 'Base64 URL-safe', encode: 'Encoder Base64', decode: 'Décoder Base64', copy: 'Copier la sortie', clear: 'Effacer', sample: 'Texte exemple',
    chars: 'Caractères', bytes: 'Octets', trustTitle: 'Privé par conception', trustOne: '<b>Traitement local.</b> Base64 est encodé et décodé dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Le texte reste sur votre appareil.',
    articleTitle: 'Quand utiliser Base64 ?', articleP1: 'Base64 sert souvent à représenter des données dans les API, embeds, tokens et transferts qui nécessitent du texte brut.', articleP2: 'L’outil valide Base64 avant décodage et prend en charge les variantes URL-safe avec - et _.',
    faqTitle: 'Foire aux questions', faq: [['Cet outil Base64 est-il gratuit ?', 'Oui. Vous pouvez encoder, décoder, copier et effacer sans inscription.'], ['Mon texte est-il envoyé ?', 'Non. Tout se passe localement dans votre navigateur.'], ['Unicode est-il pris en charge ?', 'Oui. UTF-8, emojis, accents et écritures non latines sont conservés.'], ['Qu’est-ce que Base64 URL-safe ?', 'Cette variante remplace + et / par - et _ pour une utilisation plus simple dans les URLs.'], ['Que faire avec un Base64 invalide ?', 'L’outil affiche un avertissement clair et conserve l’entrée originale.']],
    privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons le texte saisi dans cet outil.', termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Relisez la sortie avant de l’utiliser dans des systèmes de production.',
  },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/base64-encoder-decoder/`;
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
    ${schemaScripts(t, locale, { url: abs(locale) })}
</head>
<body>
    <div class="app">
        <header class="topbar">
            <a href="${home(locale)}" class="brand" aria-label="ConvertUnlimited home"><span class="mark" aria-hidden="true"></span><span class="word"><b>Convert</b><span>Unlimited</span></span></a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>100% free, no signup</span>
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'base64-encoder-decoder')}" aria-current="page">Base64</a><a href="${link(locale, 'json-formatter')}">JSON Formatter</a><a href="${link(locale, 'csv-to-json')}">CSV to JSON</a><a href="${link(locale, 'json-to-csv')}">JSON to CSV</a></div></details>
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
                                <label class="range-field" for="base64-input"><span>${esc(t.input)}</span><textarea id="base64-input" rows="14" spellcheck="false" class="mono" style="width:100%;resize:vertical;overflow-wrap:anywhere;" placeholder="Hello ConvertUnlimited"></textarea></label>
                                <label class="range-field" for="base64-url-safe"><span>${esc(t.urlSafe)}</span><input id="base64-url-safe" type="checkbox"></label>
                                <button class="btn btn-accent" id="base64-encode" type="button">${esc(t.encode)}</button>
                                <button class="btn btn-ghost" id="base64-decode" type="button">${esc(t.decode)}</button>
                                <button class="btn btn-ghost" id="base64-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="base64-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.chars)}:</b> <span id="base64-char-count" class="mono num">0</span> · <b>${esc(t.bytes)}:</b> <span id="base64-byte-count" class="mono num">0</span></p>
                            <p class="bg-status" id="base64-status"></p>
                            <p class="bg-status" id="base64-warning" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="base64-output"><span>${esc(t.output)}</span><textarea id="base64-output" rows="18" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;overflow-wrap:anywhere;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="base64-copy" type="button">${esc(t.copy)}</button></div>
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
    <script src="/base64-encoder-decoder/base64-encoder-decoder.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'base64-encoder-decoder');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized Base64 pages');
