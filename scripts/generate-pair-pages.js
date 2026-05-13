const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';

const LOCALES = [
  { code: 'en', prefix: '', hreflang: 'en', homeLabel: 'Home', toolsLabel: 'Tools', conversionsLabel: 'Image Conversions' },
  { code: 'th', prefix: 'th', hreflang: 'th', homeLabel: 'หน้าแรก', toolsLabel: 'เครื่องมือ', conversionsLabel: 'การแปลงรูปภาพ' },
  { code: 'vi', prefix: 'vi', hreflang: 'vi', homeLabel: 'Trang chủ', toolsLabel: 'Công cụ', conversionsLabel: 'Chuyển đổi ảnh' },
  { code: 'zh', prefix: 'zh', hreflang: 'zh-Hans', homeLabel: '首页', toolsLabel: '工具', conversionsLabel: '图片转换' },
  { code: 'ja', prefix: 'ja', hreflang: 'ja', homeLabel: 'ホーム', toolsLabel: 'ツール', conversionsLabel: '画像変換' },
  { code: 'ko', prefix: 'ko', hreflang: 'ko', homeLabel: '홈', toolsLabel: '도구', conversionsLabel: '이미지 변환' },
  { code: 'es', prefix: 'es', hreflang: 'es', homeLabel: 'Inicio', toolsLabel: 'Herramientas', conversionsLabel: 'Conversiones de imagen' },
  { code: 'fr', prefix: 'fr', hreflang: 'fr', homeLabel: 'Accueil', toolsLabel: 'Outils', conversionsLabel: 'Conversions d\'image' },
];

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
  { slug: 'png-to-webp', source: 'PNG', target: 'webp', targetLabel: 'WebP', sourceKey: 'png', targetKey: 'webp' },
  { slug: 'jpg-to-webp', source: 'JPG', target: 'webp', targetLabel: 'WebP', sourceKey: 'jpg', targetKey: 'webp' },
  { slug: 'webp-to-jpg', source: 'WebP', target: 'jpeg', targetLabel: 'JPEG', sourceKey: 'webp', targetKey: 'jpg' },
  { slug: 'webp-to-png', source: 'WebP', target: 'png', targetLabel: 'PNG', sourceKey: 'webp', targetKey: 'png' },
  { slug: 'png-to-jpg', source: 'PNG', target: 'jpeg', targetLabel: 'JPEG', sourceKey: 'png', targetKey: 'jpg' },
];

