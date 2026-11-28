# The Talking Gallery — an AI museum guide

Point your phone at a painting — or tap one in the gallery — and the artist talks
to you, in first person, in their own era and manner, grounded only in verified
facts about that work.

## What it is

Fourteen works from the Metropolitan Museum of Art, spanning 1465 to 1892:
Memling, Rembrandt, Vermeer, Hokusai, Monet, Manet, Degas, Seurat, Cézanne,
Gauguin, and three Van Goghs. Each work has a wall label, five verified facts,
a cached opening line in the artist's voice, and a conversation you can hold
with the artist. Two guided tours walk three stops each, with one line per stop
saying why it belongs. A live search box queries the Met's whole collection.

**The artist's voice is a persona — "inspired by", never a real quote, never a
cloned voice.** That label is on screen wherever the artist speaks.

## Run it

No install, no server, no build step. Open `index.html` in a browser (or serve
the folder with any static host — GitHub Pages works).

```sh
# tests (Node, no dependencies)
node --test tests/test.js
```

## No key needed — and what a key adds

Everything works without a key: the gallery, the facts, the tours, the Met
search, and the conversation — offline replies answer from the catalogue facts
and say so on screen. A question the facts cannot answer gets a plain "I can't
answer that" plus the facts themselves. Nothing is invented to fill the gap.

Paste a free Gemini key in **Settings** (Google AI Studio, kept in your
browser's localStorage only, sent only to Google's API) and the same
conversation goes live: `gemini-3.8-flash` answers in character, grounded in
the same facts, capped at ~120 words, history capped at 6 turns. The key also
switches on photo identification in **Scan**.

## Verified versions (checked 23 Nov 2026)

- **Gemini model `gemini-3.8-flash` is real** (Google AI Studio model index).
  Fallback: `gemini-3.5-flash-lite`. The old `gemini-2.5-flash` / `gemini-2.5-pro`
  were withdrawn 12 Nov 2026 and are never used.
- **Met Collection API:** the old `/public/collection/v1/search` returns
  **HTTP 410 Gone** (verified live). This app uses `/v1.1/search` (verified 200)
  and `/v1/objects/{id}` (verified 200). No key.
- **Images are local files from Wikimedia Commons** (public domain, credited per
  work). The Met's own image host returns a bot-challenge page to automated
  downloads, and two Met records (437133, 437112) carry no image at all — so the
  app does not hotlink Met images.

## Honest limits

- The "artist's voice" is a persona prompt, not the person, not a quote, and
  not a cloned voice. It is labelled "inspired by" on screen.
- Photo identification works only for the 14 seeded works, and only with a
  Gemini key. An arbitrary gallery wall will not be recognised; the honest
  fallback ("I don't recognise this one" + the 3 closest works to tap) is the
  product, not a bug to hide.
- *The Starry Night* is at MoMA, not the Met, so it is not in the catalogue.
  The Van Gogh hero is *Wheat Field with Cypresses* (1889, Saint-Rémy — the
  same months as *The Starry Night*).
- Speech recognition is Chrome-only and unreliable; typed questions are the
  real input. `speechSynthesis` voices differ by device.
- Met facts were verified 23 Nov 2026; they are re-checked at release time,
  never silently rewritten.
- No accounts, no server, no sync: favourites, visit log, tour progress and
  cached replies live in this browser's localStorage.

## Design

Gallery cream + Cormorant Garamond (self-hosted woff2), one accent — gallery
red. The signature idea is the museum wall label: number, title, artist, date,
medium, one rule underneath. References: metmuseum.org, artsandculture.google.com,
moma.org. No gradients, no glows, no stock copy.

## Files

- `index.html` — shell, nav, footer
- `styles.css` — the whole design system
- `data.js` — the 14-work catalogue (verified facts, personas, opening lines), tours, endpoints
- `lib.js` — pure logic (fuzzy match, offline replies, Gemini request builders) shared with tests
- `app.js` — views, chat, scan, Met search, settings, tours
- `tests/test.js` — 16 tests, Node built-in runner
- `assets/img/` — 14 public-domain images (Wikimedia Commons)
- `assets/fonts/` — Cormorant Garamond woff2 (self-hosted)
- `met-records.json` — the raw Met API records the facts were checked against
- `PLAN.md` — the deepened SaaS-level plan

## 2-minute demo

0:00 — "Every painting is a person you can interview." Tap *Wheat Field with
Cypresses* (1889, Saint-Rémy). 0:20 — the opening line appears, labelled
"inspired by"; press Listen and the browser reads it aloud; the facts panel
shows real Met data. 1:00 — ask "Why is the sky so turbulent?" (offline reply
from the facts), then with a key ask "Were you happy painting this?" (live
reply, in character, no invented diary entry). 1:40 — tap Hokusai's *Great
Wave* on the timeline strip: voice, era and manner switch instantly.
"Fourteen paintings, fourteen people. Bring a key and they all talk."

## V2 ideas

Accounts + hosted catalogue; ElevenLabs pre-generated opening lines for the 3
hero works (with attribution); a second room of 14 more Met works; classroom
mode with one shared key; print-at-home QR cards that open a work's
conversation.

## License

MIT — see `LICENSE`. Built by Sivasai Boggu, 2026.
