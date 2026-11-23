# AI Museum Guide — Deepened Plan (SaaS level, demoable in 24–48h)

**Project:** ai-museum-guide · **App name:** The Talking Gallery
**One sentence:** Point your phone at a painting — or tap one in the gallery — and the
artist talks to you, in first person, in their own era and manner, grounded only in
verified facts about that work.
**Target user:** A museum visitor (or a student at home with a print) who looks at a
famous painting and wants to know what the painter was thinking — without reading a
wall of wall text.
**Core promise:** Every painting is a person you can interview. Ask, and get an answer
that is true to the work, in the artist's voice.
**Tone:** Quiet gallery, not a theme park. Plain human words. No hype.

## 0. Verification notes (checked 23 Nov 2026, before building)

- **Gemini model `gemini-3.8-flash` is real.** Google AI Studio's model index lists
  "Gemini 3.8 Flash", endpoint `gemini-3.8-flash`. The plan's warning was wrong in the
  good direction: the name exists. `gemini-2.5-flash` and `gemini-2.5-pro` were
  withdrawn 12 Nov 2026 (503) and route to `gemini-3.5-flash-lite` / `gemini-3.8-flash`
  from 1 Dec 2026 — so this app uses `gemini-3.8-flash` first, `gemini-3.5-flash-lite`
  as the fallback, and never the 2.5 names.
- **Met Collection API:** the old `/public/collection/v1/search` returns **HTTP 410
  Gone** (verified live). The current search endpoint is
  `/public/collection/v1.1/search` (verified 200). Object records are still
  `/public/collection/v1/objects/{id}` (verified 200). No key. ~80 req/sec published.
- **Met image host is bot-gated:** `images.metmuseum.org` returns an Incapsula
  challenge page to curl (and to headless Chrome). So the app does **not** hotlink Met
  images. All 14 catalogue images are local files downloaded from Wikimedia Commons
  (public-domain works, CC0 / public-domain files), verified as real JPEGs.
- **Two Met records carry no image at all** (`isPublicDomain: false` in the Met
  record for Monet 437133 and 437112) — the Commons files are used for those too,
  and the facts panel says where each fact comes from.
- **The Starry Night is not in the Met** (it is at MoMA). It is therefore **not** in
  the catalogue, and the demo uses Van Gogh's *Wheat Field with Cypresses* (1889,
  Saint-Rémy, the same year and the same asylum months as *The Starry Night*) as the
  Van Gogh hero instead. The app never claims a work it does not hold.

## 1. Design brief

- **Signature idea:** the museum wall label. Every work is presented the way a gallery
  presents it — a number, a title in large serif, artist, date, medium, one rule
  underneath — and the conversation sits below the label like a visitor talking to
  the painter. One visual idea, repeated with discipline.
- **References (from the playbook, actually opened and used):**
  - metmuseum.org — wall-label typography, generous white space, thin rules, small
    caps section labels.
  - artsandculture.google.com — artwork-first layout, facts in a quiet side column,
    era context as a strip.
  - moma.org — plain human copy, no decoration, the work does the talking.
- **Palette (OKLCH, hex fallbacks):** gallery cream background `#f6f1e7`, ink
  `#211c16`, muted ink `#6b6156`, hairline `#d8cfbd`, one accent — gallery red
  `#7c2d2e` (the colour of a museum wall), used under 10% of any screen. No
  gradients, no glows, no glass.
- **Type:** Cormorant Garamond (self-hosted woff2, 500/600/700 + 500 italic) for
  display and the artist's words; system sans for labels and UI chrome at 12–13px
  with letterspaced small caps. Body 17px / 1.6.
- **Motion:** 150–250ms, transform/opacity only. One moment per screen: the chat
  reply fades in; the era strip slides. Nothing else moves.

## 2. Feature set (full)

### Gallery (the reliable path — the demo starts here)
- Grid of 14 works, each a real image + wall label (title, artist, year, medium).
- Filter by era (Renaissance · Dutch Golden Age · Impressionism · Post-Impressionism ·
  Japanese print) and by artist; text search across title/artist.
