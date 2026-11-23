/* The Talking Gallery — tests. Run: node --test tests/test.js
   No network, no dependencies. */
"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
global.window = {};
require(path.join(ROOT, "lib.js"));
require(path.join(ROOT, "data.js"));
const LIB = global.window.TG_LIB;
const CAT = global.window.TG_CATALOGUE;
const TOURS = global.window.TG_TOURS;

const ERAS = new Set(["Renaissance", "Dutch Golden Age", "Impressionism", "Post-Impressionism", "Japanese print"]);
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

test("catalogue holds 14 works with unique ids and unique Met object IDs", () => {
  assert.equal(CAT.length, 14);
  assert.equal(new Set(CAT.map((w) => w.id)).size, 14);
  assert.equal(new Set(CAT.map((w) => w.metObjectId)).size, 14);
  assert.ok(CAT.every((w) => Number.isInteger(w.metObjectId) && w.metObjectId > 0));
});

test("every work has the full wall-label record", () => {
  for (const w of CAT) {
    for (const f of ["id", "metObjectId", "title", "artist", "artistLived", "year", "dateLabel",
      "medium", "dimensions", "department", "image", "imageCredit", "metUrl", "era"]) {
      assert.ok(w[f] !== undefined && w[f] !== "", `${w.id}: missing ${f}`);
    }
    assert.ok(ERAS.has(w.era), `${w.id}: unknown era ${w.era}`);
    assert.ok(w.metUrl === `https://www.metmuseum.org/art/collection/search/${w.metObjectId}`, `${w.id}: Met URL must match the object ID`);
    assert.ok(Number.isInteger(w.year) && w.year >= 1400 && w.year <= 1900, `${w.id}: year ${w.year}`);
  }
});

test("every work has exactly 5 non-empty facts", () => {
  for (const w of CAT) {
    assert.equal(w.facts.length, 5, `${w.id}: needs 5 facts`);
    assert.ok(w.facts.every((f) => typeof f === "string" && f.length > 20), `${w.id}: a fact is too short to be a fact`);
  }
});

test("every opening line is at most 120 words and labelled by the app, never a quote claim", () => {
  for (const w of CAT) {
    assert.ok(LIB.wordCount(w.openingLine) <= 120, `${w.id}: opening line is ${LIB.wordCount(w.openingLine)} words`);
    assert.ok(!/I wrote in my diary|my diary says|in my letter/i.test(w.openingLine), `${w.id}: opening line must not fake a diary or letter`);
    assert.ok(w.suggested.length === 3, `${w.id}: needs 3 suggested questions`);
    assert.ok(w.voice.pitch >= 0.5 && w.voice.pitch <= 1.5, `${w.id}: pitch out of range`);
    assert.ok(w.voice.rate >= 0.5 && w.voice.rate <= 1.5, `${w.id}: rate out of range`);
  }
});

test("every catalogue image is a real local JPEG that exists", () => {
  for (const w of CAT) {
    const p = path.join(ROOT, w.image);
    assert.ok(fs.existsSync(p), `${w.id}: missing ${w.image}`);
    const buf = fs.readFileSync(p);
    assert.ok(buf.length > 50000, `${w.id}: image suspiciously small (${buf.length} bytes)`);
    assert.equal(buf[0], 0xff, `${w.id}: not a JPEG (first byte)`);
    assert.equal(buf[1], 0xd8, `${w.id}: not a JPEG (second byte)`);
  }
});

test("tours: 2 tours, 3 real stops each, one reason per stop", () => {
  assert.equal(TOURS.length, 2);
  for (const t of TOURS) {
    assert.equal(t.stops.length, 3);
    assert.equal(t.why.length, 3);
    assert.ok(t.stops.every((id) => CAT.some((w) => w.id === id)), `${t.id}: a stop is not in the catalogue`);
    assert.equal(new Set(t.stops).size, 3, `${t.id}: stops must be distinct works`);
  }
});

test("fuzzy match: exact title + artist matches; unknown work does not", () => {
  const m = LIB.matchWork("Wheat Field with Cypresses", "Vincent van Gogh", CAT);
  assert.ok(m && m.work.id === "vangogh-wheat-cypresses" && m.score >= 0.5);
  const m2 = LIB.matchWork("The Great Wave", "Katsushika Hokusai", CAT);
  assert.ok(m2 && m2.work.id === "hokusai-wave");
  assert.equal(LIB.matchWork("Mona Lisa", "Leonardo da Vinci", CAT), null);
  assert.equal(LIB.matchWork("Portrait", "Unknown Painter", CAT), null, "a generic word alone must never match");
  assert.equal(LIB.matchWork("The Starry Night", "Vincent van Gogh", CAT), null, "Starry Night is not in the catalogue and must not match a Van Gogh");
});

test("closestWorks returns 3 catalogue works, never an identification", () => {
  const c = LIB.closestWorks("Mona Lisa", "Leonardo", CAT, 3);
  assert.equal(c.length, 3);
  assert.ok(c.every((w) => CAT.includes(w)));
});

test("offline replies: keyword hit, generic fact answers, honest fallback", () => {
  const w = CAT.find((x) => x.id === "vangogh-wheat-cypresses");
  const sky = LIB.offlineReply(w, "Why is the sky so turbulent?");
  assert.equal(sky.source, "offline");
  assert.match(sky.text, /sky/i);
  const big = LIB.offlineReply(w, "How big is it?");
  assert.match(big.text, /73\.2/);
  const when = LIB.offlineReply(w, "When did you paint this?");
  assert.match(when.text, /1889/);
  const unknown = LIB.offlineReply(w, "What is the airspeed velocity of a swallow?");
  assert.equal(unknown.source, "offline-facts");
  assert.match(unknown.text, /cannot answer that/i);
  assert.match(unknown.text, /Saint-Rémy/i, "the fallback must still offer the real facts");
});

