import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const XPF = require("../src/lib/core.js");

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

const PT = "Eu não sei o que fazer com isso, mas vai dar tudo certo no final";
const EN = "Just shipped a new release of the library, check out the changelog";

function tweet(text, id) {
  return `<article id="${id}"><div lang="und"><span>${text}</span></div></article>`;
}

function domFrom(html) {
  return new JSDOM(`<!doctype html><html><body>${html}</body></html>`).window
    .document;
}

test("findTweetArticle returns the article itself or the enclosing one", () => {
  const doc = domFrom(tweet(EN, "t"));
  const article = doc.getElementById("t");
  assert.equal(XPF.findTweetArticle(article), article);
  assert.equal(XPF.findTweetArticle(article.querySelector("span")), article);
});

test("findTweetArticle returns null outside a tweet", () => {
  const doc = domFrom(`<div id="d">hi</div>`);
  assert.equal(XPF.findTweetArticle(null), null);
  assert.equal(XPF.findTweetArticle(doc.getElementById("d")), null);
  // Text nodes have no closest().
  assert.equal(XPF.findTweetArticle(doc.getElementById("d").firstChild), null);
});

test("extractText joins every div[lang] and ignores the rest", () => {
  const doc = domFrom(`
    <article id="t">
      <div>Some User @handle · 2h</div>
      <div lang="pt">primeiro bloco</div>
      <div lang="pt">segundo bloco</div>
    </article>`);
  assert.equal(
    XPF.extractText(doc.getElementById("t")),
    "primeiro bloco segundo bloco",
  );
});

test("extractText is empty for tweets with no text (e.g. media only)", () => {
  const doc = domFrom(`<article id="t"><img alt="Eu não sei que"></article>`);
  assert.equal(XPF.extractText(doc.getElementById("t")), "");
});

test("processTweet hides Portuguese tweets and keeps the others", () => {
  const doc = domFrom(tweet(PT, "pt") + tweet(EN, "en"));
  const pt = doc.getElementById("pt");
  const en = doc.getElementById("en");
  XPF.processTweet(pt);
  XPF.processTweet(en);

  assert.equal(pt.style.display, "none");
  assert.equal(en.style.display, "");
  assert.equal(pt.dataset.ptFiltered, "1");
  assert.equal(en.dataset.ptFiltered, "1");
});

test("processTweet only classifies the tweet body, not the author header", () => {
  const doc = domFrom(
    `<article id="t"><div>${PT}</div><div lang="en">${EN}</div></article>`,
  );
  const article = doc.getElementById("t");
  XPF.processTweet(article);
  assert.equal(article.style.display, "");
});

test("processTweet processes each tweet once", () => {
  const doc = domFrom(tweet(EN, "t"));
  const article = doc.getElementById("t");
  XPF.processTweet(article);
  assert.equal(article.style.display, "");

  // Already marked: a later content change is not re-evaluated.
  article.querySelector("span").textContent = PT;
  XPF.processTweet(article);
  assert.equal(article.style.display, "");
});

test("processTweet tolerates a missing article", () => {
  assert.doesNotThrow(() => XPF.processTweet(null));
});

test("processAdded handles a container holding several tweets", () => {
  const doc = domFrom(
    `<div id="wrap">${tweet(PT, "pt")}${tweet(EN, "en")}</div>`,
  );
  XPF.processAdded(doc.getElementById("wrap"));
  assert.equal(doc.getElementById("pt").style.display, "none");
  assert.equal(doc.getElementById("en").style.display, "");
});

test("processAdded handles a node inserted inside an existing tweet", () => {
  const doc = domFrom(tweet(PT, "pt"));
  XPF.processAdded(doc.querySelector("span"));
  assert.equal(doc.getElementById("pt").style.display, "none");
});

test("processAdded ignores text nodes and unrelated elements", () => {
  const doc = domFrom(`<div id="d">hello</div>`);
  assert.doesNotThrow(() => {
    XPF.processAdded(doc.getElementById("d").firstChild);
    XPF.processAdded(doc.getElementById("d"));
  });
});

/*
 * End to end: load the real scripts, in manifest order, into a jsdom window and
 * check both the initial scan and the MutationObserver path.
 */
test("content script filters existing tweets and ones added later", async () => {
  const manifest = JSON.parse(
    readFileSync(join(srcDir, "manifest.json"), "utf8"),
  );
  const dom = new JSDOM(
    `<!doctype html><html><body><main id="timeline">${tweet(PT, "pt1")}${tweet(EN, "en1")}</main></body></html>`,
    { runScripts: "outside-only" },
  );
  const { document } = dom.window;
  for (const file of manifest.content_scripts[0].js) {
    dom.window.eval(readFileSync(join(srcDir, file), "utf8"));
  }

  assert.equal(document.getElementById("pt1").style.display, "none");
  assert.equal(document.getElementById("en1").style.display, "");

  // Simulate infinite scroll appending a batch of tweets.
  const batch = document.createElement("div");
  batch.innerHTML = tweet(PT, "pt2") + tweet(EN, "en2");
  document.getElementById("timeline").appendChild(batch);
  // MutationObserver callbacks are delivered as microtasks.
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(document.getElementById("pt2").style.display, "none");
  assert.equal(document.getElementById("en2").style.display, "");
});
