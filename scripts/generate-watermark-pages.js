const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'Watermark Tool - Add Text Watermark to Images | ConvertUnlimited',
    description: 'Add a text watermark to images in your browser. Adjust position, opacity, and size, preview locally, and download a watermarked PNG without uploads.',
    hero: 'Watermark Tool',
    sub: 'Add a text watermark to an image directly in your browser.',
    eyebrow: 'Local image watermarking',
    panelTitle: 'Create a watermarked image.',
    panelText: 'Choose an image, edit the watermark text, adjust placement, opacity, and size, then export a PNG. Selected image contents are processed locally in your browser.',
    dropTitle: 'Choose image',
    dropHint: 'JPG, PNG, WebP, or browser-supported image',
    text: 'Watermark text',
    position: 'Position',
    opacity: 'Opacity',
    size: 'Size',
    download: 'Download PNG',
    clear: 'Clear',
    preview: 'Preview',
    empty: 'Image preview will appear here.',
    trustTitle: 'Why it is private',
    trustOne: '<b>Browser-based.</b> The watermark is drawn locally with Canvas.',
    trustTwo: '<b>Local processing.</b> Image contents are processed locally in your browser.',
    articleTitle: 'When should you watermark an image?',
    articleP1: 'Watermarks help mark ownership, prepare drafts, label previews, and share images while keeping brand or source context visible.',
    articleP2: 'Keep watermarks readable without covering important image details. For privacy-sensitive photos, remove metadata before publishing.',
    faqTitle: 'Frequently Asked Questions',
    faq: [['Is this Watermark Tool free?', 'Yes. You can add and download a text watermark without signup.'], ['Are my images sent to ConvertUnlimited servers?', 'No server-side upload endpoint is used for this watermarking flow. The image is processed locally in your browser.'], ['Can I change watermark position?', 'Yes. Choose corner, center, or edge positions before exporting.'], ['Can I adjust opacity and size?', 'Yes. Use the sliders to tune the watermark preview.'], ['What format is exported?', 'The tool exports a PNG image from the browser canvas.']],
    privacyTitle: 'Privacy Policy',
    privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this watermarking flow. Selected image contents are processed locally in your browser.',
    termsTitle: 'Terms of Use',
    terms: 'ConvertUnlimited is provided as is. You are responsible for the images and watermark text you create.',
  },
  th: {
    title: 'เครื่องมือใส่ลายน้ำ - เพิ่มข้อความลายน้ำบนรูปภาพ | ConvertUnlimited',
    description: 'เพิ่มข้อความลายน้ำบนรูปภาพในเบราว์เซอร์ ปรับตำแหน่ง ความทึบ และขนาด ดูตัวอย่างในเครื่อง แล้วดาวน์โหลด PNG โดยไม่อัปโหลด',
    hero: 'เครื่องมือใส่ลายน้ำ',
    sub: 'เพิ่มข้อความลายน้ำบนรูปภาพในเบราว์เซอร์ของคุณ',
    eyebrow: 'ใส่ลายน้ำรูปภาพในเครื่อง',
    panelTitle: 'สร้างรูปภาพพร้อมลายน้ำ',
    panelText: 'เลือกรูปภาพ แก้ข้อความลายน้ำ ปรับตำแหน่ง ความทึบ และขนาด แล้วส่งออกเป็น PNG รูปภาพอยู่บนอุปกรณ์ของคุณ',
    dropTitle: 'เลือกรูปภาพ',
    dropHint: 'JPG, PNG, WebP หรือรูปภาพที่เบราว์เซอร์รองรับ',
    text: 'ข้อความลายน้ำ',
    position: 'ตำแหน่ง',
    opacity: 'ความทึบ',
    size: 'ขนาด',
    download: 'ดาวน์โหลด PNG',
    clear: 'ล้าง',
    preview: 'ตัวอย่าง',
    empty: 'ตัวอย่างรูปภาพจะแสดงที่นี่',
    trustTitle: 'ทำไมจึงเป็นส่วนตัว',
    trustOne: '<b>ทำงานในเบราว์เซอร์</b> ลายน้ำถูกวาดในเครื่องด้วย Canvas',
    trustTwo: '<b>ไม่อัปโหลด</b> รูปภาพไม่ถูกส่งไปเซิร์ฟเวอร์',
    articleTitle: 'ควรใส่ลายน้ำรูปภาพเมื่อใด',
    articleP1: 'ลายน้ำช่วยระบุเจ้าของ เตรียมภาพร่าง ติดป้าย preview และแชร์ภาพพร้อมบริบทของแบรนด์หรือแหล่งที่มา',
    articleP2: 'ควรให้ลายน้ำอ่านง่ายแต่ไม่บังรายละเอียดสำคัญ หากเป็นภาพที่มีข้อมูลส่วนตัว ควรลบ metadata ก่อนเผยแพร่',
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [['เครื่องมือนี้ฟรีไหม?', 'ฟรี เพิ่มและดาวน์โหลดข้อความลายน้ำได้โดยไม่ต้องสมัคร'], ['รูปภาพถูกอัปโหลดไหม?', 'ไม่ รูปภาพถูกประมวลผลในเบราว์เซอร์'], ['เปลี่ยนตำแหน่งลายน้ำได้ไหม?', 'ได้ เลือกมุม กึ่งกลาง หรือขอบก่อนส่งออก'], ['ปรับความทึบและขนาดได้ไหม?', 'ได้ ใช้สไลเดอร์ปรับตัวอย่าง'], ['ส่งออกเป็นไฟล์อะไร?', 'เครื่องมือส่งออกเป็น PNG จาก canvas ของเบราว์เซอร์']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว',
    privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ส่งรูปภาพที่ใช้ในเครื่องมือนี้',
    termsTitle: 'ข้อกำหนดการใช้งาน',
    terms: 'ConvertUnlimited ให้บริการตามสภาพจริง คุณรับผิดชอบรูปภาพและข้อความลายน้ำที่สร้าง',
  },
  vi: {
    title: 'Công cụ Watermark - Thêm watermark văn bản vào ảnh | ConvertUnlimited',
    description: 'Thêm watermark văn bản vào ảnh trong trình duyệt. Chỉnh vị trí, độ mờ, kích thước, xem trước cục bộ và tải PNG không upload.',
    hero: 'Công cụ Watermark',
    sub: 'Thêm watermark văn bản vào ảnh ngay trong trình duyệt.',
    eyebrow: 'Watermark ảnh cục bộ',
    panelTitle: 'Tạo ảnh có watermark.',
    panelText: 'Chọn ảnh, sửa chữ watermark, chỉnh vị trí, độ mờ và kích thước rồi xuất PNG. Ảnh ở lại trên thiết bị.',
    dropTitle: 'Chọn ảnh',
    dropHint: 'JPG, PNG, WebP hoặc ảnh trình duyệt hỗ trợ',
    text: 'Văn bản watermark',
    position: 'Vị trí',
    opacity: 'Độ mờ',
    size: 'Kích thước',
    download: 'Tải PNG',
    clear: 'Xóa',
    preview: 'Xem trước',
    empty: 'Bản xem trước ảnh sẽ xuất hiện ở đây.',
    trustTitle: 'Vì sao riêng tư',
    trustOne: '<b>Chạy trong trình duyệt.</b> Watermark được vẽ cục bộ bằng Canvas.',
    trustTwo: '<b>Không upload.</b> Ảnh không được gửi lên server.',
    articleTitle: 'Khi nào nên watermark ảnh?',
    articleP1: 'Watermark giúp đánh dấu sở hữu, chuẩn bị bản nháp, gắn nhãn preview và chia sẻ ảnh với ngữ cảnh thương hiệu hoặc nguồn.',
    articleP2: 'Giữ watermark dễ đọc nhưng không che chi tiết quan trọng. Với ảnh nhạy cảm, hãy xóa metadata trước khi đăng.',
    faqTitle: 'Câu hỏi thường gặp',
    faq: [['Công cụ này miễn phí không?', 'Có. Bạn có thể thêm và tải watermark văn bản không cần đăng ký.'], ['Ảnh có được upload không?', 'Không. Ảnh được xử lý cục bộ trong trình duyệt.'], ['Có đổi vị trí watermark không?', 'Có. Chọn góc, giữa hoặc cạnh trước khi xuất.'], ['Có chỉnh độ mờ và kích thước không?', 'Có. Dùng slider để chỉnh bản xem trước.'], ['Xuất định dạng nào?', 'Công cụ xuất ảnh PNG từ canvas của trình duyệt.']],
    privacyTitle: 'Chính sách quyền riêng tư',
    privacy: 'Chúng tôi không thu thập, lưu trữ, upload hoặc truyền ảnh dùng trong công cụ này.',
    termsTitle: 'Điều khoản sử dụng',
    terms: 'ConvertUnlimited được cung cấp nguyên trạng. Bạn chịu trách nhiệm với ảnh và chữ watermark tạo ra.',
  },
  zh: {
    title: '水印工具 - 给图片添加文字水印 | ConvertUnlimited',
    description: '在浏览器中给图片添加文字水印。调整位置、透明度和大小，本地预览并下载 PNG，无需上传。',
    hero: '水印工具',
    sub: '直接在浏览器中给图片添加文字水印。',
    eyebrow: '本地图片水印工具',
    panelTitle: '创建带水印的图片。',
    panelText: '选择图片，编辑水印文字，调整位置、透明度和大小，然后导出 PNG。图片会留在你的设备上。',
    dropTitle: '选择图片',
    dropHint: 'JPG、PNG、WebP 或浏览器支持的图片',
    text: '水印文字',
    position: '位置',
    opacity: '透明度',
    size: '大小',
    download: '下载 PNG',
    clear: '清空',
    preview: '预览',
    empty: '图片预览会显示在这里。',
    trustTitle: '为什么更私密',
    trustOne: '<b>基于浏览器。</b> 水印通过 Canvas 在本地绘制。',
    trustTwo: '<b>无需上传。</b> 图片不会发送到服务器。',
    articleTitle: '什么时候给图片加水印？',
    articleP1: '水印可用于标记所有权、准备草稿、标注预览，以及在分享图片时保留品牌或来源信息。',
    articleP2: '水印应保持可读，同时不要遮挡重要细节。发布隐私敏感照片前，建议先移除 metadata。',
    faqTitle: '常见问题',
    faq: [['这个水印工具免费吗？', '免费。无需注册即可添加并下载文字水印。'], ['我的图片会上传吗？', '不会。图片会在浏览器中本地处理。'], ['可以更改水印位置吗？', '可以。导出前可选择角落、中间或边缘位置。'], ['可以调整透明度和大小吗？', '可以。使用滑块调整预览。'], ['导出什么格式？', '工具会从浏览器 canvas 导出 PNG 图片。']],
    privacyTitle: '隐私政策',
    privacy: '我们不会收集、存储、上传或传输此工具中使用的图片。',
    termsTitle: '使用条款',
    terms: 'ConvertUnlimited 按原样提供。你需对创建的图片和水印文字负责。',
  },
  ja: {
    title: 'ウォーターマークツール - 画像に文字ウォーターマークを追加 | ConvertUnlimited',
    description: 'ブラウザ内で画像に文字ウォーターマークを追加。位置、透明度、サイズを調整し、ローカルでプレビューして PNG をダウンロードできます。',
    hero: 'ウォーターマークツール',
    sub: 'ブラウザ内で画像に文字ウォーターマークを追加します。',
    eyebrow: 'ローカル画像ウォーターマーク',
    panelTitle: 'ウォーターマーク付き画像を作成。',
    panelText: '画像を選び、文字を編集し、位置、透明度、サイズを調整して PNG を書き出します。画像は端末内に留まります。',
    dropTitle: '画像を選択',
    dropHint: 'JPG、PNG、WebP、またはブラウザ対応画像',
    text: 'ウォーターマーク文字',
    position: '位置',
    opacity: '透明度',
    size: 'サイズ',
    download: 'PNG をダウンロード',
    clear: 'クリア',
    preview: 'プレビュー',
    empty: '画像プレビューがここに表示されます。',
    trustTitle: 'プライバシーについて',
    trustOne: '<b>ブラウザ内で処理。</b> ウォーターマークは Canvas でローカル描画されます。',
    trustTwo: '<b>アップロードなし。</b> 画像はサーバーへ送信されません。',
    articleTitle: 'いつ画像にウォーターマークを入れるべき？',
    articleP1: 'ウォーターマークは所有者表示、下書き、プレビューラベル、ブランドや出典を残した共有に役立ちます。',
    articleP2: '重要な画像内容を隠さず、読みやすい配置にしてください。プライバシーが気になる写真は公開前に metadata を削除しましょう。',
    faqTitle: 'よくある質問',
    faq: [['無料で使えますか？', 'はい。登録なしで文字ウォーターマークを追加してダウンロードできます。'], ['画像はアップロードされますか？', 'いいえ。画像はブラウザ内でローカル処理されます。'], ['位置を変更できますか？', 'はい。書き出し前に角、中央、端を選べます。'], ['透明度とサイズを調整できますか？', 'はい。スライダーでプレビューを調整できます。'], ['出力形式は？', 'ブラウザ canvas から PNG 画像を書き出します。']],
    privacyTitle: 'プライバシーポリシー',
    privacy: 'このツールで使う画像を収集、保存、アップロード、送信しません。',
    termsTitle: '利用規約',
    terms: 'ConvertUnlimited は現状のまま提供されます。作成する画像とウォーターマーク文字は利用者の責任です。',
  },
  ko: {
    title: '워터마크 도구 - 이미지에 텍스트 워터마크 추가 | ConvertUnlimited',
    description: '브라우저에서 이미지에 텍스트 워터마크를 추가하세요. 위치, 투명도, 크기를 조정하고 로컬 미리보기 후 PNG로 다운로드합니다.',
    hero: '워터마크 도구',
    sub: '브라우저에서 이미지에 텍스트 워터마크를 추가합니다.',
    eyebrow: '로컬 이미지 워터마크',
    panelTitle: '워터마크 이미지를 만드세요.',
    panelText: '이미지를 선택하고 워터마크 텍스트, 위치, 투명도, 크기를 조정한 뒤 PNG로 내보냅니다. 이미지는 기기에 남아 있습니다.',
    dropTitle: '이미지 선택',
    dropHint: 'JPG, PNG, WebP 또는 브라우저 지원 이미지',
    text: '워터마크 텍스트',
    position: '위치',
    opacity: '투명도',
    size: '크기',
    download: 'PNG 다운로드',
    clear: '지우기',
    preview: '미리보기',
    empty: '이미지 미리보기가 여기에 표시됩니다.',
    trustTitle: '개인정보가 보호되는 이유',
    trustOne: '<b>브라우저 기반.</b> 워터마크는 Canvas로 로컬에서 그려집니다.',
    trustTwo: '<b>업로드 없음.</b> 이미지는 서버로 전송되지 않습니다.',
    articleTitle: '언제 이미지에 워터마크를 넣나요?',
    articleP1: '워터마크는 소유권 표시, 초안 준비, 미리보기 라벨, 브랜드나 출처 맥락을 유지한 공유에 유용합니다.',
    articleP2: '중요한 이미지 세부 정보를 가리지 않으면서 읽기 쉽게 배치하세요. 민감한 사진은 게시 전 metadata 제거도 고려하세요.',
    faqTitle: '자주 묻는 질문',
    faq: [['무료인가요?', '네. 가입 없이 텍스트 워터마크를 추가하고 다운로드할 수 있습니다.'], ['이미지가 업로드되나요?', '아니요. 이미지는 브라우저에서 로컬로 처리됩니다.'], ['워터마크 위치를 바꿀 수 있나요?', '네. 내보내기 전에 모서리, 중앙 또는 가장자리 위치를 선택할 수 있습니다.'], ['투명도와 크기를 조정할 수 있나요?', '네. 슬라이더로 미리보기를 조정하세요.'], ['어떤 형식으로 내보내나요?', '브라우저 canvas에서 PNG 이미지로 내보냅니다.']],
    privacyTitle: '개인정보 처리방침',
    privacy: '이 도구에서 사용하는 이미지를 수집, 저장, 업로드 또는 전송하지 않습니다.',
    termsTitle: '이용 약관',
    terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 생성한 이미지와 워터마크 텍스트는 사용자 책임입니다.',
  },
  es: {
    title: 'Herramienta de marca de agua - Añadir texto a imágenes | ConvertUnlimited',
    description: 'Añade una marca de agua de texto a imágenes en tu navegador. Ajusta posición, opacidad y tamaño, previsualiza localmente y descarga PNG sin subidas.',
    hero: 'Herramienta de marca de agua',
    sub: 'Añade una marca de agua de texto a una imagen directamente en tu navegador.',
    eyebrow: 'Marca de agua local para imágenes',
    panelTitle: 'Crea una imagen con marca de agua.',
    panelText: 'Elige una imagen, edita el texto, ajusta posición, opacidad y tamaño, y exporta PNG. Tu imagen permanece en tu dispositivo.',
    dropTitle: 'Elegir imagen',
    dropHint: 'JPG, PNG, WebP o imagen compatible con el navegador',
    text: 'Texto de marca de agua',
    position: 'Posición',
    opacity: 'Opacidad',
    size: 'Tamaño',
    download: 'Descargar PNG',
    clear: 'Limpiar',
    preview: 'Vista previa',
    empty: 'La vista previa aparecerá aquí.',
    trustTitle: 'Por qué es privado',
    trustOne: '<b>Basado en navegador.</b> La marca de agua se dibuja localmente con Canvas.',
    trustTwo: '<b>Sin subidas.</b> Las imágenes no se envían a un servidor.',
    articleTitle: '¿Cuándo usar una marca de agua?',
    articleP1: 'Las marcas de agua ayudan a señalar propiedad, preparar borradores, etiquetar previews y compartir imágenes con contexto de marca o fuente.',
    articleP2: 'Mantén la marca legible sin cubrir detalles importantes. Para fotos sensibles, elimina metadata antes de publicar.',
    faqTitle: 'Preguntas frecuentes',
    faq: [['¿Es gratis?', 'Sí. Puedes añadir y descargar una marca de agua de texto sin registro.'], ['¿Mis imágenes se suben?', 'No. La imagen se procesa localmente en tu navegador.'], ['¿Puedo cambiar la posición?', 'Sí. Elige esquinas, centro o bordes antes de exportar.'], ['¿Puedo ajustar opacidad y tamaño?', 'Sí. Usa los sliders para ajustar la vista previa.'], ['¿Qué formato exporta?', 'La herramienta exporta una imagen PNG desde el canvas del navegador.']],
    privacyTitle: 'Política de privacidad',
    privacy: 'No recopilamos, almacenamos, subimos ni transmitimos imágenes usadas en esta herramienta.',
    termsTitle: 'Términos de uso',
    terms: 'ConvertUnlimited se proporciona tal cual. Eres responsable de las imágenes y textos de marca de agua que creas.',
  },
  fr: {
    title: 'Outil filigrane - Ajouter un filigrane texte aux images | ConvertUnlimited',
    description: 'Ajoutez un filigrane texte aux images dans votre navigateur. Réglez position, opacité et taille, prévisualisez localement et téléchargez un PNG sans envoi.',
    hero: 'Outil filigrane',
    sub: 'Ajoutez un filigrane texte à une image directement dans votre navigateur.',
    eyebrow: 'Filigrane image local',
    panelTitle: 'Créez une image avec filigrane.',
    panelText: 'Choisissez une image, modifiez le texte, réglez position, opacité et taille, puis exportez un PNG. Votre image reste sur votre appareil.',
    dropTitle: 'Choisir une image',
    dropHint: 'JPG, PNG, WebP ou image compatible navigateur',
    text: 'Texte du filigrane',
    position: 'Position',
    opacity: 'Opacité',
    size: 'Taille',
    download: 'Télécharger PNG',
    clear: 'Effacer',
    preview: 'Aperçu',
    empty: 'L’aperçu de l’image apparaîtra ici.',
    trustTitle: 'Pourquoi c’est privé',
    trustOne: '<b>Basé sur le navigateur.</b> Le filigrane est dessiné localement avec Canvas.',
    trustTwo: '<b>Aucun envoi.</b> Les images ne sont pas envoyées à un serveur.',
    articleTitle: 'Quand ajouter un filigrane ?',
    articleP1: 'Les filigranes aident à marquer la propriété, préparer des brouillons, étiqueter des aperçus et partager des images avec contexte de marque ou source.',
    articleP2: 'Gardez le filigrane lisible sans couvrir les détails importants. Pour les photos sensibles, supprimez les metadata avant publication.',
    faqTitle: 'Foire aux questions',
    faq: [['Cet outil est-il gratuit ?', 'Oui. Vous pouvez ajouter et télécharger un filigrane texte sans inscription.'], ['Mes images sont-elles envoyées ?', 'Non. L’image est traitée localement dans votre navigateur.'], ['Puis-je changer la position ?', 'Oui. Choisissez coins, centre ou bords avant export.'], ['Puis-je régler opacité et taille ?', 'Oui. Utilisez les sliders pour ajuster l’aperçu.'], ['Quel format est exporté ?', 'L’outil exporte une image PNG depuis le canvas du navigateur.']],
    privacyTitle: 'Politique de confidentialité',
    privacy: 'Nous ne collectons, stockons, envoyons ni transmettons les images utilisées dans cet outil.',
    termsTitle: 'Conditions d’utilisation',
    terms: 'ConvertUnlimited est fourni tel quel. Vous êtes responsable des images et textes de filigrane créés.',
  },
};

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const route = (locale) => `${locale.prefix ? `/${locale.prefix}` : ''}/watermark-tool/`;
const home = (locale) => locale.prefix ? `/${locale.prefix}/` : '/';
const abs = (locale) => `${BASE_URL}${route(locale)}`;
const link = (locale, slug) => `${locale.prefix ? `/${locale.prefix}` : ''}${slug ? `/${slug}/` : '/'}`;
const alternates = () => `${LOCALES.map((locale) => `    <link rel="alternate" hreflang="${locale.hreflang}" href="${abs(locale)}">`).join('\n')}\n    <link rel="alternate" hreflang="x-default" href="${abs(LOCALES[0])}">`;

