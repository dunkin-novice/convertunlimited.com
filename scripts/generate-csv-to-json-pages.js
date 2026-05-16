const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'CSV to JSON Converter - Convert CSV into JSON Online | ConvertUnlimited',
    description: 'Convert CSV to JSON locally in your browser. Paste or open a CSV file, use headers as keys, preview JSON, copy, and download without uploads.',
    hero: 'CSV to JSON Converter', sub: 'Convert spreadsheet exports into JSON data locally in your browser.',
    eyebrow: 'Local developer data tool', panelTitle: 'Paste CSV and convert it to JSON.',
    panelText: 'Use the first row as headers, preserve Unicode, and download structured JSON with selected inputs processed locally in your browser.',
    input: 'CSV input', output: 'JSON output', delimiter: 'Delimiter', upload: 'Open .csv file', indent: 'Output style', convert: 'Convert to JSON', copy: 'Copy JSON', clear: 'Clear', sample: 'Sample CSV', download: 'Download JSON',
    comma: 'Comma', semicolon: 'Semicolon', tab: 'Tab', pretty2: 'Pretty, 2 spaces', pretty4: 'Pretty, 4 spaces', tabs: 'Tabs', compact: 'Compact', rows: 'Rows', fields: 'Fields', size: 'Input size',
    trustTitle: 'Private by design', trustOne: '<b>Local conversion.</b> CSV parsing and JSON generation run in your browser.', trustTwo: '<b>Local processing.</b> Files opened here are processed locally in your browser.',
    articleTitle: 'When should you convert CSV to JSON?', articleP1: 'CSV is convenient for spreadsheet exports, while JSON is easier to use in APIs, configuration, frontend prototypes, and developer workflows.',
    articleP2: 'This converter treats the first CSV row as field names. If duplicate headers are found, it warns you and keeps values with numbered keys instead of silently overwriting data.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      ['Is this CSV to JSON Converter free?', 'Yes. You can paste, convert, copy, and download JSON without signup.'],
      ['Are CSV files uploaded?', 'No. CSV files are read and converted locally in your browser.'],
      ['How are JSON keys created?', 'The first CSV row is used as the header row, and each following row becomes a JSON object.'],
      ['What happens with duplicate headers?', 'The tool shows a warning and adds numbered keys so values are not silently overwritten.'],
      ['Does it support Unicode?', 'Yes. UTF-8 text, accents, Asian scripts, and emojis are preserved in valid CSV fields.'],
    ],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this CSV to JSON conversion flow. Selected CSV files are processed locally in your browser.',
    termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Review generated JSON before using it in production systems.',
  },
  th: {
    title: 'ตัวแปลง CSV เป็น JSON - แปลง CSV เป็น JSON ออนไลน์ | ConvertUnlimited',
    description: 'แปลง CSV เป็น JSON ในเบราว์เซอร์ วางหรือเปิดไฟล์ CSV ใช้แถวแรกเป็นคีย์ คัดลอก และดาวน์โหลดโดยไม่อัปโหลด',
    hero: 'ตัวแปลง CSV เป็น JSON', sub: 'แปลงไฟล์ส่งออกจากสเปรดชีตเป็น JSON ในเบราว์เซอร์',
    eyebrow: 'เครื่องมือข้อมูลในเครื่อง', panelTitle: 'วาง CSV แล้วแปลงเป็น JSON',
    panelText: 'ใช้แถวแรกเป็นหัวตาราง รักษา Unicode และดาวน์โหลด JSON โดยไม่ส่งข้อมูลไปเซิร์ฟเวอร์',
    input: 'CSV ขาเข้า', output: 'JSON ขาออก', delimiter: 'ตัวคั่น', upload: 'เปิดไฟล์ .csv', indent: 'รูปแบบผลลัพธ์', convert: 'แปลงเป็น JSON', copy: 'คัดลอก JSON', clear: 'ล้าง', sample: 'CSV ตัวอย่าง', download: 'ดาวน์โหลด JSON',
    comma: 'คอมมา', semicolon: 'เซมิโคลอน', tab: 'แท็บ', pretty2: 'อ่านง่าย 2 ช่องว่าง', pretty4: 'อ่านง่าย 4 ช่องว่าง', tabs: 'แท็บ', compact: 'กะทัดรัด', rows: 'แถว', fields: 'ฟิลด์', size: 'ขนาดขาเข้า',
    trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>แปลงในเครื่อง</b> การอ่าน CSV และสร้าง JSON ทำในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ไฟล์อยู่บนอุปกรณ์ของคุณ',
    articleTitle: 'ควรแปลง CSV เป็น JSON เมื่อใด?', articleP1: 'CSV เหมาะกับการส่งออกจากสเปรดชีต ส่วน JSON ใช้งานง่ายกับ API การตั้งค่า และงานพัฒนา',
    articleP2: 'เครื่องมือนี้ใช้แถวแรกเป็นชื่อฟิลด์ หากมีหัวตารางซ้ำจะแจ้งเตือนและเก็บค่าด้วยคีย์แบบมีหมายเลขแทนการเขียนทับเงียบๆ',
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี วาง แปลง คัดลอก และดาวน์โหลด JSON ได้โดยไม่ต้องสมัคร'], ['ไฟล์ CSV ถูกอัปโหลดไหม?', 'ไม่ ไฟล์ถูกอ่านและแปลงในเบราว์เซอร์'], ['คีย์ JSON สร้างอย่างไร?', 'ใช้แถวแรกของ CSV เป็นหัวตาราง และแต่ละแถวถัดไปเป็นออบเจกต์ JSON'], ['ถ้าหัวตารางซ้ำจะเกิดอะไร?', 'เครื่องมือจะแจ้งเตือนและเพิ่มหมายเลขให้คีย์เพื่อไม่ให้ค่าถูกเขียนทับ'], ['รองรับ Unicode ไหม?', 'รองรับข้อความ UTF-8 ภาษาเอเชีย เครื่องหมาย และอีโมจิในช่อง CSV ที่ถูกต้อง']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่งข้อมูล CSV หรือ JSON การเลือกไฟล์อ่านเฉพาะในเบราว์เซอร์',
    termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจ JSON ที่สร้างแล้วก่อนใช้ในระบบจริง',
  },
  vi: {
    title: 'Trình chuyển CSV sang JSON - Chuyển CSV thành JSON | ConvertUnlimited',
    description: 'Chuyển CSV sang JSON trong trình duyệt. Dán hoặc mở tệp CSV, dùng dòng đầu làm khóa, sao chép và tải JSON không cần upload.',
    hero: 'Trình chuyển CSV sang JSON', sub: 'Chuyển dữ liệu xuất từ bảng tính thành JSON ngay trong trình duyệt.',
    eyebrow: 'Công cụ dữ liệu cục bộ', panelTitle: 'Dán CSV và chuyển thành JSON.',
    panelText: 'Dùng dòng đầu làm tiêu đề, giữ Unicode và tải JSON có cấu trúc mà không gửi dữ liệu lên máy chủ.',
    input: 'CSV đầu vào', output: 'JSON đầu ra', delimiter: 'Dấu phân tách', upload: 'Mở tệp .csv', indent: 'Kiểu đầu ra', convert: 'Chuyển sang JSON', copy: 'Sao chép JSON', clear: 'Xóa', sample: 'CSV mẫu', download: 'Tải JSON',
    comma: 'Dấu phẩy', semicolon: 'Chấm phẩy', tab: 'Tab', pretty2: 'Đẹp, 2 khoảng trắng', pretty4: 'Đẹp, 4 khoảng trắng', tabs: 'Tab', compact: 'Gọn', rows: 'Dòng', fields: 'Trường', size: 'Kích thước đầu vào',
    trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Chuyển đổi cục bộ.</b> Phân tích CSV và tạo JSON chạy trong trình duyệt.', trustTwo: '<b>Không upload.</b> Tệp ở lại trên thiết bị.',
    articleTitle: 'Khi nào nên chuyển CSV sang JSON?', articleP1: 'CSV tiện cho xuất dữ liệu từ bảng tính, còn JSON dễ dùng hơn trong API, cấu hình và workflow lập trình.',
    articleP2: 'Công cụ dùng dòng CSV đầu tiên làm tên trường. Nếu tiêu đề trùng, công cụ cảnh báo và giữ giá trị bằng khóa có số thay vì ghi đè âm thầm.',
    faqTitle: 'Câu hỏi thường gặp',
    faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể dán, chuyển đổi, sao chép và tải JSON không cần đăng ký.'], ['CSV có được upload không?', 'Không. CSV được đọc và chuyển đổi cục bộ trong trình duyệt.'], ['Khóa JSON được tạo thế nào?', 'Dòng đầu của CSV được dùng làm tiêu đề, mỗi dòng sau thành một object JSON.'], ['Tiêu đề trùng thì sao?', 'Công cụ hiển thị cảnh báo và thêm số vào khóa để không mất giá trị.'], ['Có hỗ trợ Unicode không?', 'Có. Văn bản UTF-8, dấu, chữ châu Á và emoji được giữ trong trường CSV hợp lệ.']],
    privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền dữ liệu CSV hay JSON. Tệp được đọc cục bộ trong trình duyệt.',
    termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy kiểm tra JSON trước khi dùng trong hệ thống production.',
  },
  zh: {
    title: 'CSV 转 JSON 工具 - 在线转换 CSV 为 JSON | ConvertUnlimited',
    description: '在浏览器中将 CSV 转为 JSON。粘贴或打开 CSV 文件，用首行作为键，复制并下载 JSON，无需上传。',
    hero: 'CSV 转 JSON 工具', sub: '在浏览器中把电子表格导出转换为 JSON 数据。',
    eyebrow: '本地开发数据工具', panelTitle: '粘贴 CSV 并转换为 JSON。',
    panelText: '使用首行作为标题，保留 Unicode，并在不发送到服务器的情况下下载结构化 JSON。',
    input: 'CSV 输入', output: 'JSON 输出', delimiter: '分隔符', upload: '打开 .csv 文件', indent: '输出样式', convert: '转换为 JSON', copy: '复制 JSON', clear: '清空', sample: '示例 CSV', download: '下载 JSON',
    comma: '逗号', semicolon: '分号', tab: '制表符', pretty2: '美化，2 个空格', pretty4: '美化，4 个空格', tabs: '制表符', compact: '紧凑', rows: '行', fields: '字段', size: '输入大小',
    trustTitle: '隐私优先设计', trustOne: '<b>本地转换。</b> CSV 解析和 JSON 生成在浏览器中运行。', trustTwo: '<b>无需上传。</b> 文件留在你的设备上。',
    articleTitle: '什么时候需要把 CSV 转为 JSON？', articleP1: 'CSV 适合电子表格导出，JSON 更适合 API、配置、前端原型和开发流程。',
    articleP2: '本工具把 CSV 首行作为字段名。如果发现重复标题，会提醒你并用编号键保留值，避免静默覆盖。',
    faqTitle: '常见问题',
    faq: [['这个 CSV 转 JSON 工具免费吗？', '免费。无需注册即可粘贴、转换、复制和下载 JSON。'], ['CSV 文件会上传吗？', '不会。CSV 会在浏览器本地读取和转换。'], ['JSON 键如何创建？', 'CSV 第一行用作标题行，后续每行变成一个 JSON 对象。'], ['重复标题会怎样？', '工具会显示警告并添加编号键，避免值被静默覆盖。'], ['支持 Unicode 吗？', '支持。有效 CSV 字段中的 UTF-8、重音、亚洲文字和 emoji 会保留。']],
    privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输 CSV 或 JSON 数据。通过文件选择器打开的文件只在浏览器中读取。',
    termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。在生产系统使用前请检查生成的 JSON。',
  },
  ja: {
    title: 'CSV to JSON コンバーター - CSV を JSON に変換 | ConvertUnlimited',
    description: 'ブラウザ内で CSV を JSON に変換。CSV ファイルを貼り付け/開く、先頭行をキーに使用、コピーとダウンロード。アップロード不要。',
    hero: 'CSV to JSON コンバーター', sub: 'スプレッドシートのエクスポートをブラウザ内で JSON データに変換します。',
    eyebrow: 'ローカル開発データツール', panelTitle: 'CSV を貼り付けて JSON に変換。',
    panelText: '先頭行をヘッダーとして使い、Unicode を保ち、サーバーへ送信せずに構造化 JSON をダウンロードできます。',
    input: 'CSV 入力', output: 'JSON 出力', delimiter: '区切り文字', upload: '.csv ファイルを開く', indent: '出力形式', convert: 'JSON に変換', copy: 'JSON をコピー', clear: 'クリア', sample: 'サンプル CSV', download: 'JSON をダウンロード',
    comma: 'カンマ', semicolon: 'セミコロン', tab: 'タブ', pretty2: '整形 2 スペース', pretty4: '整形 4 スペース', tabs: 'タブ', compact: '圧縮', rows: '行', fields: 'フィールド', size: '入力サイズ',
    trustTitle: 'プライバシー重視', trustOne: '<b>ローカル変換。</b> CSV 解析と JSON 生成はブラウザ内で行われます。', trustTwo: '<b>アップロードなし。</b> ファイルは端末内に留まります。',
    articleTitle: 'CSV を JSON に変換する場面', articleP1: 'CSV は表計算のエクスポートに便利で、JSON は API、設定、フロントエンド試作、開発ワークフローで扱いやすい形式です。',
    articleP2: 'このツールは CSV の先頭行をフィールド名として扱います。重複ヘッダーがある場合は警告し、値を上書きせず番号付きキーで保持します。',
    faqTitle: 'よくある質問',
    faq: [['この CSV to JSON コンバーターは無料ですか？', 'はい。登録なしで貼り付け、変換、コピー、ダウンロードできます。'], ['CSV はアップロードされますか？', 'いいえ。CSV はブラウザ内でローカルに読み込まれ変換されます。'], ['JSON キーはどう作られますか？', 'CSV の先頭行をヘッダーとして使い、以降の各行を JSON オブジェクトにします。'], ['重複ヘッダーはどうなりますか？', '警告を表示し、値が失われないよう番号付きキーを追加します。'], ['Unicode に対応していますか？', 'はい。有効な CSV フィールド内の UTF-8、アクセント、アジア言語、絵文字を保持します。']],
    privacyTitle: 'プライバシーポリシー', privacy: 'CSV や JSON データを収集、保存、アップロード、送信しません。選択したファイルはブラウザ内でのみ読み込まれます。',
    termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番システムで使う前に生成された JSON を確認してください。',
  },
  ko: {
    title: 'CSV to JSON 변환기 - CSV를 JSON으로 변환 | ConvertUnlimited',
    description: '브라우저에서 CSV를 JSON으로 변환하세요. CSV를 붙여넣거나 열고 첫 행을 키로 사용하며 복사/다운로드할 수 있습니다.',
    hero: 'CSV to JSON 변환기', sub: '스프레드시트 내보내기를 브라우저에서 JSON 데이터로 변환합니다.',
    eyebrow: '로컬 개발 데이터 도구', panelTitle: 'CSV를 붙여넣고 JSON으로 변환하세요.',
    panelText: '첫 행을 헤더로 사용하고 Unicode를 보존하며 데이터를 서버로 보내지 않고 구조화된 JSON을 다운로드합니다.',
    input: 'CSV 입력', output: 'JSON 출력', delimiter: '구분자', upload: '.csv 파일 열기', indent: '출력 스타일', convert: 'JSON으로 변환', copy: 'JSON 복사', clear: '지우기', sample: '샘플 CSV', download: 'JSON 다운로드',
    comma: '쉼표', semicolon: '세미콜론', tab: '탭', pretty2: '보기 좋게, 2칸', pretty4: '보기 좋게, 4칸', tabs: '탭', compact: '압축', rows: '행', fields: '필드', size: '입력 크기',
    trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 변환.</b> CSV 파싱과 JSON 생성은 브라우저에서 실행됩니다.', trustTwo: '<b>업로드 없음.</b> 파일은 기기에 남아 있습니다.',
    articleTitle: '언제 CSV를 JSON으로 변환하나요?', articleP1: 'CSV는 스프레드시트 내보내기에 편리하고, JSON은 API, 설정, 프런트엔드 프로토타입, 개발 워크플로에서 다루기 쉽습니다.',
    articleP2: '이 도구는 첫 CSV 행을 필드 이름으로 사용합니다. 중복 헤더가 있으면 경고하고 값을 조용히 덮어쓰지 않도록 번호가 붙은 키로 보존합니다.',
    faqTitle: '자주 묻는 질문',
    faq: [['이 CSV to JSON 변환기는 무료인가요?', '네. 가입 없이 붙여넣기, 변환, 복사, 다운로드할 수 있습니다.'], ['CSV 파일이 업로드되나요?', '아니요. CSV는 브라우저에서 로컬로 읽고 변환됩니다.'], ['JSON 키는 어떻게 만들어지나요?', 'CSV의 첫 행이 헤더가 되고 이후 각 행은 JSON 객체가 됩니다.'], ['중복 헤더는 어떻게 되나요?', '경고를 표시하고 값이 덮어써지지 않도록 번호가 붙은 키를 추가합니다.'], ['Unicode를 지원하나요?', '네. 유효한 CSV 필드의 UTF-8, 악센트, 아시아 문자, 이모지를 보존합니다.']],
    privacyTitle: '개인정보 처리방침', privacy: 'CSV 또는 JSON 데이터를 수집, 저장, 업로드 또는 전송하지 않습니다. 선택한 파일은 브라우저에서만 읽힙니다.',
    termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 시스템에서 사용하기 전에 생성된 JSON을 검토하세요.',
  },
  es: {
    title: 'Convertidor CSV a JSON - Convierte CSV en JSON | ConvertUnlimited',
    description: 'Convierte CSV a JSON en tu navegador. Pega o abre un CSV, usa encabezados como claves, copia y descarga JSON sin subidas.',
    hero: 'Convertidor CSV a JSON', sub: 'Convierte exports de hojas de cálculo en datos JSON dentro de tu navegador.',
    eyebrow: 'Herramienta local de datos', panelTitle: 'Pega CSV y conviértelo en JSON.',
    panelText: 'Usa la primera fila como encabezados, conserva Unicode y descarga JSON estructurado sin enviar datos a un servidor.',
    input: 'Entrada CSV', output: 'Salida JSON', delimiter: 'Delimitador', upload: 'Abrir archivo .csv', indent: 'Estilo de salida', convert: 'Convertir a JSON', copy: 'Copiar JSON', clear: 'Limpiar', sample: 'CSV de ejemplo', download: 'Descargar JSON',
    comma: 'Coma', semicolon: 'Punto y coma', tab: 'Tab', pretty2: 'Legible, 2 espacios', pretty4: 'Legible, 4 espacios', tabs: 'Tabs', compact: 'Compacto', rows: 'Filas', fields: 'Campos', size: 'Tamaño de entrada',
    trustTitle: 'Privado por diseño', trustOne: '<b>Conversión local.</b> El CSV se analiza y el JSON se genera en tu navegador.', trustTwo: '<b>Sin subidas.</b> Los archivos permanecen en tu dispositivo.',
    articleTitle: '¿Cuándo convertir CSV a JSON?', articleP1: 'CSV es cómodo para exports de hojas de cálculo, mientras que JSON es más práctico para APIs, configuración, prototipos frontend y flujos de desarrollo.',
    articleP2: 'El convertidor usa la primera fila como nombres de campo. Si hay encabezados duplicados, avisa y conserva valores con claves numeradas en vez de sobrescribirlos.',
    faqTitle: 'Preguntas frecuentes',
    faq: [['¿Este convertidor CSV a JSON es gratis?', 'Sí. Puedes pegar, convertir, copiar y descargar JSON sin registro.'], ['¿Los CSV se suben?', 'No. Los CSV se leen y convierten localmente en tu navegador.'], ['¿Cómo se crean las claves JSON?', 'La primera fila del CSV se usa como encabezado y cada fila posterior se convierte en un objeto JSON.'], ['¿Qué pasa con encabezados duplicados?', 'La herramienta muestra una advertencia y añade claves numeradas para no sobrescribir valores.'], ['¿Soporta Unicode?', 'Sí. Conserva texto UTF-8, acentos, escrituras asiáticas y emojis en campos CSV válidos.']],
    privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos datos CSV o JSON. Los archivos se leen localmente en el navegador.',
    termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa el JSON generado antes de usarlo en sistemas de producción.',
  },
  fr: {
    title: 'Convertisseur CSV vers JSON - Convertir CSV en JSON | ConvertUnlimited',
    description: 'Convertissez CSV en JSON dans votre navigateur. Collez ou ouvrez un CSV, utilisez les en-têtes comme clés, copiez et téléchargez sans envoi.',
    hero: 'Convertisseur CSV vers JSON', sub: 'Transformez des exports de tableurs en données JSON dans votre navigateur.',
    eyebrow: 'Outil local de données', panelTitle: 'Collez du CSV et convertissez-le en JSON.',
    panelText: 'Utilisez la première ligne comme en-têtes, conservez Unicode et téléchargez du JSON structuré sans envoyer de données au serveur.',
    input: 'Entrée CSV', output: 'Sortie JSON', delimiter: 'Délimiteur', upload: 'Ouvrir un fichier .csv', indent: 'Style de sortie', convert: 'Convertir en JSON', copy: 'Copier JSON', clear: 'Effacer', sample: 'CSV exemple', download: 'Télécharger JSON',
    comma: 'Virgule', semicolon: 'Point-virgule', tab: 'Tabulation', pretty2: 'Lisible, 2 espaces', pretty4: 'Lisible, 4 espaces', tabs: 'Tabulations', compact: 'Compact', rows: 'Lignes', fields: 'Champs', size: 'Taille entrée',
    trustTitle: 'Privé par conception', trustOne: '<b>Conversion locale.</b> Le CSV est analysé et le JSON généré dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Les fichiers restent sur votre appareil.',
    articleTitle: 'Quand convertir CSV en JSON ?', articleP1: 'CSV est pratique pour les exports de tableurs, tandis que JSON est plus facile à utiliser pour les API, configurations, prototypes frontend et workflows développeur.',
    articleP2: 'Le convertisseur utilise la première ligne comme noms de champs. Si des en-têtes sont dupliqués, il avertit et conserve les valeurs avec des clés numérotées.',
    faqTitle: 'Foire aux questions',
    faq: [['Ce convertisseur CSV vers JSON est-il gratuit ?', 'Oui. Vous pouvez coller, convertir, copier et télécharger du JSON sans inscription.'], ['Les fichiers CSV sont-ils envoyés ?', 'Non. Ils sont lus et convertis localement dans votre navigateur.'], ['Comment les clés JSON sont-elles créées ?', 'La première ligne CSV sert d’en-tête et chaque ligne suivante devient un objet JSON.'], ['Que faire avec des en-têtes dupliqués ?', 'L’outil affiche un avertissement et ajoute des clés numérotées pour éviter l’écrasement.'], ['Unicode est-il pris en charge ?', 'Oui. Le texte UTF-8, accents, écritures asiatiques et emojis sont conservés dans les champs CSV valides.']],
    privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons les données CSV ou JSON. Les fichiers sont lus localement dans le navigateur.',
    termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Relisez le JSON généré avant de l’utiliser dans des systèmes de production.',
  },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/csv-to-json/`;
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
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'csv-cleaner')}">CSV Cleaner</a><a href="${link(locale, 'csv-to-json')}" aria-current="page">CSV to JSON</a><a href="${link(locale, 'json-formatter')}">JSON Formatter</a><div class="dropdown-section">SEO Tools</div><a href="${link(locale, 'meta-preview-checker')}">Meta Preview Checker</a></div></details>
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
                                <label class="range-field" for="csvjson-input"><span>${esc(t.input)}</span><textarea id="csvjson-input" rows="14" spellcheck="false" class="mono" style="width:100%;resize:vertical;" placeholder="name,city\\nAlice,Bangkok"></textarea></label>
                                <label class="range-field" for="csvjson-delimiter"><span>${esc(t.delimiter)}</span><select id="csvjson-delimiter"><option value=",">${esc(t.comma)}</option><option value=";">${esc(t.semicolon)}</option><option value="tab">${esc(t.tab)}</option></select></label>
                                <label class="range-field" for="csvjson-indent"><span>${esc(t.indent)}</span><select id="csvjson-indent"><option value="2">${esc(t.pretty2)}</option><option value="4">${esc(t.pretty4)}</option><option value="tab">${esc(t.tabs)}</option><option value="compact">${esc(t.compact)}</option></select></label>
                                <label class="range-field" for="csvjson-file"><span>${esc(t.upload)}</span><input id="csvjson-file" type="file" accept=".csv,text/csv"></label>
                                <button class="btn btn-accent" id="csvjson-convert" type="button">${esc(t.convert)}</button>
                                <button class="btn btn-ghost" id="csvjson-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="csvjson-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.rows)}:</b> <span id="csvjson-row-count" class="mono num">0</span> · <b>${esc(t.fields)}:</b> <span id="csvjson-field-count" class="mono num">0</span> · <b>${esc(t.size)}:</b> <span id="csvjson-file-size" class="mono num">0 B</span></p>
                            <p class="bg-status" id="csvjson-status"></p>
                            <p class="bg-status" id="csvjson-warning" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="csvjson-output"><span>${esc(t.output)}</span><textarea id="csvjson-output" rows="18" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="csvjson-copy" type="button">${esc(t.copy)}</button><button class="btn btn-ghost" id="csvjson-download" type="button">${esc(t.download)}</button></div>
                        </div>
                    </div>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_CSV_JSON_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_CSV_JSON_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
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
    <script src="/csv-to-json/csv-to-json.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'csv-to-json');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized CSV to JSON pages');
