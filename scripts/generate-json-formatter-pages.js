const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'JSON Formatter - Format, Validate & Minify JSON Online | ConvertUnlimited',
    description: 'Format, validate, beautify, and minify JSON locally in your browser. Free JSON formatter with Unicode support, copy, and download.',
    hero: 'JSON Formatter', sub: 'Format, validate, and minify JSON locally in your browser.',
    eyebrow: 'Local developer tool', panelTitle: 'Paste JSON and clean it up.',
    panelText: 'Beautify nested objects, minify payloads, and validate JSON with selected inputs processed locally in your browser.',
    input: 'JSON input', output: 'Formatted output', indent: 'Indentation', upload: 'Open .json file',
    format: 'Format', minify: 'Minify', validate: 'Validate', copy: 'Copy output', clear: 'Clear', sample: 'Sample JSON', download: 'Download JSON',
    count: 'Input characters', error: 'Validation message',
    trustTitle: 'Private by design', trustOne: '<b>Local processing.</b> JSON is parsed in your browser.', trustTwo: '<b>Local processing.</b> Data is processed locally in your browser.',
    articleTitle: 'When should you format JSON?', articleP1: 'Formatted JSON is easier to inspect, debug, review, and share with teammates. Minified JSON is useful when you need compact payloads for APIs, examples, or configuration files.',
    articleP2: 'This tool validates strict JSON. It does not repair invalid JSON or accept JavaScript-style comments, trailing commas, or unquoted keys.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      ['Is this JSON Formatter free?', 'Yes. You can format, validate, minify, copy, and download JSON without signup.'],
      ['Is my JSON uploaded?', 'No. Parsing and formatting run locally in your browser.'],
      ['Does it support Unicode and emojis?', 'Yes. JSON.parse and JSON.stringify preserve valid Unicode strings and emojis.'],
      ['Can it fix invalid JSON?', 'No. It validates strict JSON and shows an error so you can fix the source manually.'],
      ['What indentation should I use?', 'Two spaces are common for web projects, four spaces are easier to read, and tabs are useful when your project requires them.'],
    ],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this JSON formatting flow. JSON input and selected files are processed locally in your browser.',
    termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Always review formatted JSON before using it in production systems.',
  },
  th: {
    title: 'ตัวจัดรูปแบบ JSON - จัดรูปแบบ ตรวจสอบ และย่อ JSON | ConvertUnlimited',
    description: 'จัดรูปแบบ ตรวจสอบ และย่อ JSON ในเบราว์เซอร์ ฟรี รองรับ Unicode คัดลอก ดาวน์โหลด และไม่อัปโหลดข้อมูล',
    hero: 'ตัวจัดรูปแบบ JSON', sub: 'จัดรูปแบบ ตรวจสอบ และย่อ JSON ในเบราว์เซอร์ของคุณ',
    eyebrow: 'เครื่องมือนักพัฒนาในเครื่อง', panelTitle: 'วาง JSON แล้วจัดให้อ่านง่าย',
    panelText: 'จัด object ซ้อนกัน ย่อ payload และตรวจสอบ JSON โดยไม่อัปโหลดข้อมูลไปยังเซิร์ฟเวอร์',
    input: 'JSON ขาเข้า', output: 'ผลลัพธ์ที่จัดรูปแบบ', indent: 'การเยื้อง', upload: 'เปิดไฟล์ .json',
    format: 'จัดรูปแบบ', minify: 'ย่อ', validate: 'ตรวจสอบ', copy: 'คัดลอกผลลัพธ์', clear: 'ล้าง', sample: 'JSON ตัวอย่าง', download: 'ดาวน์โหลด JSON',
    count: 'จำนวนตัวอักษรขาเข้า', error: 'ข้อความตรวจสอบ',
    trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>ประมวลผลในเครื่อง</b> JSON ถูก parse ในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ข้อมูลไม่ถูกส่งไปยังเซิร์ฟเวอร์',
    articleTitle: 'ควรจัดรูปแบบ JSON เมื่อใด?', articleP1: 'JSON ที่จัดรูปแบบแล้วอ่าน ตรวจดีบัก รีวิว และแชร์กับทีมได้ง่ายกว่า JSON ที่ย่อแล้วเหมาะกับ payload ของ API ตัวอย่าง หรือไฟล์ config',
    articleP2: 'เครื่องมือนี้ตรวจสอบ JSON แบบ strict ไม่ซ่อม JSON ที่ผิด และไม่รับ comment, comma ท้ายสุด หรือ key ที่ไม่ใส่เครื่องหมาย',
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี ใช้จัดรูปแบบ ตรวจสอบ ย่อ คัดลอก และดาวน์โหลด JSON ได้โดยไม่ต้องสมัคร'], ['JSON ของฉันถูกอัปโหลดไหม?', 'ไม่ การ parse และจัดรูปแบบทำงานในเบราว์เซอร์'], ['รองรับ Unicode และอีโมจิไหม?', 'รองรับ JSON.parse และ JSON.stringify จะรักษา Unicode และอีโมจิที่ถูกต้อง'], ['ซ่อม JSON ที่ผิดได้ไหม?', 'ไม่ เครื่องมือนี้ตรวจ JSON แบบ strict และแสดง error เพื่อให้แก้เอง'], ['ควรใช้การเยื้องแบบไหน?', 'สองช่องว่างใช้บ่อยในเว็บ สี่ช่องว่างอ่านง่าย และ tab เหมาะเมื่อโปรเจกต์กำหนด']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่ง JSON ที่คุณวาง ไฟล์ที่เปิดจะอ่านในเบราว์เซอร์เท่านั้น',
    termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจ JSON ที่จัดรูปแบบแล้วก่อนใช้ในระบบจริง',
  },
  vi: {
    title: 'Trình định dạng JSON - Format, Validate & Minify | ConvertUnlimited',
    description: 'Định dạng, kiểm tra, beautify và rút gọn JSON cục bộ trong trình duyệt. Miễn phí, hỗ trợ Unicode, sao chép, tải xuống, không upload.',
    hero: 'Trình định dạng JSON', sub: 'Định dạng, kiểm tra và rút gọn JSON cục bộ trong trình duyệt.',
    eyebrow: 'Công cụ lập trình cục bộ', panelTitle: 'Dán JSON và làm sạch.',
    panelText: 'Beautify object lồng nhau, rút gọn payload và kiểm tra JSON mà không gửi dữ liệu lên máy chủ.',
    input: 'JSON đầu vào', output: 'Kết quả định dạng', indent: 'Thụt lề', upload: 'Mở tệp .json',
    format: 'Định dạng', minify: 'Rút gọn', validate: 'Kiểm tra', copy: 'Sao chép kết quả', clear: 'Xóa', sample: 'JSON mẫu', download: 'Tải JSON',
    count: 'Ký tự đầu vào', error: 'Thông báo kiểm tra',
    trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Xử lý cục bộ.</b> JSON được parse trong trình duyệt.', trustTwo: '<b>Không upload.</b> Dữ liệu không gửi đến máy chủ.',
    articleTitle: 'Khi nào nên định dạng JSON?', articleP1: 'JSON được định dạng dễ đọc, debug, review và chia sẻ hơn. JSON rút gọn hữu ích cho payload API, ví dụ hoặc tệp cấu hình.',
    articleP2: 'Công cụ này kiểm tra JSON nghiêm ngặt. Nó không sửa JSON sai và không chấp nhận comment, dấu phẩy cuối hoặc key không có dấu ngoặc.',
    faqTitle: 'Câu hỏi thường gặp',
    faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể định dạng, kiểm tra, rút gọn, sao chép và tải JSON không cần đăng ký.'], ['JSON của tôi có được upload không?', 'Không. Việc parse và định dạng chạy cục bộ trong trình duyệt.'], ['Có hỗ trợ Unicode và emoji không?', 'Có. JSON.parse và JSON.stringify giữ chuỗi Unicode và emoji hợp lệ.'], ['Có sửa JSON sai không?', 'Không. Công cụ kiểm tra JSON nghiêm ngặt và hiển thị lỗi để bạn tự sửa.'], ['Nên dùng thụt lề nào?', 'Hai khoảng trắng phổ biến cho web, bốn khoảng trắng dễ đọc hơn, tab dùng khi dự án yêu cầu.']],
    privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền JSON bạn dán. Tệp mở qua bộ chọn được đọc cục bộ.',
    termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Luôn kiểm tra JSON đã định dạng trước khi dùng trong hệ thống production.',
  },
  zh: {
    title: 'JSON 格式化工具 - 在线格式化、验证和压缩 JSON | ConvertUnlimited',
    description: '在浏览器中本地格式化、验证、美化和压缩 JSON。免费 JSON 工具，支持 Unicode、复制、下载，无需上传。',
    hero: 'JSON 格式化工具', sub: '在浏览器中本地格式化、验证和压缩 JSON。',
    eyebrow: '本地开发者工具', panelTitle: '粘贴 JSON 并整理格式。',
    panelText: '美化嵌套对象、压缩 payload，并在不上传数据的情况下验证 JSON。',
    input: 'JSON 输入', output: '格式化输出', indent: '缩进', upload: '打开 .json 文件',
    format: '格式化', minify: '压缩', validate: '验证', copy: '复制输出', clear: '清空', sample: '示例 JSON', download: '下载 JSON',
    count: '输入字符数', error: '验证消息',
    trustTitle: '隐私优先设计', trustOne: '<b>本地处理。</b> JSON 在浏览器中解析。', trustTwo: '<b>无需上传。</b> 数据不会发送到服务器。',
    articleTitle: '什么时候需要格式化 JSON？', articleP1: '格式化后的 JSON 更容易检查、调试、评审和分享。压缩后的 JSON 适合 API payload、示例或配置文件。',
    articleP2: '本工具验证严格 JSON，不会修复无效 JSON，也不接受 JavaScript 风格注释、尾随逗号或未加引号的 key。',
    faqTitle: '常见问题',
    faq: [['这个 JSON 工具免费吗？', '免费。无需注册即可格式化、验证、压缩、复制和下载 JSON。'], ['我的 JSON 会上传吗？', '不会。解析和格式化都在浏览器本地运行。'], ['支持 Unicode 和表情吗？', '支持。JSON.parse 和 JSON.stringify 会保留有效的 Unicode 字符串和表情。'], ['可以修复无效 JSON 吗？', '不可以。它验证严格 JSON 并显示错误，方便你手动修复。'], ['应该使用哪种缩进？', 'Web 项目常用两个空格，四个空格更易读，tab 适合项目要求时使用。']],
    privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输你粘贴的 JSON。通过文件选择器打开的文件只会在浏览器本地读取。',
    termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产系统中使用前，请务必检查格式化后的 JSON。',
  },
  ja: {
    title: 'JSON フォーマッター - JSON の整形・検証・圧縮 | ConvertUnlimited',
    description: 'ブラウザ内で JSON を整形、検証、美化、圧縮します。Unicode 対応、コピー、ダウンロード、アップロード不要の無料 JSON ツール。',
    hero: 'JSON フォーマッター', sub: 'ブラウザ内で JSON を整形、検証、圧縮します。',
    eyebrow: 'ローカル開発者ツール', panelTitle: 'JSON を貼り付けて整えます。',
    panelText: 'ネストしたオブジェクトを読みやすく整形し、payload を圧縮し、サーバーへ送らずに JSON を検証します。',
    input: 'JSON 入力', output: '整形済み出力', indent: 'インデント', upload: '.json ファイルを開く',
    format: '整形', minify: '圧縮', validate: '検証', copy: '出力をコピー', clear: 'クリア', sample: 'サンプル JSON', download: 'JSON をダウンロード',
    count: '入力文字数', error: '検証メッセージ',
    trustTitle: 'プライバシー重視', trustOne: '<b>ローカル処理。</b> JSON はブラウザ内で解析されます。', trustTwo: '<b>アップロードなし。</b> データはサーバーに送信されません。',
    articleTitle: 'いつ JSON を整形するべき？', articleP1: '整形された JSON は確認、デバッグ、レビュー、共有が簡単です。圧縮 JSON は API payload、サンプル、設定ファイルに便利です。',
    articleP2: 'このツールは厳密な JSON を検証します。無効な JSON の修復や、コメント、末尾カンマ、引用符なしキーには対応しません。',
    faqTitle: 'よくある質問',
    faq: [['この JSON フォーマッターは無料ですか？', 'はい。登録なしで整形、検証、圧縮、コピー、ダウンロードできます。'], ['JSON はアップロードされますか？', 'いいえ。解析と整形はブラウザ内でローカルに実行されます。'], ['Unicode や絵文字に対応していますか？', 'はい。JSON.parse と JSON.stringify は有効な Unicode 文字列と絵文字を保持します。'], ['無効な JSON を修復できますか？', 'いいえ。厳密な JSON を検証し、手動修正のためのエラーを表示します。'], ['どのインデントを使うべき？', 'Web では 2 スペースが一般的、4 スペースは読みやすく、タブはプロジェクト指定がある場合に便利です。']],
    privacyTitle: 'プライバシーポリシー', privacy: '貼り付けた JSON を収集、保存、アップロード、送信しません。ファイル選択で開いたファイルはブラウザ内で読み込まれます。',
    termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番システムで使う前に整形済み JSON を必ず確認してください。',
  },
  ko: {
    title: 'JSON 포매터 - JSON 포맷, 검증, 압축 | ConvertUnlimited',
    description: '브라우저에서 JSON을 로컬로 포맷, 검증, 보기 좋게 정리하고 압축합니다. Unicode, 복사, 다운로드 지원, 업로드 없음.',
    hero: 'JSON 포매터', sub: '브라우저에서 JSON을 포맷, 검증, 압축합니다.',
    eyebrow: '로컬 개발자 도구', panelTitle: 'JSON을 붙여넣고 정리하세요.',
    panelText: '중첩 객체를 보기 좋게 만들고 payload를 압축하며 서버 업로드 없이 JSON을 검증합니다.',
    input: 'JSON 입력', output: '포맷된 출력', indent: '들여쓰기', upload: '.json 파일 열기',
    format: '포맷', minify: '압축', validate: '검증', copy: '출력 복사', clear: '지우기', sample: '샘플 JSON', download: 'JSON 다운로드',
    count: '입력 글자 수', error: '검증 메시지',
    trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 처리.</b> JSON은 브라우저에서 파싱됩니다.', trustTwo: '<b>업로드 없음.</b> 데이터는 서버로 전송되지 않습니다.',
    articleTitle: '언제 JSON을 포맷해야 하나요?', articleP1: '포맷된 JSON은 검사, 디버깅, 리뷰, 공유가 더 쉽습니다. 압축 JSON은 API payload, 예시, 설정 파일에 유용합니다.',
    articleP2: '이 도구는 엄격한 JSON을 검증합니다. 잘못된 JSON을 복구하지 않으며 주석, trailing comma, 따옴표 없는 key를 허용하지 않습니다.',
    faqTitle: '자주 묻는 질문',
    faq: [['이 JSON 포매터는 무료인가요?', '네. 가입 없이 JSON을 포맷, 검증, 압축, 복사, 다운로드할 수 있습니다.'], ['JSON이 업로드되나요?', '아니요. 파싱과 포맷은 브라우저에서 로컬로 실행됩니다.'], ['Unicode와 이모지를 지원하나요?', '네. JSON.parse와 JSON.stringify는 유효한 Unicode 문자열과 이모지를 보존합니다.'], ['잘못된 JSON을 고칠 수 있나요?', '아니요. 엄격한 JSON을 검증하고 직접 수정할 수 있도록 오류를 표시합니다.'], ['어떤 들여쓰기를 써야 하나요?', '웹 프로젝트는 2칸이 흔하고, 4칸은 읽기 쉬우며, 탭은 프로젝트에서 요구할 때 유용합니다.']],
    privacyTitle: '개인정보 처리방침', privacy: '붙여넣은 JSON을 수집, 저장, 업로드 또는 전송하지 않습니다. 파일 선택기로 연 파일은 브라우저에서 로컬로 읽힙니다.',
    termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 시스템에 사용하기 전에 포맷된 JSON을 반드시 검토하세요.',
  },
  es: {
    title: 'Formateador JSON - Formatea, valida y minifica JSON | ConvertUnlimited',
    description: 'Formatea, valida, embellece y minifica JSON localmente en tu navegador. Herramienta JSON gratis con Unicode, copiar, descargar y sin subidas.',
    hero: 'Formateador JSON', sub: 'Formatea, valida y minifica JSON localmente en tu navegador.',
    eyebrow: 'Herramienta local para desarrolladores', panelTitle: 'Pega JSON y límpialo.',
    panelText: 'Embellece objetos anidados, minifica payloads y valida JSON sin subir datos a un servidor.',
    input: 'Entrada JSON', output: 'Salida formateada', indent: 'Indentación', upload: 'Abrir archivo .json',
    format: 'Formatear', minify: 'Minificar', validate: 'Validar', copy: 'Copiar salida', clear: 'Limpiar', sample: 'JSON de ejemplo', download: 'Descargar JSON',
    count: 'Caracteres de entrada', error: 'Mensaje de validación',
    trustTitle: 'Privado por diseño', trustOne: '<b>Procesamiento local.</b> El JSON se analiza en tu navegador.', trustTwo: '<b>Sin subidas.</b> Los datos no se envían a un servidor.',
    articleTitle: '¿Cuándo formatear JSON?', articleP1: 'El JSON formateado es más fácil de inspeccionar, depurar, revisar y compartir. El JSON minificado sirve para payloads de API, ejemplos o configuración.',
    articleP2: 'Esta herramienta valida JSON estricto. No repara JSON inválido ni acepta comentarios, comas finales o claves sin comillas.',
    faqTitle: 'Preguntas frecuentes',
    faq: [['¿Este formateador JSON es gratis?', 'Sí. Puedes formatear, validar, minificar, copiar y descargar JSON sin registro.'], ['¿Mi JSON se sube?', 'No. El análisis y el formato se ejecutan localmente en tu navegador.'], ['¿Soporta Unicode y emojis?', 'Sí. JSON.parse y JSON.stringify conservan cadenas Unicode y emojis válidos.'], ['¿Puede arreglar JSON inválido?', 'No. Valida JSON estricto y muestra un error para que lo corrijas manualmente.'], ['¿Qué indentación debería usar?', 'Dos espacios es común en web, cuatro es más legible y tabs sirve cuando el proyecto lo exige.']],
    privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos el JSON que pegas. Los archivos abiertos se leen localmente en el navegador.',
    termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa siempre el JSON formateado antes de usarlo en producción.',
  },
  fr: {
    title: 'Formateur JSON - Formater, valider et minifier JSON | ConvertUnlimited',
    description: 'Formatez, validez, embellissez et minifiez du JSON localement dans votre navigateur. Outil JSON gratuit avec Unicode, copie, téléchargement et sans envoi.',
    hero: 'Formateur JSON', sub: 'Formatez, validez et minifiez du JSON localement dans votre navigateur.',
    eyebrow: 'Outil développeur local', panelTitle: 'Collez du JSON et nettoyez-le.',
    panelText: 'Rendez les objets imbriqués lisibles, minifiez les payloads et validez le JSON sans envoyer de données à un serveur.',
    input: 'Entrée JSON', output: 'Sortie formatée', indent: 'Indentation', upload: 'Ouvrir un fichier .json',
    format: 'Formater', minify: 'Minifier', validate: 'Valider', copy: 'Copier la sortie', clear: 'Effacer', sample: 'JSON exemple', download: 'Télécharger JSON',
    count: 'Caractères en entrée', error: 'Message de validation',
    trustTitle: 'Privé par conception', trustOne: '<b>Traitement local.</b> Le JSON est analysé dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Les données ne sont pas envoyées à un serveur.',
    articleTitle: 'Quand formater du JSON ?', articleP1: 'Le JSON formaté est plus simple à inspecter, déboguer, relire et partager. Le JSON minifié est utile pour payloads d’API, exemples ou fichiers de configuration.',
    articleP2: 'Cet outil valide du JSON strict. Il ne répare pas le JSON invalide et n’accepte pas les commentaires, virgules finales ou clés sans guillemets.',
    faqTitle: 'Foire aux questions',
    faq: [['Ce formateur JSON est-il gratuit ?', 'Oui. Vous pouvez formater, valider, minifier, copier et télécharger du JSON sans inscription.'], ['Mon JSON est-il envoyé ?', 'Non. L’analyse et le formatage s’exécutent localement dans votre navigateur.'], ['Prend-il en charge Unicode et les emojis ?', 'Oui. JSON.parse et JSON.stringify conservent les chaînes Unicode et emojis valides.'], ['Peut-il réparer un JSON invalide ?', 'Non. Il valide du JSON strict et affiche une erreur pour correction manuelle.'], ['Quelle indentation utiliser ?', 'Deux espaces sont courants sur le web, quatre sont plus lisibles, et les tabs sont utiles si votre projet les exige.']],
    privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni ne transmettons le JSON collé. Les fichiers ouverts sont lus localement dans le navigateur.',
    termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Relisez toujours le JSON formaté avant de l’utiliser en production.',
  },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/json-formatter/`;
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
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'json-formatter')}" aria-current="page">JSON Formatter</a><div class="dropdown-section">SEO Tools</div><a href="${link(locale, 'meta-preview-checker')}">Meta Preview Checker</a><a href="${link(locale, 'qr-generator')}">QR Generator</a></div></details>
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
                                <label class="range-field" for="json-input"><span>${esc(t.input)}</span><textarea id="json-input" rows="14" spellcheck="false" class="mono" style="width:100%;resize:vertical;" placeholder='{"hello":"world"}'></textarea></label>
                                <label class="range-field" for="json-indent"><span>${esc(t.indent)}</span><select id="json-indent"><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tabs</option></select></label>
                                <label class="range-field" for="json-file"><span>${esc(t.upload)}</span><input id="json-file" type="file" accept=".json,application/json"></label>
                                <button class="btn btn-accent" id="json-format" type="button">${esc(t.format)}</button>
                                <button class="btn btn-ghost" id="json-minify" type="button">${esc(t.minify)}</button>
                                <button class="btn btn-ghost" id="json-validate" type="button">${esc(t.validate)}</button>
                                <button class="btn btn-ghost" id="json-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="json-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.count)}:</b> <span id="json-count" class="mono num">0</span></p>
                            <p class="bg-status" id="json-status"></p>
                            <p class="bg-status" id="json-error" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="json-output"><span>${esc(t.output)}</span><textarea id="json-output" rows="18" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="json-copy" type="button">${esc(t.copy)}</button><button class="btn btn-ghost" id="json-download" type="button">${esc(t.download)}</button></div>
                        </div>
                    </div>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_JSON_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_JSON_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
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
    <script src="/json-formatter/json-formatter.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'json-formatter');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized JSON formatter pages');
