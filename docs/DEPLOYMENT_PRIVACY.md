# Privacy Build Deployment

## Deployment Target

Deploy only this generated directory:

```text
dist/privacy-build/
```

Recommended hostname:

```text
privacy.convertunlimited.com
```

Do not point `privacy.convertunlimited.com` at the repository root or the public
ad-supported build.

## Cloudflare Workers Static Assets

The committed Worker configuration is `wrangler.jsonc`.

| Setting | Value |
| --- | --- |
| Worker name | `convertunlimited-privacy` |
| Assets directory | `dist/privacy-build` |
| Worker script | `workers/privacy-worker.js` |
| Compatibility date | `2026-05-18` |
| Staging Worker URL | `https://convertunlimited-privacy.kitikornr.workers.dev` |
| Production domain | `privacy.convertunlimited.com` |
| `workers_dev` | Enabled for staging checks |
| `preview_urls` | Disabled; enable only if PR/preview URLs are needed |

Recommended Cloudflare Worker build/deploy settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build:privacy` |
| Deploy command | `npx wrangler deploy` |
| Root directory | repository root |
| Custom domain / route | `privacy.convertunlimited.com` |

Equivalent manual deploy command:

```sh
npm run build:privacy
npx wrangler deploy
```

The previous manual deployment command also works for assets-only testing:

```sh
npx wrangler deploy --assets=dist/privacy-build --compatibility-date=2026-05-18
```

Use the committed `wrangler.jsonc` for production deploys so the Worker wrapper
is included. The wrapper adds `X-Robots-Tag: noindex, nofollow, noarchive` only
when the request hostname ends in `.workers.dev`. It does not noindex
`privacy.convertunlimited.com`.

Required environment variables / token permissions:

- `CLOUDFLARE_API_TOKEN` for CI deploys, or an authenticated local Wrangler
  session for manual deploys.
- Token permissions should be scoped to deploy Workers for the account/zone that
  owns `convertunlimited.com`.
- Optional for CI: set `WRANGLER_SEND_METRICS=false` if you want Wrangler CLI
  telemetry disabled during deployment jobs.
- If deploying the custom domain through Wrangler is not configured, add
  `privacy.convertunlimited.com` to the Worker in the Cloudflare dashboard.

## Cloudflare Pages

Cloudflare Workers Static Assets is the current deployment target. Cloudflare
Pages remains a compatible fallback for the generated static artifact.

Recommended Cloudflare Pages settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build:privacy` |
| Build output directory | `dist/privacy-build` |
| Root directory | repository root |
| Custom domain | `privacy.convertunlimited.com` |

The generated `_headers` file is intended for Cloudflare Pages and compatible
static hosts. It includes the privacy-build CSP and other security headers.

## Cloudflare Features to Disable

For `privacy.convertunlimited.com`, configure a separate rule or Pages project
that does not inject runtime JavaScript.

Disable:

- Cloudflare Web Analytics;
- Zaraz;
- Rocket Loader;
- Auto Minify features that rewrite or inject scripts;
- performance beacons or browser insight scripts;
- Bot Fight Mode or managed challenges on normal tool pages if they inject
  challenge scripts into the browsing session;
- any app, worker, or transform rule that adds analytics, ads, or runtime JS.

Bot protection at the edge is acceptable only if normal successful page loads do
not receive injected JavaScript. If Cloudflare serves an interstitial challenge,
that challenge page is outside the privacy-build artifact and should not be used
as evidence for privacy review.

## Required Post-Deploy Checks

After deployment, run a browser network inspection against the public hostname:

1. Open `https://privacy.convertunlimited.com/` in a clean profile.
2. Disable cache in DevTools.
3. Process a small sample file.
4. Confirm all requests are same-origin, `data:`, or `blob:`.
5. Confirm no requests to Google, DoubleClick, Cloudflare Insights, cdnjs,
   unpkg, jsDelivr, recaptcha, or other third-party runtime hosts.

Local verification before deploy:

```sh
npm run verify:privacy
```

## Separation From Public Build

The public website at `www.convertunlimited.com` may include ads and analytics.
The privacy build is the review and submission target. Privacy-sensitive
workflows should use `privacy.convertunlimited.com`.