- Sort: by year (timeline order) or by artist name.
- Favourite (heart) per work, stored in localStorage; a "Saved" filter.
- "Visited" log: opening a work records it with a timestamp; a small "Your visit"
  list on the home screen, with a clear button. Export as JSON.

### Work detail (one work, one conversation)
- Large image, wall label, facts panel: artist, date, medium, dimensions,
  department, Met object ID with a link to the Met record, image credit
  (Wikimedia Commons file, public domain).
- **Five verified facts** per work, each written from the Met record or from
  firmly established art history; the panel says "Facts checked against the Met
  Collection API, 23 Nov 2026".
- **"In the artist's words"** — a cached opening line per artist, written as a
  persona (first person, era diction, grounded only in the catalogue facts),
  labelled on screen: *"Inspired by — a persona, not a real quote."*
- **Ask the artist:** a chat thread under the work. Suggested questions (3 chips
  per work). Replies capped at ~120 words. History capped at 6 turns.
- **Listen button:** browser `speechSynthesis` reads the latest reply aloud, with
  per-artist pitch/rate (e.g. Rembrandt slower and lower; Hokusai quicker).
  A voice toggle in Settings; if the browser has no voices, the button says so.
- **Mic button:** browser speech recognition (Chrome) for spoken questions, with
  the typed box always visible as the real input (recognition is unreliable and
  the app says so).

### Scan (the flourish, not the load-bearing path)
- Camera (`getUserMedia`, rear camera preferred) or file upload; a live preview
  frame styled like a viewfinder with corner marks.
- **With a Gemini key:** the photo is sent to `gemini-3.8-flash` (multimodal) with
  a strict prompt — "identify title and artist, or say you cannot" — then the
  answer is fuzzy-matched against the 14-work catalogue. A strong match opens
  that work. Anything else: an honest "I don't recognise this one", the model's
  plain visual description, and the 3 closest catalogue works to tap.
- **Without a key:** the scan button is honest before it is pressed — "Photo
  identification needs your free Gemini key (Settings). Until then, tap a work
  in the gallery." No fake identification is ever shown. Uploading a photo
  without a key still shows the preview and the gallery shortcut.
- No photo is stored or uploaded anywhere except the Gemini call the user
  explicitly triggers with their own key.

### Era timeline
- A horizontal strip, 1465 → 1892, with one tick per work, grouped by era.
  Tapping a tick opens the work. It shows at a glance that the collection spans
  427 years and that the voices change with the century.

### Guided tours (SaaS-level structure on a seeded catalogue)
- Two ready tours, 3 stops each, each stop with one line saying why it belongs:
  - **"An hour in the gallery"** — Memling (1465) → Rembrandt (1660) →
    Van Gogh, *Wheat Field with Cypresses* (1889): how painting learned to
    look, then to feel.
  - **"Light, from Delft to Paris"** — Vermeer (1662) → Monet, *Sainte-Adresse*
    (1867) → Seurat (1887): light as a subject, from a window to a whole sky.
- Tour view: stop 1 of 3, progress, previous/next, "ask the artist" at each stop.
  Finishing a tour marks it done (localStorage).

### Live Met search (needs network, no key)
- A search box that queries the live Met API (`/v1.1/search`, then
  `/v1/objects/{id}`) for anything in the Met's ~490,000 public-domain works,
  and shows title/artist/date/image for the first 8 results. Results are
  clearly labelled "Live from the Met — not part of the talking catalogue";
  tapping one shows its facts but the artist chat is disabled with a plain
  explanation (no persona exists for it). If the network or the API fails, the
  box says so and the seeded catalogue keeps working.
- A "refresh facts" affordance is deliberately **not** included: facts are
  verified at build time and re-checked on each release, not silently rewritten.

### Settings
- Gemini API key field (password input, stored in **localStorage only**, never
  sent anywhere except `generativelanguage.googleapis.com`), with a link to
  Google AI Studio, a "test key" button (one tiny call), and a clear button.
- Model shown: `gemini-3.8-flash` (fallback `gemini-3.5-flash-lite` on 404/503),
  with the verification date.
- Voice on/off, speech rate, reset of favourites / visit log / tours.
- A plain "What this app can and cannot do" section (the honest limits, §6).

