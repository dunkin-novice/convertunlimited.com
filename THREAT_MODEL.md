# Threat Model

## Scope

This threat model covers the generated privacy build in `dist/privacy-build/`.
It does not cover the public ad-supported website unless that site serves the
same artifact without modification.

## Assets

- User-selected file contents.
- File names and file sizes displayed in the browser UI.
- Generated output files before download.
- User trust in local processing claims.

## Security Goals

- Do not upload selected file contents.
- Do not send file-derived telemetry.
- Do not load third-party runtime scripts.
- Make local-processing claims testable.
- Keep the build static-host compatible and inspectable.

## Non-Goals

- Defending against a compromised browser, OS, or device.
- Defending against malicious browser extensions.
- Hiding the user IP address from the static host that serves the app.
- Preventing browser or OS crash reporting outside this app.
- Guaranteeing that every file format is fully sanitized after conversion.

## Primary Risks and Controls

| Risk | Control |
| --- | --- |
| Third-party scripts observe the page | Privacy build strips third-party runtime scripts and vendors dependencies locally. |
| File operations trigger telemetry | Tool `track()` helpers are rewritten to no-op in the privacy build. |
| Accidental network calls during processing | CSP uses `connect-src 'none'`; runtime test patches `fetch`, XHR, and `sendBeacon`. |
| CDN dependency changes behavior | Runtime libraries are pinned and vendored in `vendor/`. |
| Maintainers cannot verify claims | `npm run verify:privacy` provides static and runtime checks. |
| Public build is confused with privacy build | README and docs distinguish the ad-supported build from the privacy build. |

## Residual Risks

- A static host may inject scripts unless configured not to.
- A browser extension can access page data depending on its permissions.
- Some conversions re-encode files and may change image/PDF fidelity.
- Metadata removal through canvas re-encoding strips common embedded metadata,
  but users should validate outputs for high-risk publishing workflows.
