/*
 * Core logic for X Portuguese Filter: the language heuristic and the per-tweet
 * DOM handling.
 *
 * This file is a plain classic script (it runs as a content script and is
 * ALSO require()-able from Node for unit tests). Nothing here touches the
 * global document or runs on load — see content/content.js for the wiring.
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.XPF = Object.assign(root.XPF || {}, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // --- language heuristic: Portuguese stopword hits ---
  const PORTUGUESE_WORDS = [
    " que ",
    " não ",
    " pra ",
    " para ",
    " com ",
    " uma ",
    " isso ",
    " mais ",
    " como ",
    " tudo ",
    " muito ",
    " também ",
    " porque ",
    " quando ",
    " sobre ",
    " depois ",
    " você ",
    " vcs ",
    " eu ",
    " ele ",
    " ela ",
    " eles ",
    " elas ",
    " meu ",
    " minha ",
    " seus ",
    " suas ",
    " nossa ",
    " nosso ",
    " são ",
    " é ",
    " está ",
    " foi ",
    " tem ",
    " fazer ",
    " vai ",
    " aqui ",
    " agora ",
    " já ",
    " só ",
    " ainda ",
    " onde ",
    " quem ",
    " qual ",
  ];

  // If tweet is very short, don't try to classify (reduces false positives)
  const MIN_LEN = 40;

  // How many hits from the list before we remove the tweet
  const HIT_THRESHOLD = 2;

  function isPortuguese(text) {
    const t = " " + text.toLowerCase().replace(/\s+/g, " ") + " ";
    if (t.length < MIN_LEN) return false;

    let hits = 0;
    for (const w of PORTUGUESE_WORDS) {
      if (t.includes(w)) {
        hits++;
        if (hits >= HIT_THRESHOLD) return true;
      }
    }
    return false;
  }

  // Find the article root for a given node if it's inside a tweet
  function findTweetArticle(node) {
    if (!node) return null;
    if (node.nodeType === 1 && node.tagName === "ARTICLE") return node;
    return node.closest ? node.closest("article") : null;
  }

  function extractText(article) {
    // Collect all visible text spans inside the tweet
    const spans = article.querySelectorAll("div[lang]");
    let text = "";
    spans.forEach((span) => {
      // innerText is unavailable outside a rendering browser (e.g. jsdom).
      text += " " + (span.innerText ?? span.textContent);
    });
    return text.trim();
  }

  function processTweet(article) {
    if (!article || article.dataset.ptFiltered === "1") return;
    article.dataset.ptFiltered = "1";

    const text = extractText(article);

    if (!text) return;

    if (isPortuguese(text)) {
      article.style.display = "none";
      // DEBUG
      // article.style.background = "rgba(255, 0, 0, 0.15)";
      // article.style.outline = "4px solid red";
      // article.style.opacity = "0.4";
    }
  }

  // Process every tweet that is, contains, or is contained by an added node.
  function processAdded(added) {
    const article = findTweetArticle(added);
    if (article) processTweet(article);
    // Sometimes multiple tweets are inserted under a container
    if (added.querySelectorAll) {
      added.querySelectorAll("article").forEach(processTweet);
    }
  }

  return {
    PORTUGUESE_WORDS,
    MIN_LEN,
    HIT_THRESHOLD,
    isPortuguese,
    findTweetArticle,
    extractText,
    processTweet,
    processAdded,
  };
});
