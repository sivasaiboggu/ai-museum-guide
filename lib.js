/* The Talking Gallery — pure logic, shared by the browser app and the Node tests.
   No DOM, no network here. */
(function (root) {
  "use strict";

  function norm(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  function tokens(s) {
    return new Set(norm(s).split(" ").filter(function (w) { return w.length > 2; }));
  }

  /* Fuzzy match a guessed title/artist against the catalogue.
     Returns { work, score } or null. A match needs score >= 0.5 AND the
     artist surname (or a distinctive title word) to agree — never a guess
     on a single common word like "portrait". */
  function matchWork(guessTitle, guessArtist, catalogue) {
    var gt = tokens(guessTitle), ga = tokens(guessArtist);
    var best = null, bestScore = 0;
    catalogue.forEach(function (w) {
      var wt = tokens(w.title), wa = tokens(w.artist);
      var titleHit = 0, titleTotal = 0;
      gt.forEach(function (t) { titleTotal++; if (wt.has(t)) titleHit++; });
      var artistHit = 0, artistTotal = 0;
      ga.forEach(function (t) { artistTotal++; if (wa.has(t)) artistHit++; });
      var titleScore = titleTotal ? titleHit / titleTotal : 0;
      var artistScore = artistTotal ? artistHit / artistTotal : 0;
      // Distinctive title words carry the match; a lone generic word does not.
      var generic = new Set(["portrait", "self", "the", "with", "and", "woman", "young"]);
      var distinctive = 0;
      gt.forEach(function (t) { if (wt.has(t) && !generic.has(t)) distinctive++; });
      var score = 0.65 * titleScore + 0.35 * artistScore;
      if (distinctive === 0 && artistScore < 1) score = 0; // no anchor, no match
      if (score > bestScore) { bestScore = score; best = w; }
    });
    if (!best || bestScore < 0.5) return null;
    return { work: best, score: Math.round(bestScore * 100) / 100 };
  }

  /* Closest N works by title/artist token overlap, for the "I don't
     recognise this one" fallback. Never presented as an identification. */
  function closestWorks(guessTitle, guessArtist, catalogue, n) {
    var gt = tokens(guessTitle), ga = tokens(guessArtist);
    var scored = catalogue.map(function (w) {
      var wt = tokens(w.title), wa = tokens(w.artist);
      var hits = 0;
      gt.forEach(function (t) { if (wt.has(t)) hits++; });
      ga.forEach(function (t) { if (wa.has(t)) hits += 2; });
      return { work: w, hits: hits };
    });
    scored.sort(function (a, b) { return b.hits - a.hits; });
    return scored.slice(0, n || 3).map(function (s) { return s.work; });
  }

  function wordCount(s) { return (s || "").trim().split(/\s+/).filter(Boolean).length; }

  /* Offline reply: keyword rules over the work's own replies, then generic
     fact-based answers, then an honest "I can't answer that" + the facts.
     Returns { text, source } where source is "offline" or "offline-facts". */
  function offlineReply(work, question) {
    var q = norm(question);
    var keys = Object.keys(work.offlineReplies || {});
    var bestKey = null, bestLen = 0;
    keys.forEach(function (k) {
      var kn = norm(k);
      if (q.indexOf(kn) !== -1 && kn.length > bestLen) { bestKey = k; bestLen = kn.length; }
    });
    if (bestKey) return { text: work.offlineReplies[bestKey], source: "offline" };
    // Generic fact-based answers.
    if (/\b(big|large|size|dimensions|tall|wide|how big)\b/.test(q))
      return { text: "It measures " + work.dimensions + " — " + work.medium.toLowerCase() + ".", source: "offline" };
    if (/\b(where|painted|place|museum|located|live)\b/.test(q) && /\b(paint|made|live|where|museum)\b/.test(q))
      return { text: "It was painted in " + work.dateLabel + ", and it now hangs in the Met's " + work.department + " department. " + work.facts[0], source: "offline" };
    if (/\b(when|year|date|old)\b/.test(q))
      return { text: "I painted it in " + work.dateLabel + ". " + work.facts[0], source: "offline" };
    if (/\b(medium|material|paint|canvas|wood|paper|oil)\b/.test(q))
      return { text: "It is " + work.medium.toLowerCase() + ", " + work.dimensions + ".", source: "offline" };
    if (/\b(who|artist|painted|painter)\b/.test(q))
      return { text: "I am " + work.artist + " (" + work.artistLived + "). This is my " + work.title + ", from " + work.dateLabel + ".", source: "offline" };
    return {
      text: "I cannot answer that from the facts I have here — I would need the live voice for it, and that needs a Gemini key in Settings. What I can tell you is this: " + work.facts.join(" "),
      source: "offline-facts"
    };
  }

  /* Build the Gemini generateContent request body for a chat turn.
     System instruction = persona + facts + the honesty rules. */
  function buildChatRequest(work, history, question, model) {
    var facts = work.facts.map(function (f, i) { return (i + 1) + ". " + f; }).join("\n");
    var system = work.persona +
      "\n\nVerified facts about the work you are speaking as the painter of — use only these facts, never invent others:\n" + facts +
      "\n\nRules: you are a persona inspired by " + work.artist + ", not " + work.artist +
      ". Never claim a real quote, letter or diary entry. If asked about something outside the facts above, say you do not know and offer what you do know. Answer in at most 120 words, in first person.";
    var contents = history.slice(-6).map(function (m) {
      return { role: m.role === "artist" ? "model" : "user", parts: [{ text: m.text }] };
    });
    contents.push({ role: "user", parts: [{ text: question }] });
    return {
      url: "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
      body: {
        systemInstruction: { parts: [{ text: system }] },
        contents: contents,
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
      }
    };
  }

  /* Build the Gemini vision request for scan identification. */
  function buildVisionRequest(base64Jpeg, model) {
    return {
      url: "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
      body: {
        contents: [{ role: "user", parts: [
          { text: "Look at this photo of an artwork. Reply with exactly two lines and nothing else. Line 1: the title of the artwork, or the words CANNOT IDENTIFY. Line 2: the artist's name, or the words CANNOT IDENTIFY. Do not guess: if you are not sure, write CANNOT IDENTIFY. Do not add any other text." },
          { inlineData: { mimeType: "image/jpeg", data: base64Jpeg } }
        ] }],
        generationConfig: { maxOutputTokens: 120, temperature: 0.1 }
      }
    };
  }

  /* Parse the two-line vision answer. Returns {title, artist} or null. */
  function parseVisionAnswer(text) {
    if (!text) return null;
    var lines = text.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    if (lines.length < 2) return null;
    if (/cannot identify/i.test(lines[0]) || /cannot identify/i.test(lines[1])) return null;
    return { title: lines[0], artist: lines[1] };
  }

  function extractGeminiText(json) {
    try {
      var parts = json.candidates[0].content.parts;
      return parts.map(function (p) { return p.text || ""; }).join("").trim();
    } catch (e) { return ""; }
  }

  function geminiErrorMessage(status, json) {
    var msg = (json && json.error && json.error.message) || "";
    if (status === 429) return "Gemini said the free-tier limit is reached (429). Wait a minute and try again — your offline replies still work.";
    if (status === 400 && /API key/i.test(msg)) return "Gemini did not accept the key (400). Check it in Settings — it is a free key from Google AI Studio.";
    if (status === 404 || status === 503) return "Gemini said this model is unavailable (" + status + "). The app will try the fallback model.";
    return "Gemini returned an error (" + status + ")" + (msg ? ": " + msg : ".") + " Your offline replies still work.";
  }

  var api = {
    norm: norm, tokens: tokens, matchWork: matchWork, closestWorks: closestWorks,
    wordCount: wordCount, offlineReply: offlineReply,
    buildChatRequest: buildChatRequest, buildVisionRequest: buildVisionRequest,
    parseVisionAnswer: parseVisionAnswer, extractGeminiText: extractGeminiText,
    geminiErrorMessage: geminiErrorMessage
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.TG_LIB = api;
})(typeof window !== "undefined" ? window : globalThis);
