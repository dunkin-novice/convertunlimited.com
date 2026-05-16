const GUIDES = [
  {
    slug: 'webp-vs-png',
    en: {
      title: "WebP vs PNG: Which Image Format is Better?",
      description: "Comparison of WebP and PNG formats. Learn about file size, transparency, and when to use each for your website or design project.",
      h1: "WebP vs PNG: The Ultimate Comparison",
      intro: "Choosing between WebP and PNG depends on your specific needs: transparency, file size, or lossless quality. While PNG is a classic, WebP is the modern standard for the web.",
      sections: [
        {
          title: "What is the Difference?",
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
            ["Best For", "Web performance, photos", "Logos, icons, text"]
          ]
        },
        {
          title: "Pros and Cons",
          prosCons: {
            webp: {
              pros: ["Significantly smaller file size", "Supports both lossy and lossless", "Great browser support"],
              cons: ["Not ideal for high-end print", "Older software might lack support"]
            },
            png: {
              pros: ["Lossless quality (no data loss)", "Universal software support", "Perfect for sharp edges"],
              cons: ["Very large file sizes", "Only supports lossless compression"]
            }
          }
        },
        {
          title: "When to Use Each",
          content: "Use **WebP** for your website to improve loading speeds and SEO. Use **PNG** when you need absolute pixel-perfection for logos or when you need to edit the image multiple times without any quality degradation."
        }
      ],
      faq: [
        ["Does WebP support transparency like PNG?", "Yes, WebP supports alpha channel transparency just like PNG, but usually at a much smaller file size."],
        ["Is WebP better than PNG for SEO?", "Yes, because WebP files are smaller, your pages load faster, which is a direct ranking factor for Google."],
        ["Can I convert PNG to WebP easily?", "Absolutely. You can use our local-first converter to batch process PNGs into WebP instantly."]
      ],
      cta: "Ready to switch? [Convert PNG to WebP now](/png-to-webp/)."
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
      title: "WebP vs JPG: The Best Format for Photos",
      description: "Comparing WebP and JPG for photography and web use. Find out which format offers better compression and visual quality.",
      h1: "WebP vs JPG: Which is Better for Your Site?",
      intro: "JPG has been the king of photos for decades, but WebP is challenging that crown with better compression and modern features like transparency.",
      sections: [
        {
          title: "Quality vs Size",
          content: "WebP lossy images are intended to be 25% to 34% smaller than comparable JPEG images at equivalent SSIM quality index. This means faster websites without sacrificing visual appeal."
        }
      ],
      faq: [
        ["Should I replace all my JPGs with WebP?", "For web use, yes. It will significantly improve your PageSpeed scores and user experience."]
      ],
      cta: "Optimize your photos. [Convert JPG to WebP now](/jpg-to-webp/)."
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
      title: "What is WebP? Everything You Need to Know",
      description: "A comprehensive guide to the WebP image format. Discover why Google created it, how it works, and why you should use it.",
      h1: "What is WebP? The Modern Image Format",
      intro: "WebP is a modern image format that provides superior lossless and lossy compression for images on the web. It was created by Google to make the web faster.",
      sections: [
        {
          title: "The Origin of WebP",
          content: "Google announced the WebP format in 2010. It is based on the VP8 video codec and uses predictive coding to encode images."
        }
      ],
      faq: [
        ["Which browsers support WebP?", "Currently, Chrome, Firefox, Edge, and Safari all have excellent support for WebP."]
      ],
      cta: "Start using WebP today. [Try our free converter](/)."
    }
  },
  {
    slug: 'local-processing',
    en: {
      title: "Local Processing: How Browser-Native File Tools Work | ConvertUnlimited",
      description: "Discover the technology behind local-first file processing. Learn how we use Canvas, WASM, and File APIs to process images and PDFs without server uploads.",
      h1: "How Local Processing Works",
      intro: "ConvertUnlimited is built around browser-native processing. Supported file tools process selected file contents locally in your browser using your own device's hardware.",
      sections: [
        {
          title: "What is Local Processing?",
          content: "Many online converters are upload services: files are sent to a remote server, processed there, and sent back. Local processing avoids that round trip for supported flows. Selected file contents are handled in browser memory by client-side scripts."
        },
        {
          title: "The Browser APIs Behind the Scenes",
          content: "We leverage modern web standards to provide desktop-class utility performance in a website:\n- **HTML5 Canvas API:** We redraw and re-encode images locally to change their formats.\n- **File & Blob APIs:** We handle your files as local data streams without triggering a network request.\n- **WebAssembly (WASM):** For heavy tasks like AVIF encoding or PDF manipulation, we run high-performance compiled code directly in your browser tab."
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
          title: "Technical Advantages",
          content: "Because there is no upload step, the speed of ConvertUnlimited is only limited by your computer's CPU and RAM. This is why we can support bulk processing of hundreds of files without a subscription fee—we don't have to pay for massive server bandwidth, and neither do you."
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
