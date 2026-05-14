export const SVG_NS = 'http://www.w3.org/2000/svg';

// Goal rect centers in SVG space (field translate(100,100) applied)
export const GOALS = {
  left:  { x: 163.75,  y: 350 },
  right: { x: 1036.25, y: 350 },
};

// Goal post positions at the goal-line opening
export const GOAL_POSTS = {
  left:  [{ x: 171.25, y: 330 }, { x: 171.25, y: 370 }],
  right: [{ x: 1028.75, y: 330 }, { x: 1028.75, y: 370 }],
};

export const GOAL_LINE_CENTERS = {
  left:  { x: 171.25,  y: 350 },
  right: { x: 1028.75, y: 350 },
};

export const GOALIE_STAND_OFFSET = 65;

// Winkelspiel: goalie distance from the goal line as a function of ball distance.
// Close ball → deep in the crease (small offset). Far ball → step out to cut the angle.
export function idealGoalieOffset(ballDist) {
  if (ballDist <= 200) return 25;
  if (ballDist >= 500) return 80;
  return 25 + ((ballDist - 200) / 300) * 55;
}

export const DEFAULT_TOKEN_SIZE = 40;
export const TOKEN_SIZE_STEP    = 5;
export const TOKEN_SIZE_MIN     = 20;
export const TOKEN_SIZE_MAX     = 100;

export const DEFAULT_PLAYERS = [
  { id: 'player-g',  label: 'G',  x:  90, y: 250, symbol: 'sym-player-goalie' },
  { id: 'player-ld', label: 'LD', x: 280, y: 155 },
  { id: 'player-rd', label: 'RD', x: 280, y: 345 },
  { id: 'player-c',  label: 'C',  x: 490, y: 250 },
  { id: 'player-lw', label: 'LW', x: 650, y: 105 },
  { id: 'player-rw', label: 'RW', x: 650, y: 395 },
];

export const DEFAULT_OPPONENTS = [
  { id: 'opponent-g',  label: 'G',  x: 920, y: 250, symbol: 'sym-opponent-goalie' },
  { id: 'opponent-ld', label: 'LD', x: 730, y: 155 },
  { id: 'opponent-rd', label: 'RD', x: 730, y: 345 },
  { id: 'opponent-c',  label: 'C',  x: 510, y: 290 },
  { id: 'opponent-lw', label: 'LW', x: 420, y: 105 },
  { id: 'opponent-rw', label: 'RW', x: 420, y: 395 },
];

export const ZONE_LABELS = [
  { x: 810,  y: 185, rotate:   0, labels: { en: 'Pocket',    de: 'Tasche'     } },
  { x: 810,  y: 515, rotate:   0, labels: { en: 'Pocket',    de: 'Tasche'     } },
  { x: 790,  y: 350, rotate:   0, labels: { en: 'High Slot', de: 'Hoher Slot' } },
  { x: 955,  y: 350, rotate:   0, labels: { en: 'Low Slot',  de: 'Naher Slot' } },
  { x: 1064, y: 250, rotate: -90, labels: { en: 'Playmaker', de: 'Playmaker'  } },
  { x: 1064, y: 450, rotate: -90, labels: { en: 'Playmaker', de: 'Playmaker'  } },
];

// Mirror of ZONE_LABELS reflected around x=600 (x' = 1200 - x), Playmaker rotation flipped
export const ZONE_LABELS_LEFT = [
  { x: 390,  y: 185, rotate:   0, labels: { en: 'Pocket',    de: 'Tasche'     } },
  { x: 390,  y: 515, rotate:   0, labels: { en: 'Pocket',    de: 'Tasche'     } },
  { x: 410,  y: 350, rotate:   0, labels: { en: 'High Slot', de: 'Hoher Slot' } },
  { x: 245,  y: 350, rotate:   0, labels: { en: 'Low Slot',  de: 'Naher Slot' } },
  { x: 136,  y: 250, rotate:  90, labels: { en: 'Playmaker', de: 'Playmaker'  } },
  { x: 136,  y: 450, rotate:  90, labels: { en: 'Playmaker', de: 'Playmaker'  } },
];

export const RINK_LABELS = [
  { x: 350, y: 30,  labels: { en: 'Team Bench',    de: 'Spielerbank' } },
  { x: 850, y: 30,  labels: { en: 'Team Bench',    de: 'Spielerbank' } },
  { x: 550, y: 680, labels: { en: 'Penalty Bench', de: 'Strafbank'   } },
  { x: 600, y: 680, labels: { en: 'Officials',     de: 'Sekretariat' } },
  { x: 650, y: 680, labels: { en: 'Penalty Bench', de: 'Strafbank'   } },
];

export const PLAYER_PATH  ='M 50 10 C 27.9 10 10 27.9 10 50 C 10 72.1 27.9 90 50 90 C 66.8 90 81.3 79.8 87.6 65 L 100 50 L 87.6 35 C 81.3 20.2 66.8 10 50 10 Z';
export const GOALIE_PATH  = 'M 45 15 C 15 15 10 30 10 50 C 10 70 15 85 45 85 C 65 85 75 75 75 50 C 75 25 65 15 45 15 Z';
export const GOALIE_CAGE  = `
  <path d="M 65 25 C 95 30 95 70 65 75" stroke-width="3" stroke-linecap="round" fill="none"/>
  <line x1="68" y1="38" x2="88" y2="42" stroke-width="2"/>
  <line x1="70" y1="50" x2="92" y2="50" stroke-width="2"/>
  <line x1="68" y1="62" x2="88" y2="58" stroke-width="2"/>
  <path d="M 75 28 Q 85 50 75 72" stroke-width="2" fill="none"/>`;
