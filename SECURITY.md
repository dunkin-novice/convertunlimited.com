# Security Policy

## Supported Artifact

Security reports should identify whether they affect:

- the public website;
- the generated privacy build in `dist/privacy-build/`;
- both.

The privacy build is the artifact used for privacy-first OSS review.

## Reporting a Vulnerability

Please open a private security advisory on GitHub if available, or contact the
maintainer through the repository contact channel. Do not publish exploit details
until the issue has been triaged.

Include:

- affected page or tool;
- browser and OS;
- proof of concept;
- whether file contents, file metadata, or network behavior are affected;
- whether the issue reproduces in `dist/privacy-build/`.

## Expected Response

- Triage: best effort within 7 days.
- Fix or mitigation plan: best effort within 30 days for confirmed issues.
- Critical privacy regressions in the privacy build should block submission and
  release until fixed.

## Security Controls in the Privacy Build

- No analytics or advertising scripts.
- No runtime third-party scripts.
- Local vendored runtime libraries.
- CSP emitted through `_headers` and meta tags.
- `Referrer-Policy: no-referrer`.
- restrictive `Permissions-Policy`.
- no-network runtime verification.

## Out of Scope

- Vulnerabilities in user browsers, extensions, or operating systems.
- Static hosts that inject scripts after deployment.
- The ad-supported public build when the report is specifically about the
  privacy build.
