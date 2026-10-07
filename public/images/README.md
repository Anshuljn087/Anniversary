# Your photos go here

Drop a photo into the matching folder below with the **exact filename** shown,
and it replaces the placeholder on the site automatically — no code changes
needed, just refresh the page (or redeploy if it's already live).

Any normal photo works. Roughly 1600px on the long edge is plenty; the site
crops/frames each one to fit, so don't worry about exact dimensions.

| Folder | Filename(s) needed | Used in |
|---|---|---|
| `cafe-dates/` | `photo.jpg` | Chapter 1 — café napkin reveal |
| `pre-wedding-getaways/` | `samskara-resort.jpg`, `achrol-niwas.jpg`, `royal-orchid.jpg` | Chapter 2 — resort keycards |
| `night-drives/` | `photo.jpg` | Chapter 3 — headlights / night highway |
| `the-sagai/` | `photo.jpg` | Chapter 4 — ring box reveal |
| `the-shaadi/` | `the-mandap.jpg`, `the-pheras.jpg`, `the-celebration.jpg` | Chapter 5 — rotating wedding carousel |
| `golden-night/` | `photo.jpg` | Chapter 6 — brightness dimmer |
| `thailand-honeymoon/` | `photo-1.jpg` … `photo-5.jpg` | Chapter 7 — passport-stamp photo carousel |
| `travel-odyssey/` | `kolkata.jpg`, `goa.jpg`, `kundalpur.jpg` | Chapter 8 — flip postcards |
| `room-warmth/` | `photo.jpg` | Chapter 9 — fairy lights / photobooth strip |
| `special-memories/` | `photo.jpg` | Chapter 10 — birthday cake reveal |
| `grand-finale/` | `photo.jpg` | Chapter 11 — anniversary finale |

If a filename is missing, the site just shows a soft "our photo" placeholder
in that spot instead of breaking — so you can add these gradually.

File extension must be `.jpg` to match what's wired up in
`src/data/journey.ts`. If you'd rather use `.png` or `.webp`, update the
`src` path for that chapter in that file to match.
