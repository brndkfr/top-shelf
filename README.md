# Top Shelf

Interactive floorball tactical board for the browser. Drag and rotate player tokens on a regulation IFF rink, visualise shooting lines, animate coaching scenarios, and draw play diagrams.

Available as a plain JavaScript class, as a React component, and as a hosted web app.

**Live demo:** https://brndkfr.github.io/top-shelf/

---

## Web app

The hosted app is a full-screen mobile-first coaching tool. A bottom tab bar gives access to four panels:

| Tab | Contents |
|---|---|
| **Scenes** | Load preset scenarios or scripted play animations |
| **Layers** | Toggle rink markings and goalie-zone overlays |
| **Tools** | Polygon editor, line tool, animation tool, zone editors |
| **Board** | Export positions, change language, resize tokens |

Tap a scenario to place teams; tap **Transition** to load a scripted multi-phase play with animated ball passing. The board fills the full screen on desktop and mobile, landscape and portrait.

---

## Quick start

### Vanilla JS

```js
import { FloorballBoard } from 'top-shelf';

const board = new FloorballBoard(document.getElementById('mount'));
```

### React

```jsx
import { FloorballBoard } from 'top-shelf/react';

function App() {
  return (
    <FloorballBoard
      lang="en"
      tokenSize={50}
      home={{ color: '#003871', accent: '#ffcc00' }}
      away={{ color: '#8b1a2a', accent: '#ffffff' }}
      onTokenMoved={({ id, x, y }) => console.log(id, x, y)}
    />
  );
}
```

The component fills the width of its container. Apply `style` or `className` to size it.

---

## Installation

```
pnpm add top-shelf
```

React is a peer dependency — install it separately if you use the React wrapper.

---

## Constructor options (Vanilla JS)

```js
new FloorballBoard(mountElement, options)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `lang` | `'en' \| 'de'` | `'en'` | Zone label language |
| `tokenSize` | `number` | `50` | Token diameter in SVG units (20–100) |
| `home` | `{ color, accent }` | blue / gold | Home team colours |
| `away` | `{ color, accent }` | red / white | Away team colours |
| `players` | `PlayerDef[]` | see below | Home team token definitions |
| `opponents` | `PlayerDef[]` | see below | Away team token definitions |
| `layers` | `object` | `{ rink: true, zones: true }` | Initial layer visibility |

### PlayerDef

```js
{ id: 'p1', x: 400, y: 250, label: 'LW' }
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier within the board |
| `x`, `y` | `number` | Initial position in SVG coordinates (viewBox 0 0 1200 700) |
| `label` | `string` | Text displayed on the token (optional) |
| `symbol` | `string` | Symbol ID for the token shape — `'sym-player-goalie'` or `'sym-opponent-goalie'` |

### Default positions

| Token | x | y | Label |
|---|---|---|---|
| Home goalkeeper | 90 | 250 | G |
| Home left defender | 280 | 155 | LD |
| Home right defender | 280 | 345 | RD |
| Home centre | 490 | 250 | C |
| Home left wing | 650 | 105 | LW |
| Home right wing | 650 | 395 | RW |
| Away goalkeeper | 920 | 250 | G |
| Away left defender | 730 | 155 | LD |
| Away right defender | 730 | 345 | RD |
| Away centre | 510 | 290 | C |
| Away left wing | 420 | 105 | LW |
| Away right wing | 420 | 395 | RW |

---

## API

### Methods

| Method | Returns | Description |
|---|---|---|
| `setLang(lang)` | `this` | Switch zone label language (`'en'` or `'de'`) |
| `setTokenSize(size)` | `this` | Resize all tokens (clamped to 20–100) |
| `setTeams(home, away)` | `this` | Update team colours; pass `undefined` to leave a side unchanged |
| `setPlayers(defs)` | `this` | Replace home team tokens; preserves positions of matching IDs |
| `setOpponents(defs)` | `this` | Replace away team tokens; preserves positions of matching IDs |
| `setLayer(name, visible)` | `this` | Show or hide a named layer (see Layers below) |
| `setShootingLine(active)` | `this` | Toggle shooting line and triangle from ball to goal |
| `moveGoalieToIdealPosition(duration?)` | `this` | Animate the defending goalkeeper to the optimal position (requires shooting line active; default 700 ms) |
| `loadScenario(name)` | `this` | Reset to a named preset scenario (see Scenarios below) |
| `getPositions()` | `{ players, opponents }` | Read current token positions as `{ id, label, symbol, x, y, angle }[]` |
| `animatePaths(paths, duration?)` | `Promise` | Animate tokens along waypoint paths simultaneously (default 3000 ms) |
| `stopAnimation()` | `this` | Cancel a running animation |
| `getState()` | `object` | Returns a snapshot of all token positions, lang, tokenSize, and shooting state |
| `setState(state)` | `this` | Restores a previously captured snapshot |
| `reset()` | `this` | Returns all tokens to their initial positions and hides the shooting line |
| `on(event, handler)` | `this` | Subscribe to an event |
| `off(event, handler)` | `this` | Unsubscribe from an event |
| `destroy()` | — | Remove the board from the DOM and clean up all event listeners |

### `animatePaths(paths, duration)`

Moves tokens simultaneously along multi-waypoint paths. Returns a `Promise` that resolves when the animation finishes.

```js
await board.animatePaths([
  { id: 'player-lw', waypoints: [{ x: 545, y: 215 }, { x: 1075, y: 140 }] },
  { id: 'player-c',  waypoints: [{ x: 400, y: 350 }, { x: 895, y: 350 }] },
], 1200);
```

### Layers

Pass any of these names to `setLayer(name, visible)`:

