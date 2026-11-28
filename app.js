/* The Talking Gallery — browser app. Plain JS, no build step, works from file://.
   No key is needed to browse, read facts, or talk offline. Live Gemini features
   need the user's own free key, pasted in Settings (localStorage only). */
(function () {
  "use strict";
  var CAT = window.TG_CATALOGUE, TOURS = window.TG_TOURS, LIB = window.TG_LIB;
  var MODEL = window.TG_MODEL, FALLBACK = window.TG_MODEL_FALLBACK;

  /* ---------- small store (localStorage only, nothing leaves the browser) ---------- */
  function load(key, def) {
    try { var v = JSON.parse(localStorage.getItem("tg-" + key)); return v === null || v === undefined ? def : v; }
    catch (e) { return def; }
  }
  function save(key, val) { try { localStorage.setItem("tg-" + key, JSON.stringify(val)); } catch (e) {} }
  var store = {
    get favs() { return load("favs", []); }, set favs(v) { save("favs", v); },
    get visits() { return load("visits", []); }, set visits(v) { save("visits", v); },
    get toursDone() { return load("toursDone", []); }, set toursDone(v) { save("toursDone", v); },
    get key() { return load("geminiKey", ""); }, set key(v) { save("geminiKey", v); },
    get voiceOn() { return load("voiceOn", true); }, set voiceOn(v) { save("voiceOn", v); },
    get rate() { return load("rate", 1); }, set rate(v) { save("rate", v); },
    get cached() { return load("cachedReplies", {}); }, set cached(v) { save("cachedReplies", v); }
  };

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function byId(id) { return CAT.find(function (w) { return w.id === id; }); }
  function shortName(w) { return w.artist === "Rembrandt van Rijn" ? "Rembrandt" : w.artist.split(" ").slice(-1)[0]; }
  function workUrl(w) { return "#/work/" + w.id; }
  function hasKey() { return !!store.key; }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return iso; }
  }
  function recordVisit(work) {
    var v = store.visits.filter(function (x) { return x.workId !== work.id; });
    v.unshift({ workId: work.id, at: new Date().toISOString() });
    store.visits = v.slice(0, 20);
  }

  /* ---------- speech ---------- */
  function speak(text, work) {
    if (!("speechSynthesis" in window)) { return "Your browser cannot read aloud — no speech synthesis. The words are on screen."; }
    if (!store.voiceOn) return "Reading aloud is off. Turn it on in Settings.";
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.pitch = work.voice.pitch; u.rate = work.voice.rate * store.rate;
      window.speechSynthesis.speak(u);
      return null;
    } catch (e) { return "Reading aloud failed on this device. The words are on screen."; }
  }
  var recog = null;
  function startListening(input, statusEl, onDone) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { statusEl.textContent = "Spoken questions are not supported in this browser — type your question instead."; return; }
    try {
      if (recog) { recog.stop(); recog = null; statusEl.textContent = ""; return; }
      recog = new SR(); recog.lang = "en-US"; recog.interimResults = false;
      recog.onresult = function (e) {
        input.value = e.results[0][0].transcript;
        statusEl.textContent = "Heard: “" + input.value + "” — press Ask.";
        recog = null; onDone(false);
      };
      recog.onerror = function () { statusEl.textContent = "I did not catch that — type your question instead."; recog = null; onDone(false); };
      recog.onend = function () { recog = null; onDone(false); };
      recog.start(); statusEl.textContent = "Listening… speak now."; onDone(true);
    } catch (e) { statusEl.textContent = "The microphone could not start — type your question instead."; }
  }

  /* ---------- Gemini ---------- */
  function geminiCall(req, useFallback) {
    var model = useFallback ? FALLBACK : MODEL;
    var url = req.url.replace(/\/models\/[^:/]+:generateContent/, "/models/" + model + ":generateContent");
    return fetch(url + "?key=" + encodeURIComponent(store.key), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    }).then(function (res) {
      return res.json().then(function (json) {
        if (!res.ok) {
          if (!useFallback && (res.status === 404 || res.status === 503)) return geminiCall(req, true);
          throw new Error(LIB.geminiErrorMessage(res.status, json));
        }
        return LIB.extractGeminiText(json);
      });
    });
  }

  /* ---------- views ---------- */
  var app = $("#app");
  var state = { era: "All", q: "", sort: "year", savedOnly: false };

  function render() {
    var hash = location.hash || "#/";
    var parts = hash.replace(/^#\//, "").split("/");
    if (parts[0] === "work" && parts[1]) return renderWork(parts[1]);
    if (parts[0] === "scan") return renderScan();
    if (parts[0] === "met") return renderMet();
    if (parts[0] === "settings") return renderSettings();
    if (parts[0] === "tour" && parts[1]) return renderTour(parts[1], parseInt(parts[2] || "0", 10));
    return renderGallery();
  }

  function setNav(current) {
    document.querySelectorAll("nav.main button").forEach(function (b) {
      b.setAttribute("aria-current", b.dataset.view === current ? "true" : "false");
    });
    var pill = $("#key-pill");
    pill.textContent = hasKey() ? "Gemini key saved — live voice on" : "No key — offline replies only";
    pill.classList.toggle("on", hasKey());
  }

  function renderGallery() {
    setNav("gallery");
    app.innerHTML = "";
    var hero = el("section", "hero");
    hero.innerHTML =
      "<h1>Every painting is a person <em>you can interview.</em></h1>" +
      "<p class=\"lede\">Fourteen works from the Metropolitan Museum of Art, spanning 1465 to 1892. " +
      "Tap one, read its real facts, and ask the artist — in their own era, in their own manner.</p>" +
      "<p class=\"note\"><b>No key needed</b> to browse, read, and talk from the catalogue facts. " +
      "A free Gemini key (Settings) turns the same conversation live. " +
      "The artist's words are a persona — <b>inspired by</b>, never a real quote.</p>";
    app.appendChild(hero);

    // Era timeline
    var tl = el("section", "timeline");
    tl.innerHTML = "<div class=\"label\">Four centuries, one strip — 1465 to 1892</div><div class=\"timeline-track\"><div class=\"timeline-line\"></div><div class=\"timeline-items\"></div></div>";
    var items = tl.querySelector(".timeline-items");
    CAT.slice().sort(function (a, b) { return a.year - b.year; }).forEach(function (w) {
      var b = el("button", "t-item");
      b.innerHTML = "<span class=\"dot\"></span><span class=\"yr\">" + w.year + "</span><span class=\"nm\">" + esc(shortName(w)) + "<i>" + esc(w.title.length > 26 ? w.title.slice(0, 26) + "…" : w.title) + "</i></span>";
      b.title = w.title + " — " + w.artist + ", " + w.dateLabel;
      b.addEventListener("click", function () { location.hash = workUrl(w); });
      items.appendChild(b);
    });
    app.appendChild(tl);

    // Filters
    var f = el("div", "filters");
    var eras = ["All", "Renaissance", "Dutch Golden Age", "Impressionism", "Post-Impressionism", "Japanese print"];
    var search = el("input"); search.type = "search"; search.placeholder = "Search title or artist…";
    search.setAttribute("aria-label", "Search works"); search.value = state.q;
    search.addEventListener("input", function () { state.q = search.value; drawGrid(); });
    f.appendChild(search);
    eras.forEach(function (era) {
      var c = el("button", "chip", esc(era));
      c.setAttribute("aria-pressed", state.era === era ? "true" : "false");
      c.addEventListener("click", function () { state.era = era; renderGallery(); });
      f.appendChild(c);
    });
    var saved = el("button", "chip", "♥ Saved");
    saved.setAttribute("aria-pressed", state.savedOnly ? "true" : "false");
    saved.addEventListener("click", function () { state.savedOnly = !state.savedOnly; renderGallery(); });
    f.appendChild(saved);
    var sort = el("select");
    sort.setAttribute("aria-label", "Sort works");
    sort.innerHTML = "<option value=\"year\">Sort: by year</option><option value=\"artist\">Sort: by artist</option>";
    sort.value = state.sort;
    sort.addEventListener("change", function () { state.sort = sort.value; drawGrid(); });
    f.appendChild(sort);
    var count = el("span", "count");
    f.appendChild(count);
    app.appendChild(f);

    var grid = el("div", "grid"); app.appendChild(grid);
    function drawGrid() {
      var list = CAT.filter(function (w) {
        if (state.era !== "All" && w.era !== state.era) return false;
        if (state.savedOnly && store.favs.indexOf(w.id) === -1) return false;
        if (state.q) {
          var q = LIB.norm(state.q);
          if (LIB.norm(w.title + " " + w.artist).indexOf(q) === -1) return false;
        }
        return true;
      });
      list.sort(function (a, b) {
        return state.sort === "artist" ? a.artist.localeCompare(b.artist) : a.year - b.year;
      });
      count.textContent = list.length + " of 14 works";
      grid.innerHTML = "";
      if (!list.length) { grid.appendChild(el("p", "empty", "Nothing matches that. Try a different era, or clear the search.")); return; }
      list.forEach(function (w, i) {
        var b = el("button", "work" + ((w.id === "hokusai-wave" || w.id === "seurat-circus") ? " wide" : ""));
        var fav = store.favs.indexOf(w.id) !== -1;
        b.innerHTML = "<span class=\"frame\"><img src=\"" + w.image + "\" alt=\"" + esc(w.title) + " by " + esc(w.artist) + "\"></span>" +
          "<span class=\"fav" + (fav ? " on" : "") + "\" aria-hidden=\"true\">" + (fav ? "♥" : "♡") + "</span>" +
          "<span class=\"num\">No. " + String(i + 1).padStart(2, "0") + " · " + esc(w.era) + "</span>" +
          "<h3>" + esc(w.title) + "</h3><span class=\"by\">" + esc(w.artist) + ", " + esc(w.dateLabel) + "</span>" +
          "<span class=\"meta\">" + esc(w.medium) + " · " + esc(w.dimensions.split("(")[1] || w.dimensions) + "</span>";
        b.addEventListener("click", function (e) {
          if (e.target.classList.contains("fav")) {
            e.stopPropagation();
            var favs = store.favs;
            var ix = favs.indexOf(w.id);
            if (ix === -1) favs.push(w.id); else favs.splice(ix, 1);
            store.favs = favs; drawGrid(); return;
          }
          location.hash = workUrl(w);
        });
        grid.appendChild(b);
      });
    }
    drawGrid();

    // Tours + visit log
    var two = el("div", "two-col");
    var tp = el("section", "panel");
    tp.innerHTML = "<div class=\"label\">Guided tours</div><h2>Walk a route, not a list</h2><p>Three stops, one line each saying why the stop belongs.</p>";
    TOURS.forEach(function (t) {
      var done = store.toursDone.indexOf(t.id) !== -1;
      var d = el("div", "tour");
      d.innerHTML = "<h3>" + esc(t.title) + "</h3><p>" + esc(t.line) + "</p>" +
        "<p class=\"stops\">" + t.stops.map(function (id) { var w = byId(id); return esc(shortName(w)) + " · " + w.year; }).join(" → ") + "</p>" +
        (done ? "<span class=\"done\">Finished ✓</span> " : "") +
        "<button class=\"mini-btn primary\">" + (done ? "Walk it again" : "Start the tour") + "</button>";
      d.querySelector("button").addEventListener("click", function () { location.hash = "#/tour/" + t.id + "/0"; });
      tp.appendChild(d);
    });
    two.appendChild(tp);
    var vp = el("section", "panel");
    vp.innerHTML = "<div class=\"label\">Your visit</div><h2>Where you have been</h2><p>Kept in this browser only. Nothing is sent anywhere.</p>";
    var visits = store.visits;
    if (!visits.length) vp.appendChild(el("p", "empty", "You have not opened a work yet. Tap any painting above."));
    else {
      var ul = el("ul", "visit-list");
      visits.slice(0, 8).forEach(function (v) {
        var w = byId(v.workId); if (!w) return;
        var li = el("li");
        var b = el("button", "", esc(w.title) + " — " + esc(w.artist));
        b.addEventListener("click", function () { location.hash = workUrl(w); });
        li.appendChild(b); li.appendChild(el("span", "", fmtDate(v.at)));
        ul.appendChild(li);
      });
      vp.appendChild(ul);
      var clear = el("button", "mini-btn", "Clear visit log");
      clear.style.marginTop = "14px";
      clear.addEventListener("click", function () { store.visits = []; renderGallery(); });
      vp.appendChild(clear);
    }
    two.appendChild(vp);
    app.appendChild(two);
  }

  function renderWork(id) {
    var w = byId(id);
    if (!w) { location.hash = "#/"; return; }
    setNav("gallery");
    recordVisit(w);
    app.innerHTML = "";
    var back = el("button", "back", "← All works");
    back.addEventListener("click", function () { location.hash = "#/"; });
    app.appendChild(back);
    var det = el("section", "detail");
    var left = el("div");
    left.innerHTML = "<div class=\"frame\"><img src=\"" + w.image + "\" alt=\"" + esc(w.title) + " by " + esc(w.artist) + "\"></div>" +
      "<p class=\"credit\">Image: " + esc(w.imageCredit) + ". Public domain. " +
      "Facts: the Met Collection API, checked 23 Nov 2026. " +
      "The Met's own image host blocks automated downloads, so this image comes from Wikimedia Commons.</p>";
    det.appendChild(left);
    var right = el("div");
    right.innerHTML = "<div class=\"label\">No. " + (CAT.indexOf(w) + 1) + " · " + esc(w.era) + "</div>" +
      "<h1>" + esc(w.title) + "</h1><p class=\"byline\">" + esc(w.artist) + " (" + esc(w.artistLived) + "), " + esc(w.dateLabel) + "</p>" +
      "<div class=\"wall-label\"><table class=\"fact-table\">" +
      "<tr><th>Medium</th><td>" + esc(w.medium) + "</td></tr>" +
      "<tr><th>Size</th><td>" + esc(w.dimensions) + "</td></tr>" +
      "<tr><th>Department</th><td>" + esc(w.department) + ", the Met</td></tr>" +
      "<tr><th>Met object</th><td><a href=\"" + w.metUrl + "\" target=\"_blank\" rel=\"noopener\">" + w.metObjectId + " — view the live record</a></td></tr>" +
      "</table></div>";
    var facts = el("ol", "facts");
    w.facts.forEach(function (f) { facts.appendChild(el("li", "", esc(f))); });
    right.appendChild(facts);
    right.appendChild(el("p", "facts-note", "Five facts, checked against the Met Collection API on 23 Nov 2026. If a fact ever changes at the Met, this page is updated at the next release — it is never silently rewritten."));
    var favBtn = el("button", "mini-btn", (store.favs.indexOf(w.id) !== -1 ? "♥ Saved" : "♡ Save this work"));
    favBtn.style.marginTop = "16px";
    favBtn.addEventListener("click", function () {
      var favs = store.favs, ix = favs.indexOf(w.id);
      if (ix === -1) favs.push(w.id); else favs.splice(ix, 1);
      store.favs = favs; renderWork(id);
    });
    right.appendChild(favBtn);
    det.appendChild(right);
    app.appendChild(det);

    // Chat
    var chat = el("section", "chat");
    chat.innerHTML = "<div class=\"label\">Ask the artist</div><h2>In " + esc(w.artist.split(" ").slice(-1)[0]) + "’s words</h2>" +
      "<p class=\"persona-tag\">Inspired by — a persona, not a real quote. The voice below is written from the facts above; it is not the artist speaking, and it never quotes a real letter or diary.</p>";
    var thread = el("div", "chat-thread"); chat.appendChild(thread);
    var history = [];
    function addMsg(role, text, source) {
      var m = el("div", "msg " + role, esc(text));
      if (source) m.appendChild(el("span", "src", esc(source)));
      thread.appendChild(m);
      thread.scrollTop = thread.scrollHeight;
      history.push({ role: role, text: text });
      if (history.length > 12) history = history.slice(-12);
      return m;
    }
    addMsg("artist", w.openingLine, "Opening line — written from the facts · inspired by");
    var listenRow = el("div", "listen-row");
    var listenBtn = el("button", "mini-btn", "▶ Listen — read aloud");
    var listenNote = el("span", "chat-status", w.voice.note + " Read by your browser's voice, not a clone.");
    listenBtn.addEventListener("click", function () {
      var last = history.filter(function (m) { return m.role === "artist"; }).pop();
      var err = speak(last ? last.text : w.openingLine, w);
      listenNote.textContent = err || ("Reading aloud… " + w.voice.note);
    });
    listenRow.appendChild(listenBtn); listenRow.appendChild(listenNote);
    chat.appendChild(listenRow);
    var sugg = el("div", "suggest");
    w.suggested.forEach(function (q) {
      var b = el("button", "", esc(q));
      b.addEventListener("click", function () { ask(q); });
      sugg.appendChild(b);
    });
    chat.appendChild(sugg);
    var row = el("div", "ask-row");
    var input = el("input"); input.type = "text"; input.placeholder = "Ask " + w.artist.split(" ")[0] + " anything about this work…";
    input.setAttribute("aria-label", "Ask the artist");
    var mic = el("button", "mic-btn", "🎙 Mic");
    var askBtn = el("button", "mini-btn primary", "Ask");
    row.appendChild(input); row.appendChild(mic); row.appendChild(askBtn);
    chat.appendChild(row);
    var status = el("p", "chat-status", hasKey() ? "Live voice on — answers come from Gemini " + MODEL + ", grounded in the facts above." : "Offline replies — from the catalogue facts, no AI call. Add a free Gemini key in Settings for the live voice.");
    chat.appendChild(status);
    mic.addEventListener("click", function () {
      startListening(input, status, function (listening) { mic.classList.toggle("listening", listening); mic.textContent = listening ? "● Listening…" : "🎙 Mic"; });
    });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") ask(input.value); });
    askBtn.addEventListener("click", function () { ask(input.value); });
    function ask(q) {
      q = (q || "").trim();
      if (!q) return;
      addMsg("user", q);
      input.value = "";
      status.textContent = "Thinking…";
      askBtn.disabled = true;
      if (!hasKey()) {
        setTimeout(function () {
          var r = LIB.offlineReply(w, q);
          addMsg("artist", r.text, r.source === "offline-facts" ? "Offline reply — from the facts · could not answer the question itself" : "Offline reply — from the catalogue facts, no AI call");
          status.textContent = "Offline replies — from the catalogue facts. Add a free Gemini key in Settings for the live voice.";
          askBtn.disabled = false;
        }, 350);
        return;
      }
      var cached = store.cached;
      var req = LIB.buildChatRequest(w, history.slice(0, -1), q, MODEL);
      geminiCall(req, false).then(function (text) {
        if (!text) throw new Error("Gemini returned an empty reply. Try again — your offline replies still work.");
        addMsg("artist", text, "Live reply — " + MODEL + " · grounded in the facts above");
        if (!cached[w.id]) { cached[w.id] = text; store.cached = cached; }
        status.textContent = "Live voice on — answers come from Gemini, grounded in the facts above.";
        askBtn.disabled = false;
      }).catch(function (err) {
        // A cached first live reply keeps the demo working through a 429.
        if (cached[w.id]) {
          addMsg("artist", cached[w.id], "Cached live reply — Gemini is unreachable right now");
          status.textContent = err.message;
        } else {
          var r = LIB.offlineReply(w, q);
          addMsg("artist", r.text, "Offline reply — Gemini is unreachable, so this comes from the facts");
          status.textContent = err.message;
        }
        status.classList.add("err");
        askBtn.disabled = false;
      });
    }
    app.appendChild(chat);
  }

  function renderScan() {
    setNav("scan");
    app.innerHTML = "";
    var s = el("section", "scan");
    s.innerHTML = "<div class=\"label\">Scan a work</div><h1>Point, and it talks back.</h1>" +
      "<p>Hold the phone up to a print of one of the 14 works — or upload a photo of one. " +
      "With a Gemini key, the app identifies it and opens the conversation. " +
      "Without a key, it says so plainly and sends you to the gallery instead. It never guesses.</p>";
    var vf = el("div", "viewfinder");
    vf.innerHTML = "<span class=\"corner c1\"></span><span class=\"corner c2\"></span><span class=\"corner c3\"></span><span class=\"corner c4\"></span><div class=\"vf-empty\">No photo yet — use the camera or upload one below.</div>";
    s.appendChild(vf);
    var actions = el("div", "scan-actions");
    var camBtn = el("button", "mini-btn", "Use camera");
    var upBtn = el("button", "mini-btn", "Upload a photo");
    var fileInput = el("input"); fileInput.type = "file"; fileInput.accept = "image/*"; fileInput.hidden = true;
    var idBtn = el("button", "mini-btn primary", "Identify this work");
    idBtn.disabled = true;
    actions.appendChild(camBtn); actions.appendChild(upBtn); actions.appendChild(idBtn);
    s.appendChild(actions); s.appendChild(fileInput);
    var result = el("div", "scan-result"); s.appendChild(result);
    if (!hasKey()) {
      var honest = el("div", "honest-box", "<b>No Gemini key yet.</b> Photo identification needs one — it is a free key from Google AI Studio, pasted in Settings and kept in this browser only. Until then, the gallery below is the reliable way in: every work there talks from the facts, no key needed.");
      s.appendChild(honest);
      var go = el("button", "mini-btn", "Browse the 14 works instead");
      go.addEventListener("click", function () { location.hash = "#/"; });
      s.appendChild(go);
    }
    var stream = null, photoDataUrl = null;
    function stopCam() { if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; } }
    function setPhoto(dataUrl) {
      photoDataUrl = dataUrl;
      vf.innerHTML = "<span class=\"corner c1\"></span><span class=\"corner c2\"></span><span class=\"corner c3\"></span><span class=\"corner c4\"></span><img src=\"" + dataUrl + "\" alt=\"Your photo of an artwork\">";
      idBtn.disabled = false;
      result.innerHTML = "";
    }
    camBtn.addEventListener("click", function () {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        result.innerHTML = "<div class=\"honest-box\">This browser cannot open the camera here — upload a photo instead.</div>";
        return;
      }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (st) {
        stream = st;
        vf.innerHTML = "<span class=\"corner c1\"></span><span class=\"corner c2\"></span><span class=\"corner c3\"></span><span class=\"corner c4\"></span><video autoplay playsinline></video>";
        vf.querySelector("video").srcObject = st;
        var snap = el("button", "mini-btn", "Take the photo");
        snap.addEventListener("click", function () {
          var v = vf.querySelector("video");
          var c = document.createElement("canvas");
          c.width = v.videoWidth; c.height = v.videoHeight;
          c.getContext("2d").drawImage(v, 0, 0);
          stopCam(); setPhoto(c.toDataURL("image/jpeg", 0.85));
        });
        actions.appendChild(snap);
        result.innerHTML = "<p>Camera open. Frame the work, then take the photo.</p>";
      }).catch(function () {
        result.innerHTML = "<div class=\"honest-box\">The camera could not start (permission, or this browser). Upload a photo instead.</div>";
      });
    });
    upBtn.addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function () {
      var f = fileInput.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () { setPhoto(r.result); };
      r.readAsDataURL(f);
    });
    idBtn.addEventListener("click", function () {
      if (!photoDataUrl) return;
      if (!hasKey()) {
        result.innerHTML = "<div class=\"honest-box\"><b>I cannot identify this photo without a key.</b> Identification is a Gemini vision call, and there is no key saved. Paste a free key in Settings, then try again — or tap a work in the gallery, which needs no key at all.</div>";
        return;
      }
      result.innerHTML = "<p>Looking at the photo…</p>";
      idBtn.disabled = true;
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas");
        var scale = Math.min(1, 1024 / Math.max(img.width, img.height));
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        var b64 = c.toDataURL("image/jpeg", 0.8).split(",")[1];
        var req = LIB.buildVisionRequest(b64, MODEL);
        geminiCall(req, false).then(function (text) {
          var parsed = LIB.parseVisionAnswer(text);
          if (!parsed) {
            result.innerHTML = "<div class=\"honest-box\"><b>I don't recognise this one.</b> Gemini looked at the photo and would not name it — so neither will I. It may be a work outside the 14, a bad angle, or glare. Here are the closest works to tap instead:</div>";
            showClosest("", "");
            idBtn.disabled = false;
            return;
          }
          var m = LIB.matchWork(parsed.title, parsed.artist, CAT);
          if (!m) {
            result.innerHTML = "<div class=\"honest-box\"><b>I don't recognise this one as one of the 14.</b> Gemini read the photo as “" + esc(parsed.title) + "” by " + esc(parsed.artist) + ", which is not in this catalogue. The description is honest; the identification is not a match. Closest works to tap:</div>";
            showClosest(parsed.title, parsed.artist);
            idBtn.disabled = false;
            return;
          }
          result.innerHTML = "<p class=\"guess\">Identified: " + esc(m.work.title) + " — " + esc(m.work.artist) + " (match " + Math.round(m.score * 100) + "%)</p><p>Opening the conversation…</p>";
          setTimeout(function () { location.hash = workUrl(m.work); }, 900);
        }).catch(function (err) {
          result.innerHTML = "<div class=\"honest-box\"><b>Identification failed.</b> " + esc(err.message) + "</div>";
          idBtn.disabled = false;
        });
      };
      img.src = photoDataUrl;
      function showClosest(t, a) {
        var box = el("div", "closest");
        LIB.closestWorks(t, a, CAT, 3).forEach(function (w) {
          var b = el("button", "", "<b>" + esc(w.title) + "</b>" + esc(w.artist) + ", " + esc(w.dateLabel));
          b.addEventListener("click", function () { location.hash = workUrl(w); });
          box.appendChild(b);
        });
        result.appendChild(box);
      }
    });
    app.appendChild(s);
    window.addEventListener("hashchange", stopCam, { once: true });
  }

  function renderMet() {
    setNav("met");
    app.innerHTML = "";
    var m = el("section", "met");
    m.innerHTML = "<div class=\"label\">Beyond the 14 — live from the Met</div><h1>Search the whole museum.</h1>" +
      "<p>The Met's Collection API holds about 490,000 public-domain works and needs no key. " +
      "Search it here. Results are real Met records — but they are <b>not</b> part of the talking catalogue, so the artist chat stays off and the app says why.</p>";
    var row = el("div", "met-row");
    var input = el("input"); input.type = "search"; input.placeholder = "Try “sunflowers”, “Rembrandt”, “Hokusai”…";
    input.setAttribute("aria-label", "Search the Met collection");
    var go = el("button", "mini-btn primary", "Search the Met");
    row.appendChild(input); row.appendChild(go);
    m.appendChild(row);
    var status = el("p", "chat-status", "Live endpoint: collectionapi.metmuseum.org/public/collection/v1.1/search — the old /v1/search was retired (410) on 1 Oct 2026.");
    m.appendChild(status);
    var grid = el("div", "met-grid"); m.appendChild(grid);
    function doSearch() {
      var q = input.value.trim();
      if (!q) { status.textContent = "Type something first — a title, an artist, a subject."; return; }
      status.textContent = "Searching the Met for “" + q + "”…";
      grid.innerHTML = "";
      fetch(window.TG_MET_SEARCH + "?q=" + encodeURIComponent(q) + "&hasImages=true")
        .then(function (r) { if (!r.ok) throw new Error("The Met API returned " + r.status + "."); return r.json(); })
        .then(function (json) {
          var ids = (json.objectIDs || []).slice(0, 8);
          if (!ids.length) { status.textContent = "The Met found nothing for “" + q + "”. Try a broader word."; return; }
          status.textContent = json.total + " matches at the Met — showing the first " + ids.length + " with images.";
          return Promise.all(ids.map(function (id) {
            return fetch(window.TG_MET_OBJECT + "/" + id).then(function (r) { return r.json(); }).catch(function () { return null; });
          })).then(function (objs) {
            objs.filter(Boolean).forEach(function (o) {
              var known = CAT.find(function (w) { return w.metObjectId === o.objectID; }) || null;
              var card = el("button", "met-hit");
              card.innerHTML = (o.primaryImageSmall ? "<img src=\"" + o.primaryImageSmall + "\" alt=\"\" loading=\"lazy\">" : "<div class=\"noimg\">No open image for this work</div>") +
                "<h3>" + esc(o.title) + "</h3><div class=\"m\">" + esc(o.artistDisplayName || "Unknown artist") + " · " + esc(o.objectDate || "") + "</div>" +
                "<div class=\"m\">" + esc(o.medium || "") + " · Met object " + o.objectID + "</div>" +
                "<div class=\"m\">" + (known ? "In the talking catalogue — tap to talk." : "Not in the talking catalogue — facts only, no artist chat.") + "</div>";
              card.addEventListener("click", function () {
                if (known) location.hash = workUrl(known);
                else window.open(o.objectURL, "_blank", "noopener");
              });
              grid.appendChild(card);
            });
          });
        })
        .catch(function (err) {
          status.textContent = "The Met search is unavailable right now (" + err.message + "). The 14 seeded works still work — the catalogue is local.";
          status.classList.add("err");
        });
    }
    go.addEventListener("click", doSearch);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") doSearch(); });
    app.appendChild(m);
  }

  function renderSettings() {
    setNav("settings");
    app.innerHTML = "";
    var s = el("section", "settings");
    s.innerHTML = "<div class=\"label\">Settings</div><h1>Your key, your voice.</h1>" +
      "<section><h2>Gemini key</h2><p>Live conversation and photo identification use Google's Gemini API. " +
      "The key is free from <a href=\"https://aistudio.google.com/apikey\" target=\"_blank\" rel=\"noopener\">Google AI Studio</a>. " +
      "It is stored in this browser's localStorage only, and sent only to Google's API. The app has no server and no way to see it.</p>" +
      "<p>Model: <b>" + MODEL + "</b> (verified in Google's docs, 23 Nov 2026), fallback <b>" + FALLBACK + "</b>. " +
      "The old <b>gemini-2.5-flash</b> was withdrawn on 12 Nov 2026 and is never used.</p>" +
      "<label for=\"key-in\">Gemini API key</label><input id=\"key-in\" type=\"password\" placeholder=\"Paste your free key here\" autocomplete=\"off\">" +
      "<div class=\"row\"><button class=\"mini-btn primary\" id=\"save-key\">Save key</button>" +
      "<button class=\"mini-btn\" id=\"test-key\">Test key</button>" +
      "<button class=\"mini-btn\" id=\"clear-key\">Remove key</button>" +
      "<span class=\"status\" id=\"key-status\">" + (hasKey() ? "A key is saved." : "No key saved — offline replies only.") + "</span></div></section>" +
      "<section><h2>Voice</h2><p>Replies are read aloud by your browser's own voices — never a cloned voice.</p>" +
      "<label class=\"toggle-row\"><input type=\"checkbox\" id=\"voice-on\"> Reading aloud on</label>" +
      "<label class=\"toggle-row\"><input type=\"checkbox\" id=\"voice-slow\"> Slower reading</label></section>" +
      "<section><h2>Your data in this browser</h2><p>Favourites, visit log, finished tours and cached first replies live in localStorage. Nothing leaves this device.</p>" +
      "<div class=\"row\"><button class=\"mini-btn\" id=\"reset-all\">Erase everything stored</button>" +
      "<span class=\"status\" id=\"reset-status\"></span></div></section>" +
      "<section><h2>What this app can and cannot do</h2><ul>" +
      "<li>The artist's voice is a persona prompt — inspired by, never a real quote, never a cloned voice.</li>" +
      "<li>Photo identification works only for the 14 seeded works, and only with a key. An arbitrary gallery wall will not be recognised.</li>" +
      "<li><i>The Starry Night</i> is at MoMA, not the Met, so it is not in the catalogue.</li>" +
      "<li>Spoken questions are Chrome-only and unreliable; typed questions are the real input. Browser voices differ by device.</li>" +
      "<li>Met facts were verified 23 Nov 2026. Images come from Wikimedia Commons (public domain) because the Met image host blocks automated downloads.</li>" +
      "<li>No accounts, no server, no sync: everything lives in this browser.</li></ul></section>";
    app.appendChild(s);
    var keyIn = $("#key-in", s); keyIn.value = store.key;
    $("#save-key", s).addEventListener("click", function () {
      store.key = keyIn.value.trim();
      $("#key-status", s).textContent = store.key ? "Key saved in this browser only." : "Key removed.";
      setNav("settings");
    });
    $("#clear-key", s).addEventListener("click", function () {
      store.key = ""; keyIn.value = "";
      $("#key-status", s).textContent = "Key removed.";
      setNav("settings");
    });
    $("#test-key", s).addEventListener("click", function () {
      var st = $("#key-status", s);
      if (!store.key) { st.textContent = "Save a key first."; return; }
      st.textContent = "Testing… one tiny call.";
      fetch("https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + encodeURIComponent(store.key), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Reply with the single word OK." }] }], generationConfig: { maxOutputTokens: 10 } })
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (x) {
          if (x.ok) { st.textContent = "Key works — Gemini answered."; st.classList.add("ok"); }
          else { st.textContent = LIB.geminiErrorMessage(400, x.j); }
        })
        .catch(function (e) { st.textContent = "Test failed: " + e.message + " — check your network and key."; });
    });
    var voiceOn = $("#voice-on", s); voiceOn.checked = store.voiceOn;
    voiceOn.addEventListener("change", function () { store.voiceOn = voiceOn.checked; });
    var slow = $("#voice-slow", s); slow.checked = store.rate < 1;
    slow.addEventListener("change", function () { store.rate = slow.checked ? 0.85 : 1; });
    $("#reset-all", s).addEventListener("click", function () {
      ["favs", "visits", "toursDone", "geminiKey", "cachedReplies"].forEach(function (k) { try { localStorage.removeItem("tg-" + k); } catch (e) {} });
      $("#reset-status", s).textContent = "Erased. The gallery is as you found it.";
      setNav("settings");
    });
  }

  function renderTour(tourId, step) {
    var t = TOURS.find(function (x) { return x.id === tourId; });
    if (!t) { location.hash = "#/"; return; }
    setNav("gallery");
    step = Math.max(0, Math.min(t.stops.length - 1, step || 0));
    var w = byId(t.stops[step]);
    app.innerHTML = "";
    var back = el("button", "back", "← All tours");
    back.addEventListener("click", function () { location.hash = "#/"; });
    app.appendChild(back);
    var v = el("section", "tour-view");
    v.innerHTML = "<div class=\"label\">Guided tour</div><h1>" + esc(t.title) + "</h1><p class=\"why\">" + esc(t.line) + "</p>" +
      "<p class=\"progress\">Stop " + (step + 1) + " of " + t.stops.length + " — " + esc(t.why[step]) + "</p>";
    var stop = el("div", "tour-stop");
    stop.innerHTML = "<div><img src=\"" + w.image + "\" alt=\"" + esc(w.title) + " by " + esc(w.artist) + "\"></div>" +
      "<div><h2>" + esc(w.title) + "</h2><p class=\"by\">" + esc(w.artist) + ", " + esc(w.dateLabel) + " · " + esc(w.medium) + "</p>" +
      "<p style=\"font-style:italic;font-size:20px\">“" + esc(w.openingLine.split(". ")[0] + ".") + "”</p>" +
      "<p class=\"persona-tag\">Inspired by — a persona, not a real quote.</p></div>";
    v.appendChild(stop);
    var nav = el("div", "tour-nav");
    if (step > 0) {
      var prev = el("button", "mini-btn", "← Previous stop");
      prev.addEventListener("click", function () { location.hash = "#/tour/" + t.id + "/" + (step - 1); });
      nav.appendChild(prev);
    }
    var talk = el("button", "mini-btn primary", "Ask the artist about this work");
    talk.addEventListener("click", function () { location.hash = workUrl(w); });
    nav.appendChild(talk);
    if (step < t.stops.length - 1) {
      var next = el("button", "mini-btn", "Next stop →");
      next.addEventListener("click", function () { location.hash = "#/tour/" + t.id + "/" + (step + 1); });
      nav.appendChild(next);
    } else {
      var done = el("button", "mini-btn primary", "Finish the tour");
      done.addEventListener("click", function () {
        var d = store.toursDone;
        if (d.indexOf(t.id) === -1) { d.push(t.id); store.toursDone = d; }
        location.hash = "#/";
      });
      nav.appendChild(done);
    }
    v.appendChild(nav);
    app.appendChild(v);
  }

  /* ---------- boot ---------- */
  document.querySelectorAll("nav.main button").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.view;
      location.hash = v === "gallery" ? "#/" : "#/" + v;
    });
  });
  window.addEventListener("hashchange", render);
  render();
})();
