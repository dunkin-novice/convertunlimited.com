"use strict";

module.exports = [
  {
    slug: "about",
    title: "About ConvertUnlimited",
    description: "About ConvertUnlimited, a browser-native file and utility tool platform focused on local processing and practical privacy boundaries.",
    schemaType: "AboutPage",
    h1: "About ConvertUnlimited",
    summary: "ConvertUnlimited is a browser-native utility platform for common file, image, PDF, and developer workflows. The tools are designed to run in the browser where practical, with trust documentation that explains the difference between the public site and the tracker-free privacy build.",
    sections: [
      {
        h2: "What the product is",
        paragraphs: [
          "ConvertUnlimited provides small, practical tools for converting images, compressing files, resizing images, removing metadata, working with PDFs, formatting JSON, encoding data, generating hashes, and similar everyday browser tasks.",
          "The product surface is intentionally simple: open a tool, choose a file or input, process it in the browser when the workflow is supported, and download or copy the result."
        ]
      },
      {
        h2: "Privacy boundary",
        paragraphs: [
          "For supported file-processing workflows, selected file contents are processed locally in your browser. ConvertUnlimited does not provide a server-side upload endpoint for those processing flows.",
          "The public site may load advertising and analytics. Privacy-sensitive workflows should use the privacy build at privacy.convertunlimited.com, which is generated without ads, analytics, remote fonts, or third-party runtime scripts."
        ]
      },
      {
        h2: "How we describe limitations",
        paragraphs: [
          "Browser-native tools depend on browser APIs, available memory, device performance, file format support, and local JavaScript execution. Some large files or unsupported formats may fail locally and require a desktop or server-side workflow.",
          "The Trust Center documents these limits directly instead of relying on broad claims such as guaranteed security or perfect privacy."
        ]
      }
    ],
    links: [
      ["/trust/", "Trust Center"],
      ["/trust/local-processing/", "How local processing works"],
      ["/trust/privacy-build/", "Privacy build"]
    ]
  },
  {
    slug: "contact",
    title: "Contact ConvertUnlimited",
    description: "Contact ConvertUnlimited for site feedback, privacy questions, corrections, and operational issues.",
    schemaType: "ContactPage",
    h1: "Contact ConvertUnlimited",
    summary: "Use this page for site feedback, privacy questions, corrections, and operational issues. Do not email files or sensitive document contents.",
    sections: [
      {
        h2: "Contact method",
        paragraphs: [
          "Email: info@convertunlimited.com",
          "Please describe the tool, browser, device type, and what happened. Do not attach private files, tokens, IDs, or document contents unless you have intentionally created a non-sensitive test file for debugging."
        ]
      },
      {
        h2: "Useful details to include",
        paragraphs: [
          "For tool bugs, include the tool URL, browser name and version, approximate file type, approximate file size, and whether the same issue happens in the privacy build.",
          "For privacy or security questions, include the route and the exact claim or behavior you want reviewed."
        ]
      },
      {
        h2: "What we cannot do",
        paragraphs: [
          "ConvertUnlimited is a browser utility site, not a file recovery service. Because supported tools process files locally in your browser, we generally cannot retrieve or inspect files you processed on your device."
        ]
      }
    ],
    links: [
      ["/trust/verification/", "Verification guide"],
      ["/trust/limitations/", "Limitations"],
      ["/privacy/", "Privacy notice"]
    ]
  },
  {
    slug: "privacy",
    title: "Privacy Notice",
    description: "Privacy notice for ConvertUnlimited public site and privacy build, including local processing boundaries, analytics, ads, and third-party services.",
    schemaType: "PrivacyPolicy",
    h1: "Privacy Notice",
    summary: "For supported processing flows, selected file contents are handled locally by your browser. The public site may load ads and analytics; the privacy build is the no-ads, no-analytics version for privacy-sensitive workflows.",
    sections: [
      {
        h2: "File processing",
        paragraphs: [
          "For supported tools, selected file contents are processed locally in your browser using browser APIs and client-side JavaScript. ConvertUnlimited does not provide a server-side upload endpoint for those processing flows.",
          "Local processing does not mean every browser or device can handle every file. Large files, unsupported formats, memory limits, and browser differences can still cause failures."
        ]
      },
      {
        h2: "Public site",
        paragraphs: [
          "The public site at convertunlimited.com may load advertising, analytics, fonts, and other public-site services. These services can receive normal web request metadata such as IP address, user agent, page URL, referrer, and timing data according to their own service behavior.",
          "Do not use the public ad-supported site for sensitive workflows if your requirement is no ads, no analytics, and no third-party runtime scripts."
        ]
      },
      {
        h2: "Privacy build",
        paragraphs: [
          "The privacy build at privacy.convertunlimited.com is generated separately without ads, analytics, remote fonts, or third-party runtime scripts. It is the intended build for privacy-sensitive workflows and technical privacy review.",
          "The privacy build uses a restrictive security header policy and is audited for third-party runtime requests as part of the deployment workflow."
        ]
      },
      {
        h2: "User input",
        paragraphs: [
          "Do not enter secrets, passwords, private keys, API tokens, or personal documents into tools unless you have verified the deployment behavior and are comfortable with local browser processing on your device.",
          "Analytics events are designed to use tool metadata and not filenames, file contents, raw text, or document contents."
        ]
      }
    ],
    links: [
      ["/trust/privacy-build/", "Privacy build details"],
      ["/trust/third-parties/", "Third-party policy"],
      ["/trust/verification/", "How to verify behavior"]
    ]
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description: "Terms of use for ConvertUnlimited browser-native utility tools.",
    schemaType: "WebPage",
    h1: "Terms of Use",
    summary: "ConvertUnlimited is provided as a browser utility service. Use the tools only with files and data you are allowed to process, and verify outputs before relying on them.",
    sections: [
      {
        h2: "Use of the tools",
        paragraphs: [
          "You are responsible for the files and text you choose to process. Do not use ConvertUnlimited to process content you do not have the right to use or content that violates applicable law.",
          "Outputs should be reviewed before use. Browser conversion, compression, PDF handling, metadata removal, and developer utilities can fail or produce results that are not appropriate for every workflow."
        ]
      },
      {
        h2: "No guarantee of availability or fitness",
        paragraphs: [
          "ConvertUnlimited is provided as-is. The site may change, tools may be unavailable, and browser behavior may differ across devices.",
          "The tools are not a substitute for professional security, legal, compliance, archival, or forensic workflows."
        ]
      },
      {
        h2: "Privacy-sensitive use",
        paragraphs: [
          "The public site may load ads and analytics. Use privacy.convertunlimited.com for workflows that require the tracker-free privacy build.",
          "Even with local processing, you should avoid processing highly sensitive files on shared, managed, or untrusted devices."
        ]
      }
    ],
    links: [
      ["/trust/limitations/", "Limitations"],
      ["/privacy/", "Privacy notice"],
      ["/contact/", "Contact"]
    ]
  }
];
