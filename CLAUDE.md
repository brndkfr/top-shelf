# Project conventions

## Writing code
Before writing code, explain the approach and edge cases.

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
- `${uid}-zone-{name}-fill` — the `<path>` or `<rect>` element
- `${uid}-zone-{name}-label` — the `<text>` element

## Terminology

- **IFF official terms** for structural rink elements (goal crease, goalkeeper area, penalty bench, centre line, face-off spot, substitution zone).
- **Coaching / tactical vocabulary** for zone overlays (Pocket, High Slot, Low Slot, Playmaker, Awareness Zone). These are standard European floorball coaching terms, not IFF rulebook terms, and are intentional.
- Position abbreviations (G, LD, RD, C, LW, RW) are conventional and stay as-is.

## SVG coordinate system

- ViewBox: `0 0 1200 700`. The field group has `transform="translate(100,100)"`.
- Field inner surface: x = 100–1100, y = 100–600 in main SVG space.
- Left goal line: x ≈ 171.25. Right goal line: x ≈ 1028.75. Centre: x = 600, y = 350.
- Token positions (`data-x`, `data-y`) are in **main SVG space** (not the field group's local coordinates).
- `toSvgPt(svg, clientX, clientY)` — converts screen coordinates to SVG coordinates using `createSVGPoint()` + `getScreenCTM().inverse()`. Use this for all click/touch coordinate conversions.

## Layers

`setLayer(name, visible)` accepts these names:

`rink`, `zones`, `zones-left`, `zone-slot`, `zone-slot-right`, `zone-danger`, `zone-danger-right`, `zone-passing-first`, `zone-passing-first-right`, `zone-attention`, `zone-attention-right`, `zone-awareness`, `zone-awareness-left`

## Scenarios (`src/core/scenarios.js`)

`SCENARIOS` keys: `neutral`, `defensiv-212`, `forechecking`, `triangle-attack`, `corner-play`.

Each scenario has `layers` (map of layer name → boolean), `players[]`, and `opponents[]`. `loadScenario(name)` applies the layers, positions, and calls `reset()`.

The goalie constants (`HOME_G`, `AWAY_G`) position goalies just inside the goal line at x = 175 / 1025.

## Rink labels (`src/core/constants.js`)

`RINK_LABELS` — array of `{ x, y, labels: { en, de } }` for bench and officials text. Rendered dynamically by `_renderRinkLabels()` in `FloorballBoard.js` using the same pattern as `_fillZoneLabels()`. The source SVG (`src/assets/rink.svg`) contains no text elements for these labels.

## Animation API (`src/core/FloorballBoard.js`)

- `animatePaths(paths, duration = 3000)` — moves tokens simultaneously along waypoint arrays. `paths` is `[{ id, waypoints: [{x,y}] }]`. Returns a `Promise` that resolves on completion. Uses `lerpWaypoints()` (module-level helper) and `requestAnimationFrame`.
- `stopAnimation()` — cancels the running rAF loop.
- `lerpWaypoints(waypoints, t)` — module-level; interpolates a position along a multi-segment path at progress `t ∈ [0,1]`.
- `getPositions()` — reads all token DOM elements via `data-tid`, `data-x`, `data-y`, `data-angle`; returns `{ players: [...], opponents: [...] }`.

## Animation tool (in `index.html`)

The animation tool state lives in `animTool`:

```js
const animTool = {
  active: false,
  selected: null,
  paths: new Map(),          // tid → { waypoints: [{x,y}], type }
  startPositions: null,      // snapshot at tool activation
  group: null,               // <g id="anim-tool-group"> appended to SVG
  overlay: null,             // transparent rect capturing clicks
  playing: false,
  scriptedScene: null,       // set when a scripted scene is loaded
  scriptedPlay: null,        // async fn replacing normal Play behaviour
};
```

`renderAnimPaths()` removes all `.anim-path-el` elements from `animTool.group` and redraws arrows + selection ring. Elements classed `scripted-overlay` are left untouched by `renderAnimPaths()`.

Hit detection under the overlay uses `document.elementsFromPoint` + `.closest('[data-tid]')` (not `e.target`) because the overlay rect sits on top.

## Scripted scenes (in `index.html`)

A scripted scene pre-populates `animTool` with fixed paths, a ball element, pass arrows, and a target polygon, then replaces the Play button's normal behaviour.

Key elements and their CSS classes:

| Element | Class | Behaviour |
|---|---|---|
| Movement arrows, pass lines | `anim-path-el` | Cleared by `renderAnimPaths()` |
| Ball circle, triangle polygon | `scripted-overlay` | Persist through `renderAnimPaths()` calls |

`loadScriptedScene(scene)` workflow:
1. `board.loadScenario(scene.scenario)` — set starting positions
2. Deactivate + re-activate `animTool` — captures start positions cleanly
3. Pre-populate `animTool.paths` from `scene.paths`
4. Append ball circle, pass lines, triangle polygon to `animTool.group`
5. Store `animTool.scriptedScene = scene` and `animTool.scriptedPlay = async fn`
6. Call `renderAnimPaths()` to show movement arrows immediately

`deactivateAnimTool()` must clear both `animTool.scriptedScene` and `animTool.scriptedPlay`.

The play button checks `animTool.scriptedPlay` first; the reset button re-calls `loadScriptedScene(animTool.scriptedScene)` for a clean reload.

`animateCircle(el, x1, y1, x2, y2, ms)` — animates a circle's `cx`/`cy` with `requestAnimationFrame`; returns a `Promise`. Used for ball animation.

`ensurePassArrow(svg)` — adds `#pass-arrow` marker (yellow fill) to `<defs>`. Complements `ensureLineArrow(svg)` which adds the cyan `#line-tool-arrow`.

## UI architecture (in `index.html`)

- `#mount` — board container, `flex: 1`, fills available height
- `.tab-bar` — fixed bottom nav, 4 tabs: Scenes / Layers / Tools / Board
- `.sheet` — slide-up panels activated by tabs; `transform: translateY(100%)` → `translateY(0)` when `.open`
- `#editor-bar` — floating pill fixed at top-centre; shown when any tool is active
- `.sbtn` — base class for all sheet buttons. Colour classes: `btn-layer`, `btn-anim`, `btn-shoot`, `btn-poly`, `btn-line`, `btn-editor`, `btn-capture`, `btn-lang`, `btn-reset`
- `.tbar-btn` — tool bar action buttons inside `#editor-bar`
- `openSheet(name)` / `closeSheet()` — manage active sheet and tab highlight state
- `$('id')` — shorthand for `document.getElementById`

## Touch support

- `touch-action: none` is set inline on the board SVG element in `FloorballBoard.js`.
- `touchmove` is listened on `window` (not the SVG) to avoid losing events when the finger slides off the element edge.

## Testing

- Tests are co-located next to source files (`FloorballBoard.test.js` beside `FloorballBoard.js`).
- Shared test infrastructure lives in `test-setup.js` at the project root.
- Runner: Vitest + jsdom. SVG APIs not in jsdom are stubbed in `test-setup.js`.
- Run once: `pnpm test:run`. Watch mode: `pnpm test`.

## Git commits

Do not add `Co-Authored-By:` lines to commit messages.
