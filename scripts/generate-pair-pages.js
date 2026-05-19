const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';

const LOCALES = require('./data/locales');

const FORMAT_INFO = {
  en: {
    webp: "WebP reduces image file sizes while preserving quality. It supports both lossy and lossless compression and transparency.",
    png: "PNG (Portable Network Graphics) is a lossless format that supports transparency and is ideal for graphics, logos, and screenshots.",
    jpg: "JPG (or JPEG) is a widely supported lossy format optimized for photos and complex images, balancing quality and file size."
  },
  th: {
    webp: "WebP ช่วยลดขนาดไฟล์ภาพในขณะที่ยังรักษาคุณภาพไว้ได้ดี รองรับทั้งการบีบอัดแบบสูญเสียและไม่สูญเสียข้อมูล รวมถึงความโปร่งใส",
    png: "PNG (Portable Network Graphics) เป็นรูปแบบไฟล์ที่ไม่สูญเสียคุณภาพ รองรับความโปร่งใส และเหมาะสำหรับกราฟิก โลโก้ และภาพหน้าจอ",
    jpg: "JPG (หรือ JPEG) เป็นรูปแบบไฟล์ที่สูญเสียข้อมูลบางส่วนซึ่งได้รับการยอมรับอย่างกว้างขวาง ปรับให้เหมาะกับภาพถ่ายและภาพที่มีความซับซ้อน โดยรักษาสมดุลระหว่างคุณภาพและขนาดไฟล์"
  },
  vi: {
    webp: "WebP giảm kích thước tệp hình ảnh trong khi vẫn giữ được chất lượng. Nó hỗ trợ cả nén có tổn hao và không tổn hao cũng như độ trong suốt.",
    png: "PNG (Portable Network Graphics) là định dạng không tổn hao hỗ trợ độ trong suốt và lý tưởng cho đồ họa, logo và ảnh chụp màn hình.",
    jpg: "JPG (hoặc JPEG) là định dạng nén có tổn hao được hỗ trợ rộng rãi, tối ưu hóa cho ảnh chụp và hình ảnh phức tạp, cân bằng giữa chất lượng và kích thước tệp."
  },
  zh: {
    webp: "WebP 在保持质量的同时缩小了图像文件大小。它支持有损和无损压缩以及透明度。",
    png: "PNG (便携式网络图形) 是一种无损格式，支持透明度，非常适合图形、徽标和屏幕截图。",
    jpg: "JPG (或 JPEG) 是一种广泛支持的有损格式，专为照片和复杂图像而优化，平衡了质量和文件大小。"
  },
  ja: {
    webp: "WebP は品質を維持しながら画像ファイルサイズを削減します。有損失および無損失圧縮の両方と透明度をサポートしています。",
    png: "PNG (Portable Network Graphics) は透明度をサポートする無損失形式であり、グラフィック、ロゴ、スクリーンショットに最適です。",
    jpg: "JPG (または JPEG) は広くサポートされている有損失形式であり、写真や複雑な画像向けに最適化され、品質とファイルサイズのバランスをとっています。"
  },
  ko: {
    webp: "WebP는 품질을 유지하면서 이미지 파일 크기를 줄입니다. 손실 및 무손실 압축과 투명도를 모두 지원합니다.",
    png: "PNG(Portable Network Graphics)는 투명도를 지원하는 무손실 형식으로 그래픽, 로고 및 스크린샷에 이상적입니다.",
    jpg: "JPG(또는 JPEG)는 사진과 복잡한 이미지에 최적화된 널리 지원되는 손실 형식으로 품질과 파일 크기의 균형을 맞춥니다."
  },
  es: {
    webp: "WebP reduce el tamaño de los archivos de imagen conservando la calidad. Admite compresión con y sin pérdida y transparencia.",
    png: "PNG (Portable Network Graphics) es un formato sin pérdida que admite transparencia y es ideal para gráficos, logotipos y capturas de pantalla.",
    jpg: "JPG (o JPEG) es un formato con pérdida ampliamente compatible optimizado para fotos e imágenes complejas, que equilibra la calidad y el tamaño del archivo."
  },
  fr: {
    webp: "WebP réduit la taille des fichiers image tout en préservant la qualité. Il prend en charge la compression avec et sans perte ainsi que la transparence.",
    png: "Le PNG (Portable Network Graphics) est un format sans perte qui prend en charge la transparence et est idéal pour les graphiques, les logos et les captures d'écran.",
    jpg: "Le JPG (ou JPEG) est un format avec perte largement pris en charge, optimisé pour les photos et les images complexes, équilibrant qualité et taille de fichier."
  }
};

