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

- `animatePaths(paths, duration = 3000)` — moves tokens simultaneously along waypoint arrays. `paths` is `[{ id, waypoints: [{x,y}] }]`. Returns a `gsap.Timeline` (thenable — `await board.animatePaths(...)` and `.then()` both work). Uses `lerpWaypoints()` (module-level helper).
- `stopAnimation()` — kills the running gsap timeline.
- All motion goes through GSAP (added in Phase A2). `animateToken()` in `src/core/animation.js` tweens a `{x, y, angle}` proxy; scripted scenes build a `gsap.timeline()` stored on `animTool.timeline` with phase labels (`phase-0`, `phase-1`, …).
- `lerpWaypoints(waypoints, t)` — module-level; interpolates a position along a multi-segment path at progress `t ∈ [0,1]`.
- `getPositions()` — reads all token DOM elements via `data-tid`, `data-x`, `data-y`, `data-angle`; returns `{ players: [...], opponents: [...] }`.
- `rotateTokenTo(id, deg, ms = 250)` — gsap tween of a token's angle along the shortest arc; returns the `gsap.Tween` (or `null` if id not found) so it can be `tl.add(...)`-ed into a scene timeline.
- `findNearestPlayer(x, y, maxDist = 80)` — returns `{ id, dist }` of the closest player token within `maxDist`, else `null`. Used by scripted-play to identify the passer at each ball phase.
- `trackGoalieToBall(bx, by, smoothing = 0.18)` — Winkelspiel: exponentially lerps the defending goalie (`opponent-g` for right-shooting, `player-g` for left) toward the ideal position computed by `_calcIdealGoaliePos`. Called per-frame from the scripted ball tween; no gsap tween — direct lerp avoids tween thrashing. Independent of `_shootingActive` (drill-only behavior). Offset is distance-aware via `idealGoalieOffset(dist)` in [src/core/constants.js](src/core/constants.js): 25 close → 80 far, linear ramp 200–500.
- `moveBallTo(x, y)` — write `data-x`/`data-y` on the ball `<g>` and re-apply its transform; auto-calls `_updateShootingLine()` when `_shootingActive`. This is the per-frame target of the scripted ball tween.
- `getBallPosition()` — returns `{ x, y }` from the ball's dataset, or `null` if the ball element is missing.
- `updateShootingLine()` — public passthrough that runs `_updateShootingLine()` only when shooting line is active.

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
  scriptedPlay: null,        // fn replacing the Play button for scripted scenes
  timeline: null,            // gsap.Timeline built by scriptedPlay
  speed: 1,                  // playback speed (1 / 2 / 0.5)
  paused: false,             // current pause state
  scrubbing: false,          // true while the user drags the scrub slider
};
```

### Playback controls (scripted scenes only)

Buttons in the editor bar are shown by `loadScriptedScene` and hidden by `deactivateAnimTool`:

| Control | Element id | Action on `animTool.timeline` |
|---|---|---|
| Play | `btn-anim-play` | (re)creates the timeline via `scriptedPlay` and starts it |
| Pause / Resume | `btn-anim-pause` | `tl.pause()` / `tl.resume()`; flips `animTool.paused` and the button label |
| Step | `btn-anim-step` | Pause, then `tl.seek(nextPhaseLabel)` using the `phase-N` labels added during build |
| Speed | `btn-anim-speed` | Cycles `[1, 2, 0.5]`; live-applies `tl.timeScale(speed)` |
| Scrub slider | `anim-scrub` | On `input` pauses + `tl.progress(value / 1000)`; on `change` clears `animTool.scrubbing` |
| Reset | `btn-anim-reset` | Kills the timeline, clears `paused` + scrub, re-runs `loadScriptedScene` |

`scriptedPlay` attaches `onUpdate` to keep the slider in sync (when not scrubbing), and `onComplete` to restore Play / Pause labels and slider position.

`renderAnimPaths()` removes all `.anim-path-el` elements from `animTool.group` and redraws arrows + selection ring. Elements classed `scripted-overlay` are left untouched by `renderAnimPaths()`.

Hit detection under the overlay uses `document.elementsFromPoint` + `.closest('[data-tid]')` (not `e.target`) because the overlay rect sits on top.

## Scripted scenes (in `index.html`)

A scripted scene pre-populates `animTool` with fixed paths, a ball element, pass arrows, and a target polygon, then replaces the Play button's normal behaviour.

Key elements and their CSS classes:

| Element | Class | Behaviour |
|---|---|---|
| Movement arrows, pass lines | `anim-path-el` | Cleared by `renderAnimPaths()` |
| Triangle polygon | `scripted-overlay` | Persists through `renderAnimPaths()` calls |

The scripted ball is the real green board ball (`${uid}-ball`), positioned via `board.moveBallTo()` — there is no separate overlay circle.

`loadScriptedScene(scene)` workflow:
1. `board.loadScenario(scene.scenario)` — set starting positions
2. Deactivate + re-activate `animTool` — captures start positions cleanly
3. Pre-populate `animTool.paths` from `scene.paths`
4. Place the real ball at `scene.ballStart` via `board.moveBallTo`; append pass lines + triangle polygon to `animTool.group`
5. Store `animTool.scriptedScene = scene` and `animTool.scriptedPlay = fn` that builds a `gsap.timeline()`
6. Show playback controls; call `renderAnimPaths()` to show movement arrows immediately

`deactivateAnimTool()` must clear `animTool.scriptedScene`, `animTool.scriptedPlay`, and kill `animTool.timeline`.

The play button checks `animTool.scriptedPlay` first; the reset button re-calls `loadScriptedScene(animTool.scriptedScene)` for a clean reload.

The scripted ball is driven by a gsap-tweened `{ x, y }` proxy whose `onUpdate` calls `board.moveBallTo(...)` and `board.trackGoalieToBall(...)` every frame. Each phase gets a `phase-N` label on the timeline so Step / Scrub can navigate it. The last phase also adds the players' `animatePaths` sub-timeline at its label so player movement starts when the final pass begins.

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

## Documentation

Do not use the character — in generated text. If you must use - 
