"use strict";

const PRIVACY_NOTE = "For supported ConvertUnlimited tools, selected file contents are processed locally in your browser. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.";

const INTENT_PAGES = [
  {
    slug: "cloudconvert-alternative",
    path: "/alternatives/cloudconvert/",
    type: "alternative",
    title: "CloudConvert Alternative for Browser-Based File Tools",
    metaDescription: "Compare CloudConvert with ConvertUnlimited for browser-based image, PDF, and developer utilities. Learn when local browser processing is a better fit.",
    h1: "CloudConvert alternative for browser-based file tools",
    summary: "ConvertUnlimited is a browser-native alternative for common image, PDF, and developer workflows when you want selected file contents processed locally in your browser for supported tools. CloudConvert remains better for large server-side conversions, obscure formats, and API workflows.",
    answer: "Use ConvertUnlimited for quick local image, PDF, and developer tasks. Use CloudConvert when the job requires server-side format coverage, automation, or integrations.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Best fit",
        paragraphs: [
          "Use ConvertUnlimited when the job matches a browser-supported workflow such as converting PNG or JPG to WebP, compressing images, removing photo metadata, merging PDFs, formatting JSON, or generating hashes.",
          "Use CloudConvert when you need server-side conversion power, account-based workflows, automation, storage integrations, or uncommon file formats that browsers cannot decode or encode directly."
        ]
      },
      {
        heading: "Comparison",
        table: {
          headers: ["Criteria", "ConvertUnlimited", "CloudConvert"],
          rows: [
            ["Processing model", "Browser-native for supported tools", "Server-side conversion"],
            ["File upload requirement", "Core supported flows do not intentionally upload file contents", "Files are uploaded for conversion"],
            ["Account/API workflows", "Not the focus", "Strong fit"],
            ["Best use case", "Fast local utility tasks", "Broad format conversion and automation"],
            ["Privacy-sensitive workflows", "Use the privacy build", "Review CloudConvert account and upload policies"]
          ]
        }
      }
    ],
    limitations: [
      "Browser-native tools are limited by browser format support, device memory, and CPU.",
      "ConvertUnlimited is not a replacement for automated server-side conversion APIs.",
      "Very large files may work better in a dedicated desktop app or server-side workflow."
    ],
    relatedTools: ["image-converter", "png-to-webp", "image-compressor", "metadata-remover", "merge-pdf"],
    guideLinks: ["/proof-of-local-processing/", "/guides/how-it-works/", "/guides/local-processing/"],
    faqs: [
      ["Is ConvertUnlimited a full CloudConvert replacement?", "No. It is a browser-native alternative for common utility workflows, not a server-side API platform."],
      ["Are files uploaded to ConvertUnlimited for these workflows?", "For supported tools, file contents are processed locally in your browser and ConvertUnlimited does not provide a server-side upload endpoint for those processing flows."],
      ["When should I still use CloudConvert?", "Use CloudConvert for uncommon formats, very large files, automation, or integrations that require server-side processing."]
    ]
  },
  {
    slug: "online-convert-alternative",
    path: "/alternatives/online-convert/",
    type: "alternative",
    title: "Online-Convert Alternative for Local Browser Processing",
    metaDescription: "Compare Online-Convert with ConvertUnlimited for browser-based file tools that process supported files locally in your browser.",
    h1: "Online-Convert alternative for local browser processing",
    summary: "ConvertUnlimited is a good fit when you want lightweight image, PDF, and developer utilities that run in the browser for supported workflows. Online-Convert is broader when you need server-side format coverage, presets, or conversion categories that browsers cannot handle.",
    answer: "Choose ConvertUnlimited for supported browser-native utility work. Choose Online-Convert when broad server-side conversion categories matter more than local processing.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "How the choice differs",
        paragraphs: [
          "Online-Convert is a broad server-side conversion site. ConvertUnlimited focuses on browser-native tools where supported file contents can be handled locally after the page loads.",
          "That difference matters most for privacy-sensitive utility tasks, quick image optimization, and developer text tools where a server-side upload endpoint is unnecessary."
        ]
      },
      {
        heading: "Comparison",
        table: {
          headers: ["Criteria", "ConvertUnlimited", "Online-Convert"],
          rows: [
            ["Primary model", "Static browser-native utilities", "Server-side online conversion"],
            ["Core strength", "Local browser workflows", "Broad conversion coverage"],
            ["Privacy-sensitive use", "Use the privacy build", "Review upload and retention behavior"],
            ["Large uncommon formats", "Limited by browser support", "Often better fit"],
            ["Developer utilities", "JSON, CSV, Base64, hash, UUID, regex", "Conversion-focused"]
          ]
        }
      }
    ],
    limitations: [
      "Browser-native processing cannot support every media format.",
      "Some PDF and image workflows depend on browser memory and available JavaScript libraries.",
      "The public build may load ads and analytics; use the privacy build when that matters."
    ],
    relatedTools: ["image-converter", "jpg-to-webp", "avif-converter", "images-to-pdf", "json-formatter"],
    guideLinks: ["/proof-of-local-processing/", "/guides/how-it-works/", "/guides/local-processing/"],
    faqs: [
      ["Is ConvertUnlimited server-side like Online-Convert?", "No. ConvertUnlimited focuses on browser-native tools for supported workflows."],
      ["Which is better for uncommon formats?", "A broad server-side converter is usually better for uncommon or legacy formats that browsers cannot decode."],
      ["Which is better for quick privacy-sensitive tasks?", "Use the ConvertUnlimited privacy build when the task is supported and you want no ads, analytics, remote fonts, or third-party runtime scripts."]
    ]
  },
  {
    slug: "browser-native-vs-cloud-converters",
    path: "/compare/browser-native-vs-cloud-converters/",
    type: "comparison",
    title: "Browser-Native vs Cloud Converters",
    metaDescription: "Compare browser-native file tools with cloud converters for privacy-sensitive workflows, format coverage, performance, and verification.",
    h1: "Browser-native vs cloud converters",
    summary: "Browser-native converters process supported files in your browser, while cloud converters send files to a remote service for processing. The right choice depends on privacy needs, file size, format coverage, automation, and device limits.",
    answer: "Use browser-native tools when the workflow is supported and you want local processing; use cloud converters when you need broad format support, APIs, automation, or server-side power.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Core difference",
        paragraphs: [
          "A browser-native converter loads static code, reads the selected file in the browser, and writes the result from the same tab for supported workflows.",
          "A cloud converter uploads the file to a remote service that performs conversion on server infrastructure. That model can support more formats and automation, but it changes the privacy and trust boundary."
        ]
      },
      {
        heading: "Comparison",
        table: {
          headers: ["Criteria", "Browser-native tools", "Cloud converters"],
          rows: [
            ["Processing location", "User browser for supported workflows", "Remote service"],
            ["Upload requirement", "Not required for supported local flows", "Usually required for conversion"],
            ["Format coverage", "Limited by browser APIs and vendored libraries", "Often broader"],
            ["Automation/API", "Not the focus", "Often a strength"],
            ["Privacy-sensitive workflows", "Use the privacy build and verify in DevTools", "Review upload, retention, and account policies"]
          ]
        }
      },
      {
        heading: "Verification steps",
        paragraphs: [
          "For a browser-native workflow, open DevTools before selecting a file, clear the Network panel, run the conversion, and check whether processing creates upload, analytics, ad, CDN, or beacon requests.",
          "For a cloud workflow, read the provider's upload, storage, deletion, and account policies before processing sensitive files."
        ]
      }
    ],
    limitations: [
      "Browser-native workflows depend on browser support, memory, CPU, and included client-side libraries.",
      "Cloud converters can be better for uncommon formats, very large files, batch automation, and API workflows.",
      "A clean Network panel verifies only the tested workflow and environment; it is not a complete security proof."
    ],
    relatedTools: ["image-converter", "image-compressor", "metadata-remover", "merge-pdf", "json-formatter"],
    guideLinks: ["/trust/local-processing/", "/trust/verification/", "/trust/limitations/", "/proof-of-local-processing/"],
    faqs: [
      ["Are browser-native converters always more private?", "No. They can reduce upload exposure for supported workflows, but the page, host, browser, and extensions still matter."],
      ["When is a cloud converter better?", "Use a cloud converter when the format is unsupported in the browser, files are too large for the device, or automation/API workflows are required."],
      ["Which ConvertUnlimited version should I use for privacy-sensitive files?", "Use privacy.convertunlimited.com, which is generated without ads, analytics, remote fonts, or third-party runtime scripts."]
    ]
  },
  {
    slug: "no-upload-file-converters",
    path: "/compare/no-upload-file-converters/",
    type: "comparison",
    title: "No-Upload File Converters: What to Check",
    metaDescription: "Learn how no-upload file converters work, what claims to verify, and when browser-native processing is a good fit.",
    h1: "No-upload file converters",
    summary: "A no-upload converter should make its processing model testable. For supported ConvertUnlimited workflows, selected file contents are processed locally in the browser and the privacy build removes ads, analytics, remote fonts, and third-party runtime scripts.",
    answer: "Do not trust a no-upload claim by wording alone. Check where processing happens, whether an upload endpoint is used, whether third-party scripts run, and whether the behavior can be verified in DevTools.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "What no-upload should mean",
        paragraphs: [
          "A useful no-upload claim should be scoped to a specific processing flow, not the entire website. It should explain that the selected file is read and transformed locally in the browser for supported tools.",
          "The claim should also be testable. Network inspection should not show file-content upload requests during the processing step."
        ]
      },
      {
        heading: "Claim checklist",
        table: {
          headers: ["Question", "Why it matters", "ConvertUnlimited privacy build"],
          rows: [
            ["Is the tool browser-native?", "Local APIs reduce the need for upload", "Yes for supported workflows"],
            ["Are ads or analytics loaded?", "Third parties can observe page activity", "No in the privacy build"],
            ["Are runtime libraries same-origin?", "CDNs are executable dependencies", "Vendored where needed"],
            ["Is connect-src restricted?", "Limits network APIs in supporting browsers", "connect-src 'none'"],
            ["Can users verify behavior?", "Trust should be inspectable", "DevTools and repository tests"]
          ]
        }
      },
      {
        heading: "Verification steps",
        paragraphs: [
          "Open a clean browser profile, visit the privacy build, open DevTools Network, disable cache, process a small sample file, and review new requests.",
          "Expected activity should be same-origin static assets or local browser URLs such as blob: and data:. Unexpected upload, analytics, ad, CDN, or beacon requests should be investigated."
        ]
      }
    ],
    limitations: [
      "No-upload does not mean no network requests before the page is loaded.",
      "No-upload does not protect against compromised browsers, extensions, operating systems, or host-level script injection.",
      "Some formats and files still require cloud or desktop tools."
    ],
    relatedTools: ["image-converter", "metadata-remover", "image-compressor", "images-to-pdf", "hash-generator"],
    guideLinks: ["/trust/verification/", "/trust/privacy-build/", "/trust/third-parties/", "/trust/limitations/"],
    faqs: [
      ["How can I tell whether a converter uploads files?", "Inspect the Network panel while processing a sample file and look for upload or third-party requests."],
      ["Does no-upload mean the site has no third parties?", "No. A site can process files locally while still loading ads or analytics. Use the privacy build when that distinction matters."],
      ["Does ConvertUnlimited provide a server-side upload endpoint for supported local flows?", "No. Supported local-processing flows use browser APIs and client-side code rather than a ConvertUnlimited upload endpoint."]
    ]
  },
  {
    slug: "tinypng-alternative",
    path: "/alternatives/tinypng/",
    type: "alternative",
    title: "TinyPNG Alternative for Browser-Based Image Workflows",
    metaDescription: "Compare TinyPNG with ConvertUnlimited for image compression, WebP conversion, resizing, metadata cleanup, and privacy-sensitive browser workflows.",
    h1: "TinyPNG alternative for browser-based image workflows",
    summary: "ConvertUnlimited is a better fit when you want several browser-native image utilities in one place and privacy-sensitive workflows can run locally in your browser. TinyPNG is a strong fit when its compression service, API, or existing optimization pipeline is what you need.",
    answer: "Use ConvertUnlimited for local browser image workflows such as compress, resize, convert, and remove metadata. Use TinyPNG when you specifically want TinyPNG/Tinify compression behavior, API integration, or an existing cloud optimization workflow.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Best fit",
        paragraphs: [
          "TinyPNG is known for image compression and the Tinify developer workflow. ConvertUnlimited is broader as a browser-native utility surface: conversion, compression, resizing, metadata cleanup, AVIF/WebP workflows, and related PDF/developer tools.",
          "The privacy distinction is the main moat: for supported ConvertUnlimited image workflows, selected file contents are processed locally in the browser. Use the privacy build for no ads, analytics, remote fonts, or third-party runtime scripts."
        ]
      },
      {
        heading: "Comparison",
        table: {
          headers: ["Criteria", "ConvertUnlimited", "TinyPNG"],
          rows: [
            ["Primary use", "Browser-native image utility workflows", "Image compression service"],
            ["Processing model", "Local browser processing for supported tools", "Service-based compression workflow"],
            ["API/integration", "Not the focus", "Strong fit via Tinify-style workflows"],
            ["Related tasks", "Convert, compress, resize, remove metadata", "Compression-focused"],
            ["Privacy-sensitive use", "Use privacy.convertunlimited.com", "Review upload and API behavior"]
          ]
        }
      }
    ],
    limitations: [
      "ConvertUnlimited browser-native compression may not match a specialized service on every image.",
      "TinyPNG can be better when an API, plugin, or existing cloud optimization pipeline is required.",
      "Browser-native processing is limited by device memory, CPU, and browser encoder behavior."
    ],
    relatedTools: ["image-compressor", "image-resizer", "png-to-webp", "jpg-to-webp", "metadata-remover"],
    guideLinks: ["/trust/local-processing/", "/trust/privacy-build/", "/trust/verification/", "/compare/png-vs-webp/"],
    faqs: [
      ["Is ConvertUnlimited a full TinyPNG replacement?", "No. It is a browser-native alternative for common image utility workflows, not a replacement for every TinyPNG/Tinify integration."],
      ["When is ConvertUnlimited better?", "When the task is supported locally and you want image conversion, compression, resizing, or metadata cleanup without a server-side upload endpoint for that flow."],
      ["When is TinyPNG better?", "When you need its specific compression service, API, plugin ecosystem, or an established cloud image-optimization pipeline."]
    ]
  },
  {
    slug: "ilovepdf-alternative",
    path: "/alternatives/ilovepdf/",
    type: "alternative",
    title: "iLovePDF Alternative for Browser-Based PDF Tools",
    metaDescription: "Compare iLovePDF with ConvertUnlimited for browser-based PDF merge, split, compress, images-to-PDF, and PDF-to-image workflows.",
    h1: "iLovePDF alternative for browser-based PDF tools",
    summary: "ConvertUnlimited is a lightweight browser-native alternative for common PDF workflows when local processing is a priority. iLovePDF is better for broad hosted PDF features, account workflows, and tools that require server-side document handling.",
    answer: "Use ConvertUnlimited for simple browser-based PDF tasks that fit local processing. Use iLovePDF when you need a broad PDF platform, account features, OCR-style workflows, editing depth, or server-side processing.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Best fit",
        paragraphs: [
          "ConvertUnlimited supports common PDF tasks such as merging, splitting, compressing, creating PDFs from images, and rendering PDF pages as images. These workflows are limited by browser memory and client-side library behavior.",
          "iLovePDF is a broader PDF platform. That breadth can be valuable, but it also means users should review upload, retention, account, and processing policies before using it for sensitive documents."
        ]
      },
      {
        heading: "Comparison",
        table: {
          headers: ["Criteria", "ConvertUnlimited", "iLovePDF"],
          rows: [
            ["Processing model", "Browser-native for supported PDF workflows", "Hosted PDF platform"],
            ["Best use", "Quick local PDF utility tasks", "Broad PDF tool coverage"],
            ["Advanced PDF features", "Limited", "Stronger fit"],
            ["Large/complex PDFs", "Limited by browser resources", "Often better fit"],
            ["Privacy-sensitive use", "Use the privacy build and verify", "Review upload and retention policy"]
          ]
        }
      }
    ],
    limitations: [
      "Browser PDF processing can fail on encrypted, damaged, or very large PDFs.",
      "Some compression results are limited because browser-side tools cannot safely rewrite every PDF object.",
      "iLovePDF may be better for OCR, editing, signing, account workflows, or advanced document tasks."
    ],
    relatedTools: ["merge-pdf", "split-pdf", "compress-pdf", "images-to-pdf", "pdf-to-images"],
    guideLinks: ["/trust/local-processing/", "/trust/limitations/", "/trust/verification/", "/best/browser-based-pdf-tools/"],
    faqs: [
      ["Is ConvertUnlimited a complete iLovePDF replacement?", "No. It covers common browser-native PDF tasks, not every hosted PDF feature."],
      ["When should I use ConvertUnlimited?", "Use it for supported quick PDF workflows where local browser processing and no-account use matter."],
      ["When should I use iLovePDF?", "Use it when you need broader PDF editing, account workflows, OCR-style features, or server-side handling for large documents."]
    ]
  },
  {
    slug: "freeconvert-alternative",
    path: "/alternatives/freeconvert/",
    type: "alternative",
    title: "FreeConvert Alternative for No-Upload Browser Workflows",
    metaDescription: "Compare FreeConvert with ConvertUnlimited for browser-native image, PDF, and developer utilities where supported workflows can run locally.",
    h1: "FreeConvert alternative for no-upload browser workflows",
    summary: "ConvertUnlimited is a better fit when you need supported browser-native utility workflows and want to avoid a server-side upload endpoint for those flows. FreeConvert is broader when you need many cloud conversion categories, presets, or server-side handling.",
    answer: "Use ConvertUnlimited for supported local browser tasks. Use FreeConvert when broad file conversion coverage, cloud processing, or formats outside browser support are the priority.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Best fit",
        paragraphs: [
          "FreeConvert is a broad cloud conversion service. ConvertUnlimited focuses on privacy-native browser utilities where the browser can do the work locally.",
          "This makes ConvertUnlimited a stronger fit for common image, PDF, and developer tasks where local processing and verification matter more than long-tail format coverage."
        ]
      },
      {
        heading: "Comparison",
        table: {
          headers: ["Criteria", "ConvertUnlimited", "FreeConvert"],
          rows: [
            ["Processing model", "Browser-native for supported workflows", "Cloud/server-side conversion service"],
            ["Format breadth", "Common browser-supported utilities", "Broader file conversion categories"],
            ["Account/API workflows", "Not the focus", "Better fit when needed"],
            ["Verification", "DevTools and privacy build tests", "Review provider policies"],
            ["Privacy-sensitive use", "Use privacy.convertunlimited.com", "Review upload, storage, and processing behavior"]
          ]
        }
      }
    ],
    limitations: [
      "ConvertUnlimited is not intended to cover every file type.",
      "FreeConvert or another cloud converter may be better for uncommon formats and very large files.",
      "Use the privacy build for privacy-sensitive ConvertUnlimited workflows, not the public ad-supported site."
    ],
    relatedTools: ["image-converter", "avif-converter", "image-compressor", "merge-pdf", "json-formatter"],
    guideLinks: ["/compare/browser-native-vs-cloud-converters/", "/compare/no-upload-file-converters/", "/trust/privacy-build/", "/trust/limitations/"],
    faqs: [
      ["Is ConvertUnlimited a full FreeConvert replacement?", "No. It is a browser-native alternative for supported utility workflows, not a broad cloud conversion platform."],
      ["When is ConvertUnlimited better?", "When the task is supported locally and privacy-sensitive processing or no-account utility use matters."],
      ["When is FreeConvert better?", "When you need broad server-side format conversion, larger files, presets, or workflows outside browser support."]
    ]
  },
  {
    slug: "canva-converters-alternative",
    path: "/alternatives/canva-converters/",
    type: "alternative",
    title: "Canva Converter Alternative for Browser-Native Utility Workflows",
    metaDescription: "Compare Canva converters with ConvertUnlimited for quick browser-native file utilities, image optimization, PDF workflows, and privacy-sensitive processing.",
    h1: "Canva converter alternative for browser-native utility workflows",
    summary: "ConvertUnlimited is a better fit for quick utility workflows such as image conversion, compression, resizing, metadata cleanup, and PDF utility tasks. Canva is better when the conversion is part of a design, template, collaboration, or publishing workflow.",
    answer: "Use ConvertUnlimited when you need a fast file utility. Use Canva when you need design editing, templates, collaboration, brand assets, or publishing tools around the conversion.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Best fit",
        paragraphs: [
          "Canva is a design platform. Its converters make sense when file conversion is part of creating or exporting a design.",
          "ConvertUnlimited is a utility platform. It is better suited to direct file tasks where the goal is convert, compress, resize, clean metadata, merge, split, or format data without entering a design workspace."
        ]
      },
      {
        heading: "Comparison",
        table: {
          headers: ["Criteria", "ConvertUnlimited", "Canva converters"],
          rows: [
            ["Primary model", "Browser-native utility tools", "Design platform workflow"],
            ["Best use", "Direct file conversion and cleanup", "Design editing and export"],
            ["Templates/collaboration", "Not the focus", "Strong fit"],
            ["Privacy-sensitive file utilities", "Use the privacy build", "Review account, upload, and design storage behavior"],
            ["Workflow speed", "Fast for utility tasks", "Better when design context is needed"]
          ]
        }
      }
    ],
    limitations: [
      "ConvertUnlimited does not provide design templates, brand kits, collaboration, or publishing workflows.",
      "Canva may be better when conversion is part of a design project.",
      "Browser-native utility tools remain limited by browser support and device resources."
    ],
    relatedTools: ["image-converter", "image-resizer", "image-compressor", "metadata-remover", "images-to-pdf"],
    guideLinks: ["/trust/local-processing/", "/trust/privacy-build/", "/best/free-image-converter/", "/best/browser-based-pdf-tools/"],
    faqs: [
      ["Is ConvertUnlimited a Canva replacement?", "No. ConvertUnlimited is a browser-native utility platform, not a design workspace."],
      ["When is ConvertUnlimited better?", "When you want a direct file utility without templates, accounts, design editing, or project storage."],
      ["When is Canva better?", "When the conversion is part of design creation, collaboration, brand management, or publishing."]
    ]
  },
  {
    slug: "free-image-converter",
    path: "/best/free-image-converter/",
    type: "best",
    title: "Best Free Image Converter for Browser-Based Workflows",
    metaDescription: "Choose a free image converter for WebP, JPG, PNG, AVIF, compression, resizing, and metadata cleanup with browser-native processing where supported.",
    h1: "Best free image converter for browser-based workflows",
    summary: "The best free image converter depends on your job. ConvertUnlimited is strongest for common browser-supported image workflows: WebP/JPG/PNG conversion, image compression, resizing, AVIF conversion where supported, and metadata cleanup.",
    answer: "For common web-image work, start with conversion, compression, resizing, and metadata cleanup. Keep source files when compatibility or future editing matters.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "What to look for",
        paragraphs: [
          "A good free image converter should make the supported formats clear, explain where processing happens, show limitations, and avoid forcing account creation for simple jobs.",
          "For web images, the most useful workflow is often convert, compress, resize, remove metadata, then download."
        ]
      },
      {
        heading: "Format and workflow fit",
        table: {
          headers: ["Need", "Recommended tool", "Notes"],
          rows: [
            ["Convert PNG or JPG to WebP", "PNG to WebP / JPG to WebP", "Useful for smaller web images"],
            ["Compress web images", "Image Compressor", "Adjust quality and compare output"],
            ["Resize dimensions", "Image Resizer", "Useful before compression"],
            ["Remove metadata", "Metadata Remover", "Re-encodes images to strip common metadata"],
            ["Try newer compression", "AVIF Converter", "Compatibility varies by browser"]
          ]
        }
      }
    ],
    limitations: [
      "Browser support determines which formats can be decoded and encoded.",
      "Large batches can be slower on phones or low-memory devices.",
      "Some professional workflows still need desktop software or server-side batch systems."
    ],
    relatedTools: ["image-converter", "png-to-webp", "jpg-to-webp", "image-compressor", "image-resizer"],
    guideLinks: ["/guides/webp-vs-png/", "/guides/webp-vs-jpg/", "/guides/what-is-webp/"],
    faqs: [
      ["What is the best free image format for websites?", "WebP is usually a strong default for web images, while JPG remains useful for photos and PNG remains useful for transparency or lossless graphics."],
      ["Can I convert images without creating an account?", "Yes. ConvertUnlimited tools are designed for no-account utility workflows."],
      ["Do browser-based converters work offline?", "Some workflows may continue after the page and required scripts are loaded, but do not assume every browser or tool is fully offline-capable."]
    ]
  },
  {
    slug: "browser-based-pdf-tools",
    path: "/best/browser-based-pdf-tools/",
    type: "best",
    title: "Best Browser-Based PDF Tools for Local Workflows",
    metaDescription: "Compare browser-based PDF workflows for merging, splitting, compressing, converting images to PDF, and extracting PDF pages.",
    h1: "Best browser-based PDF tools for local workflows",
    summary: "Browser-based PDF tools are useful for quick document tasks that do not require a server-side upload. ConvertUnlimited supports common PDF workflows such as merging, splitting, compressing, creating PDFs from images, and rendering PDF pages as images.",
    answer: "Browser-based PDF tools work best for small to moderate documents and simple page operations. Complex, encrypted, or damaged PDFs may need a desktop editor.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Workflow map",
        table: {
          headers: ["Task", "Tool", "Best for"],
          rows: [
            ["Combine documents", "Merge PDF", "Joining PDFs in a chosen order"],
            ["Extract pages", "Split PDF", "Saving ranges or individual pages"],
            ["Reduce size", "Compress PDF", "Trying browser-side size reduction"],
            ["Create a PDF", "Images to PDF", "Building a PDF from image files"],
            ["Export pages", "PDF to Images", "Rendering pages as image files"]
          ]
        }
      },
      {
        heading: "When browser-based PDF tools make sense",
        paragraphs: [
          "They work well for small to moderate files, quick edits, and workflows where keeping processing in the browser is valuable.",
          "They are less suitable for very large documents, OCR-heavy tasks, damaged PDFs, or enterprise workflows that require audit trails and shared storage."
        ]
      }
    ],
    limitations: [
      "PDF behavior varies by document structure, embedded fonts, images, encryption, and browser memory.",
      "Some compression results may be modest because the browser cannot safely rewrite every PDF object like a dedicated desktop tool.",
      "Password-protected or damaged PDFs may fail."
    ],
    relatedTools: ["merge-pdf", "split-pdf", "compress-pdf", "images-to-pdf", "pdf-to-images"],
    guideLinks: ["/proof-of-local-processing/", "/guides/how-it-works/", "/guides/local-processing/"],
    faqs: [
      ["Are browser-based PDF tools enough for all PDF work?", "No. They are useful for common tasks but not a replacement for full desktop PDF editors or enterprise document systems."],
      ["Why can PDF processing be slow?", "PDF files can contain many pages, images, fonts, and object streams. Browser memory and CPU determine how fast a local workflow feels."],
      ["What should I do if a PDF fails?", "Try a smaller file, remove encryption if you own the document, or use a dedicated PDF application for damaged or complex PDFs."]
    ]
  },
  {
    slug: "convert-webp-without-upload",
    path: "/guides/convert-webp-without-upload/",
    type: "without-upload",
    title: "Convert WebP Without Upload: Browser-Based Options",
    metaDescription: "Learn how to convert WebP without a server-side upload using browser-native tools for supported WebP to JPG or PNG workflows.",
    h1: "Convert WebP without upload",
    summary: "To convert WebP without a server-side upload, use a browser-native converter that decodes the selected WebP file locally and writes JPG or PNG output in the browser. ConvertUnlimited supports WebP to JPG and WebP to PNG workflows where the browser can decode the file.",
    answer: "Use WebP to JPG for broad photo compatibility and WebP to PNG when transparency or lossless-style output matters. Verify unusual or animated WebP files before relying on batch output.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Recommended workflow",
        paragraphs: [
          "Open the WebP to JPG or WebP to PNG tool, select your WebP files, choose the output format, run the conversion, then download the result from the same browser tab.",
          "If you need to verify behavior, use the browser network panel and check that file-content upload requests are not made during the processing step."
        ]
      },
      {
        heading: "Output choice",
        table: {
          headers: ["Output", "Use when", "Tradeoff"],
          rows: [
            ["JPG", "You need broad compatibility for photos", "No transparency support"],
            ["PNG", "You need transparency or lossless-style output", "Often larger files"],
            ["WebP", "You already have a web-optimized output", "Some older workflows may not accept it"]
          ]
        }
      }
    ],
    limitations: [
      "The browser must be able to decode the source WebP file.",
      "Animated WebP support may differ from still-image conversion behavior.",
      "Output quality and metadata behavior depend on browser image APIs."
    ],
    relatedTools: ["webp-to-jpg", "webp-to-png", "image-compressor", "metadata-remover"],
    guideLinks: ["/proof-of-local-processing/", "/guides/what-is-webp/", "/guides/webp-vs-jpg/"],
    faqs: [
      ["Can I convert WebP without uploading the file to a server?", "For supported ConvertUnlimited flows, selected file contents are processed locally in your browser."],
      ["Should I convert WebP to JPG or PNG?", "Use JPG for photos and compatibility. Use PNG when transparency or lossless-style output matters."],
      ["Will metadata be preserved?", "Browser re-encoding may remove or change metadata. Use the metadata remover when metadata cleanup is the goal."]
    ]
  },
  {
    slug: "convert-jpg-to-webp-without-upload",
    path: "/guides/convert-jpg-to-webp-without-upload/",
    type: "without-upload",
    title: "Convert JPG to WebP Without Upload",
    metaDescription: "Convert JPG images to WebP in a browser-based workflow. Learn when WebP helps and what limitations to expect.",
    h1: "Convert JPG to WebP without upload",
    summary: "JPG to WebP conversion is a strong browser-native workflow for reducing photo file sizes. In ConvertUnlimited, selected JPG contents are decoded and re-encoded locally in your browser for this supported flow.",
    answer: "Convert JPG to WebP when you want smaller web images and your publishing workflow accepts WebP. Keep the original JPG when compatibility or source quality matters.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "When JPG to WebP helps",
        paragraphs: [
          "WebP often creates smaller files than JPG at similar visual quality, which can help website performance and reduce transfer size.",
          "For web publishing, a practical workflow is convert JPG to WebP, compress if needed, resize to final dimensions, then remove metadata before publishing."
        ]
      },
      {
        heading: "JPG to WebP decision table",
        table: {
          headers: ["Question", "Recommendation"],
          rows: [
            ["Is the image a photo?", "WebP is usually a good candidate"],
            ["Do you need maximum legacy compatibility?", "Keep a JPG fallback"],
            ["Do you need transparency?", "Start from PNG or another transparent source instead"],
            ["Are files already tiny?", "Compression gains may be limited"]
          ]
        }
      }
    ],
    limitations: [
      "WebP support is strong in modern browsers but can still be a compatibility issue in older tools.",
      "Converting an already heavily compressed JPG may not improve quality.",
      "Batch conversion speed depends on image size and device resources."
    ],
    relatedTools: ["jpg-to-webp", "image-compressor", "image-resizer", "metadata-remover"],
    guideLinks: ["/proof-of-local-processing/", "/guides/webp-vs-jpg/", "/guides/what-is-webp/"],
    faqs: [
      ["Is WebP always smaller than JPG?", "Not always, but WebP is often smaller for web photos at similar visual quality."],
      ["Does converting JPG to WebP improve image quality?", "No. Conversion can reduce file size, but it cannot recover detail lost in the original JPG."],
      ["Should I keep the original JPG?", "Yes, keep source files when quality or compatibility matters."]
    ]
  },
  {
    slug: "remove-metadata-without-upload",
    path: "/guides/remove-metadata-without-upload/",
    type: "without-upload",
    title: "Remove Image Metadata Without Upload",
    metaDescription: "Learn how browser-based metadata removal works, what it can remove, and what limitations to check before sharing images.",
    h1: "Remove image metadata without upload",
    summary: "Browser-based metadata removal usually works by decoding the selected image and writing a new image file without copying common metadata blocks. ConvertUnlimited uses local browser re-encoding for supported image metadata cleanup workflows.",
    answer: "Use metadata removal before sharing photos that may include camera, timestamp, or GPS fields. It does not remove visible information inside the image pixels.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "What metadata removal can remove",
        paragraphs: [
          "Common photo metadata can include EXIF camera details, timestamps, orientation data, and GPS coordinates. A destructive re-encode can remove many of these fields because the new output file is written from pixel data rather than copied byte-for-byte.",
          "This is useful before publishing images online, sending photos to clients, or sharing screenshots that may contain device metadata."
        ]
      },
      {
        heading: "Metadata scope",
        table: {
          headers: ["Data type", "Expected behavior", "Check manually?"],
          rows: [
            ["EXIF camera fields", "Usually removed by re-encoding", "Yes"],
            ["GPS coordinates", "Usually removed when EXIF is not copied", "Yes"],
            ["Visible text inside the image", "Not removed", "Yes"],
            ["Watermarks or pixels", "Not removed", "Yes"],
            ["File name", "Not a metadata-removal guarantee", "Yes"]
          ]
        }
      }
    ],
    limitations: [
      "Metadata removal does not remove visible information inside image pixels.",
      "Different formats and browsers may behave differently.",
      "Always inspect sensitive outputs before sharing."
    ],
    relatedTools: ["metadata-remover", "image-compressor", "image-resizer", "png-to-webp"],
    guideLinks: ["/proof-of-local-processing/", "/guides/how-it-works/", "/guides/local-processing/"],
    faqs: [
      ["Does metadata removal remove visible private information?", "No. It does not remove faces, addresses, text, or other visible pixels."],
      ["Can metadata removal change image quality?", "Yes. Re-encoding may alter file size, format, or visual quality depending on output settings."],
      ["Should I verify the output?", "Yes. For sensitive images, inspect the result with a metadata viewer and visually review the image."]
    ]
  },
  {
    slug: "webp-vs-jpg",
    path: "/compare/webp-vs-jpg/",
    type: "comparison",
    title: "WebP vs JPG: Which Image Format Should You Use?",
    metaDescription: "Compare WebP and JPG for web images, compatibility, compression, quality, transparency, and browser-native conversion workflows.",
    h1: "WebP vs JPG",
    summary: "WebP is usually better when you want smaller web images at similar visual quality. JPG remains useful for broad compatibility, simple photo workflows, and systems that do not accept WebP.",
    answer: "Pick WebP for modern web delivery and JPG for maximum compatibility. If a publishing system rejects WebP, keep a JPG fallback.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Comparison table",
        table: {
          headers: ["Criteria", "WebP", "JPG"],
          rows: [
            ["Compression", "Usually smaller at similar quality", "Good, but often larger"],
            ["Transparency", "Supported", "Not supported"],
            ["Animation", "Supported by the format", "Not supported"],
            ["Compatibility", "Modern browsers and many tools", "Very broad legacy support"],
            ["Best use", "Modern web delivery", "Photos and legacy workflows"]
          ]
        }
      },
      {
        heading: "Practical recommendation",
        paragraphs: [
          "Use WebP for modern websites when your audience and toolchain support it.",
          "Use JPG when compatibility is more important than file-size savings or when downstream software does not handle WebP well."
        ]
      }
    ],
    limitations: [
      "Format choice does not improve source image quality.",
      "Compatibility requirements should drive the final decision.",
      "Some publishing systems still require JPG uploads."
    ],
    relatedTools: ["jpg-to-webp", "webp-to-jpg", "image-compressor", "metadata-remover"],
    guideLinks: ["/guides/webp-vs-jpg/", "/guides/what-is-webp/", "/proof-of-local-processing/"],
    faqs: [
      ["Is WebP better than JPG?", "For modern web images, often yes. For legacy compatibility, JPG is still safer."],
      ["Can WebP replace JPG everywhere?", "No. Some tools and workflows still expect JPG."],
      ["Can I convert JPG to WebP locally?", "For supported ConvertUnlimited flows, selected JPG contents are processed locally in your browser."]
    ]
  },
  {
    slug: "avif-vs-webp",
    path: "/compare/avif-vs-webp/",
    type: "comparison",
    title: "AVIF vs WebP: Compression, Quality, and Compatibility",
    metaDescription: "Compare AVIF and WebP for image compression, browser support, quality, encoding speed, and practical web publishing workflows.",
    h1: "AVIF vs WebP",
    summary: "AVIF can produce very small high-quality images, but WebP is often the more practical default because support and tooling are broader. Use AVIF when compression savings justify compatibility checks.",
    answer: "Use WebP as the practical default for modern sites. Test AVIF when file-size savings are worth extra compatibility checks.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Comparison table",
        table: {
          headers: ["Criteria", "AVIF", "WebP"],
          rows: [
            ["Compression potential", "Excellent", "Very good"],
            ["Browser support", "Modern browser support, but check target audience", "Broad modern support"],
            ["Encoding speed", "Can be slower", "Usually faster"],
            ["Tooling compatibility", "Improving", "More common"],
            ["Best use", "Maximum compression tests", "Reliable modern web default"]
          ]
        }
      },
      {
        heading: "Recommendation",
        paragraphs: [
          "Try AVIF for performance-sensitive pages where every kilobyte matters and you can test compatibility.",
          "Use WebP when you want a strong balance between compression, speed, and broad modern support."
        ]
      }
    ],
    limitations: [
      "AVIF encoding and decoding behavior depends heavily on browser support.",
      "Some workflows still need WebP or JPG fallbacks.",
      "Compression comparisons should use your actual images, not generic assumptions."
    ],
    relatedTools: ["avif-converter", "png-to-webp", "jpg-to-webp", "image-compressor"],
    guideLinks: ["/guides/what-is-webp/", "/guides/webp-vs-jpg/", "/proof-of-local-processing/"],
    faqs: [
      ["Is AVIF smaller than WebP?", "Often, but not always. Test with your own images and quality requirements."],
      ["Should I use AVIF or WebP by default?", "WebP is usually the practical default. AVIF is worth testing when compression savings are critical."],
      ["Can browser tools convert AVIF?", "Support depends on the browser and the specific conversion path."]
    ]
  },
  {
    slug: "png-vs-webp",
    path: "/compare/png-vs-webp/",
    type: "comparison",
    title: "PNG vs WebP: Transparency, Size, and Web Use",
    metaDescription: "Compare PNG and WebP for transparency, lossless images, web performance, compatibility, and browser-based conversion.",
    h1: "PNG vs WebP",
    summary: "PNG is reliable for lossless graphics and transparency, but WebP often produces smaller web images while still supporting transparency. For modern web publishing, WebP is often the better delivery format.",
    answer: "Keep PNG for source graphics and exact assets. Use WebP for smaller delivery files when your target browsers and tools support it.",
    reviewed: "May 2026",
    sections: [
      {
        heading: "Comparison table",
        table: {
          headers: ["Criteria", "PNG", "WebP"],
          rows: [
            ["Transparency", "Supported", "Supported"],
            ["Lossless graphics", "Strong fit", "Supported, often smaller"],
            ["Photo compression", "Usually large", "Usually much smaller"],
            ["Compatibility", "Very broad", "Broad modern support"],
            ["Best use", "Source graphics, screenshots, transparency", "Optimized web delivery"]
          ]
        }
      },
      {
        heading: "Practical recommendation",
        paragraphs: [
          "Keep PNG for source assets, exact graphics, screenshots, and workflows that need universal compatibility.",
          "Convert PNG to WebP when the goal is faster web delivery and your target environment supports WebP."
        ]
      }
    ],
    limitations: [
      "Converting PNG to WebP may be lossy depending on quality settings.",
      "Some design workflows still require PNG source files.",
      "Very small PNG icons may not always benefit from conversion."
    ],
    relatedTools: ["png-to-webp", "webp-to-png", "image-compressor", "metadata-remover"],
    guideLinks: ["/guides/webp-vs-png/", "/guides/what-is-webp/", "/proof-of-local-processing/"],
    faqs: [
      ["Is WebP better than PNG?", "For web delivery, often yes. For source graphics and maximum compatibility, PNG remains useful."],
      ["Does WebP support transparency?", "Yes, WebP supports transparency."],
      ["Should I delete my PNG originals?", "No. Keep source PNG files when you may need future edits or lossless originals."]
    ]
  }
];

module.exports = { INTENT_PAGES, PRIVACY_NOTE };
