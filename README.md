# Canvas Studio

Edit Canvas-style motion templates in your browser, preview them live, save them, and **export them as MP4 video**.
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
