# wedar — Wedding table finder

A phone-first page for the person greeting guests at the door. Type a name (Arabic, Hebrew or English, any spelling), a family name, or a table number, and it shows the table, everyone seated there, and free seats. Works with no internet after the first visit.

## Where the data comes from
The only source of truth is the two mit4mit exports in `source/`:
- `source/invitees.csv` — the invitee list. The count shown for each guest is the confirmed column ("אורחים שאישרו"). Phone numbers are removed before saving here, because this repo is public.
- `source/seating.csv` — the seating plan. It decides which table each guest sits at.

`tools/build_data.py` reads both files and writes `data.js`. Do not edit `data.js` by hand.
`aliases.json` holds the Arabic, Hebrew and English spellings for each name, so search works across languages.

## Update the guest list
1. Export both files again from mit4mit as CSV. Delete the phone column from the invitee file.
2. Replace the two files in `source/`, keeping the same names.
3. Run:
   ```
   python3 tools/build_data.py
   node tests/run.js
   ```
   The build prints guests with no table, guests who confirmed 0, count differences and over-full tables. It also warns about names missing from `aliases.json`. Add those names there, then run it again.
4. Bump `VERSION` in `sw.js`, then commit and push. Phones get the new list the next time they are online.

## Files
- `search.js` — multilingual fuzzy search. `app.js` — the UI. `hall.js` — table positions on the map. `sw.js` — offline cache.

## Run locally
```
python3 -m http.server 8000
```
Open http://localhost:8000.

## Use on the phone
Open the site once on good Wi-Fi, then Share → **Add to Home Screen**. The "✓ Works offline" label confirms it's cached.
