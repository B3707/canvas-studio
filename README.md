# Video Skills Studio

One website, one studio per skill. Each studio has its own look and its own templates. Edit a template in the browser, preview it live, save it, and **export it as MP4 video**.

| Page | Skill | Templates |
|---|---|---|
| `/` | Hub that links the skills | |
| `/canvas/` | Canvas (16:9 or 9:16 explainer graphics) | 13 |
| `/skylight/` | Skylight (9:16 podcast-clip graphics) | 8 |
Runs two ways: **locally** (`npm start`, Chrome renders the video) or **hosted on Vercel** (the visitor's own browser renders the video).

## Setup (once)
1. Install **Node.js 18+** (nodejs.org) and **Google Chrome** (Edge or Chromium also work).
2. In this folder run:  `npm install`
   (this also bundles ffmpeg; if that step is skipped, install ffmpeg yourself and put it on your PATH)

## Run
`npm start`  then open http://localhost:5173

## Use
- Pick a template, edit the fields on the left, scrub the timeline.
- **Style & export** controls: duration, animation speed, entrance style (blur / rise / fade / pop), font, overall scale, custom background and text colour, paper grain, vignette, frame rate (24/30/60), export size (720p / 1080p), 16:9 or 9:16.
- **Export MP4** renders every frame in Chrome and stitches them with ffmpeg. The file downloads and is also kept in `exports/`.
- **Save template** writes a `.json` file into `templates/`. Commit that folder to GitHub to keep your templates.

## Troubleshooting
- **"Failed to fetch" / "Can't reach the local server"**: open the editor at http://localhost:5173 (not by double-clicking `index.html`), and keep the terminal running `npm start` open. If the terminal shows an error, that is the real cause.
- **"ffmpeg is not working"**: run `npm install` again, or install ffmpeg yourself and run with `FFMPEG_PATH` set to it.
- "Chrome not found": set `CHROME_PATH` to your browser's executable, e.g.
  Mac: `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm start`
- Fonts (Inter, Playfair, Space Grotesk, DM Serif) load from Google Fonts when online; offline they fall back to system fonts.
- The server only listens on your own machine (127.0.0.1).

## Files
- `server.js`          static server, save/list API, MP4 renderer
- `public/index.html`  the editor (13 designs, see below)
- `templates/`         your saved templates     `exports/`  your rendered videos

## Designs
Caption, Quote on blue, Versus card, Bar chart, Icon flow, Checklist, Donut, Tile grid, Climbing graph, Blue line, Counter, Roadmap, Line chart.
Icon flow and Tile grid take lines like `scissors | Cut | silences gone` (49 Lucide icons from the Canvas kit; the list is shown under the field).

## Deploy to Vercel
The `public/` folder is the whole site. No build step, no server code runs on Vercel.

**Option A: GitHub (recommended)**
1. Create a GitHub repo and push this folder:
   `git init && git add . && git commit -m "Canvas Studio" && git branch -M main`
   `git remote add origin https://github.com/YOUR-NAME/canvas-studio.git && git push -u origin main`
2. Go to vercel.com/new, import the repo, leave all settings as they are (`vercel.json` already sets them), click Deploy.
3. Every `git push` redeploys.

**Option B: CLI**  `npx vercel` in this folder, then `npx vercel --prod`.

## Local vs hosted
| | Local (`npm start`) | Vercel |
|---|---|---|
| Editor, live preview, 13 designs | yes | yes |
| Save templates | files in `templates/` | in your browser (+ Download/Import JSON) |
| MP4 export | Chrome + ffmpeg on your computer | in the browser (desktop Chrome / Edge) |
Browser export needs a browser with WebCodecs (desktop Chrome or Edge). Safari and Firefox may not work. Rendering happens on the visitor's computer, so it costs you nothing to host.

## How it is organised
- `public/shared/`   the engine every skill uses: preview, editor, MP4 export, saving (`studio.js`, `studio.css`, `lib.js`)
- `public/skills/`   one file per skill: its templates, fonts and look (`canvas.js`, `skylight.js`)
- `public/<skill>/index.html`   a thin page for that skill
- `public/fonts/`    self-hosted fonts (OFL licences included)

## Add another skill
1. Copy `public/skills/skylight.js` to `public/skills/<name>.js` and replace the templates (keep the `SKILL` object at the bottom).
2. Copy `public/skylight/index.html` to `public/<name>/index.html` and change the title and the `<script src="/skills/...">` line.
3. Add an entry to `SKILLS_INDEX` at the top of `public/shared/lib.js`. The hub and the nav pick it up.

## What a skill's templates cover (and don't)
Templates cover the visual abilities that can run in a browser. Skylight's podcast download, transcript, clip picking and face-tracked reframing need the local pipeline (Claude Code), so they are not templates here. The speaker in Skylight's `a-roll` scene is a placeholder silhouette.
