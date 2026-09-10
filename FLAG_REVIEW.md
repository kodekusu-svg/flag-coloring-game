# Flag accuracy review policy

This project is an educational flag-colouring game. A flag must not be included in the quiz merely because an approximate drawing exists in the repository.

## Release rule

A flag is eligible for questions only after all of the following have been checked:

1. **Current national flag** — confirm that the design is the currently used national flag, not a historical, civil/state-only, or obsolete variant unless that distinction is intentionally documented.
2. **Aspect ratio** — confirm the official or authoritative flag proportions. The current painting renderer uses a 3:2 canvas, so only flags whose reviewed representation is valid at 3:2 may be enabled until variable-ratio rendering is implemented.
3. **Geometry** — stripes, crosses, discs, stars, triangles, emblems and their positions/sizes must match a trustworthy reference. Decorative or identity-defining details must not be omitted.
4. **Colours** — use official colour specifications where available. Otherwise use a trustworthy current reference SVG and record that source.
5. **Reference comparison** — compare the in-game sample against a trustworthy current SVG (prefer national government specifications; otherwise a carefully maintained Wikimedia-derived source).
6. **Painting regions** — grouping regions for play is allowed only when it does not change the visible flag. Simplifying the visible design is not allowed.
7. **Complex flags** — if accurate reproduction would be fragile or excessively complex, exclude the flag from the quiz rather than approximate it.

## Current safety gate

`game.js` contains `REVIEWED_FLAG_IDS`. Only IDs in that allow-list can be selected by the game. Unreviewed entries may remain in data files for development, but they are not question candidates.

The allow-list is intentionally conservative and currently favors structurally simple 3:2 flags. Previously simplified entries such as South Korea are not eligible until a stricter geometry review is completed.

## Reference priority

1. National government / law / official specification
2. Wikimedia Commons file backed by an official specification
3. A maintained accuracy-focused SVG flag collection derived from Wikimedia and national specifications, such as `hampusborgos/country-flags`

Any disagreement between sources should block that flag from release until resolved.