| Name | What it shows |
|---|---|
| `rink` | Rink surface, goal markings, and bench labels |
| `zones` | Tactical zone labels for the right goal (Pocket, High Slot, Low Slot, Playmaker) |
| `zones-left` | Same labels mirrored for the left goal |
| `zone-slot` | Goalkeeper slot zone — left goal |
| `zone-slot-right` | Goalkeeper slot zone — right goal |
| `zone-danger` | Danger zone overlay — left goal |
| `zone-danger-right` | Danger zone overlay — right goal |
| `zone-passing-first` | Pass-first zone overlay — left goal |
| `zone-passing-first-right` | Pass-first zone overlay — right goal |
| `zone-attention` | Attention zone (defending right-to-left) |
| `zone-attention-right` | Attention zone (defending left-to-right) |
| `zone-awareness` | Awareness zone — right goal |
| `zone-awareness-left` | Awareness zone — left goal |

### Scenarios

Pass any of these names to `loadScenario(name)`:

| Name | Description |
|---|---|
| `neutral` | Default open positions, no layers |
| `defensiv-212` | Home team in deep 2:1:2 box defending left goal |
| `forechecking` | Home team pressing in opponent's half |
| `triangle-attack` | Home team in offensive triangles attacking right goal |
| `corner-play` | S1 with ball in upper-right corner; C in slot; S2 far post |

### Events

| Event | Payload | Fired when |
|---|---|---|
| `tokenMoved` | `{ id, x, y, angle }` | A token is dragged to a new position |
| `tokenRotated` | `{ id, angle }` | A token is clicked (rotates 45° per click) |
| `goalSwitched` | `{ target }` | The ball is clicked while shooting line is active |

```js
board.on('tokenMoved', ({ id, x, y }) => {
  console.log(`${id} moved to ${Math.round(x)}, ${Math.round(y)}`);
});
```

### React props

All constructor options are accepted as props. Changes to `lang`, `tokenSize`, `home`, `away`, `players`, `opponents`, and `layers` are forwarded to the board instance without remounting. Wrap object/array props in `useMemo` to avoid unnecessary updates.

| Prop | Type |
|---|---|
| `lang` | `'en' \| 'de'` |
| `tokenSize` | `number` |
| `home` | `{ color, accent }` |
| `away` | `{ color, accent }` |
| `players` | `PlayerDef[]` |
| `opponents` | `PlayerDef[]` |
| `layers` | `object` |
| `onTokenMoved` | `(payload) => void` |
| `onTokenRotated` | `(payload) => void` |
| `onGoalSwitched` | `(payload) => void` |
| `style` | `React.CSSProperties` |
| `className` | `string` |

---

## Zone labels

The zones overlay labels tactical areas in front of the goal using standard European coaching vocabulary.

| Zone | EN | DE |
|---|---|---|
| Wide area flanking the goal | Pocket | Tasche |
| Mid-range shooting area | High Slot | Hoher Slot |
| Close-range area at the crease | Low Slot | Naher Slot |
| Behind-goal playmaking area | Playmaker | Playmaker |

Rink structure labels (Team Bench, Penalty Bench, Officials) follow IFF Rules of the Game 2026 terminology and are rendered in the selected language.

---

## Interaction model

| Action | Result |
|---|---|
| Drag a token | Move it to a new position |
| Click a token (no drag) | Rotate it 45° |
| Click the ball (shooting line active) | Switch the target goal |
| `moveGoalieToIdealPosition()` | Animate goalkeeper along the arc between goal line centre and ball |

Tokens are constrained to the SVG viewBox (0 0 1200 700) and cannot be dragged off the rink. Touch drag is fully supported; `touch-action: none` is applied to the SVG element.

---

## Development

```
pnpm dev          # Start Vite dev server at localhost:5173
pnpm test         # Run Vitest in watch mode
pnpm test:run     # Run tests once (CI)
```

Tests are co-located with source files (`FloorballBoard.test.js` beside `FloorballBoard.js`). The runner is Vitest + jsdom; SVG APIs missing from jsdom are stubbed in `test-setup.js`.

---

## Building

```
pnpm build        # Vanilla JS bundle  → dist/top-shelf.{esm,umd}.js
pnpm build:react  # React wrapper      → dist/top-shelf.react.{esm,umd}.js
```

### Package exports

```json
{
  ".":       { "import": "dist/top-shelf.esm.js",       "require": "dist/top-shelf.umd.js" },
  "./react": { "import": "dist/top-shelf.react.esm.js", "require": "dist/top-shelf.react.umd.js" }
}
```

React and react-dom are peer dependencies and are not included in the bundle.

---

## Conventions

### SVG element IDs

Every SVG element has an `id`. IDs follow official IFF terminology (Rules of the Game 2026) for structural elements — `goalkeeper-area`, `penalty-bench`, `goal-crease`, `centre-spot`, etc. Tactical zone names (Pocket, High Slot, Awareness Zone) use standard European coaching vocabulary and are intentionally not IFF rulebook terms.

Inside the board, all IDs are prefixed with an instance UID to support multiple boards on the same page.

---

## Rink specification

The SVG coordinate system maps the IFF standard court (40 m × 20 m) to a 1000 × 500 unit field, offset by 100 units on all sides within a 1200 × 700 viewBox.

Key measurements (in SVG units, scale 1 unit = 4 cm):

| Element | IFF term | Dimensions / position |
|---|---|---|
| Playing field | — | 1000 × 500, origin (100, 100) |
| Goal crease | Goal Crease | 100 × 125 |
| Goalkeeper area | Goalkeeper Area | 25 × 62.5 |
| Left goal line | — | x = 171.25 (SVG space) |
| Right goal line | — | x = 1028.75 (SVG space) |
| Centre | — | x = 600, y = 350 |
