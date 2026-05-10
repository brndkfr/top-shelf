# Project conventions

## SVG element IDs

Every SVG element must have an `id` attribute. No anonymous elements.

ID naming follows official IFF terminology (Rules of the Game 2026) for structural elements:

| Concept | Correct term | Wrong term |
|---|---|---|
| Small rectangle in front of goal | `goalkeeper-area` | `crease-small`, `small-crease` |
| Where penalised players sit | `penalty-bench` | `penalty-box` |
| Marked spot at centre | `centre-spot` | `center-dot` |
| 4×5m rectangle in front of goal | `goal-crease` / `crease` | — |

Inside the board SVG, every element ID is prefixed with the instance UID (`${uid}-`) to avoid collisions when multiple boards are on the same page. Use the `_id(name)` / `_q(name)` helpers — never construct IDs manually in methods.

Goalie zone elements follow this hierarchy:
- `${uid}-goalie-zones` — outer toggle group
- `${uid}-zone-{name}` — one group per zone (e.g. `zone-awareness`)
- `${uid}-zone-{name}-fill` — the `<path>` element
- `${uid}-zone-{name}-label` — the `<text>` element

## Terminology

- **IFF official terms** for structural rink elements (goal crease, goalkeeper area, penalty bench, centre line, face-off spot, substitution zone).
- **Coaching / tactical vocabulary** for zone overlays (Pocket, High Slot, Low Slot, Playmaker, Awareness Zone). These are standard European floorball coaching terms, not IFF rulebook terms, and are intentional.
- Position abbreviations (G, LD, RD, C, LW, RW) are conventional and stay as-is.

## Testing

- Tests are co-located next to source files (`FloorballBoard.test.js` beside `FloorballBoard.js`).
- Shared test infrastructure lives in `test-setup.js` at the project root.
- Runner: Vitest + jsdom. SVG APIs not in jsdom are stubbed in `test-setup.js`.
- Run once: `pnpm test:run`. Watch mode: `pnpm test`.

## Git commits

Do not add `Co-Authored-By:` lines to commit messages.
