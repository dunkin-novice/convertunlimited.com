# ConvertUnlimited

**Privacy-First, Browser-Native File Utility Suite.**

ConvertUnlimited is a local-first platform where files are processed entirely on your device using modern browser APIs. Unlike traditional online converters, your data never leaves your machine. No uploads, no servers, no privacy risks.

[Live Site](https://www.convertunlimited.com/) | [How Local Processing Works](https://www.convertunlimited.com/guides/local-processing/)

## 🛡️ Privacy Philosophy
- **Zero Uploads:** Files are decoded and encoded locally using the Canvas and File APIs.
- **Zero Knowledge:** We don't see, store, or transmit your content.
- **No Accounts:** No signup required. No tracking cookies.
- **Stateless:** There is no backend database storing your files or metadata.

## 🚀 Key Features
- **Bulk Image Conversion:** Convert hundreds of images at once (PNG, WebP, JPG, AVIF, HEIC).
- **Metadata Removal:** Strip EXIF, GPS, and personal data from photos locally.
- **Background Removal:** Simple, browser-based background clearing for product shots.
- **PDF Utilities:** Merge, split, and compress PDFs without uploading sensitive documents.
- **Developer Tools:** JSON formatters, Base64 encoders, and Regex testers.

## 🛠️ Technical Stack
ConvertUnlimited is built with a minimal, high-performance stack to ensure near-instant local processing:
- **Vanilla JavaScript:** No heavy frameworks to slow down execution.
- **HTML5 Canvas API:** For high-speed image manipulation and redrawing.
- **WebAssembly (WASM):** Used for advanced encoding tasks like AVIF and HEIC support.
- **jszip:** For client-side bundling of bulk-converted files into a single ZIP.
- **Static Architecture:** The entire suite can be run offline once the initial page is loaded.

## 📊 Local vs. Server-Based Comparison
| Feature | Traditional Converters | ConvertUnlimited |
| :--- | :--- | :--- |
| **Data Privacy** | Files uploaded to a server | Files stay on your device |
| **Speed** | Limited by upload/download | Limited by device CPU/RAM |
| **Security** | Risk of server-side data breach | Zero server-side risk |
| **Availability** | Requires active internet | Works offline once loaded |

## 📦 Local Development
To run ConvertUnlimited locally:
1. Clone the repository: `git clone https://github.com/dunkin-novice/convertunlimited.com.git`
2. Navigate to the folder: `cd convertunlimited.com`
3. Serve the directory using any local server:
   - `python3 -m http.server`
   - `npx serve .`
4. Open `localhost:8000` in your browser.

## 🌐 Localization
ConvertUnlimited is fully localized in 8 languages to serve a global audience:
- English (EN)
- Thai (TH)
- Vietnamese (VI)
- Chinese (ZH)
- Japanese (JA)
- Korean (KO)
- Spanish (ES)
- French (FR)

## 🤝 Contributions
We welcome contributions that improve the local-first utility ecosystem. Please ensure:
- All logic remains client-side.
- No external tracking or telemetry is added.
- Performance impact is minimized.

## 📜 License
MIT License. Feel free to use, fork, and self-host.
