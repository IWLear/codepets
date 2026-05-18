// ── Evolution stages ──────────────────────────────────────────────────────
export const EVOS = [
  {
    name: 'Egg',
    stage: 'stage 0',
    minXP: 0,
    desc: 'Still dormant. Log your first session or habits to hatch!',
    color: '#555',
  },
  {
    name: 'Byteling',
    stage: 'stage 1',
    minXP: 50,
    desc: 'A tiny creature awakens. It blinks curiously at your editor.',
    color: '#7c6cff',
  },
  {
    name: 'Codeling',
    stage: 'stage 2',
    minXP: 200,
    desc: 'Growing fast! It reads your commits and purrs approvingly.',
    color: '#4ecdc4',
  },
  {
    name: 'Debugmon',
    stage: 'stage 3',
    minXP: 500,
    desc: 'Battle-hardened from a thousand stack traces. Eyes like a linter.',
    color: '#ff6cab',
  },
  {
    name: 'Archimander',
    stage: 'stage 4',
    minXP: 1200,
    desc: 'A legendary being. It dreams in design patterns.',
    color: '#f0b429',
  },
  {
    name: 'Syntaxlord',
    stage: 'stage 5',
    minXP: 2500,
    desc: '10x coder incarnate. The compiler fears it.',
    color: '#ff6cab',
  },
];

// ── Daily habits ────────────────────────────────────────────────────────────
export const HABITS = [
  { id: 'commit',  text: 'Made at least one commit',        xp: 15 },
  { id: 'review',  text: "Reviewed someone's code / PR",    xp: 20 },
  { id: 'docs',    text: 'Wrote or updated documentation',  xp: 10 },
  { id: 'tests',   text: 'Wrote tests',                     xp: 20 },
  { id: 'newlang', text: 'Tried something new today',       xp: 25 },
  { id: 'nobreak', text: 'Coded for 2+ focused hours',      xp: 10 },
];

// ── Language options ────────────────────────────────────────────────────────
export const LANGUAGES = [
  'Python', 'JavaScript', 'TypeScript', 'Rust', 'Go',
  'Java', 'C++', 'C#', 'Swift', 'Kotlin',
  'Ruby', 'PHP', 'SQL', 'HTML/CSS', 'Bash', 'Other',
];

// ── XP multipliers ─────────────────────────────────────────────────────────
export const VIBE_MULTIPLIERS = {
  flow:  1.3,  // In the flow
  learn: 1.2,  // Learning mode
  grind: 1.0,  // Hard grind
  debug: 1.0,  // Debugging hell
  chill: 0.9,  // Chill session
};

// XP earned per hour before multipliers
export const BASE_XP_PER_HOUR = 30;

// Bonus XP for first use of a new language
export const NEW_LANG_BONUS = 25;

// Max streak multiplier bonus (capped at +50%)
export const MAX_STREAK_BONUS = 0.5;

// XP required for each level: 50 * level^1.4
export function xpForLevel(level) {
  return Math.round(50 * Math.pow(level, 1.4));
}
