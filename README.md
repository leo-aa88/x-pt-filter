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

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the extension folder
5. Open `https://x.com/home` and scroll

---

## Files

- `manifest.json` — Extension manifest (Manifest V3)
- `content.js` — Timeline observer and language filter

---

## Notes

- Very short posts are ignored to reduce false positives
- Filtering is heuristic-based and intentionally simple
- Thresholds and word lists can be adjusted in `content.js`
