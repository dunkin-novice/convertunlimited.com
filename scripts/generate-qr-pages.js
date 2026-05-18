const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'QR Generator - Create Free QR Codes Online | ConvertUnlimited',
    description: 'Create static QR codes for websites and text in your browser. Free local QR generator with live preview, PNG download, and SVG export.',
    hero: 'QR Generator', sub: 'Create QR codes instantly for websites, text, and sharing.',
    eyebrow: 'Local QR code generator', panelTitle: 'Generate a QR code locally.',
    panelText: 'Enter a website URL or plain text, preview the QR code instantly, then download it as PNG or SVG. Input is processed locally in your browser, and no account is required.',
    mode: 'Content type', url: 'Website URL', text: 'Plain text', value: 'QR content', placeholder: 'https://example.com',
    size: 'Size', margin: 'Margin', dark: 'Dark color', light: 'Light color', transparent: 'Transparent background',
    png: 'Download PNG', svg: 'Download SVG', status: 'Enter a URL or text to generate a QR code.',
    trustTitle: 'Private by design', trustOne: '<b>Local generation.</b> QR codes are created in your browser.', trustTwo: '<b>Local generation.</b> Text or URL input is processed locally in your browser.',
    articleTitle: 'What can you use QR codes for?', articleP1: 'Static QR codes are useful for menus, flyers, product packaging, event signs, and quick website sharing. They encode the destination directly, so there is no account or redirect service required.',
    articleP2: 'For print, download a larger PNG or SVG and test the code before publishing. A simple high-contrast QR code is usually easier to scan than a heavily styled one.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      ['Is this QR Generator free?', 'Yes. You can create and download QR codes without signup or usage limits.'],
      ['Are QR codes generated locally?', 'Yes. The QR image is generated in your browser; text or URL input is processed locally in your browser.'],
      ['Can I use QR codes commercially?', 'Yes. Static QR codes generated here can be used for business cards, flyers, packaging, and websites.'],
      ['What is the best QR code size?', 'For digital use, 512 px is usually enough. For print, use a larger PNG or SVG and test it at the final size.'],
      ['Do QR codes expire?', 'Static QR codes do not expire. They keep working as long as the encoded URL or text remains useful.'],
      ['Can I generate QR codes for URLs and text?', 'Yes. Choose Website URL or Plain text and the preview updates automatically.'],
    ],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this QR generation flow. Text or URL input is processed locally in your browser.',
    termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. You are responsible for testing QR codes before printing or publishing them.',
  },
  th: {
    title: 'ตัวสร้าง QR - สร้าง QR Code ฟรีออนไลน์ | ConvertUnlimited',
    description: 'สร้าง QR Code สำหรับเว็บไซต์และข้อความในเบราว์เซอร์ ฟรี ทำงานในเครื่อง มีตัวอย่างสด ดาวน์โหลด PNG และส่งออก SVG',
    hero: 'ตัวสร้าง QR', sub: 'สร้าง QR Code ทันทีสำหรับเว็บไซต์ ข้อความ และการแชร์',
    eyebrow: 'ตัวสร้าง QR ในเครื่อง', panelTitle: 'สร้าง QR Code ในเบราว์เซอร์',
    panelText: 'ป้อน URL หรือข้อความ ดูตัวอย่างทันที แล้วดาวน์โหลดเป็น PNG หรือ SVG ไม่ต้องอัปโหลดและไม่ต้องสมัคร',
    mode: 'ประเภทเนื้อหา', url: 'URL เว็บไซต์', text: 'ข้อความธรรมดา', value: 'เนื้อหา QR', placeholder: 'https://example.com',
    size: 'ขนาด', margin: 'ขอบ', dark: 'สีเข้ม', light: 'สีพื้น', transparent: 'พื้นหลังโปร่งใส',
    png: 'ดาวน์โหลด PNG', svg: 'ดาวน์โหลด SVG', status: 'ป้อน URL หรือข้อความเพื่อสร้าง QR',
    trustTitle: 'ออกแบบเพื่อความเป็นส่วนตัว', trustOne: '<b>สร้างในเครื่อง</b> QR ถูกสร้างในเบราว์เซอร์', trustTwo: '<b>ไม่อัปโหลด</b> ข้อความหรือ URL ไม่ถูกส่งไปยังเซิร์ฟเวอร์',
    articleTitle: 'QR Code ใช้ทำอะไรได้บ้าง?', articleP1: 'QR Code แบบคงที่เหมาะกับเมนู ใบปลิว บรรจุภัณฑ์ ป้ายงานอีเวนต์ และการแชร์เว็บไซต์อย่างรวดเร็ว โดยเข้ารหัสปลายทางไว้โดยตรง',
    articleP2: 'สำหรับงานพิมพ์ ให้ดาวน์โหลด PNG ขนาดใหญ่หรือ SVG แล้วทดสอบก่อนเผยแพร่ QR ที่เรียบและคอนทราสต์สูงมักสแกนง่ายกว่า',
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [['ตัวสร้าง QR นี้ฟรีไหม?', 'ฟรี ใช้สร้างและดาวน์โหลด QR Code ได้โดยไม่ต้องสมัคร'], ['QR ถูกสร้างในเครื่องหรือไม่?', 'ใช่ รูป QR ถูกสร้างในเบราว์เซอร์ ข้อความหรือ URL ไม่ถูกอัปโหลด'], ['ใช้ QR เพื่อการค้าได้ไหม?', 'ได้ QR แบบคงที่ใช้กับนามบัตร ใบปลิว บรรจุภัณฑ์ และเว็บไซต์ได้'], ['ขนาด QR ที่เหมาะสมคือเท่าไร?', 'สำหรับดิจิทัล 512 px มักเพียงพอ สำหรับงานพิมพ์ให้ใช้ PNG ใหญ่หรือ SVG และทดสอบจริง'], ['QR Code หมดอายุไหม?', 'QR แบบคงที่ไม่หมดอายุ ตราบใดที่ URL หรือข้อความที่เข้ารหัสยังใช้งานได้'], ['สร้าง QR สำหรับ URL และข้อความได้ไหม?', 'ได้ เลือก URL เว็บไซต์หรือข้อความธรรมดา แล้วตัวอย่างจะอัปเดตอัตโนมัติ']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ และไม่ส่งเนื้อหา QR ที่คุณป้อน การสร้างทำงานในเบราว์เซอร์',
    termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง คุณควรทดสอบ QR ก่อนพิมพ์หรือเผยแพร่',
  },
  vi: {
    title: 'Trình tạo QR - Tạo mã QR miễn phí online | ConvertUnlimited',
    description: 'Tạo mã QR cho website và văn bản trong trình duyệt. Miễn phí, chạy cục bộ, xem trước trực tiếp, tải PNG và xuất SVG.',
    hero: 'Trình tạo QR', sub: 'Tạo mã QR tức thì cho website, văn bản và chia sẻ.',
    eyebrow: 'Tạo QR cục bộ', panelTitle: 'Tạo mã QR trong trình duyệt.',
    panelText: 'Nhập URL hoặc văn bản, xem trước ngay, rồi tải xuống PNG hoặc SVG. Không cần tải lên hay tài khoản.',
    mode: 'Loại nội dung', url: 'URL website', text: 'Văn bản thường', value: 'Nội dung QR', placeholder: 'https://example.com',
    size: 'Kích thước', margin: 'Lề', dark: 'Màu tối', light: 'Màu nền', transparent: 'Nền trong suốt',
    png: 'Tải PNG', svg: 'Tải SVG', status: 'Nhập URL hoặc văn bản để tạo mã QR.',
    trustTitle: 'Riêng tư từ thiết kế', trustOne: '<b>Tạo cục bộ.</b> Mã QR được tạo trong trình duyệt.', trustTwo: '<b>Không tải lên.</b> Văn bản hoặc URL không được gửi đến máy chủ.',
    articleTitle: 'Mã QR dùng để làm gì?', articleP1: 'Mã QR tĩnh hữu ích cho menu, tờ rơi, bao bì, biển sự kiện và chia sẻ website nhanh. Nội dung được mã hóa trực tiếp nên không cần tài khoản hay dịch vụ chuyển hướng.',
    articleP2: 'Khi in, hãy tải PNG lớn hoặc SVG và kiểm tra trước. QR đơn giản, tương phản cao thường dễ quét hơn.',
    faqTitle: 'Câu hỏi thường gặp',
    faq: [['Trình tạo QR này có miễn phí không?', 'Có. Bạn có thể tạo và tải mã QR không cần đăng ký.'], ['QR có được tạo cục bộ không?', 'Có. Ảnh QR được tạo trong trình duyệt; nội dung không được tải lên.'], ['Tôi có thể dùng QR cho thương mại không?', 'Có. Mã QR tĩnh có thể dùng cho danh thiếp, tờ rơi, bao bì và website.'], ['Kích thước QR tốt nhất là bao nhiêu?', 'Dùng số 512 px cho kỹ thuật số. Khi in, dùng PNG lớn hoặc SVG và kiểm tra ở kích thước thật.'], ['Mã QR có hết hạn không?', 'Mã QR tĩnh không hết hạn miễn là URL hoặc văn bản còn hữu ích.'], ['Có thể tạo QR cho URL và văn bản không?', 'Có. Chọn URL website hoặc văn bản thường, bản xem trước sẽ cập nhật tự động.']],
    privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ hoặc truyền nội dung QR bạn nhập. Việc tạo mã chạy cục bộ trong trình duyệt.',
    termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Bạn chịu trách nhiệm kiểm tra mã QR trước khi in hoặc xuất bản.',
  },
  zh: {
    title: '二维码生成器 - 免费在线创建二维码 | ConvertUnlimited',
    description: '在浏览器中为网站和文本创建二维码。免费、本地生成、实时预览，可下载 PNG 和导出 SVG。',
    hero: '二维码生成器', sub: '为网站、文本和分享即时创建二维码。',
    eyebrow: '本地二维码生成器', panelTitle: '在浏览器中生成二维码。',
    panelText: '输入网址或文本，立即预览二维码，然后下载 PNG 或 SVG。无需上传，也无需账户。',
    mode: '内容类型', url: '网站网址', text: '纯文本', value: '二维码内容', placeholder: 'https://example.com',
    size: '尺寸', margin: '边距', dark: '深色', light: '浅色', transparent: '透明背景',
    png: '下载 PNG', svg: '下载 SVG', status: '输入网址或文本以生成二维码。',
    trustTitle: '隐私优先设计', trustOne: '<b>本地生成。</b> 二维码在浏览器中创建。', trustTwo: '<b>无需上传。</b> 你的文本或网址不会发送到服务器。',
    articleTitle: '二维码可以用来做什么？', articleP1: '静态二维码适合菜单、传单、包装、活动标牌和快速分享网站。它直接编码目标内容，不需要账户或跳转服务。',
    articleP2: '用于印刷时，请下载更大的 PNG 或 SVG 并在发布前测试。简单高对比度的二维码通常更容易扫描。',
    faqTitle: '常见问题',
    faq: [['这个二维码生成器免费吗？', '免费。无需注册即可创建和下载二维码。'], ['二维码是在本地生成的吗？', '是。二维码图像在浏览器中生成，你的文本或网址不会上传。'], ['可以商业使用吗？', '可以。这里生成的静态二维码可用于名片、传单、包装和网站。'], ['二维码最佳尺寸是多少？', '数字用途通常 512 px 足够。印刷时请使用更大的 PNG 或 SVG 并按最终尺寸测试。'], ['二维码会过期吗？', '静态二维码不会过期，只要编码的网址或文本仍然有效。'], ['可以为网址和文本生成二维码吗？', '可以。选择网站网址或纯文本，预览会自动更新。']],
    privacyTitle: '隐私政策', privacy: '我们不会收集、存储或传输你输入的二维码内容。生成过程在浏览器本地完成。',
    termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。印刷或发布前，你应自行测试二维码。',
  },
  ja: {
    title: 'QR コード生成 - 無料オンライン QR 作成 | ConvertUnlimited',
    description: 'ブラウザ内で URL やテキスト用の QR コードを作成。無料、ローカル生成、ライブプレビュー、PNG ダウンロード、SVG 書き出し。',
    hero: 'QR コード生成', sub: 'Web サイト、テキスト、共有用の QR コードをすぐに作成。',
    eyebrow: 'ローカル QR ジェネレーター', panelTitle: 'ブラウザ内で QR コードを生成。',
    panelText: 'URL またはテキストを入力するとすぐにプレビューされ、PNG または SVG でダウンロードできます。アップロードもアカウントも不要です。',
    mode: '内容タイプ', url: 'Web サイト URL', text: 'プレーンテキスト', value: 'QR 内容', placeholder: 'https://example.com',
    size: 'サイズ', margin: '余白', dark: '濃色', light: '背景色', transparent: '透明背景',
    png: 'PNG をダウンロード', svg: 'SVG をダウンロード', status: 'URL またはテキストを入力して QR コードを作成します。',
    trustTitle: 'プライバシー重視', trustOne: '<b>ローカル生成。</b> QR コードはブラウザ内で作成されます。', trustTwo: '<b>アップロードなし。</b> テキストや URL はサーバーへ送信されません。',
    articleTitle: 'QR コードの使い道', articleP1: '静的 QR コードはメニュー、チラシ、パッケージ、イベント掲示、Web サイト共有に便利です。宛先を直接エンコードするため、アカウントやリダイレクトサービスは不要です。',
    articleP2: '印刷では大きめの PNG または SVG を使い、公開前にテストしてください。シンプルで高コントラストな QR コードほど読み取りやすくなります。',
    faqTitle: 'よくある質問',
    faq: [['この QR 生成は無料ですか？', 'はい。登録や利用制限なしで QR コードを作成、ダウンロードできます。'], ['QR はローカルで生成されますか？', 'はい。QR 画像はブラウザ内で生成され、テキストや URL はアップロードされません。'], ['商用利用できますか？', 'はい。静的 QR コードは名刺、チラシ、パッケージ、Web サイトで利用できます。'], ['最適な QR サイズは？', 'デジタル用途なら 512 px で十分なことが多いです。印刷では大きめの PNG または SVG を使って実寸でテストしてください。'], ['QR コードに有効期限はありますか？', '静的 QR コードは期限切れになりません。エンコードした URL やテキストが有効な限り使えます。'], ['URL とテキストの QR を作れますか？', 'はい。Web サイト URL またはプレーンテキストを選ぶとプレビューが自動更新されます。']],
    privacyTitle: 'プライバシーポリシー', privacy: '入力した QR 内容を収集、保存、送信しません。生成はブラウザ内でローカルに行われます。',
    termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。印刷または公開前の QR コード確認は利用者の責任です。',
  },
  ko: {
    title: 'QR 생성기 - 무료 온라인 QR 코드 만들기 | ConvertUnlimited',
    description: '브라우저에서 웹사이트와 텍스트용 QR 코드를 만드세요. 무료, 로컬 생성, 실시간 미리보기, PNG 다운로드와 SVG 내보내기.',
    hero: 'QR 생성기', sub: '웹사이트, 텍스트, 공유용 QR 코드를 즉시 만듭니다.',
    eyebrow: '로컬 QR 코드 생성기', panelTitle: '브라우저에서 QR 코드를 생성하세요.',
    panelText: '웹사이트 URL 또는 텍스트를 입력하면 QR 코드가 바로 미리보기되고 PNG 또는 SVG로 다운로드할 수 있습니다. 업로드나 계정은 필요 없습니다.',
    mode: '콘텐츠 유형', url: '웹사이트 URL', text: '일반 텍스트', value: 'QR 내용', placeholder: 'https://example.com',
    size: '크기', margin: '여백', dark: '어두운 색', light: '밝은 색', transparent: '투명 배경',
    png: 'PNG 다운로드', svg: 'SVG 다운로드', status: 'URL 또는 텍스트를 입력해 QR 코드를 생성하세요.',
    trustTitle: '개인정보 보호 설계', trustOne: '<b>로컬 생성.</b> QR 코드는 브라우저에서 생성됩니다.', trustTwo: '<b>업로드 없음.</b> 텍스트나 URL은 서버로 전송되지 않습니다.',
    articleTitle: 'QR 코드는 어디에 쓰나요?', articleP1: '정적 QR 코드는 메뉴, 전단지, 제품 포장, 행사 안내판, 빠른 웹사이트 공유에 유용합니다. 목적지를 직접 인코딩하므로 계정이나 리디렉션 서비스가 필요 없습니다.',
    articleP2: '인쇄용은 더 큰 PNG 또는 SVG를 내려받고 게시 전에 테스트하세요. 단순하고 대비가 높은 QR 코드가 보통 더 잘 스캔됩니다.',
    faqTitle: '자주 묻는 질문',
    faq: [['이 QR 생성기는 무료인가요?', '네. 가입이나 사용 제한 없이 QR 코드를 만들고 다운로드할 수 있습니다.'], ['QR 코드는 로컬에서 생성되나요?', '네. QR 이미지는 브라우저에서 생성되며 텍스트나 URL은 업로드되지 않습니다.'], ['상업적으로 사용할 수 있나요?', '네. 정적 QR 코드는 명함, 전단지, 포장, 웹사이트에 사용할 수 있습니다.'], ['가장 좋은 QR 코드 크기는?', '디지털 용도는 보통 512 px면 충분합니다. 인쇄는 큰 PNG 또는 SVG로 최종 크기에서 테스트하세요.'], ['QR 코드는 만료되나요?', '정적 QR 코드는 만료되지 않습니다. 인코딩된 URL이나 텍스트가 유효한 동안 계속 작동합니다.'], ['URL과 텍스트 QR을 만들 수 있나요?', '네. 웹사이트 URL 또는 일반 텍스트를 선택하면 미리보기가 자동으로 업데이트됩니다.']],
    privacyTitle: '개인정보 처리방침', privacy: '입력한 QR 내용을 수집, 저장 또는 전송하지 않습니다. 생성은 브라우저에서 로컬로 실행됩니다.',
    termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 인쇄 또는 게시 전 QR 코드 테스트는 사용자 책임입니다.',
  },
  es: {
    title: 'Generador QR - Crea códigos QR gratis online | ConvertUnlimited',
    description: 'Crea códigos QR para sitios web y texto en tu navegador. Generador QR local gratis con vista previa, descarga PNG y exportación SVG.',
    hero: 'Generador QR', sub: 'Crea códigos QR al instante para sitios web, texto y compartir.',
    eyebrow: 'Generador QR local', panelTitle: 'Genera un código QR localmente.',
    panelText: 'Introduce una URL o texto, previsualiza el QR al instante y descárgalo como PNG o SVG. Sin subidas ni cuentas.',
    mode: 'Tipo de contenido', url: 'URL de sitio web', text: 'Texto plano', value: 'Contenido QR', placeholder: 'https://example.com',
    size: 'Tamaño', margin: 'Margen', dark: 'Color oscuro', light: 'Color claro', transparent: 'Fondo transparente',
    png: 'Descargar PNG', svg: 'Descargar SVG', status: 'Introduce una URL o texto para generar un QR.',
    trustTitle: 'Privado por diseño', trustOne: '<b>Generación local.</b> Los QR se crean en tu navegador.', trustTwo: '<b>Sin subidas.</b> Tu texto o URL no se envía a un servidor.',
    articleTitle: '¿Para qué sirven los códigos QR?', articleP1: 'Los QR estáticos sirven para menús, flyers, empaques, carteles de eventos y compartir sitios web. Codifican el destino directamente, sin cuenta ni servicio de redirección.',
    articleP2: 'Para impresión, descarga un PNG grande o SVG y pruébalo antes de publicar. Un QR simple y con alto contraste suele escanearse mejor.',
    faqTitle: 'Preguntas frecuentes',
    faq: [['¿Este generador QR es gratis?', 'Sí. Puedes crear y descargar códigos QR sin registro ni límites de uso.'], ['¿Los QR se generan localmente?', 'Sí. La imagen QR se genera en tu navegador; tu texto o URL no se sube.'], ['¿Puedo usar los QR comercialmente?', 'Sí. Los QR estáticos generados aquí pueden usarse en tarjetas, flyers, empaques y sitios web.'], ['¿Cuál es el mejor tamaño para un QR?', 'Para uso digital, 512 px suele bastar. Para impresión, usa PNG grande o SVG y pruébalo al tamaño final.'], ['¿Los QR expiran?', 'Los QR estáticos no expiran. Funcionan mientras el URL o texto codificado siga siendo útil.'], ['¿Puedo generar QR para URL y texto?', 'Sí. Elige URL de sitio web o texto plano y la vista previa se actualiza automáticamente.']],
    privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos ni transmitimos el contenido QR que introduces. La generación ocurre localmente en tu navegador.',
    termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Eres responsable de probar los QR antes de imprimirlos o publicarlos.',
  },
  fr: {
    title: 'Générateur QR - Créer des QR codes gratuits en ligne | ConvertUnlimited',
    description: 'Créez des QR codes pour sites web et texte dans votre navigateur. Générateur QR local gratuit avec aperçu, téléchargement PNG et export SVG.',
    hero: 'Générateur QR', sub: 'Créez instantanément des QR codes pour sites web, texte et partage.',
    eyebrow: 'Générateur QR local', panelTitle: 'Générer un QR code localement.',
    panelText: 'Saisissez une URL ou un texte, prévisualisez le QR code instantanément, puis téléchargez-le en PNG ou SVG. Sans envoi ni compte.',
    mode: 'Type de contenu', url: 'URL de site web', text: 'Texte simple', value: 'Contenu QR', placeholder: 'https://example.com',
    size: 'Taille', margin: 'Marge', dark: 'Couleur foncée', light: 'Couleur claire', transparent: 'Fond transparent',
    png: 'Télécharger PNG', svg: 'Télécharger SVG', status: 'Saisissez une URL ou un texte pour générer un QR code.',
    trustTitle: 'Privé par conception', trustOne: '<b>Génération locale.</b> Les QR codes sont créés dans votre navigateur.', trustTwo: '<b>Aucun envoi.</b> Votre texte ou URL n’est pas envoyé à un serveur.',
    articleTitle: 'À quoi servent les QR codes ?', articleP1: 'Les QR codes statiques sont utiles pour menus, flyers, emballages, panneaux d’événement et partage rapide de sites web. Ils encodent directement la destination, sans compte ni redirection.',
    articleP2: 'Pour l’impression, téléchargez un PNG plus grand ou un SVG et testez-le avant publication. Un QR simple et très contrasté est généralement plus facile à scanner.',
    faqTitle: 'Foire aux questions',
    faq: [['Ce générateur QR est-il gratuit ?', 'Oui. Vous pouvez créer et télécharger des QR codes sans inscription ni limite logicielle.'], ['Les QR codes sont-ils générés localement ?', 'Oui. L’image QR est générée dans votre navigateur; votre texte ou URL n’est pas envoyé.'], ['Puis-je utiliser les QR codes commercialement ?', 'Oui. Les QR codes statiques générés ici peuvent servir sur cartes, flyers, emballages et sites web.'], ['Quelle est la meilleure taille de QR code ?', 'Pour le numérique, 512 px suffit souvent. Pour l’impression, utilisez un grand PNG ou SVG et testez à la taille finale.'], ['Les QR codes expirent-ils ?', 'Les QR codes statiques n’expirent pas. Ils fonctionnent tant que l’URL ou le texte encodé reste utile.'], ['Puis-je générer des QR pour URL et texte ?', 'Oui. Choisissez URL de site web ou texte simple; l’aperçu se met à jour automatiquement.']],
    privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons ni transmettons le contenu QR saisi. La génération se fait localement dans votre navigateur.',
    termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Vous êtes responsable de tester les QR codes avant impression ou publication.',
  },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/qr-generator/`;
const home = (l) => l.prefix ? `/${l.prefix}/` : '/';
const abs = (l) => `https://www.convertunlimited.com${route(l)}`;
const alternates = () => `${LOCALES.map((l) => `    <link rel="alternate" hreflang="${l.hreflang}" href="${abs(l)}">`).join('\n')}\n    <link rel="alternate" hreflang="x-default" href="${abs(LOCALES[0])}">`;
const link = (l, slug) => `${l.prefix ? `/${l.prefix}` : ''}${slug ? `/${slug}/` : '/'}`;

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
                <details class="tools-dropdown">
                    <summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>
                    <div class="dropdown-menu" role="menu">
                        <div class="dropdown-section">Image Tools</div>
                        <a href="${link(locale, '')}">Image Converter</a>
                        <a href="${link(locale, 'avif-converter')}">AVIF Converter</a>
                        <a href="${link(locale, 'image-compressor')}">Image Compressor</a>
                        <div class="dropdown-section">SEO Tools</div>
                        <a href="${link(locale, 'qr-generator')}" aria-current="page">QR Generator</a>
                    </div>
                </details>
                <details class="lang-switcher">
                    <summary aria-label="Language"><span aria-hidden="true">🌐</span> ${locale.label}</summary>
                    <div class="lang-menu" role="menu">
${LOCALES.map((l) => `                        <a href="${route(l)}" hreflang="${l.hreflang}" lang="${l.hreflang}"${l.code === locale.code ? ' aria-current="page"' : ''}>${l.name}</a>`).join('\n')}
                    </div>
                </details>
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
                                <label class="range-field" for="qr-mode"><span>${esc(t.mode)}</span><select id="qr-mode"><option value="url">${esc(t.url)}</option><option value="text">${esc(t.text)}</option></select></label>
                                <label class="range-field" for="qr-value"><span>${esc(t.value)}</span><textarea id="qr-value" rows="4" placeholder="${esc(t.placeholder)}" style="width:100%;resize:vertical;"></textarea></label>
                                <label class="range-field" for="qr-size"><span>${esc(t.size)}</span><select id="qr-size"><option value="256">256 px</option><option value="512" selected>512 px</option><option value="1024">1024 px</option></select></label>
                                <label class="range-field" for="qr-margin"><span>${esc(t.margin)}</span><select id="qr-margin"><option value="2">2</option><option value="4" selected>4</option><option value="6">6</option></select></label>
                                <label class="range-field" for="qr-dark"><span>${esc(t.dark)}</span><input id="qr-dark" type="color" value="#111111"></label>
                                <label class="range-field" for="qr-light"><span>${esc(t.light)}</span><input id="qr-light" type="color" value="#ffffff"></label>
                                <label class="range-field" for="qr-transparent"><span>${esc(t.transparent)}</span><input id="qr-transparent" type="checkbox"></label>
                                <button class="btn btn-accent" id="qr-download-png" disabled>${esc(t.png)}</button>
                                <button class="btn btn-ghost" id="qr-download-svg" disabled>${esc(t.svg)}</button>
                            </div>
                            <p class="bg-status" id="qr-status">${esc(t.status)}</p>
                        </div>
                        <div class="bg-panel" style="display:grid;place-items:center;">
                            <canvas id="qr-canvas" width="512" height="512" style="width:min(100%,360px);height:auto;background:var(--bg);border:1px solid var(--line);border-radius:8px;"></canvas>
                        </div>
                    </div>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_QR_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar">
                    <div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_QR_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div>
                    <div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div>
                </aside>
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
        <footer class="footer"><div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — runs entirely in your browser.</div><nav class="links" aria-label="Footer"><a href="${link(locale, 'tools')}">Tools</a><a href="${route(locale)}#how">QR guide</a><a href="${route(locale)}#faq">FAQ</a><a href="${route(locale)}#privacy">Privacy</a><a href="${route(locale)}#terms">Terms</a></nav></footer>
    </div>
    <script src="/qr-generator/qr-generator.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'qr-generator');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized QR generator pages');
