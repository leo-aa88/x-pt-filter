import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const XPF = require("../src/lib/core.js");

const { isPortuguese, PORTUGUESE_WORDS, MIN_LEN, HIT_THRESHOLD } = XPF;

test("isPortuguese flags typical Portuguese posts", () => {
  const posts = [
    "Eu não sei o que fazer com isso, mas vai dar tudo certo no final",
    "Hoje foi um dia muito bom para quem gosta de futebol e churrasco",
    "Você também acha que ainda tem tempo para resolver essa situação?",
    "A reunião de hoje é sobre o projeto novo e vai começar só depois do almoço",
  ];
  for (const p of posts) assert.equal(isPortuguese(p), true, p);
});

test("isPortuguese leaves English posts alone", () => {
  const posts = [
    "Just shipped a new release of the library, check the changelog for details",
    "The quick brown fox jumps over the lazy dog while everyone is watching",
    "Anyone else think this quarter's earnings call was a complete disaster?",
  ];
  for (const p of posts) assert.equal(isPortuguese(p), false, p);
});

test("isPortuguese ignores very short posts even when they are Portuguese", () => {
  const short = "eu não sei o que fazer";
  assert.ok(short.length + 2 < MIN_LEN);
  assert.equal(isPortuguese(short), false);
});

test("isPortuguese applies MIN_LEN to the padded, whitespace-collapsed text", () => {
  // "eu não" are the two hits; filler pads the text to an exact length.
  const build = (len) => "eu não " + "x".repeat(len - 2 - "eu não ".length);
  assert.equal(isPortuguese(build(MIN_LEN - 1)), false);
  assert.equal(isPortuguese(build(MIN_LEN)), true);
  // Runs of whitespace collapse to one space, so they don't count as length.
  assert.equal(isPortuguese("eu    não" + " ".repeat(60)), false);
});

test("isPortuguese needs HIT_THRESHOLD distinct stopwords", () => {
  assert.equal(HIT_THRESHOLD, 2);
  const filler = "lorem ipsum dolor sit amet consectetur adipiscing";
  assert.equal(isPortuguese(`${filler} isso`), false);
  assert.equal(isPortuguese(`${filler} isso tudo`), true);
  // The same stopword repeated is still a single hit.
  assert.equal(isPortuguese(`${filler} isso isso isso`), false);
});

test("a single stopword shared with other languages is not enough", () => {
  // "quando" is also Italian; "para"/"como" are also Spanish.
  assert.equal(
    isPortuguese("Dimmi quando arrivi alla stazione di Milano Centrale"),
    false,
  );
});

test("isPortuguese is case-insensitive and normalises whitespace", () => {
  assert.equal(
    isPortuguese("EU NÃO ACREDITO NISSO, SIMPLESMENTE INACREDITÁVEL DEMAIS"),
    true,
  );
  assert.equal(
    isPortuguese("eu\nnão\tacredito nisso, simplesmente inacreditável demais"),
    true,
  );
});

test("stopwords match at the very start and end of the text", () => {
  assert.equal(
    isPortuguese("eu acredito nisso simplesmente inacreditável demais aqui"),
    true,
  );
});

test("stopwords only match as whole words", () => {
  // "comum", "parada", "temporal" contain "com", "para", "tem" as substrings.
  assert.equal(
    isPortuguese("comum parada temporal queijo maison elegante sobremesa"),
    false,
  );
});

test("PORTUGUESE_WORDS is a clean list", () => {
  assert.equal(
    new Set(PORTUGUESE_WORDS).size,
    PORTUGUESE_WORDS.length,
    "duplicate entries would let one word count as two hits",
  );
  for (const w of PORTUGUESE_WORDS) {
    assert.match(w, /^ \S+ $/, `"${w}" must be one space-padded word`);
    assert.equal(w, w.toLowerCase(), `"${w}" must be lowercase`);
  }
});