test("chat request: persona + facts + 120-word rule + history cap, correct model", () => {
  const w = CAT.find((x) => x.id === "hokusai-wave");
  const hist = Array.from({ length: 10 }, (_, i) => ({ role: i % 2 ? "artist" : "user", text: "turn " + i }));
  const req = LIB.buildChatRequest(w, hist, "Why is Fuji so small?", global.window.TG_MODEL);
  assert.ok(req.url.includes("gemini-3.8-flash"), "chat must call gemini-3.8-flash");
  assert.ok(req.body.systemInstruction.parts[0].text.includes("never claim a real quote") ||
    req.body.systemInstruction.parts[0].text.includes("Never claim a real quote"));
  assert.match(req.body.systemInstruction.parts[0].text, /at most\s+120 words/i);
  assert.match(req.body.systemInstruction.parts[0].text, /Thirty-six Views of Mount Fuji/);
  assert.equal(req.body.contents.length, 7, "history capped at 6 turns + the new question");
  assert.equal(req.body.generationConfig.maxOutputTokens, 300);
});

test("vision request: strict two-line prompt, low temperature, base64 image", () => {
  const req = LIB.buildVisionRequest("AAAA", global.window.TG_MODEL);
  assert.ok(req.url.includes("gemini-3.8-flash"));
  assert.match(req.body.contents[0].parts[0].text, /CANNOT IDENTIFY/);
  assert.match(req.body.contents[0].parts[0].text, /Do not guess/);
  assert.equal(req.body.contents[0].parts[1].inlineData.mimeType, "image/jpeg");
  assert.equal(req.body.generationConfig.temperature, 0.1);
});

test("vision answer parsing: two lines in, null on any refusal", () => {
  assert.deepEqual(LIB.parseVisionAnswer("Wheat Field with Cypresses\nVincent van Gogh"),
    { title: "Wheat Field with Cypresses", artist: "Vincent van Gogh" });
  assert.equal(LIB.parseVisionAnswer("CANNOT IDENTIFY\nCANNOT IDENTIFY"), null);
  assert.equal(LIB.parseVisionAnswer("Something\nCANNOT IDENTIFY"), null);
  assert.equal(LIB.parseVisionAnswer("only one line"), null);
  assert.equal(LIB.parseVisionAnswer(""), null);
});

test("Gemini response helpers: text extraction and plain-word errors", () => {
  const j = { candidates: [{ content: { parts: [{ text: "Hello " }, { text: "there." }] } }] };
  assert.equal(LIB.extractGeminiText(j), "Hello there.");
  assert.equal(LIB.extractGeminiText({}), "");
  assert.match(LIB.geminiErrorMessage(429, {}), /free-tier limit/);
  assert.match(LIB.geminiErrorMessage(429, {}), /offline replies still work/);
  assert.match(LIB.geminiErrorMessage(400, { error: { message: "API key not valid." } }), /did not accept the key/);
});

test("verified endpoints and models: v1.1 search, gemini-3.8-flash, no retired names anywhere", () => {
  assert.equal(global.window.TG_MODEL, "gemini-3.8-flash");
  assert.equal(global.window.TG_MODEL_FALLBACK, "gemini-3.5-flash-lite");
  assert.ok(global.window.TG_MET_SEARCH.endsWith("/v1.1/search"));
  assert.ok(global.window.TG_MET_OBJECT.endsWith("/v1/objects"));
  for (const f of ["data.js", "lib.js", "app.js", "index.html", "PLAN.md"]) {
    // The withdrawn names may be *mentioned* (docs, Settings explainer) but never *used*:
    // never as a quoted model string, never in a models/ URL.
    assert.ok(!/["']gemini-2\.5/.test(read(f)), `${f} must never use a gemini-2.5 model string`);
    assert.ok(!/models\/gemini-2\.5/.test(read(f)), `${f} must never call a gemini-2.5 model`);
    // The retired endpoint may be *mentioned* (docs, status text) but never *used* as a URL with a query.
    assert.ok(!/collection\/v1\/search\?/.test(read(f)), `${f}: stale /v1/search endpoint in use`);
  }
});

test("facts match their images: the Met Sunflowers stand in a vase (not lying on a table)", () => {
  const w = CAT.find((x) => x.id === "vangogh-sunflowers");
  assert.match(w.facts.join(" "), /stand in a vase/i);
  assert.ok(!/lying on a table|lie cut on a table/i.test(w.facts.join(" ") + " " + w.openingLine));
  assert.match(w.openingLine, /stand in a vase/i);
});

test("no AI-slop in the shipped CSS/HTML: no gradients, no glows, no sparkle copy", () => {
  const css = read("styles.css");
  assert.ok(!/linear-gradient|radial-gradient|box-shadow:\s*0 0|backdrop-filter|blur\(/.test(css), "no gradients, glows or glass");
  for (const f of ["index.html", "app.js", "data.js"]) {
    const t = read(f);
    assert.ok(!/seamless|supercharge|elevate|unlock the|revolutioni[sz]e/i.test(t), `${f}: cliché copy`);
    assert.ok(!/✨|🚀|💫|🌟/.test(t), `${f}: sparkle/rocket emoji`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, "README.md")), "README.md required");
  assert.ok(fs.existsSync(path.join(ROOT, "LICENSE")), "LICENSE required");
});
