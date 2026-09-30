# Contributing to X Portuguese Filter

Thanks for helping out! Contributions of all sizes are welcome — especially
**heuristic fixes** (posts that slip through, or posts hidden by mistake) and
**selector refreshes** when X changes its markup.

By participating you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).

## Getting set up

```bash
git clone https://github.com/leo-aa88/x-pt-filter.git
cd x-pt-filter
npm ci            # dev tooling only (the extension has no runtime deps)
npm run check     # lint + tests — run this before a PR
```

Load the extension unpacked while you work (see the README's
[Installation](README.md#installation-developer-mode) section). `src/` is
directly loadable in Chromium; run `npm run build` to produce the packaged
per-browser variants.

## Project conventions

- **No runtime dependencies.** The shipped extension is plain JS. Dev
  dependencies (ESLint, Prettier, jsdom, web-ext) are fine.
- **Keep logic in `src/lib/core.js`.** It's unit-tested and never touches the
  global document. The observer wiring lives in `src/content/content.js`.
- **Formatting & linting** are enforced in CI: `npm run lint` (ESLint +
  Prettier). Run `npm run format` to auto-fix.
- **Tests** run with `node --test` (`npm test`). Add or update tests for any
  behavior change. DOM behavior is testable with jsdom — see `test/dom.test.mjs`.
- **Versions move together.** `package.json` and `src/manifest.json` must carry
  the same version; a test and the release workflow both check it.

## Tuning the heuristic (the common contribution)

A post is hidden when its text is at least `MIN_LEN` characters long and
contains at least `HIT_THRESHOLD` distinct entries from `PORTUGUESE_WORDS`, all
in [`src/lib/core.js`](src/lib/core.js).

1. **A Portuguese post slipped through:** find common words it uses that aren't
   in `PORTUGUESE_WORDS` and add them — lowercase, one word, padded with a space
   on each side (e.g. `" então "`).
2. **A non-Portuguese post was hidden:** identify which list entries matched.
   Words shared with Spanish, Italian, or English are the usual culprits;
   consider removing the entry rather than raising the threshold for everyone.
3. Add the post's text as a case in `test/core.test.mjs` so it stays fixed.
   Please strip usernames and anything personal first.

## Keeping the scanner working

The content script treats each `<article>` as a post and reads its text from
the `div[lang]` elements inside it. If X changes that markup:

1. On X, open DevTools and inspect a post to see what changed.
2. Update `findTweetArticle` / `extractText` in `core.js`.
3. Add a regression case to `test/dom.test.mjs` with a synthetic DOM that
   mirrors the new structure.

## Commit & PR

- Use clear, imperative commit messages (e.g. "Add more PT-PT stopwords").
- Keep PRs focused. Describe what you changed and how you verified it (browser +
  version help a lot for markup changes).
- Ensure `npm run check` passes.
- Add a line to `CHANGELOG.md` under "Unreleased" if the change is user-facing.

## Reporting bugs

Use the issue templates. For "post not hidden" or "post wrongly hidden" reports,
please include the text of the post — that's what lets us fix the heuristic
quickly.
