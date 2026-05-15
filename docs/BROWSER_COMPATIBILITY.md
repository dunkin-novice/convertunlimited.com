# Browser Compatibility

The privacy build targets current desktop and mobile browsers.

| Feature | Required browser capability |
| --- | --- |
| Image conversion | `File`, `Blob`, `Image`, `Canvas`, `canvas.toBlob` |
| Batch ZIP downloads | `Blob`, object URLs, local JSZip |
| Metadata removal | Canvas decode/re-encode support for the selected image type |
| AVIF export | Browser support for `canvas.toBlob(..., "image/avif")` |
| HEIC conversion | Local heic2any library support and sufficient memory |
| PDF rendering | Web Worker support for local PDF.js worker |
| PDF merge/split | Typed arrays, `ArrayBuffer`, local pdf-lib |

## Practical Notes

- Large files are limited by browser memory and device CPU, not server quotas.
- Mobile browsers may kill tabs during large batch jobs.
- AVIF and HEIC support varies by browser and OS.
- Privacy verification is currently automated against a Chrome-compatible
  browser through the Chrome DevTools Protocol.
