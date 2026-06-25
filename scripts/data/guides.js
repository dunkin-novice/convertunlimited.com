const GUIDES = [
  {
    slug: 'webp-vs-png',
    en: {
      title: "WebP vs PNG: Format Differences and Use Cases",
      description: "Comparison of WebP and PNG formats. Learn about file size, transparency, and when to use each for your website or design project.",
      h1: "WebP vs PNG: format differences and use cases",
      intro: "Choosing between WebP and PNG depends on transparency requirements, file size targets, browser support, and whether lossless output is required.",
      sections: [
        {
          title: "Technical difference",
          content: "PNG is a lossless format that has been the standard for transparent images for decades. WebP is a newer format developed by Google that offers both lossy and lossless compression, often resulting in much smaller files than PNG."
        },
        {
          title: "Comparison Table",
          isTable: true,
          headers: ["Feature", "WebP", "PNG"],
          rows: [
            ["Compression", "Lossy & Lossless", "Lossless"],
            ["Transparency", "Supported", "Supported"],
            ["File Size", "Smaller (up to 26% less)", "Larger"],
            ["Best for", "Web delivery, photos, mixed transparency use", "Logos, icons, screenshots, lossless graphics"]
          ]
        },
        {
          title: "Pros and Cons",
          prosCons: {
            webp: {
              pros: ["Often smaller file size", "Supports both lossy and lossless modes", "Strong browser support"],
              cons: ["Not ideal for high-end print", "Older software might lack support"]
            },
            png: {
              pros: ["Lossless quality (no data loss)", "Universal software support", "Perfect for sharp edges"],
              cons: ["Often large file sizes", "Only supports lossless compression"]
            }
          }
        },
        {
          title: "When to Use Each",
          content: "Use **WebP** for modern web delivery when smaller files are useful and the publishing workflow supports the format. Use **PNG** when transparency, sharp edges, screenshots, or lossless graphics are more important than file size."
        }
      ],
      faq: [
        ["Does WebP support transparency like PNG?", "Yes, WebP supports alpha channel transparency just like PNG, but usually at a much smaller file size."],
        ["Is WebP better than PNG for SEO?", "WebP can help performance when it produces smaller files, but SEO depends on many page-level factors. Use WebP when it improves delivery without breaking compatibility."],
        ["Can I convert PNG to WebP in the browser?", "Yes. Use the ConvertUnlimited image converter to decode selected PNG files and write WebP output locally in the browser for supported workflows."]
      ],
      cta: "Convert PNG to WebP in the browser: [PNG to WebP](/png-to-webp/)."
    },
    th: {
      title: "WebP vs PNG: รูปแบบไฟล์ภาพไหนดีกว่ากัน?",
      description: "เปรียบเทียบ WebP และ PNG เรียนรู้เกี่ยวกับขนาดไฟล์ ความโปร่งใส และเมื่อไหร่ควรใช้แต่ละรูปแบบสำหรับเว็บไซต์หรืองานออกแบบของคุณ",
      h1: "WebP vs PNG: การเปรียบเทียบฉบับสมบูรณ์",
      intro: "การเลือกระหว่าง WebP และ PNG ขึ้นอยู่กับความต้องการของคุณ: ความโปร่งใส ขนาดไฟล์ หรือคุณภาพที่ไม่สูญเสียข้อมูล แม้ว่า PNG จะเป็นแบบดั้งเดิม แต่ WebP คือมาตรฐานสมัยใหม่สำหรับเว็บ",
      sections: [
        {
          title: "ความแตกต่างคืออะไร?",
          content: "PNG เป็นรูปแบบที่ไม่สูญเสียข้อมูล (Lossless) ซึ่งเป็นมาตรฐานสำหรับรูปภาพโปร่งใสมานานหลายทศวรรษ ส่วน WebP เป็นรูปแบบใหม่ที่พัฒนาโดย Google ซึ่งรองรับทั้งการบีบอัดแบบสูญเสียและไม่สูญเสียข้อมูล มักส่งผลให้ไฟล์มีขนาดเล็กกว่า PNG มาก"
        }
      ],
      faq: [
        ["WebP รองรับความโปร่งใสเหมือน PNG หรือไม่?", "ใช่ WebP รองรับความโปร่งใส (Alpha Channel) เหมือน PNG แต่ปกติจะมีขนาดไฟล์ที่เล็กกว่ามาก"]
      ],
      cta: "พร้อมเปลี่ยนหรือยัง? [แปลง PNG เป็น WebP ตอนนี้เลย](/th/png-to-webp/)."
    },
    es: {
      title: "¿WebP vs PNG: Qué formato de imagen es mejor?",
      description: "Comparativa entre WebP y PNG. Conoce el tamaño de archivo, la transparencia y cuándo usar cada uno en tu web o proyecto de diseño.",
      h1: "WebP vs PNG: La comparativa definitiva",
      intro: "Elegir entre WebP y PNG depende de tus necesidades: transparencia, tamaño de archivo o calidad sin pérdidas. Mientras que PNG es un clásico, WebP es el estándar moderno.",
      sections: [
        {
          title: "¿Cuál es la diferencia?",
          content: "PNG es un formato sin pérdidas estándar para imágenes transparentes. WebP es un formato más reciente de Google que ofrece compresión con y sin pérdidas, logrando archivos más pequeños."
        }
      ],
      faq: [
        ["¿WebP admite transparencia como PNG?", "Sí, WebP admite transparencia de canal alfa como PNG, pero normalmente con un archivo mucho más pequeño."]
      ],
      cta: "¿Listo para cambiar? [Convierte PNG a WebP ahora](/es/png-to-webp/)."
    },
    fr: {
      title: "WebP vs PNG : quel format d'image est le meilleur ?",
      description: "Comparaison des formats WebP et PNG. Découvrez la taille des fichiers, la transparence et quand utiliser chacun pour votre site web.",
      h1: "WebP vs PNG : la comparaison ultime",
      intro: "Choisir entre WebP et PNG dépend de vos besoins : transparence, taille de fichier ou qualité sans perte. Le PNG est un classique, mais le WebP est le standard moderne.",
      sections: [
        {
          title: "Quelle est la différence ?",
          content: "Le PNG est un format sans perte standard depuis des décennies. Le WebP est un format plus récent de Google offrant une meilleure compression."
        }
      ],
      faq: [
        ["Le WebP supporte-t-il la transparence ?", "Oui, le WebP supporte la transparence comme le PNG, mais avec des fichiers souvent bien plus légers."]
      ],
      cta: "Prêt à passer au WebP ? [Convertir PNG en WebP](/fr/png-to-webp/)."
    }
  },
  {
    slug: 'webp-vs-jpg',
    en: {
      title: "WebP vs JPG: Photo Format Tradeoffs",
      description: "Comparing WebP and JPG for photography and web use. Find out which format offers better compression and visual quality.",
      h1: "WebP vs JPG: photo format tradeoffs",
      intro: "JPG remains broadly compatible for photos. WebP can provide smaller web images at similar visual quality and also supports transparency.",
      sections: [
        {
          title: "Quality vs Size",
          content: "WebP lossy images are intended to be 25% to 34% smaller than comparable JPEG images at equivalent SSIM quality index. This means faster websites without sacrificing visual appeal."
        }
      ],
      faq: [
        ["Should I replace all JPGs with WebP?", "Not automatically. Use WebP for modern web delivery when supported, and keep JPG fallbacks when compatibility matters."]
      ],
      cta: "Convert JPG to WebP in the browser: [JPG to WebP](/jpg-to-webp/)."
    },
    es: {
      title: "WebP vs JPG: El mejor formato para fotos",
      description: "Comparativa entre WebP y JPG para fotografía y uso web. Descubre qué formato ofrece mejor compresión y calidad visual.",
      h1: "WebP vs JPG: ¿Cuál es mejor para tu sitio?",
      intro: "JPG ha sido el rey durante décadas, pero WebP ofrece mejor compresión y funciones modernas.",
      sections: [
        {
          title: "Calidad vs Tamaño",
          content: "Las imágenes WebP suelen ser entre un 25% y un 34% más pequeñas que las JPEG equivalentes con la misma calidad visual."
        }
      ],
      faq: [
        ["¿Debo reemplazar mis JPG por WebP?", "Para uso web, sí. Mejorará significativamente la velocidad de tu página."]
      ],
      cta: "Optimiza tus fotos. [Convierte JPG a WebP ahora](/es/jpg-to-webp/)."
    }
  },
  {
    slug: 'what-is-webp',
    en: {
      title: "What is WebP? Format Overview and Browser Support",
      description: "A technical overview of the WebP image format, including compression behavior, browser support, and common use cases.",
      h1: "What is WebP?",
      intro: "WebP is a modern image format that supports lossy compression, lossless compression, transparency, and animation for web image workflows.",
      sections: [
        {
          title: "The Origin of WebP",
          content: "Google announced the WebP format in 2010. It is based on the VP8 video codec and uses predictive coding to encode images."
        }
      ],
      faq: [
        ["Which browsers support WebP?", "Current versions of Chrome, Firefox, Edge, and Safari support WebP."]
      ],
      cta: "Convert images to WebP in the browser: [Image Converter](/)."
    }
  },
  {
    slug: 'local-processing',
    en: {
      title: "Local Processing: How Browser-Native File Tools Work | ConvertUnlimited",
      description: "Technical explanation of browser-native file processing, including Canvas, File APIs, Blob URLs, and local workflows that do not require a ConvertUnlimited upload endpoint.",
      h1: "How Local Processing Works",
      intro: "ConvertUnlimited is built around browser-native processing. Supported file tools process selected file contents locally in your browser using your own device's hardware.",
      sections: [
        {
          title: "What is Local Processing?",
          content: "Many online converters are upload services: files are sent to a remote server, processed there, and sent back. Local processing avoids that round trip for supported flows. Selected file contents are handled in browser memory by client-side scripts."
        },
        {
          title: "Browser APIs used",
          content: "ConvertUnlimited uses browser standards for supported local workflows:\n- **HTML5 Canvas API:** redraws and re-encodes images to change formats.\n- **File & Blob APIs:** handle selected files as local data streams.\n- **Object URLs:** create downloadable outputs in the browser tab.\n- **Vendored client-side libraries:** support selected PDF, archive, and image operations where browser APIs need help."
        },
        {
          title: "Comparison: Local vs. Upload",
          isTable: true,
          headers: ["Feature", "Upload-Based Sites", "ConvertUnlimited"],
          rows: [
            ["Privacy", "Higher exposure risk because files are uploaded", "File contents are processed locally in your browser"],
            ["Security", "Server breach risk", "No server-side upload endpoint for supported local flows"],
            ["Wait Time", "Upload + Download time", "Instant local processing"],
            ["Data Usage", "Upload + download", "Static page load, then local processing for supported flows"],
            ["Internet", "Required for processing", "Not required after load"]
          ]
        },
        {
          title: "Operational advantages and limits",
          content: "For supported workflows, avoiding a server-side upload step reduces transfer time and file-exposure surface. Processing speed still depends on device CPU, available memory, browser support, and source file size."
        }
      ],
      faq: [
        ["Can ConvertUnlimited see my files?", "For supported local-processing flows, ConvertUnlimited does not provide a server-side upload endpoint for selected file contents. The public site may still load ads and analytics."],
        ["Which version should I use for sensitive documents?", "Use the privacy build for privacy-sensitive workflows. It is designed without ads, analytics, remote fonts, or third-party runtime scripts."]
      ],
      cta: "Try the local-first experience. [Go to the Metadata Remover](/metadata-remover/)."
    },
    th: {
      title: "การประมวลผลในเครื่อง: ทำไมไฟล์ของคุณจึงไม่ถูกส่งออกจากอุปกรณ์ | ConvertUnlimited",
      description: "ค้นพบเทคโนโลยีเบื้องหลังการประมวลผลไฟล์ในเครื่อง เรียนรู้วิธีที่เราใช้ Canvas, WASM และ File APIs เพื่อประมวลผลรูปภาพและ PDF โดยไม่ต้องอัปโหลด",
      h1: "การประมวลผลในเครื่องทำงานอย่างไร",
      intro: "ConvertUnlimited สร้างขึ้นบนหลักการของซอฟต์แวร์ 'Local-First' ซึ่งหมายความว่าทุกรูปภาพที่คุณแปลงและทุก PDF ที่คุณรวมจะถูกประมวลผลในเว็บเบราว์เซอร์ของคุณทั้งหมดโดยใช้ฮาร์ดแวร์ของอุปกรณ์คุณเอง",
      sections: [
        {
          title: "การประมวลผลในเครื่องคืออะไร?",
          content: "ตัวแปลงออนไลน์ส่วนใหญ่เป็นบริการอัปโหลด เมื่อคุณใช้งาน ไฟล์ของคุณจะถูกส่งผ่านอินเทอร์เน็ตไปยังเซิร์ฟเวอร์ที่อยู่ห่างไาก ประมวลผลที่นั่น แล้วส่งกลับมาให้คุณ การประมวลผลในเครื่องช่วยขจัดขั้นตอนนี้ ไฟล์ของคุณจะอยู่ในหน่วยความจำของเบราว์เซอร์และจัดการโดยสคริปต์ฝั่งไคลเอนต์"
        }
      ],
      faq: [
        ["คุณเห็นไฟล์ของฉันไหม?", "ไม่ เซิร์ฟเวอร์ของเราไม่เคยได้รับข้อมูลไฟล์ของคุณ การเชื่อมต่อใช้เพื่อส่งรหัส HTML/JS แบบคงที่ให้คุณเท่านั้น"]
      ],
      cta: "สัมผัสประสบการณ์การประมวลผลในเครื่อง [ไปที่ตัวลบข้อมูลเมตา](/th/metadata-remover/)."
    }
  }
];

module.exports = GUIDES;
