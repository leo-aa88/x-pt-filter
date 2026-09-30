import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  readFileSync(join(root, "src", "manifest.json"), "utf8"),
);

const X_HOSTS = ["https://x.com/*", "https://twitter.com/*"];

test("manifest is MV3 with least-privilege permissions", () => {
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.permissions, undefined);
  assert.deepEqual(manifest.host_permissions, X_HOSTS);
});

test("content script only runs on X / Twitter", () => {
  assert.equal(manifest.content_scripts.length, 1);
  assert.deepEqual(manifest.content_scripts[0].matches, X_HOSTS);
});

test("declared script files exist and load core before the content script", () => {
  const cs = manifest.content_scripts[0];
  assert.equal(cs.run_at, "document_idle");
  assert.deepEqual(cs.js, ["lib/core.js", "content/content.js"]);
  for (const file of cs.js) {
    assert.ok(existsSync(join(root, "src", file)), `missing src/${file}`);
  }
});

test("manifest version matches package.json", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(manifest.version, pkg.version);
});
