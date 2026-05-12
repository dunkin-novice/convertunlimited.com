const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';

const LOCALES = [
  { code: 'en', prefix: '', hreflang: 'en' },
  { code: 'th', prefix: 'th', hreflang: 'th' },
  { code: 'vi', prefix: 'vi', hreflang: 'vi' },
  { code: 'zh', prefix: 'zh', hreflang: 'zh-Hans' },
  { code: 'ja', prefix: 'ja', hreflang: 'ja' },
  { code: 'ko', prefix: 'ko', hreflang: 'ko' },
  { code: 'es', prefix: 'es', hreflang: 'es' },
  { code: 'fr', prefix: 'fr', hreflang: 'fr' },
];

const PAIRS = [
  { slug: 'png-to-webp', source: 'PNG', target: 'webp', targetLabel: 'WebP' },
  { slug: 'jpg-to-webp', source: 'JPG', target: 'webp', targetLabel: 'WebP' },
  { slug: 'webp-to-jpg', source: 'WebP', target: 'jpeg', targetLabel: 'JPEG' },
  { slug: 'webp-to-png', source: 'WebP', target: 'png', targetLabel: 'PNG' },
  { slug: 'png-to-jpg', source: 'PNG', target: 'jpeg', targetLabel: 'JPEG' },
];

const TEXT = {
  en: {
    title: "{S} to {T} Converter — Free, Bulk, Browser-Based | ConvertUnlimited",
    description: "Convert {S} images to {T} in bulk. Free, unlimited, no signup. Runs entirely in your browser for maximum privacy. No upload required.",
    heroTitle: "Free {S} to {T} Converter",
    heroSub: "Fast, bulk conversion of {S} files to {T}. Your images stay on your device — no uploads, no servers, total privacy.",
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
    heroSub: "แปลงไฟล์ {S} เป็น {T} จำนวนมากอย่างรวดเร็ว รูปภาพของคุณจะอยู่บนอุปกรณ์ของคุณ ไม่มีการอัปโหลด ไม่มีเซิร์ฟเวอร์ เป็นส่วนตัว 100%",
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
    heroSub: "Chuyển đổi tệp {S} sang {T} nhanh chóng và hàng loạt. Ảnh của bạn ở lại trên thiết bị — không tải lên, không máy chủ, riêng tư tuyệt đối.",
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
    heroSub: "快速批量将 {S} 文件转换为 {T}。您的图片保留在设备上 —— 无需上传，无需服务器，完全隐私。",
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
    heroSub: "{S} ファイルから {T} への高速一括変換。画像はデバイス内に残り、サーバーへのアップロードはありません。完全なプライバシーを保証します。",
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
    heroSub: "{S} 파일을 {T}로 빠르고 대량으로 변환합니다. 이미지는 장치에 그대로 유지되며 서버 업로드가 없습니다. 완전한 프라이버시.",
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
    heroSub: "Conversión rápida y por lotes de archivos {S} a {T}. Tus imágenes permanecen en tu dispositivo: sin subidas, sin servidores, privacidad total.",
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
    heroSub: "Conversion rapide et en lot de fichiers {S} en {T}. Vos images restent sur votre appareil : pas de téléchargement, pas de serveurs, confidentialité totale.",
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

      const title = text.title.replace(/{S}/g, tSource).replace(/{T}/g, tTarget);
      const desc = text.description.replace(/{S}/g, tSource).replace(/{T}/g, tTarget);
      const h1 = text.heroTitle.replace(/{S}/g, tSource).replace(/{T}/g, tTarget);
      const sub = text.heroSub.replace(/{S}/g, tSource).replace(/{T}/g, tTarget);

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
      
      // We need to find the FAQ section and replace its content.
      // Assuming FAQ section starts with <section id="faq"
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
console.log("Generated 40 localized conversion pair pages.");