const PAIRS = [
  { slug: 'png-to-webp', source: 'PNG', target: 'webp', targetLabel: 'WebP', sourceKey: 'png', targetKey: 'webp', guideSlug: 'webp-vs-png' },
  { slug: 'jpg-to-webp', source: 'JPG', target: 'webp', targetLabel: 'WebP', sourceKey: 'jpg', targetKey: 'webp', guideSlug: 'webp-vs-jpg' },
  { slug: 'webp-to-jpg', source: 'WebP', target: 'jpeg', targetLabel: 'JPEG', sourceKey: 'webp', targetKey: 'jpg', guideSlug: 'webp-vs-jpg' },
  { slug: 'webp-to-png', source: 'WebP', target: 'png', targetLabel: 'PNG', sourceKey: 'webp', targetKey: 'png', guideSlug: 'webp-vs-png' },
  { slug: 'png-to-jpg', source: 'PNG', target: 'jpeg', targetLabel: 'JPEG', sourceKey: 'png', targetKey: 'jpg' },
];

const TEXT = {
  en: {
    title: "{S} to {T} Converter — Free, Bulk, Browser-Based | ConvertUnlimited",
    description: "Convert {S} images to {T} in bulk. Free, unlimited, no signup. Images are processed locally in your browser.",
    heroTitle: "Free {S} to {T} Converter",
    heroSub: "Fast, bulk conversion of {S} files to {T}. {BENEFIT} Selected image contents are processed locally in your browser.",
    aeoTitle: "What this tool does",
    aeoPrivacyTitle: "Privacy behavior",
    aeoWorkflowTitle: "Supported formats and workflow",
    aeoPrivacy: "Selected image contents are processed locally in your browser. File contents are not intentionally uploaded by this tool. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.",
    aeoWorkflow: "Choose one or more {S} images, convert them to {T}, then download the converted files from this browser tab.",
    faqTitle: "Frequently Asked Questions",
    faq: [
        ["Is the conversion local?", "Yes. The conversion uses browser-native image processing. File contents are not intentionally uploaded by this tool."],
        ["Can I convert multiple {S} files at once?", "Yes, you can drag and drop hundreds of {S} files and convert them all to {T} in one click."],
        ["What is the limit?", "There is no account-level file count limit. Practical limits depend on your device memory and browser capability."],
        ["Which version should I use for sensitive files?", "Use the privacy build for privacy-sensitive workflows. It is designed without ads, analytics, remote fonts, or third-party runtime scripts."]
    ]
  },
  th: {
    title: "ตัวแปลง {S} เป็น {T} — ฟรี, จำนวนมาก, ทำงานในเบราว์เซอร์ | ConvertUnlimited",
    description: "แปลงรูปภาพ {S} เป็น {T} จำนวนมาก ฟรี ไม่จำกัด ไม่ต้องสมัครสมาชิก และประมวลผลในเบราว์เซอร์ของคุณ",
    heroTitle: "ตัวแปลง {S} เป็น {T} ฟรี",
    heroSub: "แปลงไฟล์ {S} เป็น {T} จำนวนมากอย่างรวดเร็ว {BENEFIT} เนื้อหารูปภาพที่เลือกจะประมวลผลในเบราว์เซอร์ของคุณ",
    aeoTitle: "เครื่องมือนี้ทำอะไร",
    aeoPrivacyTitle: "พฤติกรรมด้านความเป็นส่วนตัว",
    aeoWorkflowTitle: "รูปแบบไฟล์และขั้นตอนที่รองรับ",
    aeoPrivacy: "เนื้อหาไฟล์ที่เลือกจะประมวลผลในเบราว์เซอร์ของคุณ เครื่องมือนี้ไม่ได้ตั้งใจอัปโหลดเนื้อหาไฟล์ เว็บไซต์สาธารณะอาจโหลดโฆษณาและ analytics; ใช้ privacy build สำหรับงานที่อ่อนไหวด้านความเป็นส่วนตัว",
    aeoWorkflow: "เลือกภาพ {S} หนึ่งไฟล์หรือหลายไฟล์ แปลงเป็น {T} แล้วดาวน์โหลดไฟล์ที่แปลงแล้วจากแท็บเบราว์เซอร์นี้",
    faqTitle: "คำถามที่พบบ่อย",
    faq: [
        ["การแปลงทำงานในเครื่องหรือไม่?", "ใช่ การแปลงใช้การประมวลผลภาพของเบราว์เซอร์ เครื่องมือนี้ไม่ได้ตั้งใจอัปโหลดเนื้อหาไฟล์"],
        ["แปลงหลายไฟล์พร้อมกันได้ไหม?", "ได้ คุณสามารถลากและวางไฟล์ {S} หลายร้อยไฟล์เพื่อแปลงเป็น {T} ได้ในคลิกเดียว"],
        ["มีข้อจำกัดอะไรไหม?", "ไม่มีข้อจำกัดระดับบัญชีสำหรับจำนวนไฟล์ ข้อจำกัดจริงขึ้นอยู่กับหน่วยความจำของอุปกรณ์และขีดความสามารถของเบราว์เซอร์"],
        ["ควรใช้เวอร์ชันใดกับไฟล์ที่อ่อนไหว?", "ใช้ privacy build สำหรับงานที่อ่อนไหวด้านความเป็นส่วนตัว เพราะออกแบบโดยไม่มีโฆษณา analytics ฟอนต์ระยะไกล หรือสคริปต์ runtime จากบุคคลที่สาม"]
    ]
  },
  vi: {
    title: "Trình chuyển đổi {S} sang {T} — Miễn phí, Số lượng lớn | ConvertUnlimited",
    description: "Chuyển đổi ảnh {S} sang {T} hàng loạt. Miễn phí, không giới hạn, không cần đăng ký. Ảnh được xử lý cục bộ trong trình duyệt.",
    heroTitle: "Trình chuyển đổi {S} sang {T} miễn phí",
    heroSub: "Chuyển đổi tệp {S} sang {T} nhanh chóng và hàng loạt. {BENEFIT} Nội dung ảnh đã chọn được xử lý cục bộ trong trình duyệt.",
    aeoTitle: "Công cụ này làm gì",
    aeoPrivacyTitle: "Cách xử lý quyền riêng tư",
    aeoWorkflowTitle: "Định dạng và quy trình hỗ trợ",
    aeoPrivacy: "Nội dung tệp đã chọn được xử lý cục bộ trong trình duyệt. Công cụ này không chủ ý tải nội dung tệp lên. Trang công khai có thể tải quảng cáo và analytics; hãy dùng privacy build cho quy trình nhạy cảm về quyền riêng tư.",
    aeoWorkflow: "Chọn một hoặc nhiều ảnh {S}, chuyển đổi sang {T}, rồi tải tệp đã chuyển đổi từ tab trình duyệt này.",
    faqTitle: "Câu hỏi thường gặp",
    faq: [
        ["Việc chuyển đổi có chạy cục bộ không?", "Có. Việc chuyển đổi dùng xử lý ảnh của trình duyệt. Công cụ này không chủ ý tải nội dung tệp lên."],
        ["Tôi có thể chuyển nhiều tệp cùng lúc không?", "Có, bạn có thể kéo và thả hàng trăm tệp {S} và chuyển tất cả sang {T} chỉ với một cú nhấp chuột."],
        ["Giới hạn là gì?", "Không có giới hạn số lượng tệp theo tài khoản. Giới hạn thực tế phụ thuộc vào bộ nhớ thiết bị và khả năng của trình duyệt."],
        ["Nên dùng phiên bản nào cho tệp nhạy cảm?", "Hãy dùng privacy build cho quy trình nhạy cảm về quyền riêng tư. Phiên bản đó được thiết kế không có quảng cáo, analytics, font từ xa hoặc script runtime của bên thứ ba."]
    ]
  },
  zh: {
    title: "{S} 转 {T} 转换器 — 免费、批量、基于浏览器 | ConvertUnlimited",
    description: "批量将 {S} 图片转换为 {T}。免费、无限、无需注册。图片会在浏览器中本地处理。",
    heroTitle: "免费 {S} 转 {T} 转换器",
    heroSub: "快速批量将 {S} 文件转换为 {T}。{BENEFIT} 所选图片内容会在浏览器中本地处理。",
    aeoTitle: "此工具的作用",
    aeoPrivacyTitle: "隐私行为",
    aeoWorkflowTitle: "支持的格式和流程",
    aeoPrivacy: "所选文件内容会在浏览器中本地处理。此工具不会有意上传文件内容。公共网站可能加载广告和 analytics；隐私敏感流程请使用 privacy build。",
    aeoWorkflow: "选择一个或多个 {S} 图片，将其转换为 {T}，然后从当前浏览器标签页下载转换后的文件。",
    faqTitle: "常见问题",
    faq: [
        ["转换是在本地运行吗？", "是的。转换使用浏览器内置的图片处理功能。此工具不会有意上传文件内容。"],
        ["可以一次转换多个文件吗？", "是的，您可以拖放数百个 {S} 文件，一键全部转换为 {T}。"],
        ["有什么限制吗？", "没有账户级文件数量限制。实际限制取决于设备内存和浏览器能力。"],
        ["敏感文件应使用哪个版本？", "隐私敏感流程请使用 privacy build。该版本设计为不包含广告、analytics、远程字体或第三方运行时脚本。"]
    ]
  },
  ja: {
    title: "{S} から {T} への変換 — 無料、一括、ブラウザベース | ConvertUnlimited",
    description: "{S} 画像を {T} に一括変換します。無料、無制限、登録不要。画像はブラウザ内でローカル処理されます。",
    heroTitle: "無料 {S} から {T} への変換",
    heroSub: "{S} ファイルを {T} へ高速に一括変換します。{BENEFIT} 選択した画像コンテンツはブラウザ内でローカル処理されます。",
    aeoTitle: "このツールでできること",
    aeoPrivacyTitle: "プライバシー動作",
    aeoWorkflowTitle: "対応形式と流れ",
    aeoPrivacy: "選択したファイル内容はブラウザ内でローカル処理されます。このツールはファイル内容を意図的にアップロードしません。公開サイトでは広告と analytics が読み込まれる場合があります。プライバシー重視の作業には privacy build を使用してください。",
    aeoWorkflow: "1つ以上の {S} 画像を選択し、{T} に変換して、このブラウザタブから変換済みファイルをダウンロードします。",
    faqTitle: "よくある質問",
    faq: [
        ["変換はローカルで実行されますか？", "はい。変換にはブラウザの画像処理機能を使用します。このツールはファイル内容を意図的にアップロードしません。"],
        ["複数のファイルを一度に変換できますか？", "はい、数百の {S} ファイルをドラッグ＆ドロップして、ワンクリックで {T} に変換できます。"],
        ["制限はありますか？", "アカウント単位のファイル数制限はありません。実際の制限はデバイスのメモリとブラウザ性能によって決まります。"],
        ["機密性の高いファイルにはどの版を使うべきですか？", "プライバシー重視の作業には privacy build を使用してください。広告、analytics、リモートフォント、第三者ランタイムスクリプトを含まない設計です。"]
    ]
  },
  ko: {
    title: "{S}를 {T}로 변환 — 무료, 대량, 브라우저 기반 | ConvertUnlimited",
    description: "{S} 이미지를 {T}로 대량 변환하세요. 무료, 무제한, 가입 불필요. 이미지는 브라우저에서 로컬로 처리됩니다.",
    heroTitle: "무료 {S}를 {T}로 변환",
    heroSub: "{S} 파일을 {T}로 빠르고 대량으로 변환합니다. {BENEFIT} 선택한 이미지 콘텐츠는 브라우저에서 로컬로 처리됩니다.",
    aeoTitle: "이 도구의 기능",
    aeoPrivacyTitle: "개인정보 처리 방식",
    aeoWorkflowTitle: "지원 형식 및 흐름",
    aeoPrivacy: "선택한 파일 콘텐츠는 브라우저에서 로컬로 처리됩니다. 이 도구는 파일 콘텐츠를 의도적으로 업로드하지 않습니다. 공개 사이트는 광고와 analytics를 로드할 수 있으므로 민감한 작업에는 privacy build를 사용하세요.",
    aeoWorkflow: "{S} 이미지 하나 이상을 선택하고 {T}로 변환한 뒤 이 브라우저 탭에서 변환된 파일을 다운로드합니다.",
    faqTitle: "자주 묻는 질문",
    faq: [
        ["변환은 로컬에서 실행되나요?", "네. 변환은 브라우저의 이미지 처리 기능을 사용합니다. 이 도구는 파일 콘텐츠를 의도적으로 업로드하지 않습니다."],
        ["여러 파일을 한 번에 변환할 수 있나요?", "네, 수백 개의 {S} 파일을 드래그 앤 드롭하여 클릭 한 번으로 {T}로 변환할 수 있습니다."],
        ["제한이 있나요?", "계정 단위 파일 수 제한은 없습니다. 실제 제한은 장치 메모리와 브라우저 성능에 따라 달라집니다."],
        ["민감한 파일에는 어떤 버전을 써야 하나요?", "민감한 작업에는 privacy build를 사용하세요. 광고, analytics, 원격 폰트, 서드파티 런타임 스크립트 없이 설계되었습니다."]
    ]
  },
  es: {
    title: "Convertidor de {S} a {T} — Gratis, por lotes, en el navegador | ConvertUnlimited",
    description: "Convierte imágenes {S} a {T} por lotes. Gratis, ilimitado, sin registro. Las imágenes se procesan localmente en tu navegador.",
    heroTitle: "Convertidor gratuito de {S} a {T}",
    heroSub: "Conversión rápida y por lotes de archivos {S} a {T}. {BENEFIT} El contenido de las imágenes seleccionadas se procesa localmente en tu navegador.",
    aeoTitle: "Qué hace esta herramienta",
    aeoPrivacyTitle: "Comportamiento de privacidad",
    aeoWorkflowTitle: "Formatos y flujo admitidos",
    aeoPrivacy: "El contenido de los archivos seleccionados se procesa localmente en tu navegador. Esta herramienta no sube intencionadamente el contenido de los archivos. El sitio público puede cargar anuncios y analytics; usa la privacy build para flujos sensibles.",
    aeoWorkflow: "Elige una o varias imágenes {S}, conviértelas a {T} y descarga los archivos convertidos desde esta pestaña del navegador.",
    faqTitle: "Preguntas frecuentes",
    faq: [
        ["¿La conversión se ejecuta localmente?", "Sí. La conversión usa el procesamiento de imágenes del navegador. Esta herramienta no sube intencionadamente el contenido de los archivos."],
        ["¿Puedo convertir varios archivos a la vez?", "Sí, puedes arrastrar y soltar cientos de archivos {S} y convertirlos todos a {T} con un solo clic."],
        ["¿Cuál es el límite?", "No hay un límite de cantidad de archivos por cuenta. Los límites prácticos dependen de la memoria del dispositivo y del navegador."],
        ["¿Qué versión debo usar para archivos sensibles?", "Usa la privacy build para flujos sensibles. Está diseñada sin anuncios, analytics, fuentes remotas ni scripts runtime de terceros."]
    ]
  },
  fr: {
    title: "Convertisseur {S} en {T} — Gratuit, en lot, sur navigateur | ConvertUnlimited",
    description: "Convertissez des images {S} en {T} par lot. Gratuit, illimité, sans inscription. Les images sont traitées localement dans votre navigateur.",
    heroTitle: "Convertisseur gratuit de {S} en {T}",
    heroSub: "Conversion rapide et en lot de fichiers {S} en {T}. {BENEFIT} Le contenu des images sélectionnées est traité localement dans votre navigateur.",
    aeoTitle: "Ce que fait cet outil",
    aeoPrivacyTitle: "Comportement de confidentialité",
    aeoWorkflowTitle: "Formats et flux pris en charge",
    aeoPrivacy: "Le contenu des fichiers sélectionnés est traité localement dans votre navigateur. Cet outil ne téléverse pas intentionnellement le contenu des fichiers. Le site public peut charger des publicités et analytics; utilisez la privacy build pour les flux sensibles.",
    aeoWorkflow: "Choisissez une ou plusieurs images {S}, convertissez-les en {T}, puis téléchargez les fichiers convertis depuis cet onglet du navigateur.",
    faqTitle: "Questions fréquemment posées",
    faq: [
        ["La conversion s'exécute-t-elle localement ?", "Oui. La conversion utilise le traitement d'image du navigateur. Cet outil ne téléverse pas intentionnellement le contenu des fichiers."],
        ["Puis-je convertir plusieurs fichiers à la fois ?", "Oui, vous pouvez glisser-déposer des centaines de fichiers {S} et les convertir en {T} en un seul clic."],
        ["Quelle est la limite ?", "Il n'y a pas de limite de nombre de fichiers liée à un compte. Les limites pratiques dépendent de la mémoire de votre appareil et du navigateur."],
        ["Quelle version utiliser pour des fichiers sensibles ?", "Utilisez la privacy build pour les flux sensibles. Elle est conçue sans publicités, analytics, polices distantes ni scripts runtime tiers."]
    ]
  }
};

