# Top Shelf

Interactive floorball tactical board for the browser. Drag and rotate player tokens on a regulation IFF rink, visualise shooting lines, and animate the goalkeeper to the ideal defensive position.

Available as a plain JavaScript class and as a React component.

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
| `layers` | `{ rink, zones }` | both `true` | Initial layer visibility |

### PlayerDef

```js
{ id: 'p1', x: 400, y: 250, label: 'LW' }
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier within the board |
| `x`, `y` | `number` | Initial position in SVG coordinates (viewBox 0 0 1200 700) |
| `label` | `string` | Text displayed on the token (optional) |
| `symbol` | `string` | Custom symbol ID suffix (optional) |

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

| Method | Description |
|---|---|
| `setLang(lang)` | Switch zone label language (`'en'` or `'de'`) |
| `setTokenSize(size)` | Resize all tokens (clamped to 20–100) |
| `setTeams(home, away)` | Update team colours; pass `undefined` to leave a side unchanged |
| `setPlayers(defs)` | Replace home team tokens; preserves positions of matching IDs |
| `setOpponents(defs)` | Replace away team tokens; preserves positions of matching IDs |
| `setLayer(name, visible)` | Show or hide a layer (`'rink'` or `'zones'`) |
| `setShootingLine(active)` | Toggle shooting line and triangle from ball to goal |
| `moveGoalieToIdealPosition(duration?)` | Animate the defending goalkeeper to the optimal position (requires shooting line active; default 700 ms) |
| `getState()` | Returns a snapshot of all token positions, lang, tokenSize, and shooting state |
| `setState(state)` | Restores a previously captured snapshot |
| `reset()` | Returns all tokens to their initial positions and hides the shooting line |
| `on(event, handler)` | Subscribe to an event |
| `off(event, handler)` | Unsubscribe from an event |
| `destroy()` | Remove the board from the DOM and clean up all event listeners |

All methods except `getState()` return `this` for chaining.

### Events

| Event | Payload | Fired when |
|---|---|---|
| `tokenMoved` | `{ id, x, y, angle }` | A token is dragged to a new position |
| `tokenRotated` | `{ id, angle }` | A token is clicked (rotates 45° per click) |
| `goalSwitched` | `{ target }` | The ball is clicked while shooting line is active, switching the target goal |

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
| `layers` | `{ rink?, zones? }` |
| `onTokenMoved` | `(payload) => void` |
| `onTokenRotated` | `(payload) => void` |
| `onGoalSwitched` | `(payload) => void` |
| `style` | `React.CSSProperties` |
| `className` | `string` |

---

## Zone labels

The zones overlay labels the tactical areas in front of the goal. Terms follow standard European coaching vocabulary.

| Zone | EN | DE |
|---|---|---|
| Wide area flanking the goal | Pocket | Tasche |
| Mid-range shooting area | High Slot | Hoher Slot |
| Close-range area at the crease | Low Slot | Naher Slot |
| Behind-goal playmaking area | Playmaker | Playmaker |

---

## Interaction model

| Action | Result |
|---|---|
| Drag a token | Move it to a new position |
| Click a token (no drag) | Rotate it 45° |
| Click the ball (shooting line active) | Switch the target goal |
| `moveGoalieToIdealPosition()` | Animate goalkeeper along the arc between goal line centre and ball |

Tokens are constrained to the SVG viewBox (0 0 1200 700) and cannot be dragged off the rink.

---

## Development

```
pnpm dev          # Start Vite dev server at localhost:5173
pnpm test         # Run Vitest in watch mode
pnpm test:run     # Run tests once (CI)
```

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

| Element | IFF term | Dimensions |
|---|---|---|
| Playing field | — | 1000 × 500 |
| Goal crease | Goal Crease | 100 × 125 |
| Small crease | Goalkeeper Area | 25 × 62.5 |
| Goal line distance from boards | — | 71.25 from left edge |
