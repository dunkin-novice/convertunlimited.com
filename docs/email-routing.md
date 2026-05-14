# Email routing — convertunlimited.com

Internal note covering the brand inbox setup. Not published to the site.

## Active configuration

| Field | Value |
|---|---|
| Public address | `info@convertunlimited.com` |
| Forward destination | `kitikornr@gmail.com` |
| Inbound provider | Cloudflare Email Routing |
| Outbound (sending) provider | none yet — see "Sending as info@" below |
| Catch-all `*@convertunlimited.com` | **disabled** (intentional) |

## Status

Cloudflare Email Routing is enabled on the zone. The single rule `info@convertunlimited.com → kitikornr@gmail.com` is active. The destination address is verified in Cloudflare (one-time confirmation clicked from Gmail).

DNS is managed by Cloudflare (NS: `alaric.ns.cloudflare.com`, `candy.ns.cloudflare.com`). When Email Routing is enabled, Cloudflare auto-adds the records below as locked / managed entries — do not edit them by hand:

```
MX   convertunlimited.com   10  route1.mx.cloudflare.net
MX   convertunlimited.com   20  route2.mx.cloudflare.net
MX   convertunlimited.com   30  route3.mx.cloudflare.net
TXT  convertunlimited.com   "v=spf1 include:_spf.mx.cloudflare.net ~all"
```

The pre-existing `google-site-verification` TXT record stays untouched — independent of mail.

## Why no catch-all

`*@convertunlimited.com` forwarding was deliberately left off. Catch-all attracts dictionary-attack spam (`admin@`, `sales@`, `postmaster@`, random strings) which then forwards into the personal Gmail inbox and trains its spam filter against legitimate mail. If a second alias is genuinely needed later (e.g., `support@`), add it as a **specific** custom-address rule in Cloudflare instead of flipping catch-all on.

## Limitation — inbound only

Cloudflare Email Routing **only forwards inbound mail**. It does **not** send outbound mail. There is no Cloudflare SMTP relay. Replying from Gmail today will send from `kitikornrakhangthong@gmail.com`, not `info@convertunlimited.com`.

## Sending as `info@convertunlimited.com` — remaining step

To make Gmail's compose / reply show `info@convertunlimited.com` as the From address, an outbound sending provider is still required. Pick one:

**a) Gmail "Send mail as" + third-party SMTP** *(cheapest path)*
- Sign up for an SMTP-capable provider with a free tier (Resend, Brevo, Mailgun, Postmark).
- Verify domain there (adds DKIM CNAMEs + a separate SPF TXT). With Cloudflare already SPF-publishing for inbound, the outbound provider's SPF will need to be **merged** into one TXT record, not added as a second one.
- In Gmail → Settings → Accounts → *Send mail as* → add `info@convertunlimited.com` with the provider's SMTP host, port, and credentials.
- Gmail sends a confirmation code to `info@`; Cloudflare forwards it to `kitikornr@gmail.com`; paste it back into Gmail. Done.
- ⚠️ Do **not** select "Send through Gmail" / "Treat as alias" — Gmail will rewrite the From header and DMARC alignment will fail when the domain eventually adds DMARC.

**b) Google Workspace**
- Paid (~$6/user/month). Provides a real mailbox at `info@convertunlimited.com` with native send. Replaces Cloudflare Email Routing entirely — the Cloudflare MX records would be deleted and Google Workspace MX records would take over.

**c) Resend / Postmark / Mailgun for transactional only**
- For programmatic / app-driven email (signup confirmations, contact-form submissions, etc.), not for hand-typed replies from Gmail. Domain verification + DKIM + SPF needed the same way as (a).

Recommended order if traffic stays low: stay on Cloudflare for inbound, add (a) when you actually need to reply as `info@`.

## Validation checklist

- [ ] Email Routing toggled on in Cloudflare dashboard → Email → Email Routing.
- [ ] Custom address `info@` → `kitikornr@gmail.com` shows status **Active**.
- [ ] Destination address `kitikornr@gmail.com` shows status **Verified**.
- [ ] DNS tab shows the four Cloudflare-managed records above (3× MX, 1× SPF TXT).
- [ ] Test: send mail from any external account → `info@convertunlimited.com` → arrives at `kitikornr@gmail.com` within ~1 minute.
- [ ] Test (negative): send mail to `random-test@convertunlimited.com` → bounces with "address not found" (confirms catch-all is off, as intended).
- [ ] Site source contains no `mailto:kitikornr@gmail.com` references (already verified — only `info@` should ever appear publicly, and currently no contact link exists on the site at all).

## Dashboard click-path (one-time setup)

1. Cloudflare dashboard → select **convertunlimited.com** zone.
2. Left nav → **Email** → **Email Routing** → **Get started**.
3. Cloudflare proposes the four DNS records — click **Add records and enable**.
4. Add destination address → `kitikornr@gmail.com` → check Gmail, click the verification link.
5. Add custom address → `info@convertunlimited.com` → action **Send to an email** → select `kitikornr@gmail.com` → Save.
6. Leave the catch-all toggle **disabled**.
7. Run the validation checklist above.