const TEXT = {
  en: {
    title: "{S} to {T} Converter — Free, Bulk, Browser-Based | ConvertUnlimited",
    description: "Convert {S} images to {T} in bulk. Free, unlimited, no signup. Runs entirely in your browser for maximum privacy. No upload required.",
    heroTitle: "Free {S} to {T} Converter",
    heroSub: "Fast, bulk conversion of {S} files to {T}. {BENEFIT} Your images stay on your device — no uploads, no servers, total privacy.",
    faqTitle: "Frequently Asked Questions",
    faq: [
        ["Is the conversion really private?", "Yes. We use your browser's built-in image processing. Your {S} files are never sent to our servers."],
        ["Can I convert multiple {S} files at once?", "Yes, you can drag and drop hundreds of {S} files and convert them all to {T} in one click."],
        ["What is the limit?", "There are no file size or count limits. The only limit is your device's memory and browser capability."]
    ]
  },
  th: {
    title: "ตัวแปลง {S} เป็น {T} — ฟรี, จำนวนมาก, ทำงานในเบราว์เซอร์ | ConvertUnlimited",
    description: "แปลงรูปภาพ {S} เป็น {T} จำนวนมาก ฟรี ไม่จำกัด ไม่ต้องสมัครสมาชิก ทำงานในเบราว์เซอร์ของคุณเพื่อความเป็นส่วนตัวสูงสุด ไม่ต้องอัปโหลด",
    heroTitle: "ตัวแปลง {S} เป็น {T} ฟรี",
    heroSub: "แปลงไฟล์ {S} เป็น {T} จำนวนมากอย่างรวดเร็ว {BENEFIT} รูปภาพของคุณจะอยู่บนอุปกรณ์ของคุณ ไม่มีการอัปโหลด ไม่มีเซิร์ฟเวอร์ เป็นส่วนตัว 100%",
    faqTitle: "คำถามที่พบบ่อย",
    faq: [
        ["การแปลงเป็นส่วนตัวจริงหรือไม่?", "ใช่ เราใช้การประมวลผลภาพในตัวของเบราว์เซอร์ ไฟล์ {S} ของคุณจะไม่ถูกส่งไปยังเซิร์ฟเวอร์ของเรา"],
        ["แปลงหลายไฟล์พร้อมกันได้ไหม?", "ได้ คุณสามารถลากและวางไฟล์ {S} หลายร้อยไฟล์เพื่อแปลงเป็น {T} ได้ในคลิกเดียว"],
        ["มีข้อจำกัดอะไรไหม?", "ไม่มีการจำกัดขนาดหรือจำนวนไฟล์ ข้อจำกัดเดียวคือหน่วยความจำของอุปกรณ์และขีดความสามารถของเบราว์เซอร์"]
    ]
  },
  vi: {
    title: "Trình chuyển đổi {S} sang {T} — Miễn phí, Số lượng lớn | ConvertUnlimited",
    description: "Chuyển đổi ảnh {S} sang {T} hàng loạt. Miễn phí, không giới hạn, không cần đăng ký. Chạy hoàn toàn trong trình duyệt để bảo mật tối đa.",
    heroTitle: "Trình chuyển đổi {S} sang {T} miễn phí",
    heroSub: "Chuyển đổi tệp {S} sang {T} nhanh chóng và hàng loạt. {BENEFIT} Ảnh của bạn ở lại trên thiết bị — không tải lên, không máy chủ, riêng tư tuyệt đối.",
    faqTitle: "Câu hỏi thường gặp",
    faq: [
        ["Việc chuyển đổi có thực sự riêng tư?", "Có. Chúng tôi sử dụng trình xử lý ảnh tích hợp của trình duyệt. Tệp {S} của bạn không bao giờ được gửi đến máy chủ."],
        ["Tôi có thể chuyển nhiều tệp cùng lúc không?", "Có, bạn có thể kéo và thả hàng trăm tệp {S} và chuyển tất cả sang {T} chỉ với một cú nhấp chuột."],
        ["Giới hạn là gì?", "Không có giới hạn về kích thước hoặc số lượng tệp. Giới hạn duy nhất là bộ nhớ thiết bị và khả năng của trình duyệt."]
    ]
  },
  zh: {
    title: "{S} 转 {T} 转换器 — 免费、批量、基于浏览器 | ConvertUnlimited",
    description: "批量将 {S} 图片转换为 {T}。免费、无限、无需注册。完全在浏览器中运行，确保最高隐私。无需上传。",
    heroTitle: "免费 {S} 转 {T} 转换器",
    heroSub: "快速批量将 {S} 文件转换为 {T}。{BENEFIT} 您的图片保留在设备上 —— 无需上传，无需服务器，完全隐私。",
    faqTitle: "常见问题",
    faq: [
        ["转换真的私密吗？", "是的。我们使用浏览器内置的图片处理功能。您的 {S} 文件永远不会发送到我们的服务器。"],
        ["可以一次转换多个文件吗？", "是的，您可以拖放数百个 {S} 文件，一键全部转换为 {T}。"],
        ["有什么限制吗？", "没有文件大小或数量限制。唯一的限制是您的设备内存和浏览器性能。"]
    ]
  },
  ja: {
    title: "{S} から {T} への変換 — 無料、一括、ブラウザベース | ConvertUnlimited",
    description: "{S} 画像を {T} に一括変換します。無料、無制限、登録不要。プライバシー保護のためブラウザ内で完結。アップロード不要。",
    heroTitle: "無料 {S} から {T} への変換",
    heroSub: "{S} ファイルจาก {T} への高速一括変換。{BENEFIT} 画像はデバイス内に残り、サーバーへのアップロードはありません。完全なプライバシーを保証します。",
    faqTitle: "よくある質問",
    faq: [
        ["変換は本当にプライベートですか？", "はい。ブラウザの内蔵画像処理を使用します。{S} ファイルがサーバーに送信されることはありません。"],
        ["複数のファイルを一度に変換できますか？", "はい、数百の {S} ファイルをドラッグ＆ドロップして、ワンクリックで {T} に変換できます。"],
        ["制限はありますか？", "ファイルサイズや数の制限はありません。デバイスのメモリとブラウザの性能が唯一の制限です。"]
    ]
  },
  ko: {
    title: "{S}를 {T}로 변환 — 무료, 대량, 브라우저 기반 | ConvertUnlimited",
    description: "{S} 이미지를 {T}로 대량 변환하세요. 무료, 무제한, 가입 불필요. 프라이버시를 위해 브라우저에서 직접 실행됩니다. 업로드 불필요.",
    heroTitle: "무료 {S}를 {T}로 변환",
    heroSub: "{S} 파일을 {T}로 빠르고 대량으로 변환합니다. {BENEFIT} 이미지는 장치에 그대로 유지되며 서버 업로드가 없습니다. 완전한 프라이버시.",
    faqTitle: "자주 묻는 질문",
    faq: [
        ["변환이 정말 안전한가요?", "네. 브라우저의 기본 이미지 처리 기능을 사용합니다. {S} 파일은 서버로 전송되지 않습니다."],
        ["여러 파일을 한 번에 변환할 수 있나요?", "네, 수백 개의 {S} 파일을 드래그 앤 드롭하여 클릭 한 번으로 {T}로 변환할 수 있습니다."],
        ["제한이 있나요?", "파일 크기나 개수 제한은 없습니다. 장치의 메모리와 브라우저 성능이 유일한 제한입니다."]
    ]
  },
  es: {
    title: "Convertidor de {S} a {T} — Gratis, por lotes, en el navegador | ConvertUnlimited",
    description: "Convierte imágenes {S} a {T} por lotes. Gratis, ilimitado, sin registro. Se ejecuta en tu navegador para máxima privacidad. Sin subidas.",
    heroTitle: "Convertidor gratuito de {S} a {T}",
    heroSub: "Conversión rápida y por lotes de archivos {S} a {T}. {BENEFIT} Tus imágenes permanecen en tu dispositivo: sin subidas, sin servidores, privacidad total.",
    faqTitle: "Preguntas frecuentes",
    faq: [
        ["¿La conversión es realmente privada?", "Sí. Usamos el procesamiento de imágenes integrado de tu navegador. Tus archivos {S} nunca se envían a nuestros servidores."],
        ["¿Puedo convertir varios archivos a la vez?", "Sí, puedes arrastrar y soltar cientos de archivos {S} y convertirlos todos a {T} con un solo clic."],
        ["¿Cuál es el límite?", "No hay límites de tamaño o cantidad de archivos. El único límite es la memoria de tu dispositivo y la capacidad del navegador."]
    ]
  },
  fr: {
    title: "Convertisseur {S} en {T} — Gratuit, en lot, sur navigateur | ConvertUnlimited",
    description: "Convertissez des images {S} en {T} par lot. Gratuit, illimité, sans inscription. S'exécute dans votre navigateur pour une confidentialité maximale.",
    heroTitle: "Convertisseur gratuit de {S} en {T}",
    heroSub: "Conversion rapide et en lot de fichiers {S} en {T}. {BENEFIT} Vos images restent sur votre appareil : pas de téléchargement, pas de serveurs, confidentialité totale.",
    faqTitle: "Questions fréquemment posées",
    faq: [
        ["La conversion est-elle vraiment privée ?", "Oui. Nous utilisons le traitement d'image intégré de votre navigateur. Vos fichiers {S} ne sont jamais envoyés à nos serveurs."],
        ["Puis-je convertir plusieurs fichiers à la fois ?", "Oui, vous pouvez glisser-déposer des centaines de fichiers {S} et các chuyển tất cả sang {T} en un seul clic."],
        ["Quelle est la limite ?", "Il n'y a pas de limite de taille ou de nombre de fichiers. La seule limite est la mémoire de votre appareil et les capacités du navigateur."]
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

      // Add tracking to primary button
      html = html.replace('id="primary-btn"', 'id="primary-btn" data-track="conversion-action" data-pair="' + pair.slug + '"');

      // What is block
      const sourceDef = FORMAT_INFO[locale.code][pair.sourceKey];
      const targetDef = FORMAT_INFO[locale.code][pair.targetKey];
      const definitionsHtml = `
            <section class="article" style="margin-top: 40px; border-top: 1px solid var(--border); pt: 40px;">
                <h2>What is ${pair.source}?</h2>
                <p>${htmlEscape(sourceDef)}</p>
                <h2>What is ${pair.targetLabel}?</h2>
                <p>${htmlEscape(targetDef)}</p>
            </section>
`;
      // Inject before FAQ
      html = html.replace('<section id="faq"', definitionsHtml + '<section id="faq"');

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
