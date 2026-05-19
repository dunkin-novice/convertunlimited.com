"use strict";

const TRUST_PAGES = [
  {
    slug: "",
    type: "AboutPage",
    title: "Trust Center",
    h1: "ConvertUnlimited Trust Center",
    description: "Technical trust documentation for ConvertUnlimited browser-native tools, privacy build behavior, verification steps, and limitations.",
    summary: "ConvertUnlimited uses browser-native processing for supported utility workflows. This Trust Center explains what runs locally, what the privacy build changes, how network isolation is verified, and where browser or device limits still apply.",
    answer: "For supported tools, selected file contents are processed locally in your browser. The public site may load ads and analytics, while the privacy build is generated without ads, analytics, remote fonts, or third-party runtime scripts.",
    sections: [
      {
        heading: "What this Trust Center covers",
        paragraphs: [
          "This section documents the technical trust model behind ConvertUnlimited. It separates public-site behavior from privacy-build behavior and avoids broad claims that cannot be verified from the page itself.",
          "The main trust boundary is the browser tab. Supported tools use browser APIs, local JavaScript, Canvas, Web Crypto, and vendored client-side libraries to process selected files without a server-side upload endpoint for those processing flows."
        ]
      },
      {
        heading: "Where to start",
        list: [
          ["/trust/local-processing/", "Local processing", "How browser-native file processing works and when uploads are not required."],
          ["/trust/privacy-build/", "Privacy build", "What changes on privacy.convertunlimited.com compared with the public site."],
          ["/trust/verification/", "Verification", "How to inspect network behavior and run local verification tests."],
          ["/trust/limitations/", "Limitations", "What browser-native processing does not protect against."]
        ]
      }
    ],
    faqs: [
      ["Is the public site the privacy-reviewed build?", "No. The public site may load ads and analytics. The privacy-reviewed deployment target is privacy.convertunlimited.com."],
      ["Does every workflow run without upload?", "No. Trust claims are scoped to supported local-processing flows. Pages should state when browser support or device limits apply."],
      ["How can I verify the behavior?", "Use the verification guide, browser DevTools Network panel, and the repository privacy tests before processing sensitive files."]
    ]
  },
  {
    slug: "local-processing",
    type: "TechArticle",
    title: "Local Processing",
    h1: "How local browser processing works",
    description: "A technical explanation of ConvertUnlimited local processing, browser APIs, and when file uploads are not required.",
    summary: "Local processing means the selected file is handled by JavaScript and browser APIs in the page after the static assets have loaded. For supported workflows, ConvertUnlimited does not provide a server-side upload endpoint for the processing flow.",
    answer: "A supported local-processing tool reads the selected file in the browser, processes it with browser APIs or vendored client-side libraries, and creates a downloadable result from the same tab.",
    sections: [
      {
        heading: "Processing path",
        paragraphs: [
          "A typical image workflow uses the File API to read the selected file, Canvas to decode or re-encode pixels, Blob or object URLs to hold the result, and a download link to save the new file.",
          "PDF and developer utilities may use ArrayBuffer, Blob, Web Crypto, or vendored JavaScript libraries. The important distinction is that the file operation is performed by the browser runtime, not by a ConvertUnlimited upload service."
        ]
      },
      {
        heading: "When uploads are not required",
        paragraphs: [
          "Uploads are not required when the browser can decode, transform, and write the required output format locally. Examples include supported image conversion, image compression, metadata cleanup by re-encoding, many PDF operations, JSON formatting, hashing, Base64 conversion, and QR generation.",
          "If a browser cannot decode a format, runs out of memory, or lacks an encoder for the requested output, a local-processing tool may fail or need a different workflow."
        ]
      },
      {
        heading: "Related source documentation",
        links: [
          ["LOCAL_PROCESSING.md", "https://github.com/dunkin-novice/convertunlimited.com/blob/main/LOCAL_PROCESSING.md"],
          ["Architecture notes", "https://github.com/dunkin-novice/convertunlimited.com/blob/main/docs/ARCHITECTURE.md"]
        ]
      }
    ],
    faqs: [
      ["Does local processing mean no network requests at all?", "No. The page must load static assets first. The privacy claim concerns supported processing flows after the page is loaded."],
      ["Can local processing handle every format?", "No. It depends on browser support, available memory, and the client-side libraries included in the build."],
      ["Is local processing the same as a desktop sandbox?", "No. The page still runs inside the browser and is affected by browser, extension, device, and host behavior."]
    ]
  },
  {
    slug: "privacy-build",
    type: "TechArticle",
    title: "Privacy Build",
    h1: "What the privacy build changes",
    description: "What privacy.convertunlimited.com removes, keeps, and verifies compared with the public ConvertUnlimited site.",
    summary: "The privacy build is a generated deployment artifact for privacy-sensitive workflows and privacy review. It removes ads, analytics, remote fonts, Google services, Cloudflare Insights, and third-party runtime scripts from the app artifact.",
    answer: "Use privacy.convertunlimited.com when you want the tracker-free ConvertUnlimited build. The public site remains ad-supported and is not the review target for no-ads/no-analytics claims.",
    sections: [
      {
        heading: "Removed from the privacy build",
        list: [
          ["Ads", "Ad provider scripts and ad slot scaffolding are removed from the generated privacy artifact."],
          ["Analytics", "GTM, GA4, analytics-events.js, and file-operation telemetry are stripped or no-oped."],
          ["Remote runtime assets", "Runtime CDNs and remote fonts are removed or replaced with same-origin vendored files."],
          ["Third-party script policy", "The privacy build is audited for known third-party runtime script references."]
        ]
      },
      {
        heading: "What stays the same",
        paragraphs: [
          "The tools remain static browser pages. They still rely on the user's browser, CPU, memory, and supported APIs. The privacy build does not add server-side conversion, account storage, or a stronger device sandbox."
        ]
      },
      {
        heading: "Deployment boundary",
        paragraphs: [
          "privacy.convertunlimited.com is deployed separately from the ad-supported public site. Cloudflare Web Analytics, Zaraz, Rocket Loader, email obfuscation, and other runtime script injections must remain disabled for the privacy hostname."
        ]
      }
    ],
    faqs: [
      ["Should I use the privacy build for sensitive files?", "Yes, when the workflow is supported and browser/device limits are acceptable."],
      ["Does the privacy build include ads?", "No. The generated privacy artifact removes ad scripts and ad scaffold DOM."],
      ["Does the privacy build send analytics events?", "No. Tracking helpers are stripped or rewritten to no-ops in the privacy artifact."]
    ]
  },
  {
    slug: "security-architecture",
    type: "TechArticle",
    title: "Security Architecture",
    h1: "Security architecture",
    description: "Security controls used by the ConvertUnlimited privacy build, including CSP, permissions policy, and host-level deployment rules.",
    summary: "The privacy build uses a static architecture with same-origin assets, a restrictive Content Security Policy, no connect destinations, blocked sensitive browser permissions, and Worker headers for deployment separation.",
    answer: "The security model reduces runtime network and script exposure, but it does not protect against a compromised browser, malicious extension, operating-system telemetry, or user-downloaded files after they leave the page.",
    sections: [
      {
        heading: "Primary controls",
        list: [
          ["Content Security Policy", "The privacy deployment uses default-src 'self', script-src 'self', connect-src 'none', object-src 'none', base-uri 'self', form-action 'none', and frame-ancestors 'none'."],
          ["Permissions Policy", "Camera, microphone, geolocation, payment, USB, Bluetooth, accelerometer, gyroscope, magnetometer, and interest-cohort permissions are disabled."],
          ["Same-origin runtime", "Runtime JavaScript and vendored libraries are served from the privacy origin."],
          ["Staging noindex", "workers.dev staging responses receive noindex headers and robots meta overrides."]
        ]
      },
      {
        heading: "Why connect-src none matters",
        paragraphs: [
          "connect-src 'none' blocks fetch, XHR, WebSocket, EventSource, and sendBeacon destinations in supporting browsers after the page is loaded. It is a deployment control that supports the local-processing claim for the privacy build."
        ]
      },
      {
        heading: "Related source documentation",
        links: [
          ["THREAT_MODEL.md", "https://github.com/dunkin-novice/convertunlimited.com/blob/main/THREAT_MODEL.md"],
          ["Deployment notes", "https://github.com/dunkin-novice/convertunlimited.com/blob/main/docs/DEPLOYMENT_PRIVACY.md"]
        ]
      }
    ],
    faqs: [
      ["Does CSP make the app risk-free?", "No. CSP reduces classes of network and script exposure, but it is not a complete security boundary."],
      ["Why allow unsafe-inline styles?", "The current pages include inline style attributes, so style-src 'unsafe-inline' remains a future hardening task."],
      ["Does the privacy build use third-party runtime scripts?", "The generated artifact is audited so it does not intentionally load third-party runtime scripts."]
    ]
  },
  {
    slug: "verification",
    type: "TechArticle",
    title: "Verification",
    h1: "How to verify local processing",
    description: "Verification steps for checking ConvertUnlimited privacy build behavior in DevTools and with repository tests.",
    summary: "Trust claims should be testable. You can inspect the Network panel, run the privacy build audit, and run the no-network processing test against representative workflows.",
    answer: "Open DevTools before selecting a file, clear the Network log, run the tool, and confirm processing does not create third-party or upload requests. For repository verification, run npm run verify:privacy.",
    sections: [
      {
        heading: "Browser DevTools check",
        list: [
          ["Open a clean browser profile", "Use privacy.convertunlimited.com and disable browser extensions if possible."],
          ["Open Network panel", "Enable Preserve log and disable cache before selecting a file."],
          ["Process a sample file", "Run the workflow and watch for new requests."],
          ["Review requests", "Expected requests should be same-origin static assets, data URLs, or blob URLs. Third-party analytics, ads, or file uploads should not appear."]
        ]
      },
      {
        heading: "Repository checks",
        paragraphs: [
          "The repository includes static and runtime checks for the privacy artifact. The static audit scans for known third-party runtime references. The runtime test blocks common network APIs while exercising representative processing flows."
        ],
        code: "npm run build:privacy\nnpm run audit:privacy\nnpm run test:privacy-network\nnpm run verify:privacy"
      },
      {
        heading: "Related proof page",
        paragraphs: [
          "The existing proof page summarizes the privacy artifact, verification command, network isolation model, and threat-model limitations."
        ],
        links: [["Proof of local processing", "/proof-of-local-processing/"]]
      }
    ],
    faqs: [
      ["What should I look for in the Network panel?", "Look for unexpected upload, analytics, ad, CDN, or beacon requests during processing."],
      ["Does a clean Network panel prove all security properties?", "No. It verifies a narrow behavior: whether the tested processing flow caused network requests."],
      ["Can browser extensions affect the result?", "Yes. Extensions can inject scripts or inspect page data depending on their permissions."]
    ]
  },
  {
    slug: "limitations",
    type: "TechArticle",
    title: "Limitations",
    h1: "Limitations of browser-native processing",
    description: "Practical limitations of ConvertUnlimited local processing, privacy claims, browser support, and device constraints.",
    summary: "Browser-native processing is useful for many privacy-sensitive utility workflows, but it is not a replacement for every converter, a device sandbox, or a guarantee that every file type will work.",
    answer: "Use ConvertUnlimited when the workflow is supported by your browser and device. Use desktop or server-side workflows when files are too large, formats are unsupported, or automation is required.",
    sections: [
      {
        heading: "Technical limitations",
        list: [
          ["Browser support", "Format decoding and encoding depends on the browser."],
          ["Device memory", "Large images, PDFs, or batches can exhaust tab memory."],
          ["Processing speed", "Mobile devices may be slower or more constrained than desktop browsers."],
          ["Output verification", "Sensitive outputs should be inspected before sharing."]
        ]
      },
      {
        heading: "Privacy limitations",
        list: [
          ["Compromised device", "A compromised browser, operating system, or malicious extension can observe page data."],
          ["Host-level injection", "Privacy deployment depends on the host not injecting runtime scripts."],
          ["Downloaded files", "Once a file is downloaded or shared elsewhere, it leaves the page's control."],
          ["Visible content", "Metadata removal does not remove faces, addresses, text, or other visible pixels."]
        ]
      }
    ],
    faqs: [
      ["When should I avoid browser-native tools?", "Avoid them when files are too large for your device, formats are unsupported, or you need automation/API workflows."],
      ["Does metadata removal remove visible private information?", "No. It removes metadata by re-encoding supported images, but visible pixels remain."],
      ["Does the privacy build protect against extensions?", "No. Browser extensions operate outside the app's control."]
    ]
  },
  {
    slug: "third-parties",
    type: "TechArticle",
    title: "Third Parties",
    h1: "Third-party and runtime script policy",
    description: "How ConvertUnlimited separates public-site third parties from the privacy build and audits runtime dependencies.",
    summary: "The public site may use ads and analytics. The privacy build is the review target for no ads, no analytics, no remote fonts, and no third-party runtime scripts.",
    answer: "Trust claims must specify which build is being discussed. The privacy build is generated separately and audited for known third-party runtime references.",
    sections: [
      {
        heading: "Public site",
        paragraphs: [
          "The public site is ad-supported and may load analytics or advertising services. Its core supported tool logic can still process files in the browser, but the public site should not be used as evidence for no-ads/no-analytics claims."
        ]
      },
      {
        heading: "Privacy build",
        list: [
          ["No ads", "Ad scripts and ad scaffold DOM are removed from the generated artifact."],
          ["No analytics", "GTM, GA4, and platform analytics wrappers are stripped from the privacy build."],
          ["No remote fonts", "Remote font references are removed."],
          ["No runtime CDNs", "Required runtime libraries are served from same-origin vendored files."],
          ["No host injection", "Cloudflare Web Analytics, Zaraz, Rocket Loader, email obfuscation, and injected challenge scripts must remain disabled for privacy.convertunlimited.com."]
        ]
      },
      {
        heading: "Related source documentation",
        links: [
          ["THIRD_PARTIES.md", "https://github.com/dunkin-novice/convertunlimited.com/blob/main/THIRD_PARTIES.md"],
          ["Privacy policy for the privacy build", "https://github.com/dunkin-novice/convertunlimited.com/blob/main/PRIVACY.md"]
        ]
      }
    ],
    faqs: [
      ["Does the privacy build load Google Tag Manager?", "No. GTM is stripped from the privacy build."],
      ["Does the privacy build load Cloudflare Web Analytics?", "It should not. If a beacon appears in rendered HTML, that is a Cloudflare dashboard configuration problem that must be disabled."],
      ["Are vendored libraries third-party code?", "They are third-party libraries served from the same origin and tracked in the repository inventory."]
    ]
  }
];

module.exports = { TRUST_PAGES };
