# The Digital Coach

## Project Context

The objective is a system where a user feeds in a drill (description or image) and the board generates a fluid, mathematically accurate animation that also looks good and has clean ball flow.

Two intelligence modules sit on top of the drill engine:

- **Goalie Intelligence** — *Winkelspiel* (angle play): the goalie aligns with the shot line between ball and goal centre, and adjusts depth based on ball distance.
- **Player Intelligence** — the ball carrier faces the next receiver; passers, receivers, and shooters rotate naturally during scripted play; shot lines and pass lines update live as the ball moves.

The board already supports a player-centric drill library (7 scripted scenes). The work below upgrades the engine and adds the goalie intelligence.

---

## Phase 1: Foundation — Coordinate System & IDs

The "world" is already defined. Build against the real numbers, not the placeholders in earlier drafts.

### ViewBox & units

| Item | Value |
|---|---|
| SVG viewBox | `0 0 1200 700` |
| Field group transform | `translate(100, 100)` |
| Inner playing surface | x = 100–1100, y = 100–600 |
| IFF court mapped | 40 m × 20 m → 1000 × 500 units |
| **Scale** | **1 unit = 4 cm (25 units / m)** |

### Key landmarks (from `src/core/constants.js`)

| Landmark | Position |
|---|---|
| Left goal line centre | (171.25, 350) |
| Right goal line centre | (1028.75, 350) |
| Left goal posts | (171.25, 330) and (171.25, 370) |
| Right goal posts | (1028.75, 330) and (1028.75, 370) |
| Centre | (600, 350) |

### Element IDs

Every SVG element has an `id`. Inside the board every ID is prefixed with the board instance UID (`${uid}-…`). Use the `_id()` / `_q()` helpers in `FloorballBoard.js` — never hand-build IDs.

Persistent IDs available to drill scripts:

- `${uid}-ball` — the orange floorball
- `${uid}-player-*`, `${uid}-opponent-*` — team tokens (configurable via `players` / `opponents` constructor options)
- `${uid}-cone-*` — neutral marker tokens (`addCone()`)
- `${uid}-shooting-line` — dashed line from ball to goal (active when `setShootingLine(true)`)
- `${uid}-shooting-triangle` — shaded coverage triangle between ball and goal posts

Naming follows IFF *Rules of the Game 2026* for structural elements (`goal-crease`, `goalkeeper-area`, `penalty-bench`, `centre-spot`). Tactical zone names (Pocket, High Slot, Awareness Zone) use European coaching vocabulary and are intentionally not IFF rulebook terms.

### State sync

Animations write `data-x`, `data-y`, `data-angle` on each frame, so the Vue/JS data state is always current. `getState()` / `setState()` snapshot the full board (positions, lang, tokenSize, shooting state).

---

## Phase 2: The Animation Engine (GSAP)

Adopt GSAP as the single motion primitive. The current custom rAF in `animation.js` / `animateCircle()` is replaced by `gsap.to()` and `gsap.timeline()`.

### Timeline architecture

One `gsap.timeline()` per scripted scene. Each `ballPhase` becomes a labelled position; player paths and pass arrows are parallel tweens added with `tl.to(..., '<')` or at a phase label. The timeline is stored on `animTool.timeline` so playback controls (Phase 5) can drive it.

### The shot-line observer

While the shooting line is active, the ball tween's `onUpdate` calls `board.updateShootingLineTo(ball.cx, ball.cy)` — the dashed line and shooting triangle track the ball through every pass and shot. Stroke colour matches the ball's fill (orange).

### Token rotation

Public helper `rotateTokenTo(id, deg, ms)` wraps a GSAP tween on the token's angle. Rotation math:

$$\theta = \arctan2(y_{\text{target}} - y_{\text{token}},\ x_{\text{target}} - x_{\text{token}}) \times \frac{180}{\pi}$$

Used by both player and goalie intelligence modules.

---

## Phase 3: Goalie Intelligence (Winkelspiel)

Automating the green/grey zones from coaching materials.

### Angle closure

The goalie sits on the line between the goal-line centre and the ball — that's already what `_calcIdealGoaliePos()` computes. The new behaviour is that the goalie *tracks* the ball during scripted animation, not just when the user calls `moveGoalieToIdealPosition()`.

A throttled `trackGoalieToBall(ballX, ballY, ms)` is called from the ball tween's `onUpdate` (every ~50 ms) when the defending-side goalie is on the field.

### Dynamic depth — `idealGoalieOffset(ballDist)`

Replaces the fixed `GOALIE_STAND_OFFSET = 65`:

| Ball distance | Goalie offset from goal line |
|---|---|
| Close — < 200 units (≈ 8 m) | 25 — stay deep |
| Mid — 200–500 units | Linear ramp 25 → 80 |
| Far — > 500 units | 80 — challenge the shooter |

### Save-area width

Future work (see Phase 6). Requires reshaping `GOALIE_CAGE` based on a "set vs reacting" state machine — not in this iteration.

---

## Phase 4: Player Intelligence

The companion module to Phase 3, used by every drill in the library.

### Auto-face-the-ball

At each `ballPhase` boundary on the scene timeline:

- The current ball owner rotates toward the phase end-point (i.e. faces the next receiver) before the pass starts.
- The new owner can rotate toward the next target as soon as they receive.

Driven by `rotateTokenTo()` tweens added alongside the ball tween at each phase label.

### Pass-line preview

Pass arrows (`#pass-arrow` marker on dashed lines) are already drawn for each scripted phase. Future enhancement: fade them in/out in step with the corresponding ball tween via timeline labels.

### Live shot-line

See Phase 2 — the shot-line and shooting triangle update during scripted ball motion, not just on manual drag. Useful in non-goalie drills as a "threat-line" visualisation.

---

## Phase 5: UI & Playback Controls

All controls are thin wrappers over the scene's `gsap.timeline()`.

| Feature | Implementation |
|---|---|
| **Play / Reset** | Existing buttons; Play runs `tl.restart()`; Reset re-applies the scene |
| **Speed** (0.5× / 1× / 2×) | `tl.timeScale(speed)` — live, mid-play |
| **Pause / Resume** | `tl.pause()` / `tl.resume()` |
| **Step** (phase-by-phase) | `tl.seek(nextLabel)` using labels added per `ballPhase` |
| **Scrub slider** | Range input bound to `tl.progress(v / 100)` |
| **Drill Library** | The existing Scenes sheet — extend with categories / metadata, no separate page needed |

---

## Phase 6: Future Work

Out of scope for the current iteration, kept here as a roadmap:

- **LLM image-to-JSON pipeline** — upload a drill diagram (with ghosted player positions), have the model emit a scene object (`players`, `opponents`, `ballStart`, `ballPhases`, `paths`, `passLines`). Translates "Trainer German" ("Goalie verkürzt den Winkel") into engine input.
- **Goalie save-area width animation** — reshape `GOALIE_CAGE` based on set vs reacting state.
- **Save / load custom scenarios** in localStorage with a UI (the API exists via `getState` / `setState`).
- **Free-text annotation tool** on the field.
- **Per-token role / colour switch** (attacker becomes defender mid-drill) — required for chained transition drills like Swiss Way Brésil.

— -