### Accounts, sync, billing (deliberately out of scope for the 24–48h build)
- No accounts, no server, no database, no payments. All state is localStorage.
  The SaaS shape is the structure (catalogue, tours, settings, logs), not a
  backend. A v2 note in the README lists accounts + hosted catalogue as the
  first paid step.

## 3. Data model

```js
Work {
  id: string,            // slug, e.g. "vangogh-wheat-cypresses"
  metObjectId: number,   // Met Collection API object ID
  title: string,         // Met title, trimmed of the parenthetical where it hurts readability
  artist: string,        // display name
  artistLived: string,   // e.g. "1853–1890"
  year: number,          // sort year (objectBeginDate)
  dateLabel: string,     // Met objectDate, e.g. "ca. 1830–32"
  medium: string,        // Met medium
  dimensions: string,    // Met dimensions
  department: string,    // Met department
  image: string,         // local path assets/img/<slug>.jpg (Wikimedia Commons, public domain)
  imageCredit: string,   // Commons file name
  metUrl: string,        // https://www.metmuseum.org/art/collection/search/<id>
  era: "Renaissance" | "Dutch Golden Age" | "Impressionism" |
       "Post-Impressionism" | "Japanese print",
  facts: string[5],      // verified, see §0
  voice: { pitch: number, rate: number, note: string },
  persona: string,       // system-prompt fragment: era, diction, what may/may not be claimed
  openingLine: string,   // cached first reply, <=120 words, labelled "inspired by"
  suggested: string[3],  // suggested questions
  offlineReplies: { key: string } // keyword -> grounded reply, see §4
}
Tour { id, title, line, stops: workId[3], why: string[3] }
Visit { workId, at: ISO timestamp }
```

## 4. How the artist talks (the honesty core)

- The persona prompt is built from three parts only: the artist's era and
  manner (diction), the work's 5 verified facts, and a hard instruction —
  "You are a persona inspired by {artist}. You are not {artist}. Never claim a
  real quote, letter or diary entry. If asked about something outside the facts
  below, say you don't know and offer what you do know. Answer in at most
  120 words, in first person."
- **Offline replies (no key):** a small keyword rule engine over the catalogue
  facts (technique, colour, light, why this subject, where it was painted,
  how big, who is in it, what it means, happy/sad). Every offline reply is
  labelled "Offline reply — from the catalogue facts, no AI call." A question
  with no keyword match gets a plain answer: "I can't answer that without a
  key — here are the facts I do have", followed by the 5 facts. Nothing is
  invented to fill the gap.
