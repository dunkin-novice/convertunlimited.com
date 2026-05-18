"use strict";

const WORKFLOW_CLUSTERS = [
  {
    workflow_id: "image-optimization",
    name: "Image optimization",
    description: "Prepare web images by resizing, compressing, removing metadata, and converting formats in the browser.",
    primary_tools: [
      "image-resizer",
      "image-compressor",
      "metadata-remover",
      "image-converter",
      "png-to-webp",
      "jpg-to-webp",
      "webp-to-jpg",
      "webp-to-png",
      "png-to-jpg",
      "avif-converter",
      "heic-to-jpg"
    ],
    next_actions: {
      "png-to-webp": ["image-compressor", "metadata-remover", "image-resizer", "webp-to-png", "avif-converter"],
      "jpg-to-webp": ["image-compressor", "metadata-remover", "image-resizer", "webp-to-jpg", "avif-converter"],
      "image-compressor": ["metadata-remover", "image-resizer", "png-to-webp", "jpg-to-webp"],
      "metadata-remover": ["image-compressor", "image-resizer", "png-to-webp", "jpg-to-webp"]
    },
    related_guides: ["/guides/local-processing/", "/guides/webp-vs-jpg/", "/guides/webp-vs-png/"],
    trust_modules: ["local-processing", "canvas-reencoding", "metadata-limits", "browser-memory-limits"],
    intent_page_opportunities: [
      "convert-webp-without-upload",
      "best-free-image-converter",
      "cloudconvert-alternative",
      "avif-vs-webp"
    ]
  },
  {
    workflow_id: "image-editing",
    name: "Image editing",
    description: "Apply browser-side edits such as background removal and watermarking, then optimize the result.",
    primary_tools: ["background-remover", "watermark-tool", "image-resizer", "image-compressor", "metadata-remover"],
    next_actions: {
      "background-remover": ["image-compressor", "image-resizer", "metadata-remover"],
      "watermark-tool": ["image-compressor", "image-resizer", "metadata-remover"]
    },
    related_guides: ["/guides/local-processing/"],
    trust_modules: ["canvas-processing", "browser-memory-limits", "download-behavior"],
    intent_page_opportunities: ["remove-background-without-upload", "add-watermark-without-upload"]
  },
  {
    workflow_id: "pdf-assembly",
    name: "PDF assembly",
    description: "Create, merge, compress, split, or extract PDF content using browser-side flows where supported.",
    primary_tools: ["images-to-pdf", "merge-pdf", "compress-pdf", "split-pdf", "pdf-to-images"],
    next_actions: {
      "images-to-pdf": ["merge-pdf", "compress-pdf", "split-pdf"],
      "merge-pdf": ["compress-pdf", "split-pdf"],
      "pdf-to-images": ["images-to-pdf", "image-compressor"]
    },
    related_guides: ["/guides/local-processing/"],
    trust_modules: ["wasm-processing", "pdf-limitations", "browser-memory-limits"],
    intent_page_opportunities: ["browser-native-pdf-tools", "merge-pdf-without-upload", "compress-pdf-without-upload"]
  },
  {
    workflow_id: "developer-data",
    name: "Developer and data utilities",
    description: "Inspect, format, transform, and copy structured text without sending raw input to a server-side processing endpoint.",
    primary_tools: [
      "json-formatter",
      "csv-cleaner",
      "csv-to-json",
      "json-to-csv",
      "diff-checker",
      "regex-tester",
      "base64-encoder-decoder",
      "url-encoder-decoder",
      "jwt-decoder",
      "uuid-generator",
      "hash-generator",
      "timestamp-converter"
    ],
    next_actions: {
      "json-formatter": ["json-to-csv", "diff-checker", "jwt-decoder"],
      "csv-cleaner": ["csv-to-json", "json-formatter"],
      "csv-to-json": ["json-formatter", "json-to-csv"],
      "json-to-csv": ["csv-cleaner", "csv-to-json"]
    },
    related_guides: ["/guides/local-processing/"],
    trust_modules: ["text-processing-scope", "clipboard-behavior", "input-limitations"],
    intent_page_opportunities: ["format-json-without-upload", "csv-to-json-browser-based", "jwt-decode-locally"]
  },
  {
    workflow_id: "seo-sharing",
    name: "SEO and sharing",
    description: "Preview metadata and generate share assets such as QR codes in browser-native tools.",
    primary_tools: ["meta-preview-checker", "qr-generator"],
    next_actions: {
      "meta-preview-checker": ["qr-generator"],
      "qr-generator": ["meta-preview-checker"]
    },
    related_guides: [],
    trust_modules: ["preview-limitations", "local-generation"],
    intent_page_opportunities: ["qr-code-generator-browser-based", "meta-preview-checker"]
  }
];

module.exports = { WORKFLOW_CLUSTERS };