function htmlEscape(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

function applyReplacements(value, source, target) {
  return value.replace(/{S}/g, source).replace(/{T}/g, target);
}

function routeFor(locale, slug) {
  return `${locale.prefix ? `/${locale.prefix}` : ''}/${slug}/`;
}

function generate() {
  for (const pair of PAIRS) {
    for (const locale of LOCALES) {
      const templatePath = locale.prefix ? path.join(ROOT, locale.prefix, 'index.html') : path.join(ROOT, 'index.html');
      let html = fs.readFileSync(templatePath, 'utf8');

      const text = TEXT[locale.code];
      const tSource = pair.source;
      const tTarget = pair.targetLabel;
      const benefit = FORMAT_INFO[locale.code][pair.targetKey];

      const title = text.title.replace(/{S}/g, tSource).replace(/{T}/g, tTarget);
      const desc = text.description.replace(/{S}/g, tSource).replace(/{T}/g, tTarget);
      const h1 = text.heroTitle.replace(/{S}/g, tSource).replace(/{T}/g, tTarget);
      const sub = text.heroSub.replace(/{S}/g, tSource).replace(/{T}/g, tTarget).replace(/{BENEFIT}/g, benefit);
      const aeoWorkflow = applyReplacements(text.aeoWorkflow, tSource, tTarget);
      const aeoPrivacy = applyReplacements(text.aeoPrivacy, tSource, tTarget);

      // Remove template JSON-LD scripts to avoid duplication
      html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

      // Meta tags
      html = html.replace(/<title>.*?<\/title>/, `<title>${htmlEscape(title)}</title>`);
      html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${htmlEscape(desc)}">`);
      html = html.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${htmlEscape(title)}">`);
      html = html.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${htmlEscape(desc)}">`);
      html = html.replace(/<meta name="twitter:title" content=".*?">/, `<meta name="twitter:title" content="${htmlEscape(title)}">`);
      html = html.replace(/<meta name="twitter:description" content=".*?">/, `<meta name="twitter:description" content="${htmlEscape(desc)}">`);

      // Canonical and Alternates
      const canonical = `${BASE_URL}${locale.prefix ? '/' + locale.prefix : ''}/${pair.slug}/`;
      html = html.replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${canonical}">`);
      
      const altRe = /<link rel="alternate" hreflang="(.*?)" href="(.*?)">/g;
      html = html.replace(altRe, (match, hreflang, href) => {
        const altLocale = LOCALES.find(l => l.hreflang === hreflang);
        if (altLocale) {
            const altPath = `${BASE_URL}${altLocale.prefix ? '/' + altLocale.prefix : ''}/${pair.slug}/`;
            return `<link rel="alternate" hreflang="${hreflang}" href="${altPath}">`;
        }
        return match;
      });
      html = html.replace(/<link rel="alternate" hreflang="x-default" href=".*?">/, `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/${pair.slug}/">`);

      // OG URL
      html = html.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${canonical}">`);

      for (const switchLocale of LOCALES) {
        const href = routeFor(switchLocale, pair.slug);
        const current = switchLocale.code === locale.code ? ' aria-current="page"' : '';
        const label = switchLocale.label;
        const labelPattern = switchLocale.code === 'zh'
          ? '(?:中文（简体）|中文\\(简体\\))'
          : label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const switcherRe = new RegExp(`<a href="[^"]*" hreflang="${switchLocale.hreflang}" lang="${switchLocale.hreflang}"(?: aria-current="page")?>${labelPattern}</a>`, 'g');
        html = html.replace(switcherRe, `<a href="${href}" hreflang="${switchLocale.hreflang}" lang="${switchLocale.hreflang}"${current}>${label}</a>`);
      }

      // Hero content
      html = html.replace(/<h1 class="hero-title">.*?<\/h1>/, `<h1 class="hero-title">${htmlEscape(h1)}</h1>`);
      html = html.replace(/<p class="sub hero-sub">.*?<\/p>/, `<p class="sub hero-sub">${htmlEscape(sub)}</p>`);

      // Structured Data
      const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": text.faq.map(([q, a]) => ({
              "@type": "Question",
              "name": q.replace(/{S}/g, tSource).replace(/{T}/g, tTarget),
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": a.replace(/{S}/g, tSource).replace(/{T}/g, tTarget)
              }
          }))
      };

      const softwareSchema = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": h1,
          "description": desc,
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Any",
          "url": canonical,
          "inLanguage": locale.hreflang,
          "isAccessibleForFree": true,
          "featureList": [
            `Convert ${tSource} images to ${tTarget}`,
            "Batch image conversion",
            "Browser-native local processing",
            "Download converted files from the browser"
          ],
          "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
          }
      };

      const breadcrumbSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
              {
                  "@type": "ListItem",
                  "position": 1,
                  "name": locale.homeLabel,
                  "item": `${BASE_URL}${locale.prefix ? '/' + locale.prefix : ''}/`
              },
              {
                  "@type": "ListItem",
                  "position": 2,
                  "name": locale.toolsLabel,
                  "item": `${BASE_URL}${locale.prefix ? '/' + locale.prefix : ''}/tools/`
              },
              {
                  "@type": "ListItem",
                  "position": 3,
                  "name": h1,
                  "item": canonical
              }
          ]
      };

      const schemaHtml = `
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(softwareSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
`;
      html = html.replace('</head>', schemaHtml + '</head>');

      // Breadcrumb UI
      const breadcrumbUi = `
        <nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 14px; opacity: 0.8;">
            <a href="${locale.prefix ? '/' + locale.prefix : ''}/" data-track="breadcrumb-click" data-level="home">${htmlEscape(locale.homeLabel)}</a> &gt; 
            <a href="${locale.prefix ? '/' + locale.prefix : ''}/tools/" data-track="breadcrumb-click" data-level="tools">${htmlEscape(locale.toolsLabel)}</a> &gt; 
            <span>${htmlEscape(h1)}</span>
        </nav>
`;
      html = html.replace('<section class="hero">', breadcrumbUi + '<section class="hero">');

      const aeoHtml = `
            <section class="article aeo-summary" id="tool-summary">
                <h2>${htmlEscape(text.aeoTitle)}</h2>
                <p>${htmlEscape(`${h1} converts ${tSource} images to ${tTarget} in your browser. ${benefit}`)}</p>
                <h2>${htmlEscape(text.aeoPrivacyTitle)}</h2>
                <p>${htmlEscape(aeoPrivacy)}</p>
                <h2>${htmlEscape(text.aeoWorkflowTitle)}</h2>
                <p>${htmlEscape(aeoWorkflow)}</p>
            </section>
`;

      // Add tracking to primary button
      html = html.replace('id="primary-btn"', 'id="primary-btn" data-track="conversion-action" data-pair="' + pair.slug + '"');

      // What is block
      const sourceDef = FORMAT_INFO[locale.code][pair.sourceKey];
      const targetDef = FORMAT_INFO[locale.code][pair.targetKey];
      let deepDive = "";
      if (pair.guideSlug) {
          const guideUrl = `${locale.prefix ? '/' + locale.prefix : ''}/guides/${pair.guideSlug}/`;
          deepDive = `<p style="margin-top: 20px; font-weight: 600;">Deep Dive: <a href="${guideUrl}">Read our full ${pair.source} vs ${pair.targetLabel} comparison guide.</a></p>`;
      }
      const definitionsHtml = `
            <section class="article" style="margin-top: 40px; border-top: 1px solid var(--border); pt: 40px;">
                <h2>What is ${pair.source}?</h2>
                <p>${htmlEscape(sourceDef)}</p>
                <h2>What is ${pair.targetLabel}?</h2>
                <p>${htmlEscape(targetDef)}</p>
                ${deepDive}
            </section>
`;
      // Inject before FAQ
      html = html.replace('<section id="faq"', aeoHtml + definitionsHtml + '<section id="faq"');

      // Inject format selection and input priority
      const injectScript = `
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        // Pre-select the target format
        const targetBtn = document.querySelector('button[data-format="${pair.target}"]');
        if (targetBtn) targetBtn.click();

        // Prioritize the source format in the file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.accept = ".${pair.source.toLowerCase()},.jpg,.jpeg,.png,.gif,.svg,.webp,.bmp";
        }
      });
    </script>
`;
      html = html.replace('</body>', injectScript + '</body>');

      // Update FAQ section
      const faqTitleHtml = `<h2>${htmlEscape(text.faqTitle)}</h2>`;
      const faqItemsHtml = text.faq.map(([q, a]) => `<h3>${htmlEscape(q.replace(/{S}/g, tSource).replace(/{T}/g, tTarget))}</h3><p>${htmlEscape(a.replace(/{S}/g, tSource).replace(/{T}/g, tTarget))}</p>`).join('\n');
      
      const faqRe = /(<section id="faq".*?>)[\s\S]*?(<\/section>)/;
      html = html.replace(faqRe, `$1\n${faqTitleHtml}\n${faqItemsHtml}\n$2`);

      // Save file
      const outDir = path.join(ROOT, locale.prefix || '', pair.slug);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    }
  }
}

generate();
console.log("Generated 40 localized conversion pair pages with Defensive Quality Layer.");
