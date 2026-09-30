/*
 * Content script. Runs on X (Twitter) pages: scans the tweets already in the
 * timeline, then watches for the ones added by infinite scroll.
 *
 * Depends on the shared XPF namespace defined by lib/core.js (loaded before
 * this file per the manifest).
 */
(function () {
  "use strict";

  const { processTweet, processAdded } = globalThis.XPF;

  function scanExisting() {
    document.querySelectorAll("article").forEach(processTweet);
  }

  function observe() {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const added of m.addedNodes) processAdded(added);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  scanExisting();
  observe();
})();