function page(locale) {
  const text = TEXT[locale.code];
  return `<!DOCTYPE html>
<html lang="${locale.hreflang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(text.title)}</title>
    <meta name="description" content="${esc(text.description)}">
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
    <style>.watermark-preview{width:100%;max-height:520px;object-fit:contain;border:1px solid var(--line);border-radius:8px;background:var(--bg-2)}.watermark-empty{display:grid;min-height:280px;place-items:center;border:1px dashed var(--line);border-radius:8px;color:var(--ink-3);text-align:center;padding:24px}.watermark-select{width:100%;min-height:42px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);padding:0 10px}</style>
    ${schemaScripts(text, locale, { url: abs(locale) })}
</head>
<body>
    <div class="app">
        <header class="topbar">
            <a href="${home(locale)}" class="brand" aria-label="ConvertUnlimited home"><span class="mark" aria-hidden="true"></span><span class="word"><b>Convert</b><span>Unlimited</span></span></a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>100% free, no signup</span>
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">Image Tools</div><a href="${link(locale, '')}">Image Converter</a><a href="${link(locale, 'image-compressor')}">Image Compressor</a><a href="${link(locale, 'image-resizer')}">Image Resizer</a><a href="${link(locale, 'metadata-remover')}">Metadata Remover</a><a href="${link(locale, 'watermark-tool')}" aria-current="page">Watermark Tool</a><a href="${link(locale, 'avif-converter')}">AVIF Converter</a></div></details>
                <details class="lang-switcher"><summary aria-label="Language"><span aria-hidden="true">🌐</span> ${locale.label}</summary><div class="lang-menu" role="menu">
${LOCALES.map((item) => `                        <a href="${route(item)}" hreflang="${item.hreflang}" lang="${item.hreflang}"${item.code === locale.code ? ' aria-current="page"' : ''}>${item.name}</a>`).join('\n')}
                    </div></details>
            </nav>
        </header>
        <main>
            <section class="hero"><h1 class="hero-title">${esc(text.hero)}</h1><p class="sub hero-sub">${esc(text.sub)}</p></section>
            <div class="grid" id="layout">
                <section class="bg-tool" aria-label="${esc(text.hero)}">
                    <div class="bg-tool-head"><div><p class="section-eyebrow">${esc(text.eyebrow)}</p><h2>${esc(text.panelTitle)}</h2><p>${esc(text.panelText)}</p></div></div>
                    <div class="bg-workbench">
                        <div class="bg-panel">
                            <div class="bg-drop" id="watermark-dropzone" tabindex="0" role="button" aria-label="${esc(text.dropTitle)}">
                                <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 7v6c0 5 8 8 8 8s8-3 8-8V7l-8-4Z"/><path d="M9 12h6"/></svg></div>
                                <div class="title">${esc(text.dropTitle)}</div>
                                <div class="hint">${esc(text.dropHint)}</div>
                                <input type="file" id="watermark-file-input" accept="image/*" hidden>
                            </div>
                            <div class="bg-controls" style="margin-top:16px;">
                                <label class="range-field" for="watermark-text"><span>${esc(text.text)}</span><input id="watermark-text" type="text" value="ConvertUnlimited" style="width:100%;min-height:42px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);padding:0 10px;"></label>
                                <label class="range-field" for="watermark-position"><span>${esc(text.position)}</span><select id="watermark-position" class="watermark-select"><option value="top-left">Top left</option><option value="top-center">Top center</option><option value="top-right">Top right</option><option value="middle-left">Middle left</option><option value="middle-center">Center</option><option value="middle-right">Middle right</option><option value="bottom-left">Bottom left</option><option value="bottom-center">Bottom center</option><option value="bottom-right" selected>Bottom right</option></select></label>
                                <label class="range-field" for="watermark-opacity"><span>${esc(text.opacity)}</span><input id="watermark-opacity" type="range" min="10" max="100" value="70"><span class="mono num" id="watermark-opacity-value">70%</span></label>
                                <label class="range-field" for="watermark-size"><span>${esc(text.size)}</span><input id="watermark-size" type="range" min="2" max="18" value="6"><span class="mono num" id="watermark-size-value">6%</span></label>
                                <button class="btn btn-accent" id="watermark-download" type="button" disabled>${esc(text.download)}</button>
                                <button class="btn btn-ghost" id="watermark-clear" type="button">${esc(text.clear)}</button>
                            </div>
                            <p class="bg-status" id="watermark-status"></p>
                        </div>
                        <div class="bg-panel">
                            <div class="range-field"><span>${esc(text.preview)}</span><div id="watermark-empty" class="watermark-empty">${esc(text.empty)}</div><canvas id="watermark-canvas" class="watermark-preview" hidden></canvas></div>
                        </div>
                    </div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="rail-card trust"><h3>${esc(text.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${text.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${text.trustTwo}</div></div></div></aside>
            </div>
${aeoSummary(text, esc)}
            <section id="how" class="article"><h2>${esc(text.articleTitle)}</h2><p>${esc(text.articleP1)}</p><p>${esc(text.articleP2)}</p></section>
            <section id="faq" class="article"><h2>${esc(text.faqTitle)}</h2>
${text.faq.map(([q, a]) => `                <h3>${esc(q)}</h3>\n                <p>${esc(a)}</p>`).join('\n')}
            </section>
            <section id="privacy" class="article"><h2>${esc(text.privacyTitle)}</h2><p>${esc(text.privacy)}</p></section>
            <section id="terms" class="article"><h2>${esc(text.termsTitle)}</h2><p>${esc(text.terms)}</p></section>
<!-- RELATED_TOOLS_START -->
<!-- RELATED_TOOLS_END -->
        </main>
        <footer class="footer"><div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — ${locale.footerProcessing || 'supported processing runs in your browser'}.</div><nav class="links" aria-label="Footer"><a href="${link(locale, 'tools')}">${locale.toolsLabel || 'Tools'}</a><a href="${route(locale)}#how">${locale.guideLabel || 'Guide'}</a><a href="${route(locale)}#faq">${locale.faqLabel || 'FAQ'}</a><a href="${route(locale)}#privacy">${locale.privacyLabel || 'Privacy'}</a><a href="${route(locale)}#terms">${locale.termsLabel || 'Terms'}</a></nav></footer>
    </div>
    <script src="/watermark-tool/watermark-tool.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'watermark-tool');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}

console.log('Generated localized Watermark Tool pages');
