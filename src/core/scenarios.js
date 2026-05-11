import { DEFAULT_PLAYERS, DEFAULT_OPPONENTS } from './constants.js';

// Home goal line: x≈171 (left). Away goal line: x≈1029 (right).
// Field inner surface: x≈115–1085, y≈115–585.
// Goalie resting position: just behind the goal line on their side.
const HOME_G  = { id: 'player-g',   label: 'G', symbol: 'sym-player-goalie',   x: 175,  y: 350 };
const AWAY_G  = { id: 'opponent-g', label: 'G', symbol: 'sym-opponent-goalie', x: 1025, y: 350 };

export const SCENARIOS = {
  'neutral': {
    layers:    { rink: true },
    players:   DEFAULT_PLAYERS,
    opponents: DEFAULT_OPPONENTS,
  },

  // Deep 2:1:2 box — compact dice formation defending the left goal.
  // Upper player in each pair is ~35 px more forward (toward midfield) than
  // the lower player; this diagonal stagger closes the horizontal passing lanes.
  //
  //   V1 (fwd) ·              S1 (fwd) ·
  //             · V2 (deep)             · S2 (deep)
  //        C ·
  'defensiv-212': {
    layers: { rink: true, 'zone-slot': true },
    players: [
      HOME_G,
      { id: 'player-ld', label: 'V1', x: 295, y: 215 },
      { id: 'player-rd', label: 'V2', x: 260, y: 485 },
      { id: 'player-c',  label: 'C',  x: 400, y: 350 },
      { id: 'player-lw', label: 'S1', x: 545, y: 215 },
      { id: 'player-rw', label: 'S2', x: 510, y: 485 },
    ],
    opponents: [
      AWAY_G,
      { id: 'opponent-ld', label: 'V1', x:  860, y: 170 },
      { id: 'opponent-rd', label: 'V2', x:  860, y: 530 },
      { id: 'opponent-c',  label: 'C',  x:  715, y: 350 },
      { id: 'opponent-lw', label: 'A1', x:  645, y: 155 },
      { id: 'opponent-rw', label: 'A2', x:  645, y: 545 },
    ],
  },

  // Forechecking — pressing in opponent's half.
  // S1 (Steuerflügel) approaches in an arc toward center at opponent-defender height.
  // S2 covers the next likely receiver. C lurks past the centre line.
  // V1/V2 stay compact near midfield — do NOT push too far forward.
  'forechecking': {
    layers: { rink: true },
    players: [
      HOME_G,
      { id: 'player-ld', label: 'V1', x: 450, y: 220 },
      { id: 'player-rd', label: 'V2', x: 450, y: 480 },
      { id: 'player-c',  label: 'C',  x: 650, y: 350 },
      { id: 'player-lw', label: 'S1', x: 875, y: 255 },
      { id: 'player-rw', label: 'S2', x: 800, y: 470 },
    ],
    opponents: [
      AWAY_G,
      { id: 'opponent-ld', label: 'V1', x:  900, y: 165 },
      { id: 'opponent-rd', label: 'V2', x:  900, y: 535 },
      { id: 'opponent-c',  label: 'C',  x:  750, y: 350 },
      { id: 'opponent-lw', label: 'A1', x:  750, y: 165 },
      { id: 'opponent-rw', label: 'A2', x:  750, y: 535 },
    ],
  },

  // Offensive triangles — attacking the right goal.
  // S1/S2 wide on the flanks; C at the pivot (Drehscheibe); V1/V2 support moderately.
  'triangle-attack': {
    layers: { rink: true, 'zone-slot-right': true },
    players: [
      HOME_G,
      { id: 'player-ld', label: 'V1', x: 430, y: 220 },
      { id: 'player-rd', label: 'V2', x: 430, y: 480 },
      { id: 'player-c',  label: 'C',  x: 720, y: 350 },
      { id: 'player-lw', label: 'S1', x: 855, y: 170 },
      { id: 'player-rw', label: 'S2', x: 855, y: 530 },
    ],
    opponents: [
      AWAY_G,
      { id: 'opponent-ld', label: 'V1', x:  920, y: 215 },
      { id: 'opponent-rd', label: 'V2', x:  920, y: 485 },
      { id: 'opponent-c',  label: 'C',  x:  800, y: 350 },
      { id: 'opponent-lw', label: 'A1', x:  700, y: 215 },
      { id: 'opponent-rw', label: 'A2', x:  700, y: 485 },
    ],
  },

  // Corner play — S1 with the ball in the upper-right corner.
  // C occupies the slot in front of the right goal (always!).
  // S2 at the far post for the rebound. V1/V2 secure the half-field.
  'corner-play': {
    layers: { rink: true, 'zone-slot-right': true },
    players: [
      HOME_G,
      { id: 'player-ld', label: 'V1', x: 570, y: 310 },
      { id: 'player-rd', label: 'V2', x: 570, y: 395 },
      { id: 'player-c',  label: 'C',  x: 900, y: 350 },
      { id: 'player-lw', label: 'S1', x: 1060, y: 155 },
      { id: 'player-rw', label: 'S2', x:  985, y: 425 },
    ],
    opponents: [
      AWAY_G,
      { id: 'opponent-ld', label: 'V1', x:  920, y: 215 },
      { id: 'opponent-rd', label: 'V2', x:  920, y: 485 },
      { id: 'opponent-c',  label: 'C',  x:  800, y: 350 },
      { id: 'opponent-lw', label: 'A1', x:  700, y: 215 },
      { id: 'opponent-rw', label: 'A2', x:  700, y: 485 },
    ],
  },
};
