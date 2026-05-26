const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'CSV Cleaner - Clean, Trim & Remove Duplicate CSV Rows | ConvertUnlimited',
    description: 'Clean CSV online in your browser. Trim whitespace, remove empty rows, deduplicate rows, preview data, copy, and download without uploads.',
    hero: 'CSV Cleaner', sub: 'Clean spreadsheet exports and datasets locally in your browser.',
    eyebrow: 'Local developer data tool', panelTitle: 'Paste CSV and clean safe issues.',
    panelText: 'Trim cells, remove blank rows, normalize line endings, and remove duplicate identical rows without uploading your data.',
    input: 'CSV input', output: 'Cleaned CSV', delimiter: 'Delimiter', upload: 'Open .csv file', clean: 'Clean CSV', copy: 'Copy cleaned CSV', clear: 'Clear', sample: 'Sample CSV', download: 'Download CSV',
    comma: 'Comma', semicolon: 'Semicolon', tab: 'Tab', preview: 'Parsed preview', rows: 'Rows', columns: 'Columns', size: 'Input size', warning: 'Validation warning',
    trustTitle: 'Private by design', trustOne: '<b>Local processing.</b> CSV parsing and cleaning runs in your browser.', trustTwo: '<b>Local processing.</b> Files opened here are processed locally in your browser.',
    articleTitle: 'When should you clean CSV files?', articleP1: 'CSV exports often include extra spaces, blank rows, inconsistent line endings, or repeated rows. Cleaning those safe issues makes datasets easier to import, compare, and review.',
    articleP2: 'This tool avoids destructive transformations. It preserves column order and values except for trimming whitespace, removing blank rows, and deleting exact duplicate rows.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      ['Is this CSV Cleaner free?', 'Yes. You can paste, clean, preview, copy, and download CSV without signup.'],
      ['Are CSV files uploaded?', 'No. CSV files are read and cleaned locally in your browser.'],
      ['What cleaning rules are applied?', 'The tool trims cell whitespace, removes blank rows, normalizes line endings, and removes duplicate identical rows.'],
      ['Does it change column order?', 'No. Column order is preserved. The tool avoids destructive reshaping.'],
      ['What happens with malformed CSV?', 'The tool shows a friendly warning and preserves your original input.'],
    ],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this CSV cleaning flow. Selected CSV files are processed locally in your browser.',
    termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Review cleaned CSV before importing it into production systems.',
  },
  th: {
    title: 'ตัวล้าง CSV - ล้าง ตัดช่องว่าง และลบแถวซ้ำ | ConvertUnlimited',
    description: 'ล้าง CSV ในเบราว์เซอร์ ตัดช่องว่าง ลบแถวว่าง ลบแถวซ้ำ ดูตัวอย่าง คัดลอก และดาวน์โหลดโดยไม่อัปโหลด',
    hero: 'ตัวล้าง CSV', sub: 'ล้างไฟล์ส่งออกจากสเปรดชีตและชุดข้อมูลในเบราว์เซอร์',
    eyebrow: 'เครื่องมือข้อมูลในเครื่อง', panelTitle: 'วาง CSV แล้วล้างปัญหาที่ปลอดภัย',
    panelText: 'ตัดช่องว่าง ลบแถวว่าง ปรับ line ending และลบแถวซ้ำแบบเหมือนกันโดยไม่อัปโหลดข้อมูล',
    input: 'CSV ขาเข้า', output: 'CSV ที่ล้างแล้ว', delimiter: 'ตัวคั่น', upload: 'เปิดไฟล์ .csv', clean: 'ล้าง CSV', copy: 'คัดลอก CSV', clear: 'ล้าง', sample: 'CSV ตัวอย่าง', download: 'ดาวน์โหลด CSV',
    comma: 'คอมมา', semicolon: 'เซมิโคลอน', tab: 'แท็บ', preview: 'ตัวอย่างที่อ่านได้', rows: 'แถว', columns: 'คอลัมน์', size: 'ขนาดขาเข้า', warning: 'คำเตือนการตรวจสอบ',
    trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>ประมวลผลในเครื่อง</b> CSV ถูกอ่านและล้างในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ไฟล์อยู่บนอุปกรณ์ของคุณ',
    articleTitle: 'ควรล้าง CSV เมื่อใด?', articleP1: 'ไฟล์ CSV จากการ export มักมีช่องว่าง แถวว่าง line ending ไม่สม่ำเสมอ หรือแถวซ้ำ การล้างช่วยให้นำเข้าและตรวจสอบง่ายขึ้น',
    articleP2: 'เครื่องมือนี้หลีกเลี่ยงการเปลี่ยนแปลงที่ทำลายข้อมูล โดยรักษาลำดับคอลัมน์และค่าไว้ ยกเว้นการตัดช่องว่าง ลบแถวว่าง และลบแถวซ้ำตรงกัน',
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี วาง ล้าง ดูตัวอย่าง คัดลอก และดาวน์โหลด CSV ได้โดยไม่ต้องสมัคร'], ['ไฟล์ CSV ถูกอัปโหลดไหม?', 'ไม่ ไฟล์ถูกอ่านและล้างในเบราว์เซอร์'], ['ล้างอะไรบ้าง?', 'ตัดช่องว่างในเซลล์ ลบแถวว่าง ปรับ line ending และลบแถวซ้ำแบบเหมือนกัน'], ['เปลี่ยนลำดับคอลัมน์ไหม?', 'ไม่ ลำดับคอลัมน์ถูกเก็บไว้'], ['ถ้า CSV ผิดรูปแบบจะเกิดอะไร?', 'เครื่องมือจะแสดงคำเตือนและเก็บข้อมูลเดิมไว้']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่งข้อมูล CSV การเลือกไฟล์อ่านเฉพาะในเบราว์เซอร์',
    termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง ควรตรวจ CSV ที่ล้างแล้วก่อนนำเข้าในระบบจริง',
  },
  vi: {
    title: 'Trình làm sạch CSV - Xóa trùng, cắt khoảng trắng | ConvertUnlimited',
    description: 'Làm sạch CSV trong trình duyệt. Cắt khoảng trắng, xóa dòng trống, bỏ dòng trùng, xem trước, sao chép và tải xuống không cần upload.',
    hero: 'Trình làm sạch CSV', sub: 'Làm sạch dữ liệu xuất từ bảng tính và dataset ngay trong trình duyệt.',
    eyebrow: 'Công cụ dữ liệu cục bộ', panelTitle: 'Dán CSV và làm sạch an toàn.',
    panelText: 'Cắt ô, xóa dòng trống, chuẩn hóa line ending và xóa dòng trùng giống hệt mà không tải dữ liệu lên.',
    input: 'CSV đầu vào', output: 'CSV đã làm sạch', delimiter: 'Dấu phân tách', upload: 'Mở tệp .csv', clean: 'Làm sạch CSV', copy: 'Sao chép CSV', clear: 'Xóa', sample: 'CSV mẫu', download: 'Tải CSV',
    comma: 'Dấu phẩy', semicolon: 'Chấm phẩy', tab: 'Tab', preview: 'Xem trước dữ liệu', rows: 'Dòng', columns: 'Cột', size: 'Kích thước đầu vào', warning: 'Cảnh báo kiểm tra',
    trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Xử lý cục bộ.</b> CSV được phân tích và làm sạch trong trình duyệt.', trustTwo: '<b>Không upload.</b> Tệp ở lại trên thiết bị.',
    articleTitle: 'Khi nào nên làm sạch CSV?', articleP1: 'CSV xuất từ bảng tính thường có khoảng trắng, dòng trống, line ending khác nhau hoặc dòng lặp. Làm sạch giúp nhập và kiểm tra dữ liệu dễ hơn.',
    articleP2: 'Công cụ tránh biến đổi phá hủy. Thứ tự cột và giá trị được giữ, ngoại trừ cắt khoảng trắng, xóa dòng trống và xóa dòng trùng giống hệt.',
    faqTitle: 'Câu hỏi thường gặp',
    faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể dán, làm sạch, xem trước, sao chép và tải CSV không cần đăng ký.'], ['CSV có được upload không?', 'Không. CSV được đọc và làm sạch cục bộ trong trình duyệt.'], ['Quy tắc làm sạch là gì?', 'Cắt khoảng trắng trong ô, xóa dòng trống, chuẩn hóa line ending và xóa dòng trùng giống hệt.'], ['Có đổi thứ tự cột không?', 'Không. Thứ tự cột được giữ nguyên.'], ['CSV lỗi thì sao?', 'Công cụ hiển thị cảnh báo thân thiện và giữ nguyên dữ liệu gốc.']],
    privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền dữ liệu CSV. Tệp được đọc cục bộ trong trình duyệt.',
    termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Hãy kiểm tra CSV đã làm sạch trước khi nhập vào hệ thống production.',
  },
  zh: {
    title: 'CSV 清理工具 - 去重、去空行和修剪空白 | ConvertUnlimited',
    description: '在浏览器中清理 CSV。修剪空白、删除空行、移除重复行、预览数据、复制并下载，无需上传。',
    hero: 'CSV 清理工具', sub: '在浏览器中清理电子表格导出和数据集。',
    eyebrow: '本地开发数据工具', panelTitle: '粘贴 CSV 并安全清理。',
    panelText: '修剪单元格、删除空行、标准化换行并移除完全重复的行，无需上传数据。',
    input: 'CSV 输入', output: '清理后的 CSV', delimiter: '分隔符', upload: '打开 .csv 文件', clean: '清理 CSV', copy: '复制 CSV', clear: '清空', sample: '示例 CSV', download: '下载 CSV',
    comma: '逗号', semicolon: '分号', tab: '制表符', preview: '解析预览', rows: '行', columns: '列', size: '输入大小', warning: '验证警告',
    trustTitle: '隐私优先设计', trustOne: '<b>本地处理。</b> CSV 在浏览器中解析和清理。', trustTwo: '<b>无需上传。</b> 文件留在你的设备上。',
    articleTitle: '什么时候需要清理 CSV？', articleP1: 'CSV 导出常包含多余空格、空行、不一致换行或重复行。清理这些安全问题能让数据更容易导入、比较和检查。',
    articleP2: '本工具避免破坏性转换。除修剪空白、删除空行和删除完全重复行外，会保留列顺序和值。',
    faqTitle: '常见问题',
    faq: [['这个 CSV 工具免费吗？', '免费。无需注册即可粘贴、清理、预览、复制和下载 CSV。'], ['CSV 文件会上传吗？', '不会。CSV 会在浏览器本地读取和清理。'], ['会应用哪些清理规则？', '修剪单元格空白、删除空行、标准化换行，并删除完全相同的重复行。'], ['会改变列顺序吗？', '不会。列顺序会保留。'], ['CSV 格式异常怎么办？', '工具会显示友好警告并保留原始输入。']],
    privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或传输 CSV 数据。通过文件选择器打开的文件只在浏览器中读取。',
    termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。导入生产系统前请检查清理后的 CSV。',
  },
  ja: {
    title: 'CSV クリーナー - CSV の空白削除・重複行削除 | ConvertUnlimited',
    description: 'ブラウザ内で CSV をクリーニング。空白削除、空行削除、重複行削除、プレビュー、コピー、ダウンロード。アップロード不要。',
    hero: 'CSV クリーナー', sub: 'スプレッドシートのエクスポートやデータセットをブラウザ内で整理します。',
    eyebrow: 'ローカル開発データツール', panelTitle: 'CSV を貼り付けて安全に整理。',
    panelText: 'セルの空白、空行、改行コード、完全一致の重複行を、データをアップロードせずに整理します。',
    input: 'CSV 入力', output: 'クリーニング済み CSV', delimiter: '区切り文字', upload: '.csv ファイルを開く', clean: 'CSV をクリーニング', copy: 'CSV をコピー', clear: 'クリア', sample: 'サンプル CSV', download: 'CSV をダウンロード',
    comma: 'カンマ', semicolon: 'セミコロン', tab: 'タブ', preview: '解析プレビュー', rows: '行', columns: '列', size: '入力サイズ', warning: '検証警告',
    trustTitle: 'プライバシー重視', trustOne: '<b>ローカル処理。</b> CSV の解析と整理はブラウザ内で行われます。', trustTwo: '<b>アップロードなし。</b> ファイルは端末内に留まります。',
    articleTitle: 'CSV はいつ整理するべき？', articleP1: 'CSV のエクスポートには余分な空白、空行、不統一な改行、重複行が含まれることがあります。安全な整理でインポートや確認が簡単になります。',
    articleP2: 'このツールは破壊的な変換を避けます。列順と値を保持し、空白のトリム、空行削除、完全重複行削除だけを行います。',
    faqTitle: 'よくある質問',
    faq: [['この CSV クリーナーは無料ですか？', 'はい。登録なしで貼り付け、整理、プレビュー、コピー、ダウンロードできます。'], ['CSV はアップロードされますか？', 'いいえ。CSV はブラウザ内でローカルに読み込まれ整理されます。'], ['どんなルールで整理しますか？', 'セルの空白をトリムし、空行を削除し、改行を標準化し、完全一致の重複行を削除します。'], ['列順は変わりますか？', 'いいえ。列順は保持されます。'], ['壊れた CSV はどうなりますか？', '分かりやすい警告を表示し、元の入力を保持します。']],
    privacyTitle: 'プライバシーポリシー', privacy: 'CSV データを収集、保存、アップロード、送信しません。選択したファイルはブラウザ内でのみ読み込まれます。',
    termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。本番システムへ取り込む前に整理済み CSV を確認してください。',
  },
  ko: {
    title: 'CSV 클리너 - CSV 공백 제거 및 중복 행 삭제 | ConvertUnlimited',
    description: '브라우저에서 CSV를 정리하세요. 공백 제거, 빈 행 삭제, 중복 행 제거, 미리보기, 복사, 다운로드, 업로드 없음.',
    hero: 'CSV 클리너', sub: '스프레드시트 내보내기와 데이터셋을 브라우저에서 정리합니다.',
    eyebrow: '로컬 개발 데이터 도구', panelTitle: 'CSV를 붙여넣고 안전하게 정리하세요.',
    panelText: '셀 공백, 빈 행, 줄바꿈, 완전히 동일한 중복 행을 데이터 업로드 없이 정리합니다.',
    input: 'CSV 입력', output: '정리된 CSV', delimiter: '구분자', upload: '.csv 파일 열기', clean: 'CSV 정리', copy: 'CSV 복사', clear: '지우기', sample: '샘플 CSV', download: 'CSV 다운로드',
    comma: '쉼표', semicolon: '세미콜론', tab: '탭', preview: '파싱 미리보기', rows: '행', columns: '열', size: '입력 크기', warning: '검증 경고',
    trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 처리.</b> CSV 파싱과 정리는 브라우저에서 실행됩니다.', trustTwo: '<b>업로드 없음.</b> 파일은 기기에 남아 있습니다.',
    articleTitle: '언제 CSV를 정리해야 하나요?', articleP1: 'CSV 내보내기에는 불필요한 공백, 빈 행, 다른 줄바꿈, 반복 행이 들어갈 수 있습니다. 안전한 정리는 가져오기와 검토를 쉽게 만듭니다.',
    articleP2: '이 도구는 파괴적인 변환을 피합니다. 공백 trim, 빈 행 삭제, 완전 중복 행 삭제를 제외하고 열 순서와 값은 유지됩니다.',
    faqTitle: '자주 묻는 질문',
    faq: [['이 CSV 클리너는 무료인가요?', '네. 가입 없이 붙여넣기, 정리, 미리보기, 복사, 다운로드할 수 있습니다.'], ['CSV 파일이 업로드되나요?', '아니요. CSV는 브라우저에서 로컬로 읽고 정리됩니다.'], ['어떤 규칙이 적용되나요?', '셀 공백 제거, 빈 행 삭제, 줄바꿈 표준화, 완전히 동일한 중복 행 삭제입니다.'], ['열 순서가 바뀌나요?', '아니요. 열 순서는 유지됩니다.'], ['잘못된 CSV는 어떻게 되나요?', '친절한 경고를 표시하고 원본 입력은 보존합니다.']],
    privacyTitle: '개인정보 처리방침', privacy: 'CSV 데이터를 수집, 저장, 업로드 또는 전송하지 않습니다. 선택한 파일은 브라우저에서만 읽힙니다.',
    termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 프로덕션 시스템에 가져오기 전에 정리된 CSV를 검토하세요.',
  },
  es: {
    title: 'Limpiador CSV - Limpia espacios y elimina duplicados | ConvertUnlimited',
    description: 'Limpia CSV en tu navegador. Recorta espacios, elimina filas vacías, quita duplicados, previsualiza, copia y descarga sin subidas.',
    hero: 'Limpiador CSV', sub: 'Limpia exports de hojas de cálculo y datasets en tu navegador.',
    eyebrow: 'Herramienta local de datos', panelTitle: 'Pega CSV y limpia problemas seguros.',
    panelText: 'Recorta celdas, elimina filas vacías, normaliza saltos de línea y quita filas duplicadas idénticas sin subir datos.',
    input: 'Entrada CSV', output: 'CSV limpio', delimiter: 'Delimitador', upload: 'Abrir archivo .csv', clean: 'Limpiar CSV', copy: 'Copiar CSV', clear: 'Limpiar', sample: 'CSV de ejemplo', download: 'Descargar CSV',
    comma: 'Coma', semicolon: 'Punto y coma', tab: 'Tab', preview: 'Vista previa', rows: 'Filas', columns: 'Columnas', size: 'Tamaño de entrada', warning: 'Advertencia',
    trustTitle: 'Privado por diseño', trustOne: '<b>Procesamiento local.</b> El CSV se analiza y limpia en tu navegador.', trustTwo: '<b>Sin subidas.</b> Los archivos permanecen en tu dispositivo.',
    articleTitle: '¿Cuándo limpiar archivos CSV?', articleP1: 'Los CSV exportados suelen incluir espacios, filas vacías, saltos de línea inconsistentes o filas repetidas. Limpiar esos problemas facilita importar y revisar datos.',
    articleP2: 'La herramienta evita cambios destructivos. Conserva el orden de columnas y valores salvo recortar espacios, eliminar filas vacías y quitar duplicados exactos.',
    faqTitle: 'Preguntas frecuentes',
    faq: [['¿Este limpiador CSV es gratis?', 'Sí. Puedes pegar, limpiar, previsualizar, copiar y descargar CSV sin registro.'], ['¿Los CSV se suben?', 'No. Los CSV se leen y limpian localmente en tu navegador.'], ['¿Qué reglas aplica?', 'Recorta espacios, elimina filas vacías, normaliza saltos de línea y quita filas duplicadas idénticas.'], ['¿Cambia el orden de columnas?', 'No. El orden de columnas se conserva.'], ['¿Qué pasa con CSV malformado?', 'La herramienta muestra una advertencia clara y conserva la entrada original.']],
    privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni transmitimos datos CSV. Los archivos se leen localmente en el navegador.',
    termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Revisa el CSV limpio antes de importarlo en sistemas de producción.',
  },
  fr: {
    title: 'Nettoyeur CSV - Supprimer espaces, lignes vides et doublons | ConvertUnlimited',
    description: 'Nettoyez des CSV dans votre navigateur. Supprimez espaces, lignes vides, doublons, prévisualisez, copiez et téléchargez sans envoi.',
    hero: 'Nettoyeur CSV', sub: 'Nettoyez exports de tableurs et jeux de données dans votre navigateur.',
    eyebrow: 'Outil local de données', panelTitle: 'Collez du CSV et nettoyez les problèmes sûrs.',
    panelText: 'Supprimez les espaces, lignes vides, normalisez les retours ligne et retirez les lignes identiques sans envoyer vos données.',
    input: 'Entrée CSV', output: 'CSV nettoyé', delimiter: 'Délimiteur', upload: 'Ouvrir un fichier .csv', clean: 'Nettoyer CSV', copy: 'Copier CSV', clear: 'Effacer', sample: 'CSV exemple', download: 'Télécharger CSV',
    comma: 'Virgule', semicolon: 'Point-virgule', tab: 'Tabulation', preview: 'Aperçu analysé', rows: 'Lignes', columns: 'Colonnes', size: 'Taille entrée', warning: 'Avertissement',
    trustTitle: 'Privé par conception', trustOne: '<b>Traitement local.</b> Le CSV est analysé et nettoyé dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Les fichiers restent sur votre appareil.',
    articleTitle: 'Quand nettoyer des fichiers CSV ?', articleP1: 'Les exports CSV contiennent souvent espaces, lignes vides, retours ligne incohérents ou doublons. Nettoyer ces problèmes facilite import, comparaison et relecture.',
    articleP2: 'L’outil évite les transformations destructives. Il conserve l’ordre des colonnes et les valeurs sauf pour trim, lignes vides et doublons exacts.',
    faqTitle: 'Foire aux questions',
    faq: [['Ce nettoyeur CSV est-il gratuit ?', 'Oui. Vous pouvez coller, nettoyer, prévisualiser, copier et télécharger du CSV sans inscription.'], ['Les fichiers CSV sont-ils envoyés ?', 'Non. Ils sont lus et nettoyés localement dans votre navigateur.'], ['Quelles règles sont appliquées ?', 'Trim des cellules, suppression des lignes vides, normalisation des retours ligne et suppression des doublons identiques.'], ['L’ordre des colonnes change-t-il ?', 'Non. L’ordre des colonnes est conservé.'], ['Que faire avec un CSV mal formé ?', 'L’outil affiche un avertissement clair et conserve l’entrée originale.']],
    privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni transmettons les données CSV. Les fichiers sont lus localement dans le navigateur.',
    termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Relisez le CSV nettoyé avant de l’importer dans des systèmes de production.',
  },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/csv-cleaner/`;
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
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Developer Tools</div><a href="${link(locale, 'json-formatter')}">JSON Formatter</a><a href="${link(locale, 'csv-cleaner')}" aria-current="page">CSV Cleaner</a><div class="dropdown-section">SEO Tools</div><a href="${link(locale, 'meta-preview-checker')}">Meta Preview Checker</a><a href="${link(locale, 'qr-generator')}">QR Generator</a></div></details>
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
                                <label class="range-field" for="csv-input"><span>${esc(t.input)}</span><textarea id="csv-input" rows="14" spellcheck="false" class="mono" style="width:100%;resize:vertical;" placeholder="name,city\\nAlice,Bangkok"></textarea></label>
                                <label class="range-field" for="csv-delimiter"><span>${esc(t.delimiter)}</span><select id="csv-delimiter"><option value=",">${esc(t.comma)}</option><option value=";">${esc(t.semicolon)}</option><option value="tab">${esc(t.tab)}</option></select></label>
                                <label class="range-field" for="csv-file"><span>${esc(t.upload)}</span><input id="csv-file" type="file" accept=".csv,text/csv"></label>
                                <button class="btn btn-accent" id="csv-clean" type="button">${esc(t.clean)}</button>
                                <button class="btn btn-ghost" id="csv-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="csv-clear" type="button">${esc(t.clear)}</button>
                            </div>
                            <p class="bg-status"><b>${esc(t.rows)}:</b> <span id="csv-row-count" class="mono num">0</span> · <b>${esc(t.columns)}:</b> <span id="csv-col-count" class="mono num">0</span> · <b>${esc(t.size)}:</b> <span id="csv-file-size" class="mono num">0 B</span></p>
                            <p class="bg-status" id="csv-status"></p>
                            <p class="bg-status" id="csv-warning" style="color: var(--warn);"></p>
                        </div>
                        <div class="bg-panel">
                            <label class="range-field" for="csv-output"><span>${esc(t.output)}</span><textarea id="csv-output" rows="10" spellcheck="false" class="mono" readonly style="width:100%;resize:vertical;"></textarea></label>
                            <div class="bg-controls" style="margin-top:16px;"><button class="btn btn-accent" id="csv-copy" type="button">${esc(t.copy)}</button><button class="btn btn-ghost" id="csv-download" type="button">${esc(t.download)}</button></div>
                            <div class="category-title">${esc(t.preview)}</div>
                            <div id="csv-preview" style="overflow:auto; max-height: 280px;"></div>
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
    <script src="/csv-cleaner/csv-cleaner.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'csv-cleaner');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized CSV cleaner pages');
