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
  en: {
    title: 'Timestamp Converter - Unix Time to Date Online | ConvertUnlimited',
    description: 'Convert Unix timestamps to dates and dates to Unix time locally in your browser. Supports seconds, milliseconds, UTC, local time, and ISO 8601.',
    hero: 'Timestamp Converter', sub: 'Convert Unix timestamps and human-readable dates locally in your browser.',
    eyebrow: 'Local developer time tool', panelTitle: 'Convert timestamps both ways.', panelText: 'Switch between seconds and milliseconds, view UTC and local time, and copy ISO 8601 output without server requests.',
    timestamp: 'Unix timestamp', date: 'Date / time input', unit: 'Timestamp unit', seconds: 'Seconds', milliseconds: 'Milliseconds', toDate: 'Timestamp to date', toTimestamp: 'Date to timestamp', now: 'Current timestamp', output: 'Converted output', copy: 'Copy output', clear: 'Clear',
    trustTitle: 'Private by design', trustOne: '<b>Local conversion.</b> Dates and timestamps are converted in your browser.', trustTwo: '<b>No uploads.</b> No server request is needed.',
    articleTitle: 'When should you convert timestamps?', articleP1: 'Unix timestamps are common in logs, APIs, databases, analytics exports, and debugging workflows.', articleP2: 'This tool converts timestamps to ISO 8601, UTC, and local time so dates can be checked quickly without a date library or network request.',
    faqTitle: 'Frequently Asked Questions',
    faq: [['Is this Timestamp Converter free?', 'Yes. You can convert, copy, and clear timestamps without signup.'], ['Are conversions done locally?', 'Yes. All conversion happens in your browser using native Date APIs.'], ['Does it support seconds and milliseconds?', 'Yes. Use the unit selector to switch between Unix seconds and Unix milliseconds.'], ['What timezone is shown?', 'The output includes ISO 8601, UTC, and your browser local timezone.'], ['What happens with invalid dates?', 'The tool shows a friendly warning and preserves your input.']],
    privacyTitle: 'Privacy Policy', privacy: 'We do not collect, store, upload, or transmit timestamps or dates entered into this tool.', termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Review converted dates before using them in production systems.',
  },
  th: { title: 'ตัวแปลง Timestamp - Unix Time เป็นวันที่ | ConvertUnlimited', description: 'แปลง Unix timestamp เป็นวันที่และวันที่เป็น Unix time ในเบราว์เซอร์ รองรับวินาที มิลลิวินาที UTC local time และ ISO 8601', hero: 'ตัวแปลง Timestamp', sub: 'แปลง Unix timestamp และวันที่อ่านได้ในเบราว์เซอร์', eyebrow: 'เครื่องมือเวลาในเครื่อง', panelTitle: 'แปลง timestamp ได้สองทาง', panelText: 'สลับวินาที/มิลลิวินาที ดู UTC และ local time และคัดลอก ISO 8601 โดยไม่เรียกเซิร์ฟเวอร์', timestamp: 'Unix timestamp', date: 'วันที่ / เวลา', unit: 'หน่วย timestamp', seconds: 'วินาที', milliseconds: 'มิลลิวินาที', toDate: 'Timestamp เป็นวันที่', toTimestamp: 'วันที่เป็น timestamp', now: 'Timestamp ปัจจุบัน', output: 'ผลลัพธ์', copy: 'คัดลอกผลลัพธ์', clear: 'ล้าง', trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>แปลงในเครื่อง</b> วันที่และ timestamp ถูกแปลงในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ไม่ต้องเรียกเซิร์ฟเวอร์', articleTitle: 'ควรแปลง timestamp เมื่อใด?', articleP1: 'Unix timestamp พบได้ใน log, API, database, analytics export และงาน debug', articleP2: 'เครื่องมือนี้แปลงเป็น ISO 8601, UTC และ local time โดยไม่ใช้ไลบรารีวันที่หรือ network', faqTitle: 'คำถามที่พบบ่อย', faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี แปลง คัดลอก และล้างได้โดยไม่ต้องสมัคร'], ['แปลงในเครื่องไหม?', 'ใช่ ทุกอย่างทำในเบราว์เซอร์ด้วย Date APIs'], ['รองรับวินาทีและมิลลิวินาทีไหม?', 'รองรับ ใช้ตัวเลือกหน่วยเพื่อสลับ'], ['แสดง timezone อะไร?', 'แสดง ISO 8601, UTC และ local timezone ของเบราว์เซอร์'], ['ถ้าวันที่ไม่ถูกต้องจะเกิดอะไร?', 'จะแสดงคำเตือนและเก็บข้อมูลเดิมไว้']], privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่ง timestamp หรือวันที่ที่ใส่', termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจวันที่ก่อนใช้ในระบบจริง' },
  vi: { title: 'Trình chuyển Timestamp - Unix Time sang ngày | ConvertUnlimited', description: 'Chuyển Unix timestamp sang ngày và ngày sang Unix time trong trình duyệt. Hỗ trợ giây, mili giây, UTC, giờ cục bộ và ISO 8601.', hero: 'Trình chuyển Timestamp', sub: 'Chuyển Unix timestamp và ngày đọc được ngay trong trình duyệt.', eyebrow: 'Công cụ thời gian cục bộ', panelTitle: 'Chuyển timestamp hai chiều.', panelText: 'Đổi giữa giây và mili giây, xem UTC và giờ cục bộ, sao chép ISO 8601 mà không cần máy chủ.', timestamp: 'Unix timestamp', date: 'Ngày / giờ nhập', unit: 'Đơn vị timestamp', seconds: 'Giây', milliseconds: 'Mili giây', toDate: 'Timestamp sang ngày', toTimestamp: 'Ngày sang timestamp', now: 'Timestamp hiện tại', output: 'Kết quả chuyển đổi', copy: 'Sao chép đầu ra', clear: 'Xóa', trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Chuyển đổi cục bộ.</b> Ngày và timestamp được chuyển trong trình duyệt.', trustTwo: '<b>Không upload.</b> Không cần yêu cầu máy chủ.', articleTitle: 'Khi nào nên chuyển timestamp?', articleP1: 'Unix timestamp thường xuất hiện trong log, API, database, analytics export và debug.', articleP2: 'Công cụ chuyển sang ISO 8601, UTC và giờ cục bộ để kiểm tra nhanh không cần thư viện ngày hoặc mạng.', faqTitle: 'Câu hỏi thường gặp', faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể chuyển, sao chép và xóa không cần đăng ký.'], ['Chuyển đổi có cục bộ không?', 'Có. Tất cả chạy trong trình duyệt với Date APIs.'], ['Có hỗ trợ giây và mili giây không?', 'Có. Dùng bộ chọn đơn vị để chuyển đổi.'], ['Hiển thị timezone nào?', 'Kết quả gồm ISO 8601, UTC và timezone cục bộ của trình duyệt.'], ['Ngày không hợp lệ thì sao?', 'Công cụ cảnh báo thân thiện và giữ nguyên đầu vào.']], privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền timestamp hay ngày nhập vào công cụ.', termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy kiểm tra ngày trước khi dùng trong production.' },
  zh: { title: '时间戳转换器 - Unix 时间转日期 | ConvertUnlimited', description: '在浏览器中本地转换 Unix 时间戳和日期。支持秒、毫秒、UTC、本地时间和 ISO 8601。', hero: '时间戳转换器', sub: '在浏览器中本地转换 Unix 时间戳和可读日期。', eyebrow: '本地开发时间工具', panelTitle: '双向转换时间戳。', panelText: '在秒和毫秒之间切换，查看 UTC 和本地时间，并复制 ISO 8601 输出，无需服务器请求。', timestamp: 'Unix 时间戳', date: '日期 / 时间输入', unit: '时间戳单位', seconds: '秒', milliseconds: '毫秒', toDate: '时间戳转日期', toTimestamp: '日期转时间戳', now: '当前时间戳', output: '转换结果', copy: '复制输出', clear: '清空', trustTitle: '隐私优先设计', trustOne: '<b>本地转换。</b> 日期和时间戳在浏览器中转换。', trustTwo: '<b>无需上传。</b> 不需要服务器请求。', articleTitle: '什么时候需要转换时间戳？', articleP1: 'Unix 时间戳常见于日志、API、数据库、分析导出和调试流程。', articleP2: '本工具转换为 ISO 8601、UTC 和本地时间，无需日期库或网络请求即可快速检查。', faqTitle: '常见问题', faq: [['这个时间戳工具免费吗？', '免费。无需注册即可转换、复制和清空。'], ['转换是本地完成的吗？', '是的。使用浏览器原生 Date API。'], ['支持秒和毫秒吗？', '支持。使用单位选择器切换。'], ['显示哪个时区？', '输出包含 ISO 8601、UTC 和浏览器本地时区。'], ['日期无效怎么办？', '工具会显示友好警告并保留输入。']], privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输输入到此工具的时间戳或日期。', termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产系统使用前请检查转换后的日期。' },
  ja: { title: 'タイムスタンプ変換ツール - Unix 時刻を日付へ | ConvertUnlimited', description: 'ブラウザ内で Unix タイムスタンプと日付を変換。秒、ミリ秒、UTC、ローカル時刻、ISO 8601 に対応。', hero: 'タイムスタンプ変換ツール', sub: 'Unix タイムスタンプと読みやすい日付をブラウザ内で変換します。', eyebrow: 'ローカル開発時間ツール', panelTitle: 'タイムスタンプを双方向変換。', panelText: '秒/ミリ秒を切り替え、UTC とローカル時刻を確認し、ISO 8601 をコピーできます。サーバー不要です。', timestamp: 'Unix タイムスタンプ', date: '日付 / 時刻入力', unit: 'タイムスタンプ単位', seconds: '秒', milliseconds: 'ミリ秒', toDate: 'タイムスタンプを日付へ', toTimestamp: '日付をタイムスタンプへ', now: '現在のタイムスタンプ', output: '変換結果', copy: '出力をコピー', clear: 'クリア', trustTitle: 'プライバシー重視', trustOne: '<b>ローカル変換。</b> 日付とタイムスタンプはブラウザ内で変換されます。', trustTwo: '<b>アップロードなし。</b> サーバーリクエストは不要です。', articleTitle: 'タイムスタンプを変換する場面', articleP1: 'Unix タイムスタンプはログ、API、データベース、分析エクスポート、デバッグでよく使われます。', articleP2: 'このツールは ISO 8601、UTC、ローカル時刻へ変換し、日付ライブラリやネットワークなしで確認できます。', faqTitle: 'よくある質問', faq: [['このツールは無料ですか？', 'はい。登録なしで変換、コピー、クリアできます。'], ['変換はローカルですか？', 'はい。ブラウザの Date API で処理します。'], ['秒とミリ秒に対応しますか？', 'はい。単位セレクターで切り替えます。'], ['どのタイムゾーンを表示しますか？', 'ISO 8601、UTC、ブラウザのローカルタイムゾーンを表示します。'], ['無効な日付は？', '警告を表示し、元の入力を保持します。']], privacyTitle: 'プライバシーポリシー', privacy: '入力されたタイムスタンプや日付を収集、保存、アップロード、送信しません。', termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番システムで使う前に変換結果を確認してください。' },
  ko: { title: '타임스탬프 변환기 - Unix 시간을 날짜로 | ConvertUnlimited', description: '브라우저에서 Unix 타임스탬프와 날짜를 변환하세요. 초, 밀리초, UTC, 로컬 시간, ISO 8601 지원.', hero: '타임스탬프 변환기', sub: '브라우저에서 Unix 타임스탬프와 읽기 쉬운 날짜를 로컬로 변환합니다.', eyebrow: '로컬 개발 시간 도구', panelTitle: '타임스탬프를 양방향 변환하세요.', panelText: '초/밀리초를 전환하고 UTC와 로컬 시간을 확인하며 서버 요청 없이 ISO 8601 출력을 복사합니다.', timestamp: 'Unix 타임스탬프', date: '날짜 / 시간 입력', unit: '타임스탬프 단위', seconds: '초', milliseconds: '밀리초', toDate: '타임스탬프를 날짜로', toTimestamp: '날짜를 타임스탬프로', now: '현재 타임스탬프', output: '변환 결과', copy: '출력 복사', clear: '지우기', trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 변환.</b> 날짜와 타임스탬프는 브라우저에서 변환됩니다.', trustTwo: '<b>업로드 없음.</b> 서버 요청이 필요 없습니다.', articleTitle: '타임스탬프는 언제 변환하나요?', articleP1: 'Unix 타임스탬프는 로그, API, 데이터베이스, 분석 내보내기, 디버깅에서 자주 사용됩니다.', articleP2: '이 도구는 ISO 8601, UTC, 로컬 시간으로 변환해 날짜 라이브러리나 네트워크 없이 빠르게 확인할 수 있습니다.', faqTitle: '자주 묻는 질문', faq: [['이 도구는 무료인가요?', '네. 가입 없이 변환, 복사, 지우기를 할 수 있습니다.'], ['변환은 로컬인가요?', '네. 브라우저 Date API로 처리합니다.'], ['초와 밀리초를 지원하나요?', '네. 단위 선택기로 전환합니다.'], ['어떤 시간대를 표시하나요?', 'ISO 8601, UTC, 브라우저 로컬 시간대를 표시합니다.'], ['잘못된 날짜는 어떻게 되나요?', '친절한 경고를 표시하고 입력을 유지합니다.']], privacyTitle: '개인정보 처리방침', privacy: '이 도구에 입력한 타임스탬프나 날짜를 수집, 저장, 업로드 또는 전송하지 않습니다.', termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 사용 전 변환 결과를 확인하세요.' },
  es: { title: 'Convertidor Timestamp - Unix Time a fecha | ConvertUnlimited', description: 'Convierte Unix timestamps a fechas y fechas a Unix time en tu navegador. Segundos, milisegundos, UTC, hora local e ISO 8601.', hero: 'Convertidor Timestamp', sub: 'Convierte Unix timestamps y fechas legibles localmente en tu navegador.', eyebrow: 'Herramienta local de tiempo', panelTitle: 'Convierte timestamps en ambos sentidos.', panelText: 'Cambia entre segundos y milisegundos, ve UTC y hora local, y copia ISO 8601 sin servidor.', timestamp: 'Unix timestamp', date: 'Fecha / hora', unit: 'Unidad timestamp', seconds: 'Segundos', milliseconds: 'Milisegundos', toDate: 'Timestamp a fecha', toTimestamp: 'Fecha a timestamp', now: 'Timestamp actual', output: 'Salida convertida', copy: 'Copiar salida', clear: 'Limpiar', trustTitle: 'Privado por diseño', trustOne: '<b>Conversión local.</b> Fechas y timestamps se convierten en tu navegador.', trustTwo: '<b>Sin subidas.</b> No se necesita servidor.', articleTitle: '¿Cuándo convertir timestamps?', articleP1: 'Los Unix timestamps son comunes en logs, APIs, bases de datos, exports de analítica y depuración.', articleP2: 'Esta herramienta convierte a ISO 8601, UTC y hora local para revisar fechas sin librerías ni red.', faqTitle: 'Preguntas frecuentes', faq: [['¿Este convertidor es gratis?', 'Sí. Puedes convertir, copiar y limpiar sin registro.'], ['¿La conversión es local?', 'Sí. Todo ocurre en el navegador con Date APIs nativas.'], ['¿Soporta segundos y milisegundos?', 'Sí. Usa el selector de unidad.'], ['¿Qué zona horaria muestra?', 'Incluye ISO 8601, UTC y zona local del navegador.'], ['¿Qué pasa con fechas inválidas?', 'Muestra una advertencia clara y conserva la entrada.']], privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos timestamps o fechas introducidas.', termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa las fechas convertidas antes de usarlas en producción.' },
  fr: { title: 'Convertisseur Timestamp - Unix Time vers date | ConvertUnlimited', description: 'Convertissez timestamps Unix en dates et dates en Unix time dans votre navigateur. Secondes, millisecondes, UTC, heure locale, ISO 8601.', hero: 'Convertisseur Timestamp', sub: 'Convertissez timestamps Unix et dates lisibles localement dans votre navigateur.', eyebrow: 'Outil local de temps', panelTitle: 'Convertissez les timestamps dans les deux sens.', panelText: 'Passez entre secondes et millisecondes, affichez UTC et heure locale, copiez ISO 8601 sans serveur.', timestamp: 'Timestamp Unix', date: 'Date / heure', unit: 'Unité timestamp', seconds: 'Secondes', milliseconds: 'Millisecondes', toDate: 'Timestamp vers date', toTimestamp: 'Date vers timestamp', now: 'Timestamp actuel', output: 'Sortie convertie', copy: 'Copier la sortie', clear: 'Effacer', trustTitle: 'Privé par conception', trustOne: '<b>Conversion locale.</b> Dates et timestamps sont convertis dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Aucune requête serveur requise.', articleTitle: 'Quand convertir des timestamps ?', articleP1: 'Les timestamps Unix sont fréquents dans logs, API, bases de données, exports analytics et debug.', articleP2: 'Cet outil convertit en ISO 8601, UTC et heure locale pour vérifier les dates sans bibliothèque ni réseau.', faqTitle: 'Foire aux questions', faq: [['Ce convertisseur est-il gratuit ?', 'Oui. Vous pouvez convertir, copier et effacer sans inscription.'], ['La conversion est-elle locale ?', 'Oui. Tout se passe dans le navigateur avec les Date APIs natives.'], ['Secondes et millisecondes sont-elles prises en charge ?', 'Oui. Utilisez le sélecteur d’unité.'], ['Quel fuseau horaire est affiché ?', 'La sortie inclut ISO 8601, UTC et le fuseau local du navigateur.'], ['Que faire avec une date invalide ?', 'L’outil affiche un avertissement clair et conserve l’entrée.']], privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons les timestamps ou dates saisis.', termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Vérifiez les dates converties avant une utilisation en production.' },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/timestamp-converter/`;
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
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'timestamp-converter')}" aria-current="page">Timestamp Converter</a><a href="${link(locale, 'uuid-generator')}">UUID Generator</a><a href="${link(locale, 'hash-generator')}">Hash Generator</a><a href="${link(locale, 'json-formatter')}">JSON Formatter</a></div></details>
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
                                <label class="range-field" for="timestamp-input"><span>${esc(t.timestamp)}</span><input id="timestamp-input" class="mono" type="text" inputmode="numeric"></label>
                                <label class="range-field" for="timestamp-date"><span>${esc(t.date)}</span><input id="timestamp-date" class="mono" type="datetime-local"></label>
                                <label class="range-field" for="timestamp-unit"><span>${esc(t.unit)}</span><select id="timestamp-unit"><option value="s">${esc(t.seconds)}</option><option value="ms">${esc(t.milliseconds)}</option></select></label>
                                <button class="btn btn-accent" id="timestamp-to-date" type="button">${esc(t.toDate)}</button>
                                <button class="btn btn-ghost" id="timestamp-to-timestamp" type="button">${esc(t.toTimestamp)}</button>
                                <button class="btn btn-ghost" id="timestamp-now" type="button">${esc(t.now)}</button>
                                <button class="btn btn-ghost" id="timestamp-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status" id="timestamp-status"></p>
                            <p class="bg-status" id="timestamp-warning" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="timestamp-output"><span>${esc(t.output)}</span><textarea id="timestamp-output" rows="18" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;overflow-wrap:anywhere;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="timestamp-copy" type="button">${esc(t.copy)}</button></div>
                        </div>
                    </div>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_TIMESTAMP_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_TIMESTAMP_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
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
    <script src="/timestamp-converter/timestamp-converter.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'timestamp-converter');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized Timestamp pages');
