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
    slug: 'how-it-works',
    en: {
      title: "How it Works: Private, Browser-Based File Processing | ConvertUnlimited",
      description: "Learn how ConvertUnlimited processes your files locally in your browser. No uploads, no servers, 100% private and secure.",
      h1: "How Local Processing Works",
      intro: "Unlike traditional online converters that upload your files to a server, ConvertUnlimited works entirely inside your web browser. Your files never leave your device.",
      sections: [
        {
          title: "The Magic of Browser-Native Processing",
          content: "We use modern web technologies like the HTML5 Canvas API and WebAssembly (WASM) to decode and encode your images and documents locally. When you drop a file, your browser's own engine does the heavy lifting."
        },
        {
          title: "Why This is Better for You",
          prosCons: {
            "Local-First": {
              pros: ["100% Private (No one else sees your files)", "No upload/download waiting time", "Work offline once the page is loaded"],
              cons: ["Limited by your device's RAM/CPU", "Extremely large files (2GB+) may struggle"]
            },
            "Server-Based": {
              pros: ["Can handle massive enterprise-scale files"],
              cons: ["Files are uploaded to someone else's server", "Slower (upload/download required)", "Privacy risks"]
            }
          }
        },
        {
          title: "Our Privacy Promise",
          content: "ConvertUnlimited is designed to be zero-knowledge. We don't have a backend that stores your data. We don't have accounts. We don't track your content. The code you see on the screen is the code that runs on your machine."
        }
      ],
      faq: [
        ["Are my files safe?", "Yes. Since your files are never uploaded, they are as safe as they are on your own computer."],
        ["Does this use my internet data?", "Only to load the initial website (a few KB). The actual file processing uses zero data because it happens offline on your device."]
      ],
      cta: "Experience the privacy. [Try our bulk converter now](/)."
    },
    th: {
      title: "มันทำงานอย่างไร: การประมวลผลไฟล์ส่วนตัวในเบราว์เซอร์ | ConvertUnlimited",
      description: "เรียนรู้วิธีที่ ConvertUnlimited ประมวลผลไฟล์ของคุณในเครื่องผ่านเบราว์เซอร์ ไม่มีการอัปโหลด ไม่มีเซิร์ฟเวอร์ เป็นส่วนตัวและปลอดภัย 100%",
      h1: "การประมวลผลในเครื่องทำงานอย่างไร",
      intro: "ต่างจากตัวแปลงออนไลน์ทั่วไปที่ต้องอัปโหลดไฟล์ของคุณไปยังเซิร์ฟเวอร์ ConvertUnlimited ทำงานในเว็บเบราว์เซอร์ของคุณทั้งหมด ไฟล์ของคุณจะไม่ถูกส่งออกจากอุปกรณ์",
      sections: [
        {
          title: "พลังของการประมวลผลในเบราว์เซอร์",
          content: "เราใช้เทคโนโลยีเว็บสมัยใหม่ เช่น HTML5 Canvas API และ WebAssembly (WASM) เพื่อประมวลผลไฟล์ของคุณโดยตรงในเครื่อง"
        }
      ],
      faq: [
          ["ไฟล์ของฉันปลอดภัยหรือไม่?", "ปลอดภัยแน่นอน เนื่องจากไฟล์ของคุณไม่เคยถูกอัปโหลด จึงปลอดภัยเท่ากับไฟล์ที่อยู่ในคอมพิวเตอร์ของคุณเอง"]
      ],
      cta: "สัมผัสความเป็นส่วนตัว [ลองใช้ตัวแปลงของเราตอนนี้](/) ."
    }
  }
];

module.exports = GUIDES;
