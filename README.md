# X Portuguese Filter

A lightweight browser extension that removes Portuguese-language posts from X (Twitter) timelines using simple client-side heuristics.

The extension runs entirely in the browser, requires no API access, and does not track or collect any data.

---

## Features

- Hides Portuguese (PT-BR / PT-PT) posts from timelines
- Works on dynamically loaded content (infinite scroll)
- No permissions beyond access to x.com
- No external services, analytics, or storage
- Fast and non-intrusive

---

## How it works

Tweets are scanned in real time and filtered using a small set of common Portuguese stopwords.  
If a tweet crosses a configurable threshold, it is removed from the DOM.

This avoids reliance on unreliable language metadata and keeps the extension lightweight.

---

## Installation (Developer Mode)

**Chrome · Edge · Brave · Opera · Vivaldi**

1. Open `chrome://extensions` (on Edge: `edge://extensions`)
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `src/` folder
5. Open `https://x.com/home` and scroll

**Firefox**

1. Run `npm ci && npm run build:unpacked`
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on…** and select `dist/firefox/manifest.json`

**Safari** (macOS)

Requires Xcode. Run `npm run build:safari`, then open the generated project in
`dist/safari/` and run it. Details in [docs/SAFARI.md](docs/SAFARI.md).

Packaged zips for Chrome, Edge and Firefox are attached to each
[release](https://github.com/leo-aa88/x-pt-filter/releases).

---

## Files

- `src/manifest.json` — Extension manifest (Manifest V3)
- `src/lib/core.js` — Language heuristic and per-tweet filtering
- `src/content/content.js` — Timeline observer
- `scripts/build.mjs` — Builds `dist/<browser>/` and the store zips
- `scripts/build-safari.sh` — Generates the Safari Xcode project (macOS)
- `test/` — Unit and DOM tests

---

## Development

Requires Node 22+.

```bash
npm install
npm run check   # lint + format check + tests
npm run build   # dist/chrome, dist/edge, dist/firefox + zips
```

CI runs the same checks on every push and pull request.

To release: bump `version` in both `package.json` and `src/manifest.json`,
merge, then run the **Release** workflow from the Actions tab. It tags
`v<version>` and publishes a GitHub Release with the zips attached.

---

## Notes

- Very short posts are ignored to reduce false positives
- Filtering is heuristic-based and intentionally simple
- Thresholds and word lists can be adjusted in `src/lib/core.js`

---

## Project

- [Privacy policy](PRIVACY.md) — no data is collected
- [Security policy](SECURITY.md)
- [Contributing](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)
