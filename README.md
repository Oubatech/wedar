# wedar — Wedding table finder

A phone-first page for the person greeting guests at the door. Type a name (Arabic, Hebrew or English, any spelling), a family name, or a table number, and it shows the table, everyone seated there, and free seats. Works with no internet after the first visit.

## Files
- `data.js` — the seating list (edit this to change guests). Each row: `[partySize, "name as in sheet", "other spelling", ...]`.
- `hall.js` — table positions on the hall map.
- `search.js` — multilingual fuzzy search. `app.js` — the UI. `sw.js` — offline cache.

## Change the guest list
1. Edit `data.js`.
2. Run `node tests/run.js` (checks each table total against the sheet's printed total and runs search cases).
3. Bump `VERSION` in `sw.js` so phones pick up the new data.

## Run locally
```
python3 -m http.server 8000
```
Open http://localhost:8000.

## Use on the phone
Open the site once on good Wi-Fi, then Share → **Add to Home Screen**. The "✓ Works offline" label confirms it's cached.
