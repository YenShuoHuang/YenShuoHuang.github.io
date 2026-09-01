# 0€ Souvenir Map

A dark-gold Leaflet map (same style as your Brussels Heritage Explorer) that
plots real official [0-Euro-Souvenir](https://en.wikipedia.org/wiki/Euro_souvenir_banknote)
banknote sale points — tourist attractions across Europe where you can buy
the collectible zero-euro note.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The map itself. Open it directly, or serve the folder. |
| `spots.json` | The data: name, city, lat/lon, Wikipedia link, and photo filename for each spot. |
| `images/` | Local photos, one per spot, named to match `spots.json`. Starts empty. |
| `fetch_photos.py` | Run this once to auto-fill `images/` from Wikipedia. |

## 1. Get the photos

I couldn't download real image files from inside my sandbox (no general
internet access there), so this is the one manual step. On your own machine:

```bash
cd euro_map
pip install requests
python fetch_photos.py
```

This reads each spot's Wikipedia page and saves a properly licensed photo
(usually CC-BY-SA or public domain from Wikimedia Commons) into `images/`
under the exact filename `spots.json` expects. Re-running it later is safe —
it skips files you already have, and lists any spot it couldn't find an
image for so you can add one by hand (Wikimedia Commons is the best source
to check the license on).

## 2. Check it locally

Because the page `fetch()`es `spots.json`, opening `index.html` straight
from disk will be blocked by the browser in some cases. Easiest fix — serve
the folder:

```bash
cd euro_map
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## 3. Publish it

Drop the whole `euro_map` folder into your
`YenShuoHuang.github.io` repo, commit, and push. It'll be live at:

```
https://yenshuohuang.github.io/euro_map/
```

## About the current data

The pilot batch in `spots.json` is **20 real Belgian locations**, sourced
from the official 0-Euro-Souvenir collector registry
(euro-souvenirscheine.de), which tracks every banknote issued and which
site sells it — the Atomium, Mini-Europe, Antwerp Cathedral, the historic
centre of Bruges, the Citadel of Dinant, Waterloo's Lion's Mound, and so on.

## Expanding to other countries

The same registry lists sale points for ~80 countries (France, Germany,
Netherlands, Italy, Spain…). To add a country, tell me which one and I'll
research and add the same verified name/city/coordinates entries to
`spots.json` — then just re-run `fetch_photos.py` to pick up photos for the
new entries.

## Why photos are linked, not scraped in bulk

Most 0-euro banknote *product photos* (the note itself) are copyrighted by
the printer/retailer. What `fetch_photos.py` grabs instead is a photo of
the **attraction itself** from Wikipedia/Commons, which carries a clear,
reusable license — safer for a public GitHub Pages site than redistributing
someone else's commercial photography.
