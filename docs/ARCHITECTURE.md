# Privacy Build Architecture

## Recommended Deployment

Use a separate subdomain:

```text
privacy.convertunlimited.com
```

Serve only:

```text
dist/privacy-build/
```

For Cloudflare Pages, use:

```text
Build command: npm run build:privacy
Output directory: dist/privacy-build
Custom domain: privacy.convertunlimited.com
```

This is better than `/privacy-build/` on the public domain because:

- absolute static paths continue to work;
- the CSP can be written for a standalone origin;
- privacy reviewers can audit one artifact;
- public ads/analytics cannot be confused with the privacy submission.

## Build Flow

```text
public static source
      |
      v
scripts/build-privacy.js
      |
      +-- strips ads, analytics, remote fonts
      +-- replaces runtime CDN URLs with /vendor files
      +-- rewrites telemetry helpers to no-op
      +-- rewrites PDF.js worker to local vendor file
      +-- emits _headers
      |
      v
dist/privacy-build/
```

## Headers

The generated `_headers` file contains:

- `Content-Security-Policy`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

The CSP intentionally sets:

```text
connect-src 'none'
```

This blocks browser network APIs in supporting browsers after the page is loaded.

The current CSP target is:

```text
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
media-src 'self' blob:;
connect-src 'none';
font-src 'self';
worker-src 'self' blob:;
object-src 'none';
base-uri 'self';
form-action 'none';
frame-ancestors 'none'
```

## Host-Level Injection Risk

The privacy build assumes the static host serves the generated files without
injecting runtime JavaScript. On Cloudflare, create a dedicated configuration for
`privacy.convertunlimited.com` and disable Web Analytics, Zaraz, Rocket Loader,
script-injecting performance features, and normal-page managed challenge
injection. See [DEPLOYMENT_PRIVACY.md](DEPLOYMENT_PRIVACY.md).

## Known Hardening Tradeoff

The current pages use inline style attributes, so the privacy build keeps:

```text
style-src 'self' 'unsafe-inline'
```

This should be removed in a later refactor by moving inline styles into CSS.
