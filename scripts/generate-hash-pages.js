const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'Hash Generator - SHA-256, SHA-384 & SHA-512 Online | ConvertUnlimited',
    description: 'Generate SHA-256, SHA-384, and SHA-512 hashes locally in your browser. Hash Unicode text and copy output.',
    hero: 'Hash Generator', sub: 'Generate SHA hashes locally for checksums, API testing, and development workflows.',
    eyebrow: 'Local developer checksum tool', panelTitle: 'Hash text with browser crypto APIs.', panelText: 'Create SHA-256, SHA-384, or SHA-512 hashes with selected text processed locally in your browser.',
    input: 'Text input', output: 'Hash output', algorithm: 'Algorithm', uppercase: 'Uppercase output', generate: 'Generate hash', copy: 'Copy hash', clear: 'Clear', sample: 'Sample text',
    chars: 'Characters', bytes: 'Bytes', trustTitle: 'Private by design', trustOne: '<b>Local hashing.</b> Hashes are generated in your browser.', trustTwo: '<b>Local hashing.</b> Text is processed locally in your browser.',
    articleTitle: 'When should you generate hashes?', articleP1: 'Hashes are useful for checksums, API signing examples, cache keys, debugging, and comparing whether text content changed.', articleP2: 'Hashes are one-way digests, not encryption. This tool does not store input and does not send generated hashes anywhere.',
    faqTitle: 'Frequently Asked Questions',
    faq: [['Is this Hash Generator free?', 'Yes. You can generate and copy SHA hashes without signup.'], ['Is my text sent to ConvertUnlimited servers?', 'No. Hashing happens locally in your browser.'], ['Which algorithms are supported?', 'SHA-256, SHA-384, and SHA-512 are supported through the Web Crypto API.'], ['Can hashes be reversed?', 'No. Hashes are one-way digests, not reversible encryption.'], ['Does it support Unicode?', 'Yes. UTF-8 text, emojis, accents, and non-Latin scripts are supported.']],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this hashing flow. Text input is processed locally in your browser.', termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Do not treat hashes as password storage guidance or encryption.',
  },
  th: { title: 'ตัวสร้าง Hash - SHA-256, SHA-384 และ SHA-512 | ConvertUnlimited', description: 'สร้าง SHA-256, SHA-384 และ SHA-512 ในเบราว์เซอร์ รองรับ Unicode คัดลอกผลลัพธ์ และไม่อัปโหลด', hero: 'ตัวสร้าง Hash', sub: 'สร้าง SHA hash ในเครื่องสำหรับ checksum, API testing และงานพัฒนา', eyebrow: 'เครื่องมือ checksum ในเครื่อง', panelTitle: 'สร้าง hash ด้วย browser crypto APIs', panelText: 'สร้าง SHA-256, SHA-384 หรือ SHA-512 โดยไม่ส่งข้อความไปเซิร์ฟเวอร์', input: 'ข้อความขาเข้า', output: 'ผลลัพธ์ hash', algorithm: 'อัลกอริทึม', uppercase: 'ผลลัพธ์ตัวพิมพ์ใหญ่', generate: 'สร้าง hash', copy: 'คัดลอก hash', clear: 'ล้าง', sample: 'ข้อความตัวอย่าง', chars: 'อักขระ', bytes: 'ไบต์', trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>สร้างในเครื่อง</b> Hash ถูกสร้างในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ข้อความไม่ถูกส่งไปเซิร์ฟเวอร์', articleTitle: 'ควรสร้าง hash เมื่อใด?', articleP1: 'Hash เหมาะกับ checksum ตัวอย่าง API signing cache key debugging และการเทียบว่าข้อความเปลี่ยนหรือไม่', articleP2: 'Hash เป็น digest ทางเดียว ไม่ใช่การเข้ารหัส เครื่องมือนี้ไม่เก็บและไม่ส่งข้อมูล', faqTitle: 'คำถามที่พบบ่อย', faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี สร้างและคัดลอก SHA hash ได้โดยไม่ต้องสมัคร'], ['ข้อความถูกอัปโหลดไหม?', 'ไม่ การสร้าง hash ทำในเบราว์เซอร์'], ['รองรับอะไรบ้าง?', 'SHA-256, SHA-384 และ SHA-512 ผ่าน Web Crypto API'], ['Hash ย้อนกลับได้ไหม?', 'ไม่ได้ Hash เป็น digest ทางเดียว ไม่ใช่ encryption'], ['รองรับ Unicode ไหม?', 'รองรับ UTF-8 อีโมจิ เครื่องหมาย และภาษาที่ไม่ใช่ละติน']], privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่งข้อความหรือ hash ที่สร้าง', termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง อย่าใช้ข้อมูลนี้เป็นคำแนะนำการเก็บรหัสผ่านหรือ encryption' },
  vi: { title: 'Trình tạo Hash - SHA-256, SHA-384 & SHA-512 | ConvertUnlimited', description: 'Tạo hash SHA-256, SHA-384 và SHA-512 trong trình duyệt. Hỗ trợ Unicode, sao chép đầu ra và không upload.', hero: 'Trình tạo Hash', sub: 'Tạo SHA hash cục bộ cho checksum, kiểm thử API và workflow lập trình.', eyebrow: 'Công cụ checksum cục bộ', panelTitle: 'Hash văn bản bằng browser crypto APIs.', panelText: 'Tạo SHA-256, SHA-384 hoặc SHA-512 mà không gửi văn bản lên máy chủ.', input: 'Văn bản đầu vào', output: 'Hash đầu ra', algorithm: 'Thuật toán', uppercase: 'Đầu ra chữ hoa', generate: 'Tạo hash', copy: 'Sao chép hash', clear: 'Xóa', sample: 'Văn bản mẫu', chars: 'Ký tự', bytes: 'Byte', trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Hash cục bộ.</b> Hash được tạo trong trình duyệt.', trustTwo: '<b>Không upload.</b> Văn bản không gửi lên máy chủ.', articleTitle: 'Khi nào nên tạo hash?', articleP1: 'Hash hữu ích cho checksum, ví dụ ký API, cache key, debug và so sánh nội dung văn bản.', articleP2: 'Hash là digest một chiều, không phải mã hóa. Công cụ không lưu và không gửi dữ liệu.', faqTitle: 'Câu hỏi thường gặp', faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể tạo và sao chép SHA hash không cần đăng ký.'], ['Văn bản có được upload không?', 'Không. Hash chạy cục bộ trong trình duyệt.'], ['Hỗ trợ thuật toán nào?', 'SHA-256, SHA-384 và SHA-512 qua Web Crypto API.'], ['Hash có đảo ngược được không?', 'Không. Hash là digest một chiều, không phải mã hóa có thể đảo ngược.'], ['Có hỗ trợ Unicode không?', 'Có. UTF-8, emoji, dấu và chữ không Latin được hỗ trợ.']], privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền văn bản hay hash đã tạo.', termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Không xem hash như hướng dẫn lưu mật khẩu hoặc mã hóa.' },
  zh: { title: '哈希生成器 - SHA-256、SHA-384 和 SHA-512 | ConvertUnlimited', description: '在浏览器中本地生成 SHA-256、SHA-384 和 SHA-512 哈希。支持 Unicode、复制输出，无需上传。', hero: '哈希生成器', sub: '为校验和、API 测试和开发流程本地生成 SHA 哈希。', eyebrow: '本地开发校验工具', panelTitle: '使用浏览器 crypto API 生成文本哈希。', panelText: '无需发送到服务器即可创建 SHA-256、SHA-384 或 SHA-512 哈希。', input: '文本输入', output: '哈希输出', algorithm: '算法', uppercase: '大写输出', generate: '生成哈希', copy: '复制哈希', clear: '清空', sample: '示例文本', chars: '字符', bytes: '字节', trustTitle: '隐私优先设计', trustOne: '<b>本地哈希。</b> 哈希在浏览器中生成。', trustTwo: '<b>无需上传。</b> 文本不会发送到服务器。', articleTitle: '什么时候需要生成哈希？', articleP1: '哈希适用于校验和、API 签名示例、缓存键、调试以及比较文本是否变化。', articleP2: '哈希是单向摘要，不是加密。本工具不会存储输入，也不会发送生成的哈希。', faqTitle: '常见问题', faq: [['这个哈希工具免费吗？', '免费。无需注册即可生成和复制 SHA 哈希。'], ['文本会上传吗？', '不会。哈希在浏览器本地完成。'], ['支持哪些算法？', '通过 Web Crypto API 支持 SHA-256、SHA-384 和 SHA-512。'], ['哈希可以还原吗？', '不可以。哈希是单向摘要，不是可逆加密。'], ['支持 Unicode 吗？', '支持。UTF-8、emoji、重音和非拉丁文字都支持。']], privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输输入文本或生成的哈希。', termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。不要把哈希视为密码存储建议或加密。' },
  ja: { title: 'ハッシュ生成ツール - SHA-256、SHA-384、SHA-512 | ConvertUnlimited', description: 'ブラウザ内で SHA-256、SHA-384、SHA-512 ハッシュを生成。Unicode 対応、コピー可能、アップロード不要。', hero: 'ハッシュ生成ツール', sub: 'チェックサム、API テスト、開発ワークフロー向けに SHA ハッシュをローカル生成します。', eyebrow: 'ローカル開発チェックサムツール', panelTitle: 'Browser crypto APIs でテキストをハッシュ化。', panelText: 'テキストをサーバーへ送信せずに SHA-256、SHA-384、SHA-512 を作成します。', input: 'テキスト入力', output: 'ハッシュ出力', algorithm: 'アルゴリズム', uppercase: '大文字出力', generate: 'ハッシュを生成', copy: 'ハッシュをコピー', clear: 'クリア', sample: 'サンプルテキスト', chars: '文字', bytes: 'バイト', trustTitle: 'プライバシー重視', trustOne: '<b>ローカル生成。</b> ハッシュはブラウザ内で生成されます。', trustTwo: '<b>アップロードなし。</b> テキストはサーバーに送信されません。', articleTitle: 'ハッシュを生成する場面', articleP1: 'ハッシュはチェックサム、API 署名例、キャッシュキー、デバッグ、テキスト変更の比較に役立ちます。', articleP2: 'ハッシュは一方向ダイジェストであり、暗号化ではありません。このツールは入力を保存も送信もしません。', faqTitle: 'よくある質問', faq: [['このハッシュツールは無料ですか？', 'はい。登録なしで SHA ハッシュを生成、コピーできます。'], ['テキストはアップロードされますか？', 'いいえ。ブラウザ内でローカルに処理されます。'], ['対応アルゴリズムは？', 'Web Crypto API により SHA-256、SHA-384、SHA-512 に対応します。'], ['ハッシュは元に戻せますか？', 'いいえ。ハッシュは一方向ダイジェストで、可逆暗号ではありません。'], ['Unicode に対応していますか？', 'はい。UTF-8、絵文字、アクセント、非ラテン文字に対応します。']], privacyTitle: 'プライバシーポリシー', privacy: '入力テキストや生成ハッシュを収集、保存、アップロード、送信しません。', termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。ハッシュをパスワード保存や暗号化の助言として扱わないでください。' },
  ko: { title: '해시 생성기 - SHA-256, SHA-384, SHA-512 | ConvertUnlimited', description: '브라우저에서 SHA-256, SHA-384, SHA-512 해시를 생성하세요. Unicode 지원, 복사, 업로드 없음.', hero: '해시 생성기', sub: '체크섬, API 테스트, 개발 워크플로용 SHA 해시를 로컬로 생성합니다.', eyebrow: '로컬 개발 체크섬 도구', panelTitle: '브라우저 crypto API로 텍스트 해시 생성.', panelText: '텍스트를 서버로 보내지 않고 SHA-256, SHA-384, SHA-512 해시를 만듭니다.', input: '텍스트 입력', output: '해시 출력', algorithm: '알고리즘', uppercase: '대문자 출력', generate: '해시 생성', copy: '해시 복사', clear: '지우기', sample: '샘플 텍스트', chars: '문자', bytes: '바이트', trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 해싱.</b> 해시는 브라우저에서 생성됩니다.', trustTwo: '<b>업로드 없음.</b> 텍스트는 서버로 전송되지 않습니다.', articleTitle: '해시는 언제 생성하나요?', articleP1: '해시는 체크섬, API 서명 예시, 캐시 키, 디버깅, 텍스트 변경 비교에 유용합니다.', articleP2: '해시는 단방향 digest이며 암호화가 아닙니다. 이 도구는 입력을 저장하거나 전송하지 않습니다.', faqTitle: '자주 묻는 질문', faq: [['이 해시 도구는 무료인가요?', '네. 가입 없이 SHA 해시를 생성하고 복사할 수 있습니다.'], ['텍스트가 업로드되나요?', '아니요. 브라우저에서 로컬로 처리됩니다.'], ['어떤 알고리즘을 지원하나요?', 'Web Crypto API를 통해 SHA-256, SHA-384, SHA-512를 지원합니다.'], ['해시를 되돌릴 수 있나요?', '아니요. 해시는 단방향 digest이며 되돌릴 수 있는 암호화가 아닙니다.'], ['Unicode를 지원하나요?', '네. UTF-8, 이모지, 악센트, 비라틴 문자를 지원합니다.']], privacyTitle: '개인정보 처리방침', privacy: '입력 텍스트나 생성된 해시를 수집, 저장, 업로드 또는 전송하지 않습니다.', termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 해시를 비밀번호 저장 지침이나 암호화로 간주하지 마세요.' },
  es: { title: 'Generador Hash - SHA-256, SHA-384 y SHA-512 | ConvertUnlimited', description: 'Genera hashes SHA-256, SHA-384 y SHA-512 localmente en tu navegador. Unicode, copia y sin subidas.', hero: 'Generador Hash', sub: 'Genera hashes SHA localmente para checksums, pruebas API y desarrollo.', eyebrow: 'Herramienta local de checksum', panelTitle: 'Genera hash de texto con crypto APIs del navegador.', panelText: 'Crea SHA-256, SHA-384 o SHA-512 sin enviar texto a un servidor.', input: 'Texto de entrada', output: 'Hash de salida', algorithm: 'Algoritmo', uppercase: 'Salida en mayúsculas', generate: 'Generar hash', copy: 'Copiar hash', clear: 'Limpiar', sample: 'Texto de ejemplo', chars: 'Caracteres', bytes: 'Bytes', trustTitle: 'Privado por diseño', trustOne: '<b>Hash local.</b> Los hashes se generan en tu navegador.', trustTwo: '<b>Sin subidas.</b> El texto no se envía a un servidor.', articleTitle: '¿Cuándo generar hashes?', articleP1: 'Los hashes sirven para checksums, ejemplos de firma API, cache keys, depuración y comparar si un texto cambió.', articleP2: 'Los hashes son digests unidireccionales, no cifrado. Esta herramienta no almacena ni envía datos.', faqTitle: 'Preguntas frecuentes', faq: [['¿Este generador Hash es gratis?', 'Sí. Puedes generar y copiar hashes SHA sin registro.'], ['¿Mi texto se sube?', 'No. El hashing ocurre localmente en tu navegador.'], ['¿Qué algoritmos soporta?', 'SHA-256, SHA-384 y SHA-512 mediante Web Crypto API.'], ['¿Se pueden revertir los hashes?', 'No. Son digests unidireccionales, no cifrado reversible.'], ['¿Soporta Unicode?', 'Sí. Soporta UTF-8, emojis, acentos y escrituras no latinas.']], privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos texto o hashes generados.', termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. No trates los hashes como guía de almacenamiento de contraseñas o cifrado.' },
  fr: { title: 'Générateur Hash - SHA-256, SHA-384 et SHA-512 | ConvertUnlimited', description: 'Générez des hashes SHA-256, SHA-384 et SHA-512 localement dans votre navigateur. Unicode, copie, aucun envoi.', hero: 'Générateur Hash', sub: 'Générez des hashes SHA localement pour checksums, tests API et workflows développeur.', eyebrow: 'Outil local de checksum', panelTitle: 'Hachez du texte avec les crypto APIs du navigateur.', panelText: 'Créez SHA-256, SHA-384 ou SHA-512 sans envoyer le texte à un serveur.', input: 'Texte d’entrée', output: 'Hash de sortie', algorithm: 'Algorithme', uppercase: 'Sortie en majuscules', generate: 'Générer hash', copy: 'Copier hash', clear: 'Effacer', sample: 'Texte exemple', chars: 'Caractères', bytes: 'Octets', trustTitle: 'Privé par conception', trustOne: '<b>Hash local.</b> Les hashes sont générés dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Le texte n’est pas envoyé à un serveur.', articleTitle: 'Quand générer des hashes ?', articleP1: 'Les hashes sont utiles pour checksums, exemples de signature API, clés de cache, debug et comparaison de contenu.', articleP2: 'Les hashes sont des digests à sens unique, pas du chiffrement. Cet outil ne stocke ni n’envoie les données.', faqTitle: 'Foire aux questions', faq: [['Ce générateur Hash est-il gratuit ?', 'Oui. Vous pouvez générer et copier des hashes SHA sans inscription.'], ['Mon texte est-il envoyé ?', 'Non. Le hachage se fait localement dans votre navigateur.'], ['Quels algorithmes sont pris en charge ?', 'SHA-256, SHA-384 et SHA-512 via Web Crypto API.'], ['Les hashes sont-ils réversibles ?', 'Non. Ce sont des digests à sens unique, pas du chiffrement réversible.'], ['Unicode est-il pris en charge ?', 'Oui. UTF-8, emojis, accents et écritures non latines sont pris en charge.']], privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons le texte ou les hashes générés.', termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Ne considérez pas les hashes comme conseil de stockage de mots de passe ou chiffrement.' },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/hash-generator/`;
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
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'hash-generator')}" aria-current="page">Hash Generator</a><a href="${link(locale, 'uuid-generator')}">UUID Generator</a><a href="${link(locale, 'base64-encoder-decoder')}">Base64</a><a href="${link(locale, 'url-encoder-decoder')}">URL Encoder</a></div></details>
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
                                <label class="range-field" for="hash-input"><span>${esc(t.input)}</span><textarea id="hash-input" rows="14" spellcheck="false" class="mono" style="width:100%;resize:vertical;overflow-wrap:anywhere;" placeholder="Text to hash"></textarea></label>
                                <label class="range-field" for="hash-algorithm"><span>${esc(t.algorithm)}</span><select id="hash-algorithm"><option value="SHA-256">SHA-256</option><option value="SHA-384">SHA-384</option><option value="SHA-512">SHA-512</option></select></label>
                                <label class="range-field" for="hash-uppercase"><span>${esc(t.uppercase)}</span><input id="hash-uppercase" type="checkbox"></label>
                                <button class="btn btn-accent" id="hash-generate" type="button">${esc(t.generate)}</button>
                                <button class="btn btn-ghost" id="hash-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="hash-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.chars)}:</b> <span id="hash-char-count" class="mono num">0</span> · <b>${esc(t.bytes)}:</b> <span id="hash-byte-count" class="mono num">0</span></p>
                            <p class="bg-status" id="hash-status"></p>
                            <p class="bg-status" id="hash-warning" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="hash-output"><span>${esc(t.output)}</span><textarea id="hash-output" rows="18" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;overflow-wrap:anywhere;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="hash-copy" type="button">${esc(t.copy)}</button></div>
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
        <footer class="footer"><div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — runs entirely in your browser.</div><nav class="links" aria-label="Footer"><a href="${link(locale, 'tools')}">Tools</a><a href="${route(locale)}#how">Guide</a><a href="${route(locale)}#faq">FAQ</a><a href="${route(locale)}#privacy">Privacy</a><a href="${route(locale)}#terms">Terms</a></nav></footer>
    </div>
    <script src="/hash-generator/hash-generator.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'hash-generator');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized Hash pages');
