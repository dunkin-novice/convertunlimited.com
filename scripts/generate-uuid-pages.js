const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'UUID Generator - Generate UUID v4 Online | ConvertUnlimited',
    description: 'Generate UUID v4 values locally in your browser. Batch generate random UUIDs, copy output, and use secure browser randomness without uploads.',
    hero: 'UUID Generator', sub: 'Generate UUID v4 values locally for APIs, tests, databases, and development workflows.',
    eyebrow: 'Local developer ID tool', panelTitle: 'Generate one or many UUIDs.', panelText: 'Create random RFC4122-style UUID v4 values in your browser with no server request.',
    output: 'Generated UUIDs', quantity: 'Quantity', uppercase: 'Uppercase', separator: 'Output format', lines: 'Line separated', comma: 'Comma separated', generate: 'Generate UUIDs', copy: 'Copy UUIDs', clear: 'Clear',
    trustTitle: 'Private by design', trustOne: '<b>Local generation.</b> UUIDs are generated in your browser.', trustTwo: '<b>Local processing.</b> This workflow runs in your browser after the page loads.',
    articleTitle: 'When should you use UUIDs?', articleP1: 'UUIDs are useful for test data, request IDs, database keys, API examples, and client-side prototypes where globally unique-looking identifiers are needed.', articleP2: 'This tool generates UUID v4 values with browser crypto APIs. It does not send generated IDs anywhere.',
    faqTitle: 'Frequently Asked Questions',
    faq: [['Is this UUID Generator free?', 'Yes. You can generate and copy UUIDs without signup.'], ['Are UUIDs generated locally?', 'Yes. Generation happens in your browser with native crypto APIs.'], ['Which UUID version is generated?', 'This tool generates UUID v4 values.'], ['Can I generate UUIDs in bulk?', 'Yes. Use the quantity field to generate up to 500 UUIDs at once.'], ['Are generated UUIDs stored?', 'No server-side upload endpoint is used for this UUID generation flow. UUIDs are generated locally in your browser.']],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this UUID generation flow. UUIDs are generated locally in your browser.', termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Review generated identifiers before using them in production systems.',
  },
  th: { title: 'ตัวสร้าง UUID - สร้าง UUID v4 ออนไลน์ | ConvertUnlimited', description: 'สร้าง UUID v4 ในเบราว์เซอร์ สร้างหลายรายการ คัดลอกผลลัพธ์ และใช้ browser randomness โดยไม่อัปโหลด', hero: 'ตัวสร้าง UUID', sub: 'สร้าง UUID v4 ในเครื่องสำหรับ API การทดสอบ ฐานข้อมูล และงานพัฒนา', eyebrow: 'เครื่องมือ ID ในเครื่อง', panelTitle: 'สร้าง UUID หนึ่งรายการหรือหลายรายการ', panelText: 'สร้าง UUID v4 แบบ RFC4122 ในเบราว์เซอร์โดยไม่ต้องเรียกเซิร์ฟเวอร์', output: 'UUID ที่สร้าง', quantity: 'จำนวน', uppercase: 'ตัวพิมพ์ใหญ่', separator: 'รูปแบบผลลัพธ์', lines: 'แยกบรรทัด', comma: 'คั่นด้วยคอมมา', generate: 'สร้าง UUID', copy: 'คัดลอก UUID', clear: 'ล้าง', trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>สร้างในเครื่อง</b> UUID ถูกสร้างในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ไม่ต้องเรียกเซิร์ฟเวอร์', articleTitle: 'ควรใช้ UUID เมื่อใด?', articleP1: 'UUID เหมาะกับข้อมูลทดสอบ request ID key ฐานข้อมูล ตัวอย่าง API และ prototype ฝั่ง client', articleP2: 'เครื่องมือนี้สร้าง UUID v4 ด้วย browser crypto APIs และไม่ส่ง ID ไปที่ใด', faqTitle: 'คำถามที่พบบ่อย', faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี สร้างและคัดลอก UUID ได้โดยไม่ต้องสมัคร'], ['UUID สร้างในเครื่องไหม?', 'ใช่ สร้างในเบราว์เซอร์ด้วย crypto APIs'], ['สร้าง UUID เวอร์ชันใด?', 'เครื่องมือนี้สร้าง UUID v4'], ['สร้างหลายรายการได้ไหม?', 'ได้ ใช้ช่องจำนวนเพื่อสร้างได้สูงสุด 500 รายการ'], ['UUID ถูกจัดเก็บไหม?', 'ไม่ ไม่อัปโหลด ไม่จัดเก็บ และไม่ส่งต่อ']], privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่ง UUID ที่สร้าง', termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจ ID ก่อนใช้ในระบบจริง' },
  vi: { title: 'Trình tạo UUID - Tạo UUID v4 online | ConvertUnlimited', description: 'Tạo UUID v4 cục bộ trong trình duyệt. Tạo hàng loạt UUID ngẫu nhiên, sao chép đầu ra và không upload.', hero: 'Trình tạo UUID', sub: 'Tạo UUID v4 cục bộ cho API, kiểm thử, cơ sở dữ liệu và workflow lập trình.', eyebrow: 'Công cụ ID cục bộ', panelTitle: 'Tạo một hoặc nhiều UUID.', panelText: 'Tạo UUID v4 kiểu RFC4122 trong trình duyệt mà không cần gọi máy chủ.', output: 'UUID đã tạo', quantity: 'Số lượng', uppercase: 'Chữ hoa', separator: 'Định dạng đầu ra', lines: 'Mỗi dòng một UUID', comma: 'Phân tách bằng dấu phẩy', generate: 'Tạo UUID', copy: 'Sao chép UUID', clear: 'Xóa', trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Tạo cục bộ.</b> UUID được tạo trong trình duyệt.', trustTwo: '<b>Không upload.</b> Không cần yêu cầu máy chủ.', articleTitle: 'Khi nào nên dùng UUID?', articleP1: 'UUID hữu ích cho dữ liệu kiểm thử, request ID, khóa database, ví dụ API và prototype phía client.', articleP2: 'Công cụ tạo UUID v4 bằng browser crypto APIs và không gửi ID đi đâu.', faqTitle: 'Câu hỏi thường gặp', faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể tạo và sao chép UUID không cần đăng ký.'], ['UUID có được tạo cục bộ không?', 'Có. Việc tạo chạy trong trình duyệt bằng crypto APIs.'], ['Tạo phiên bản UUID nào?', 'Công cụ này tạo UUID v4.'], ['Có tạo hàng loạt được không?', 'Có. Tạo tối đa 500 UUID một lần.'], ['UUID có được lưu không?', 'Không. Chúng không được upload, lưu trữ hoặc truyền đi.']], privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền UUID đã tạo.', termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy kiểm tra ID trước khi dùng trong production.' },
  zh: { title: 'UUID 生成器 - 在线生成 UUID v4 | ConvertUnlimited', description: '在浏览器中本地生成 UUID v4。批量生成随机 UUID、复制输出，无需上传。', hero: 'UUID 生成器', sub: '为 API、测试、数据库和开发流程本地生成 UUID v4。', eyebrow: '本地开发 ID 工具', panelTitle: '生成一个或多个 UUID。', panelText: '在浏览器中创建 RFC4122 风格的随机 UUID v4，无需服务器请求。', output: '生成的 UUID', quantity: '数量', uppercase: '大写', separator: '输出格式', lines: '按行分隔', comma: '逗号分隔', generate: '生成 UUID', copy: '复制 UUID', clear: '清空', trustTitle: '隐私优先设计', trustOne: '<b>本地生成。</b> UUID 在浏览器中生成。', trustTwo: '<b>无需上传。</b> 不需要服务器请求。', articleTitle: '什么时候使用 UUID？', articleP1: 'UUID 适用于测试数据、请求 ID、数据库键、API 示例和客户端原型。', articleP2: '本工具使用浏览器 crypto API 生成 UUID v4，不会发送生成的 ID。', faqTitle: '常见问题', faq: [['这个 UUID 工具免费吗？', '免费。无需注册即可生成和复制 UUID。'], ['UUID 是本地生成的吗？', '是的。使用浏览器原生 crypto API。'], ['生成哪个 UUID 版本？', '本工具生成 UUID v4。'], ['可以批量生成吗？', '可以。一次最多生成 500 个。'], ['生成的 UUID 会存储吗？', '不会。不会上传、存储或传输。']], privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输生成的 UUID。', termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产系统使用前请检查生成的标识符。' },
  ja: { title: 'UUID 生成ツール - UUID v4 をオンライン生成 | ConvertUnlimited', description: 'ブラウザ内で UUID v4 を生成。ランダム UUID の一括生成、コピー、アップロード不要。', hero: 'UUID 生成ツール', sub: 'API、テスト、データベース、開発ワークフロー向けに UUID v4 をローカル生成します。', eyebrow: 'ローカル開発 ID ツール', panelTitle: 'UUID を 1 件または複数生成。', panelText: 'サーバーに送信せず、ブラウザ内で RFC4122 風の UUID v4 を作成します。', output: '生成された UUID', quantity: '数量', uppercase: '大文字', separator: '出力形式', lines: '行区切り', comma: 'カンマ区切り', generate: 'UUID を生成', copy: 'UUID をコピー', clear: 'クリア', trustTitle: 'プライバシー重視', trustOne: '<b>ローカル生成。</b> UUID はブラウザ内で生成されます。', trustTwo: '<b>アップロードなし。</b> サーバーリクエストは不要です。', articleTitle: 'UUID を使う場面', articleP1: 'UUID はテストデータ、request ID、DB キー、API 例、クライアント側プロトタイプに便利です。', articleP2: 'このツールは browser crypto APIs で UUID v4 を生成し、ID を送信しません。', faqTitle: 'よくある質問', faq: [['この UUID ツールは無料ですか？', 'はい。登録なしで生成とコピーができます。'], ['UUID はローカル生成ですか？', 'はい。ブラウザの crypto APIs で生成します。'], ['どの UUID バージョンですか？', 'UUID v4 を生成します。'], ['一括生成できますか？', 'はい。一度に最大 500 件生成できます。'], ['UUID は保存されますか？', 'いいえ。アップロード、保存、送信されません。']], privacyTitle: 'プライバシーポリシー', privacy: '生成された UUID を収集、保存、アップロード、送信しません。', termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番システムで使う前に確認してください。' },
  ko: { title: 'UUID 생성기 - UUID v4 온라인 생성 | ConvertUnlimited', description: '브라우저에서 UUID v4를 생성하세요. 랜덤 UUID 일괄 생성, 복사, 업로드 없음.', hero: 'UUID 생성기', sub: 'API, 테스트, 데이터베이스, 개발 워크플로용 UUID v4를 로컬로 생성합니다.', eyebrow: '로컬 개발 ID 도구', panelTitle: 'UUID를 하나 또는 여러 개 생성하세요.', panelText: '서버 요청 없이 브라우저에서 RFC4122 스타일 UUID v4를 만듭니다.', output: '생성된 UUID', quantity: '수량', uppercase: '대문자', separator: '출력 형식', lines: '줄 구분', comma: '쉼표 구분', generate: 'UUID 생성', copy: 'UUID 복사', clear: '지우기', trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 생성.</b> UUID는 브라우저에서 생성됩니다.', trustTwo: '<b>업로드 없음.</b> 서버 요청이 필요 없습니다.', articleTitle: 'UUID는 언제 사용하나요?', articleP1: 'UUID는 테스트 데이터, request ID, 데이터베이스 키, API 예시, 클라이언트 프로토타입에 유용합니다.', articleP2: '이 도구는 browser crypto APIs로 UUID v4를 생성하며 ID를 전송하지 않습니다.', faqTitle: '자주 묻는 질문', faq: [['이 UUID 도구는 무료인가요?', '네. 가입 없이 UUID를 생성하고 복사할 수 있습니다.'], ['UUID가 로컬에서 생성되나요?', '네. 브라우저 crypto APIs로 생성됩니다.'], ['어떤 UUID 버전인가요?', 'UUID v4를 생성합니다.'], ['일괄 생성할 수 있나요?', '네. 한 번에 최대 500개 생성할 수 있습니다.'], ['생성된 UUID가 저장되나요?', '아니요. 업로드, 저장, 전송되지 않습니다.']], privacyTitle: '개인정보 처리방침', privacy: '생성된 UUID를 수집, 저장, 업로드 또는 전송하지 않습니다.', termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 사용 전 확인하세요.' },
  es: { title: 'Generador UUID - Generar UUID v4 online | ConvertUnlimited', description: 'Genera UUID v4 localmente en tu navegador. Generación en lote, copia de salida y sin subidas.', hero: 'Generador UUID', sub: 'Genera UUID v4 localmente para APIs, pruebas, bases de datos y desarrollo.', eyebrow: 'Herramienta local de IDs', panelTitle: 'Genera uno o muchos UUID.', panelText: 'Crea UUID v4 estilo RFC4122 en tu navegador sin solicitud al servidor.', output: 'UUID generados', quantity: 'Cantidad', uppercase: 'Mayúsculas', separator: 'Formato de salida', lines: 'Separados por líneas', comma: 'Separados por coma', generate: 'Generar UUID', copy: 'Copiar UUID', clear: 'Limpiar', trustTitle: 'Privado por diseño', trustOne: '<b>Generación local.</b> Los UUID se generan en tu navegador.', trustTwo: '<b>Sin subidas.</b> No se necesita servidor.', articleTitle: '¿Cuándo usar UUID?', articleP1: 'Los UUID son útiles para datos de prueba, request IDs, claves de base de datos, ejemplos API y prototipos frontend.', articleP2: 'Esta herramienta genera UUID v4 con crypto APIs del navegador y no envía los IDs.', faqTitle: 'Preguntas frecuentes', faq: [['¿Este generador UUID es gratis?', 'Sí. Puedes generar y copiar UUID sin registro.'], ['¿Los UUID se generan localmente?', 'Sí. Se generan en el navegador con crypto APIs nativas.'], ['¿Qué versión genera?', 'Genera UUID v4.'], ['¿Puedo generar en lote?', 'Sí. Hasta 500 UUID de una vez.'], ['¿Se almacenan los UUID?', 'No. No se suben, almacenan ni transmiten.']], privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos UUID generados.', termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa los identificadores antes de usarlos en producción.' },
  fr: { title: 'Générateur UUID - Générer UUID v4 en ligne | ConvertUnlimited', description: 'Générez des UUID v4 localement dans votre navigateur. Génération en lot, copie, aucun envoi.', hero: 'Générateur UUID', sub: 'Générez des UUID v4 localement pour API, tests, bases de données et workflows développeur.', eyebrow: 'Outil local d’ID', panelTitle: 'Générez un ou plusieurs UUID.', panelText: 'Créez des UUID v4 style RFC4122 dans votre navigateur sans requête serveur.', output: 'UUID générés', quantity: 'Quantité', uppercase: 'Majuscules', separator: 'Format de sortie', lines: 'Séparés par ligne', comma: 'Séparés par virgule', generate: 'Générer UUID', copy: 'Copier UUID', clear: 'Effacer', trustTitle: 'Privé par conception', trustOne: '<b>Génération locale.</b> Les UUID sont générés dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Aucune requête serveur requise.', articleTitle: 'Quand utiliser des UUID ?', articleP1: 'Les UUID sont utiles pour données de test, request IDs, clés de base de données, exemples API et prototypes client.', articleP2: 'Cet outil génère des UUID v4 avec les crypto APIs du navigateur et n’envoie pas les IDs.', faqTitle: 'Foire aux questions', faq: [['Ce générateur UUID est-il gratuit ?', 'Oui. Vous pouvez générer et copier des UUID sans inscription.'], ['Les UUID sont-ils générés localement ?', 'Oui. La génération se fait dans le navigateur avec les crypto APIs natives.'], ['Quelle version est générée ?', 'Cet outil génère UUID v4.'], ['Puis-je générer en lot ?', 'Oui. Jusqu’à 500 UUID à la fois.'], ['Les UUID sont-ils stockés ?', 'Non. Ils ne sont ni envoyés, ni stockés, ni transmis.']], privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons les UUID générés.', termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Vérifiez les identifiants avant une utilisation en production.' },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/uuid-generator/`;
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
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'uuid-generator')}" aria-current="page">UUID Generator</a><a href="${link(locale, 'url-encoder-decoder')}">URL Encoder</a><a href="${link(locale, 'base64-encoder-decoder')}">Base64</a><a href="${link(locale, 'json-formatter')}">JSON Formatter</a></div></details>
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
                                <label class="range-field" for="uuid-quantity"><span>${esc(t.quantity)}</span><input id="uuid-quantity" type="number" min="1" max="500" value="5"></label>
                                <label class="range-field" for="uuid-separator"><span>${esc(t.separator)}</span><select id="uuid-separator"><option value="lines">${esc(t.lines)}</option><option value="comma">${esc(t.comma)}</option></select></label>
                                <label class="range-field" for="uuid-uppercase"><span>${esc(t.uppercase)}</span><input id="uuid-uppercase" type="checkbox"></label>
                                <button class="btn btn-accent" id="uuid-generate" type="button">${esc(t.generate)}</button>
                                <button class="btn btn-ghost" id="uuid-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.output)}:</b> <span id="uuid-count" class="mono num">0</span></p>
                            <p class="bg-status" id="uuid-status"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="uuid-output"><span>${esc(t.output)}</span><textarea id="uuid-output" rows="18" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;overflow-wrap:anywhere;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="uuid-copy" type="button">${esc(t.copy)}</button></div>
                        </div>
                    </div>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_UUID_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_UUID_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
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
    <script src="/uuid-generator/uuid-generator.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'uuid-generator');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized UUID pages');