- **Live replies (key present):** `gemini-3.8-flash` via
  `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent`,
  key as `?key=`, system instruction = persona + facts, history capped at 6
  turns, `maxOutputTokens` 300. A 404/503 retries once with
  `gemini-3.5-flash-lite`. Any other error is shown verbatim in plain words
  ("Gemini said: 429 — free-tier limit. Wait a minute and try again. Your
  offline replies still work."). The first live reply per work is cached in
  localStorage so a later 429 still leaves a working demo.
- **Voice:** `speechSynthesis` only. No voice cloning, no ElevenLabs in v1
  (the free tier's ~10 minutes would not survive a demo day, and a cloned
  voice would mislead). The "Listen" button reads the persona text in a
  system voice; the label says "Read aloud by your browser".

## 5. User flow, end to end

1. **Land** on the gallery: 14 works, era filter chips, search box, era timeline
   strip at the top. A one-line note under the title says what the app does
   and that no key is needed to browse and talk offline.
2. **Browse:** filter to "Post-Impressionism", tap *Wheat Field with Cypresses*.
3. **Read:** wall label + image + 5 facts + Met link. The work is added to the
   visit log.
4. **Listen:** the opening line appears ("Inspired by — a persona, not a real
   quote") and the Listen button reads it aloud.
5. **Ask:** tap a suggested question ("Why is the sky so turbulent?") — an
   offline reply arrives, labelled as offline. Type a follow-up; without a key
   it answers from facts or says plainly it cannot.
6. **Scan (optional flourish):** open Scan, point at a print, take the photo.
   Without a key the app says identification needs a key and offers the
   gallery; with a key it identifies the work in a few seconds and opens it.
7. **Tour:** from the home screen, start "Light, from Delft to Paris" — 3 stops,
   ask one question at each, finish, tour marked done.
8. **Search the Met:** type "sunflowers" in the Met search box, see live
   results, open one, read its real Met facts (chat disabled, explained).
9. **Settings:** paste a free Gemini key, test it, and the same conversation
   now answers live, in character, within the same 120-word cap.
10. **Leave and return:** favourites, visit log, tour progress and cached first
    replies persist in localStorage; the key persists until cleared.

## 6. Honest limits (shown in the app and the README)

- The "artist's voice" is a persona prompt, not the person, not a quote, and
  not a cloned voice. It is labelled "inspired by" on screen.
- Recognition works only for the 14 seeded works, and only with a Gemini key.
  An arbitrary gallery wall will not be recognised, and the honest fallback
  ("I don't recognise this one") is the product, not a bug to hide.
- *The Starry Night* is at MoMA, not the Met, so it is not in the catalogue.
- Speech recognition is Chrome-only and unreliable; typed questions are the
  real input. `speechSynthesis` voices differ by device.
- Met facts were verified 23 Nov 2026; the Met image host blocks automated
  downloads, so images come from Wikimedia Commons (public domain) and are
  credited per work.
- No accounts, no server, no sync: everything lives in this browser.

## 7. 2-minute demo script

- **0:00–0:20** — "Every painting is a person you can interview." Gallery on
  screen, 14 works. Tap *Wheat Field with Cypresses* (1889, Saint-Rémy — the
  same months Van Gogh painted *The Starry Night*).
- **0:20–1:00** — The opening line appears, labelled "inspired by". Press
  Listen; the browser reads it aloud. The facts panel shows real Met data
  (1889, oil on canvas, 73.2 × 93.4 cm).
- **1:00–1:40** — Ask aloud or type: "Why is the sky so turbulent?" An offline
  reply answers from the facts; then paste the key (or say it is already in)
  and ask "Were you happy painting this?" — the live reply answers in
  character, referencing Saint-Rémy, without inventing a diary entry.
- **1:40–2:00** — Tap Hokusai's *Great Wave* on the timeline strip: the voice,
  the era and the manner switch instantly. Close: "Fourteen paintings, fourteen
  people. Bring a key and they all talk."

## 8. Stack and versions (verified 23 Nov 2026)

- Plain HTML + CSS + vanilla JS, no build step, no framework — chosen so the
  app runs from `file://` with no server and no install, which is what a
  24–48h demo needs. (The original plan's Next.js 16.4.5 is real, but a build
  step buys nothing here and breaks the file:// demo.)
- Gemini `gemini-3.8-flash` (verified in Google AI Studio docs) + fallback
  `gemini-3.5-flash-lite`, REST `v1beta ... :generateContent`.
- Met Collection API: `/v1.1/search` (200, verified) + `/v1/objects/{id}`
  (200, verified). Old `/v1/search` is 410 Gone (verified).
- Web Speech API (`speechSynthesis`, `SpeechRecognition`) — browser-native.
- Tests: Node's built-in test runner, no dependencies. Screenshots: headless
  Chromium, `file://` URLs.
- Deploy: any static host (GitHub Pages). No secrets in the repo; the key is
  the user's own, in their own browser only.

## 9. Risks and fallbacks

| Risk | Fallback |
|---|---|
| Gemini 429 / key missing | Offline replies from facts; cached first replies; label says so |
| Vision misidentifies a photo | Exact catalogue match required; otherwise "I don't recognise this one" + 3 closest to tap |
| Met API down | Seeded catalogue is local; live search box says plainly it is unavailable |
| Speech recognition unsupported | Typed box is always visible and is the real input |
| No network at all in the demo room | Everything except live Gemini and live Met search works from local files |

## 10. Launch checklist / v2 ideas

- Checklist: 14 images render, 0 overflow at 1280px and 390px, tests pass,
  README + LICENSE, git history, screenshots read by a human.
- V2: accounts + hosted catalogue; ElevenLabs pre-generated opening lines for
  the 3 hero works (with attribution); more works (a second room: 14 more from
  the Met); a "classroom mode" with one shared key; print-at-home QR cards
  that open a work's conversation.
