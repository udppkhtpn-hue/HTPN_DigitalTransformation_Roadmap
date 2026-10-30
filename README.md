# Built From Within

A five-minute keynote as a web app. HTPN Digital Roadmap 2025–2028.

Twelve sheets, twenty-three clicker presses, 4:55 planned.

## Presenting

**Present from `dist-single/index.html`.** Copy that one file onto the venue
laptop and open it in Chrome. Everything is inlined — fonts, images, QR codes —
so it needs no network, no server and no dev tools. This is the path that has to
work in the room.

The GitHub Pages copy is for sharing afterwards, not for presenting: it runs
inside a hosted page that can compete for keystrokes and may not grant real
fullscreen.

### Keys

| | |
|---|---|
| `→` `↓` `PageDown` `Space` `Enter` | next |
| `←` `↑` `PageUp` `Backspace` | back |
| `N` | speaker notes, timer and pacing |
| `B` or `.` | blackout — when you want the room looking at you |
| `F` | fullscreen |
| `Home` / `End` | first / last sheet |
| digits then `Enter` | jump to that sheet |
| `R` | reset, including the timer |

Presenter remotes disagree about which keys they send, so the common ones are
all bound. The timer starts on your first advance, not on load.

If the browser reloads or crashes mid-talk, it comes back on the exact beat —
the position is in the URL and in session storage.

## Working on it

```bash
npm run dev
```

```bash
npm run check
```

`check` type-checks, builds the offline file, asserts it fits the size budget,
and measures frame pacing at 4× CPU throttle.

| script | what it does |
|---|---|
| `npm run assets` | pulls the two images out of the original `.pptx` and optimises them |
| `npm run shots` | Playwright screenshots of the two live sites |
| `npm run qr` | regenerates the QR path data |
| `npm run notes` | word count and pacing of the spoken script |
| `npm run perf` | frame budget check |
| `npm run deploy` | builds, checks the budget, publishes `dist/` to `gh-pages` |

`npm run assets` needs the original deck. It looks in `~/Downloads` by default;
override with `PPTX=/path/to/deck.pptx npm run assets`.

## Where things live

All copy and every figure is in `src/content/scenes.ts`. Scene components read
from it and hold none of their own — change a number there and it changes
everywhere, including the speaker notes and the word count.

```
src/
  content/scenes.ts     the talk: copy, figures, notes, timings
  deck/                 cursor, clicker, stage scaling, boot gate, notes panel
  system/               Blueprint tokens, the sheet, the title block
  kit/                  width-axis type, draw-on paths, dimensions, count-ups
  scenes/               one file per sheet
```

## Deploying

Pages serves from the `gh-pages` branch. Set it once under
**Settings → Pages → Source → Deploy from a branch → `gh-pages` / root**, then:

```bash
npm run deploy
```

The build always runs first, so the branch can never carry stale output.

## Notes

`ppt/media/image4.png` — the news screenshot carrying a photograph of the Prime
Minister — is deliberately not used. S-03 typesets that headline instead, which
keeps the sheet in one visual language.
