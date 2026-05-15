# Third-Party Dependency Inventory

This inventory distinguishes the current public site from the generated privacy
build.

## Privacy Build Runtime Dependencies

These files are vendored locally and loaded from the same origin.

| Dependency | Version | Local file | Purpose | Privacy classification |
| --- | --- | --- | --- | --- |
| JSZip | 3.10.1 | `vendor/jszip-3.10.1.min.js` | ZIP creation for batch downloads | Acceptable when self-hosted |
| pdf-lib | 1.17.1 | `vendor/pdf-lib-1.17.1.min.js` | PDF merge/split/compress operations | Acceptable when self-hosted |
| jsPDF | 2.5.1 | `vendor/jspdf-2.5.1.umd.min.js` | Images-to-PDF generation | Acceptable when self-hosted |
| PDF.js | 3.4.120 | `vendor/pdfjs-3.4.120.min.js` | PDF rendering | Acceptable when self-hosted |
| PDF.js worker | 3.4.120 | `vendor/pdfjs-3.4.120.worker.min.js` | PDF rendering worker | Acceptable when self-hosted |
| heic2any | 0.0.4 | `vendor/heic2any-0.0.4.min.js` | HEIC decoding/conversion | Acceptable when self-hosted |

## Removed From Privacy Build

| Service | Public-site purpose | Privacy-build classification |
| --- | --- | --- |
| Google Analytics / GA4 | Aggregate traffic and event analytics | Harmful to privacy positioning |
| Google Tag Manager / gtag | Analytics loader | Harmful to privacy positioning |
| Google AdSense | Ads and monetization | Harmful to privacy positioning |
| DoubleClick / Google ad-quality endpoints | Ad serving and fraud measurement | Harmful to privacy positioning |
| Google Fonts | Remote font delivery | Replaceable |
| cdnjs | Runtime JavaScript CDN | Replaceable |
| unpkg | Runtime JavaScript CDN | Replaceable |
| jsDelivr | Runtime JavaScript CDN | Replaceable |
| Cloudflare Insights/RUM | Performance telemetry | Harmful to privacy positioning |

## Policy

Privacy-build runtime dependencies must be:

- pinned to a specific version;
- stored in `vendor/`;
- loaded from the same origin;
- listed in this file;
- covered by `npm run audit:privacy`.

Do not add analytics, ads, remote fonts, or runtime CDN scripts to the privacy
build.
