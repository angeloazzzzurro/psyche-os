# Deployment Hardening

PSYCHE/OS is a static frontend plus local scripts. The browser surface should still be deployed with explicit security headers.

## Included Baseline

The repository includes [`web/public/_headers`](../web/public/_headers), which is automatically copied into the build output and can be consumed directly by platforms such as Netlify and Cloudflare Pages.

That baseline sets:

- `Content-Security-Policy`
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`

## If Your Host Does Not Support `_headers`

Mirror the same policy at the CDN, reverse proxy, or hosting layer.

Recommended baseline:

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; worker-src 'self' blob:
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

## Notes

- `style-src 'unsafe-inline'` is currently required because the UI uses inline style attributes in React for some visual states.
- `frame-ancestors 'none'` is only enforceable as an HTTP header, not through a meta CSP tag.
- If you introduce external APIs, analytics, or media providers later, update `connect-src`, `img-src`, or `media-src` explicitly instead of widening the policy blindly.
