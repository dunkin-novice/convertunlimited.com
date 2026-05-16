const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'JSON to CSV Converter - Convert JSON into CSV Online | ConvertUnlimited',
    description: 'Convert JSON to CSV locally in your browser. Paste or open JSON, flatten nested fields, preview CSV, copy, and download without uploads.',
    hero: 'JSON to CSV Converter', sub: 'Convert API and structured JSON data into spreadsheet-friendly CSV.',
    eyebrow: 'Local developer data tool', panelTitle: 'Paste JSON and convert it to CSV.',
    panelText: 'Turn arrays of objects into CSV, flatten nested fields with dot notation, and download with selected inputs processed locally in your browser.',
    input: 'JSON input', output: 'CSV output', delimiter: 'Delimiter', upload: 'Open .json file', headers: 'Include header row', convert: 'Convert to CSV', copy: 'Copy CSV', clear: 'Clear', sample: 'Sample JSON', download: 'Download CSV',
    comma: 'Comma', semicolon: 'Semicolon', tab: 'Tab', rows: 'Rows', fields: 'Fields', size: 'Input size',
    trustTitle: 'Private by design', trustOne: '<b>Local conversion.</b> JSON parsing and CSV generation run in your browser.', trustTwo: '<b>Local processing.</b> Files opened here are processed locally in your browser.',
    articleTitle: 'When should you convert JSON to CSV?', articleP1: 'JSON is common in APIs and developer tools, while CSV is easier to inspect in spreadsheet apps and data-cleaning workflows.',
    articleP2: 'This converter supports JSON objects and arrays of objects. Nested objects are flattened with dot notation so nested data is visible instead of silently discarded.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      ['Is this JSON to CSV Converter free?', 'Yes. You can paste, convert, copy, and download CSV without signup.'],
      ['Are JSON files uploaded?', 'No. JSON files are read and converted locally in your browser.'],
      ['What JSON shape works best?', 'Arrays of objects work best. A single object is converted into one CSV row.'],
      ['How are nested objects handled?', 'Nested keys are flattened with dot notation, such as profile.name.'],
      ['Does it support Unicode?', 'Yes. UTF-8 text, accents, Asian scripts, and emojis are preserved in CSV output.'],
    ],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this JSON to CSV conversion flow. Selected JSON files are processed locally in your browser.',
    termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Review generated CSV before using it in production systems.',
  },
  th: {
    title: 'ตัวแปลง JSON เป็น CSV - แปลง JSON เป็น CSV ออนไลน์ | ConvertUnlimited',
    description: 'แปลง JSON เป็น CSV ในเบราว์เซอร์ วางหรือเปิดไฟล์ JSON flatten ฟิลด์ซ้อน คัดลอก และดาวน์โหลดโดยไม่อัปโหลด',
    hero: 'ตัวแปลง JSON เป็น CSV', sub: 'แปลงข้อมูล JSON จาก API เป็น CSV ที่เปิดในสเปรดชีตได้ง่าย',
    eyebrow: 'เครื่องมือข้อมูลในเครื่อง', panelTitle: 'วาง JSON แล้วแปลงเป็น CSV',
    panelText: 'แปลง array ของ object เป็น CSV และ flatten ฟิลด์ซ้อนด้วย dot notation โดยไม่ส่งข้อมูลไปเซิร์ฟเวอร์',
    input: 'JSON ขาเข้า', output: 'CSV ขาออก', delimiter: 'ตัวคั่น', upload: 'เปิดไฟล์ .json', headers: 'ใส่แถวหัวตาราง', convert: 'แปลงเป็น CSV', copy: 'คัดลอก CSV', clear: 'ล้าง', sample: 'JSON ตัวอย่าง', download: 'ดาวน์โหลด CSV',
    comma: 'คอมมา', semicolon: 'เซมิโคลอน', tab: 'แท็บ', rows: 'แถว', fields: 'ฟิลด์', size: 'ขนาดขาเข้า',
    trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>แปลงในเครื่อง</b> การอ่าน JSON และสร้าง CSV ทำในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ไฟล์อยู่บนอุปกรณ์ของคุณ',
    articleTitle: 'ควรแปลง JSON เป็น CSV เมื่อใด?', articleP1: 'JSON ใช้บ่อยใน API และงานพัฒนา ส่วน CSV ตรวจสอบและทำความสะอาดในสเปรดชีตได้ง่ายกว่า',
    articleP2: 'รองรับ JSON object และ array ของ object ค่าซ้อนจะถูก flatten ด้วย dot notation เพื่อไม่ให้ข้อมูลหายเงียบๆ',
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี วาง แปลง คัดลอก และดาวน์โหลด CSV ได้โดยไม่ต้องสมัคร'], ['ไฟล์ JSON ถูกอัปโหลดไหม?', 'ไม่ ไฟล์ถูกอ่านและแปลงในเบราว์เซอร์'], ['JSON แบบไหนเหมาะที่สุด?', 'array ของ object เหมาะที่สุด ส่วน object เดี่ยวจะแปลงเป็นหนึ่งแถว'], ['ข้อมูลซ้อนจัดการอย่างไร?', 'คีย์ซ้อนถูก flatten เป็น dot notation เช่น profile.name'], ['รองรับ Unicode ไหม?', 'รองรับข้อความ UTF-8 ภาษาเอเชีย เครื่องหมาย และอีโมจิ']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่งข้อมูล JSON หรือ CSV การเลือกไฟล์อ่านเฉพาะในเบราว์เซอร์',
    termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจ CSV ที่สร้างแล้วก่อนใช้ในระบบจริง',
  },
  vi: {
    title: 'Trình chuyển JSON sang CSV - Chuyển JSON thành CSV | ConvertUnlimited',
    description: 'Chuyển JSON sang CSV trong trình duyệt. Dán hoặc mở JSON, làm phẳng trường lồng nhau, sao chép và tải CSV không cần upload.',
    hero: 'Trình chuyển JSON sang CSV', sub: 'Chuyển dữ liệu JSON từ API thành CSV thân thiện với bảng tính.',
    eyebrow: 'Công cụ dữ liệu cục bộ', panelTitle: 'Dán JSON và chuyển thành CSV.',
    panelText: 'Chuyển mảng object thành CSV, làm phẳng trường lồng nhau bằng dot notation và tải xuống không gửi dữ liệu lên máy chủ.',
    input: 'JSON đầu vào', output: 'CSV đầu ra', delimiter: 'Dấu phân tách', upload: 'Mở tệp .json', headers: 'Gồm dòng tiêu đề', convert: 'Chuyển sang CSV', copy: 'Sao chép CSV', clear: 'Xóa', sample: 'JSON mẫu', download: 'Tải CSV',
    comma: 'Dấu phẩy', semicolon: 'Chấm phẩy', tab: 'Tab', rows: 'Dòng', fields: 'Trường', size: 'Kích thước đầu vào',
    trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Chuyển đổi cục bộ.</b> Phân tích JSON và tạo CSV chạy trong trình duyệt.', trustTwo: '<b>Không upload.</b> Tệp ở lại trên thiết bị.',
    articleTitle: 'Khi nào nên chuyển JSON sang CSV?', articleP1: 'JSON phổ biến trong API và công cụ lập trình, còn CSV dễ xem trong ứng dụng bảng tính và quy trình làm sạch dữ liệu.',
    articleP2: 'Công cụ hỗ trợ object JSON và mảng object. Object lồng nhau được làm phẳng bằng dot notation để dữ liệu không bị mất âm thầm.',
    faqTitle: 'Câu hỏi thường gặp',
    faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể dán, chuyển đổi, sao chép và tải CSV không cần đăng ký.'], ['JSON có được upload không?', 'Không. JSON được đọc và chuyển đổi cục bộ trong trình duyệt.'], ['Dạng JSON nào tốt nhất?', 'Mảng object là tốt nhất. Một object đơn được chuyển thành một dòng CSV.'], ['Object lồng nhau xử lý thế nào?', 'Khóa lồng nhau được làm phẳng bằng dot notation, ví dụ profile.name.'], ['Có hỗ trợ Unicode không?', 'Có. Văn bản UTF-8, dấu, chữ châu Á và emoji được giữ trong CSV.']],
    privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền dữ liệu JSON hay CSV. Tệp được đọc cục bộ trong trình duyệt.',
    termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy kiểm tra CSV trước khi dùng trong hệ thống production.',
  },
  zh: {
    title: 'JSON 转 CSV 工具 - 在线转换 JSON 为 CSV | ConvertUnlimited',
    description: '在浏览器中将 JSON 转为 CSV。粘贴或打开 JSON，展开嵌套字段，复制并下载 CSV，无需上传。',
    hero: 'JSON 转 CSV 工具', sub: '把 API 和结构化 JSON 数据转换为适合电子表格的 CSV。',
    eyebrow: '本地开发数据工具', panelTitle: '粘贴 JSON 并转换为 CSV。',
    panelText: '将对象数组转换为 CSV，使用点号路径展开嵌套字段，无需发送到服务器。',
    input: 'JSON 输入', output: 'CSV 输出', delimiter: '分隔符', upload: '打开 .json 文件', headers: '包含标题行', convert: '转换为 CSV', copy: '复制 CSV', clear: '清空', sample: '示例 JSON', download: '下载 CSV',
    comma: '逗号', semicolon: '分号', tab: '制表符', rows: '行', fields: '字段', size: '输入大小',
    trustTitle: '隐私优先设计', trustOne: '<b>本地转换。</b> JSON 解析和 CSV 生成在浏览器中运行。', trustTwo: '<b>无需上传。</b> 文件留在你的设备上。',
    articleTitle: '什么时候需要把 JSON 转为 CSV？', articleP1: 'JSON 常用于 API 和开发工具，而 CSV 更适合在电子表格和数据清理流程中查看。',
    articleP2: '本工具支持 JSON 对象和对象数组。嵌套对象会用点号路径展开，避免嵌套数据被静默丢弃。',
    faqTitle: '常见问题',
    faq: [['这个 JSON 转 CSV 工具免费吗？', '免费。无需注册即可粘贴、转换、复制和下载 CSV。'], ['JSON 文件会上传吗？', '不会。JSON 会在浏览器本地读取和转换。'], ['哪种 JSON 结构最适合？', '对象数组最适合。单个对象会转换为一行 CSV。'], ['嵌套对象如何处理？', '嵌套键会使用点号路径展开，例如 profile.name。'], ['支持 Unicode 吗？', '支持。CSV 输出会保留 UTF-8、重音、亚洲文字和 emoji。']],
    privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输 JSON 或 CSV 数据。通过文件选择器打开的文件只在浏览器中读取。',
    termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产系统使用前请检查生成的 CSV。',
  },
  ja: {
    title: 'JSON to CSV コンバーター - JSON を CSV に変換 | ConvertUnlimited',
    description: 'ブラウザ内で JSON を CSV に変換。JSON を貼り付け/開く、ネスト項目をフラット化、コピーとダウンロード。アップロード不要。',
    hero: 'JSON to CSV コンバーター', sub: 'API や構造化 JSON データを表計算向け CSV に変換します。',
    eyebrow: 'ローカル開発データツール', panelTitle: 'JSON を貼り付けて CSV に変換。',
    panelText: 'オブジェクト配列を CSV に変換し、ネスト項目をドット記法でフラット化して、サーバーへ送信せずにダウンロードできます。',
    input: 'JSON 入力', output: 'CSV 出力', delimiter: '区切り文字', upload: '.json ファイルを開く', headers: 'ヘッダー行を含める', convert: 'CSV に変換', copy: 'CSV をコピー', clear: 'クリア', sample: 'サンプル JSON', download: 'CSV をダウンロード',
    comma: 'カンマ', semicolon: 'セミコロン', tab: 'タブ', rows: '行', fields: 'フィールド', size: '入力サイズ',
    trustTitle: 'プライバシー重視', trustOne: '<b>ローカル変換。</b> JSON 解析と CSV 生成はブラウザ内で行われます。', trustTwo: '<b>アップロードなし。</b> ファイルは端末内に留まります。',
    articleTitle: 'JSON を CSV に変換する場面', articleP1: 'JSON は API や開発ツールで一般的ですが、CSV は表計算アプリやデータ整理で確認しやすい形式です。',
    articleP2: 'JSON オブジェクトとオブジェクト配列に対応します。ネストしたオブジェクトはドット記法でフラット化し、データを失わないようにします。',
    faqTitle: 'よくある質問',
    faq: [['この JSON to CSV コンバーターは無料ですか？', 'はい。登録なしで貼り付け、変換、コピー、ダウンロードできます。'], ['JSON はアップロードされますか？', 'いいえ。JSON はブラウザ内でローカルに読み込まれ変換されます。'], ['どんな JSON が最適ですか？', 'オブジェクト配列が最適です。単一オブジェクトは 1 行の CSV になります。'], ['ネストしたオブジェクトは？', 'profile.name のようなドット記法でフラット化します。'], ['Unicode に対応していますか？', 'はい。UTF-8、アクセント、アジア言語、絵文字を CSV 出力に保持します。']],
    privacyTitle: 'プライバシーポリシー', privacy: 'JSON や CSV データを収集、保存、アップロード、送信しません。選択したファイルはブラウザ内でのみ読み込まれます。',
    termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番システムで使う前に生成された CSV を確認してください。',
  },
  ko: {
    title: 'JSON to CSV 변환기 - JSON을 CSV로 변환 | ConvertUnlimited',
    description: '브라우저에서 JSON을 CSV로 변환하세요. JSON을 붙여넣거나 열고 중첩 필드를 펼치며 CSV를 복사/다운로드합니다.',
    hero: 'JSON to CSV 변환기', sub: 'API와 구조화된 JSON 데이터를 스프레드시트용 CSV로 변환합니다.',
    eyebrow: '로컬 개발 데이터 도구', panelTitle: 'JSON을 붙여넣고 CSV로 변환하세요.',
    panelText: '객체 배열을 CSV로 변환하고 중첩 필드를 점 표기법으로 펼치며 서버로 보내지 않고 다운로드합니다.',
    input: 'JSON 입력', output: 'CSV 출력', delimiter: '구분자', upload: '.json 파일 열기', headers: '헤더 행 포함', convert: 'CSV로 변환', copy: 'CSV 복사', clear: '지우기', sample: '샘플 JSON', download: 'CSV 다운로드',
    comma: '쉼표', semicolon: '세미콜론', tab: '탭', rows: '행', fields: '필드', size: '입력 크기',
    trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 변환.</b> JSON 파싱과 CSV 생성은 브라우저에서 실행됩니다.', trustTwo: '<b>업로드 없음.</b> 파일은 기기에 남아 있습니다.',
    articleTitle: '언제 JSON을 CSV로 변환하나요?', articleP1: 'JSON은 API와 개발 도구에서 흔하고, CSV는 스프레드시트와 데이터 정리 흐름에서 확인하기 쉽습니다.',
    articleP2: 'JSON 객체와 객체 배열을 지원합니다. 중첩 객체는 점 표기법으로 펼쳐 중첩 데이터가 사라지지 않게 합니다.',
    faqTitle: '자주 묻는 질문',
    faq: [['이 JSON to CSV 변환기는 무료인가요?', '네. 가입 없이 붙여넣기, 변환, 복사, 다운로드할 수 있습니다.'], ['JSON 파일이 업로드되나요?', '아니요. JSON은 브라우저에서 로컬로 읽고 변환됩니다.'], ['어떤 JSON 형태가 가장 좋나요?', '객체 배열이 가장 좋습니다. 단일 객체는 CSV 한 행으로 변환됩니다.'], ['중첩 객체는 어떻게 처리되나요?', 'profile.name 같은 점 표기법으로 펼칩니다.'], ['Unicode를 지원하나요?', '네. UTF-8, 악센트, 아시아 문자, 이모지를 CSV 출력에 보존합니다.']],
    privacyTitle: '개인정보 처리방침', privacy: 'JSON 또는 CSV 데이터를 수집, 저장, 업로드 또는 전송하지 않습니다. 선택한 파일은 브라우저에서만 읽힙니다.',
    termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 시스템에서 사용하기 전에 생성된 CSV를 검토하세요.',
  },
  es: {
    title: 'Convertidor JSON a CSV - Convierte JSON en CSV | ConvertUnlimited',
    description: 'Convierte JSON a CSV en tu navegador. Pega o abre JSON, aplana campos anidados, copia y descarga CSV sin subidas.',
    hero: 'Convertidor JSON a CSV', sub: 'Convierte datos JSON de APIs en CSV apto para hojas de cálculo.',
    eyebrow: 'Herramienta local de datos', panelTitle: 'Pega JSON y conviértelo en CSV.',
    panelText: 'Convierte arrays de objetos en CSV, aplana campos anidados con notación de puntos y descarga sin enviar datos a un servidor.',
    input: 'Entrada JSON', output: 'Salida CSV', delimiter: 'Delimitador', upload: 'Abrir archivo .json', headers: 'Incluir encabezados', convert: 'Convertir a CSV', copy: 'Copiar CSV', clear: 'Limpiar', sample: 'JSON de ejemplo', download: 'Descargar CSV',
    comma: 'Coma', semicolon: 'Punto y coma', tab: 'Tab', rows: 'Filas', fields: 'Campos', size: 'Tamaño de entrada',
    trustTitle: 'Privado por diseño', trustOne: '<b>Conversión local.</b> El JSON se analiza y el CSV se genera en tu navegador.', trustTwo: '<b>Sin subidas.</b> Los archivos permanecen en tu dispositivo.',
    articleTitle: '¿Cuándo convertir JSON a CSV?', articleP1: 'JSON es común en APIs y herramientas de desarrollo, mientras que CSV es más fácil de revisar en hojas de cálculo y flujos de limpieza de datos.',
    articleP2: 'El convertidor admite objetos JSON y arrays de objetos. Los objetos anidados se aplanan con notación de puntos para no perder datos.',
    faqTitle: 'Preguntas frecuentes',
    faq: [['¿Este convertidor JSON a CSV es gratis?', 'Sí. Puedes pegar, convertir, copiar y descargar CSV sin registro.'], ['¿Los JSON se suben?', 'No. Los JSON se leen y convierten localmente en tu navegador.'], ['¿Qué forma de JSON funciona mejor?', 'Los arrays de objetos funcionan mejor. Un objeto único se convierte en una fila CSV.'], ['¿Cómo maneja objetos anidados?', 'Las claves anidadas se aplanan con notación de puntos, como profile.name.'], ['¿Soporta Unicode?', 'Sí. Conserva texto UTF-8, acentos, escrituras asiáticas y emojis en el CSV.']],
    privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos datos JSON o CSV. Los archivos se leen localmente en el navegador.',
    termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa el CSV generado antes de usarlo en sistemas de producción.',
  },
  fr: {
    title: 'Convertisseur JSON vers CSV - Convertir JSON en CSV | ConvertUnlimited',
    description: 'Convertissez JSON en CSV dans votre navigateur. Collez ou ouvrez du JSON, aplatissez les champs imbriqués, copiez et téléchargez sans envoi.',
    hero: 'Convertisseur JSON vers CSV', sub: 'Transformez des données JSON d’API en CSV compatible tableur.',
    eyebrow: 'Outil local de données', panelTitle: 'Collez du JSON et convertissez-le en CSV.',
    panelText: 'Convertissez des tableaux d’objets en CSV, aplatissez les champs imbriqués avec la notation pointée et téléchargez sans serveur.',
    input: 'Entrée JSON', output: 'Sortie CSV', delimiter: 'Délimiteur', upload: 'Ouvrir un fichier .json', headers: 'Inclure l’en-tête', convert: 'Convertir en CSV', copy: 'Copier CSV', clear: 'Effacer', sample: 'JSON exemple', download: 'Télécharger CSV',
    comma: 'Virgule', semicolon: 'Point-virgule', tab: 'Tabulation', rows: 'Lignes', fields: 'Champs', size: 'Taille entrée',
    trustTitle: 'Privé par conception', trustOne: '<b>Conversion locale.</b> Le JSON est analysé et le CSV généré dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Les fichiers restent sur votre appareil.',
    articleTitle: 'Quand convertir JSON en CSV ?', articleP1: 'JSON est fréquent dans les API et outils développeur, tandis que CSV est plus facile à relire dans les tableurs et workflows de nettoyage.',
    articleP2: 'Le convertisseur prend en charge les objets JSON et tableaux d’objets. Les objets imbriqués sont aplatis avec la notation pointée pour éviter de perdre des données.',
    faqTitle: 'Foire aux questions',
    faq: [['Ce convertisseur JSON vers CSV est-il gratuit ?', 'Oui. Vous pouvez coller, convertir, copier et télécharger du CSV sans inscription.'], ['Les fichiers JSON sont-ils envoyés ?', 'Non. Ils sont lus et convertis localement dans votre navigateur.'], ['Quelle structure JSON fonctionne le mieux ?', 'Les tableaux d’objets fonctionnent le mieux. Un objet seul devient une ligne CSV.'], ['Comment gérer les objets imbriqués ?', 'Les clés imbriquées sont aplaties avec la notation pointée, par exemple profile.name.'], ['Unicode est-il pris en charge ?', 'Oui. Le texte UTF-8, accents, écritures asiatiques et emojis sont conservés dans le CSV.']],
    privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons les données JSON ou CSV. Les fichiers sont lus localement dans le navigateur.',
    termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Relisez le CSV généré avant de l’utiliser dans des systèmes de production.',
  },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/json-to-csv/`;
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
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-98HSCSEKBX"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-98HSCSEKBX');</script>
</head>
<body>
    <div class="app">
        <header class="topbar">
            <a href="${home(locale)}" class="brand" aria-label="ConvertUnlimited home"><span class="mark" aria-hidden="true"></span><span class="word"><b>Convert</b><span>Unlimited</span></span></a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>100% free, no signup</span>
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'csv-cleaner')}">CSV Cleaner</a><a href="${link(locale, 'csv-to-json')}">CSV to JSON</a><a href="${link(locale, 'json-to-csv')}" aria-current="page">JSON to CSV</a><a href="${link(locale, 'json-formatter')}">JSON Formatter</a></div></details>
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
                                <label class="range-field" for="jsoncsv-input"><span>${esc(t.input)}</span><textarea id="jsoncsv-input" rows="14" spellcheck="false" class="mono" style="width:100%;resize:vertical;" placeholder='[{"name":"Alice","city":"Bangkok"}]'></textarea></label>
                                <label class="range-field" for="jsoncsv-delimiter"><span>${esc(t.delimiter)}</span><select id="jsoncsv-delimiter"><option value=",">${esc(t.comma)}</option><option value=";">${esc(t.semicolon)}</option><option value="tab">${esc(t.tab)}</option></select></label>
                                <label class="range-field" for="jsoncsv-headers"><span>${esc(t.headers)}</span><input id="jsoncsv-headers" type="checkbox" checked></label>
                                <label class="range-field" for="jsoncsv-file"><span>${esc(t.upload)}</span><input id="jsoncsv-file" type="file" accept=".json,application/json"></label>
                                <button class="btn btn-accent" id="jsoncsv-convert" type="button">${esc(t.convert)}</button>
                                <button class="btn btn-ghost" id="jsoncsv-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="jsoncsv-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.rows)}:</b> <span id="jsoncsv-row-count" class="mono num">0</span> · <b>${esc(t.fields)}:</b> <span id="jsoncsv-field-count" class="mono num">0</span> · <b>${esc(t.size)}:</b> <span id="jsoncsv-file-size" class="mono num">0 B</span></p>
                            <p class="bg-status" id="jsoncsv-status"></p>
                            <p class="bg-status" id="jsoncsv-warning" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="jsoncsv-output"><span>${esc(t.output)}</span><textarea id="jsoncsv-output" rows="18" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="jsoncsv-copy" type="button">${esc(t.copy)}</button><button class="btn btn-ghost" id="jsoncsv-download" type="button">${esc(t.download)}</button></div>
                        </div>
                    </div>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_JSON_CSV_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_JSON_CSV_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
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
    <script src="/json-to-csv/json-to-csv.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'json-to-csv');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized JSON to CSV pages');
