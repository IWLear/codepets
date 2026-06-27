// ── Evolution stages ──────────────────────────────────────────────────────
export const EVOS = [
  { id: 'egg',        name: 'Egg',        stage: 'Stage 0', minXP: 0,    desc: 'Still dormant. Log your first session or habits to hatch!', color: '#888888', emoji: '🥚' },
  { id: 'hatchling',  name: 'Hatchling',  stage: 'Stage 1', minXP: 100,  desc: 'A tiny creature awakens. It blinks curiously at your editor.', color: '#7c6cff', emoji: '🐣' },
  { id: 'apprentice', name: 'Apprentice', stage: 'Stage 2', minXP: 350,  desc: 'Growing fast! It reads your commits and purrs approvingly.', color: '#4ecdc4', emoji: '🧑‍💻' },
  { id: 'dev',        name: 'Dev',        stage: 'Stage 3', minXP: 750,  desc: 'Battle-hardened from a thousand stack traces. Eyes like a linter.', color: '#ff6cab', emoji: '⚡' },
  { id: 'senior_dev', name: 'Senior Dev', stage: 'Stage 4', minXP: 1500, desc: 'A seasoned warrior. It dreams in design patterns.', color: '#f0b429', emoji: '🦁' },
  { id: 'architect',  name: 'Architect',  stage: 'Stage 5', minXP: 3000, desc: 'A legendary being. Systems bow to its will.', color: '#ff4757', emoji: '🏛️' },
  { id: 'syntaxlord', name: 'Syntaxlord', stage: 'Stage 6', minXP: 5000, desc: '10x coder incarnate. The compiler fears it. All hail Syntaxlord.', color: '#ffd700', emoji: '👑' },
];

// ── Daily habits ────────────────────────────────────────────────────────────
export const HABITS = [
  { id: 'commit',  text: 'Committed code today',        xp: 15 },
  { id: 'docs',    text: 'Read documentation',           xp: 10 },
  { id: 'help',    text: 'Helped someone',               xp: 20 },
  { id: 'notutorial', text: 'No tutorial hell',          xp: 15 },
];

// ── Language options ────────────────────────────────────────────────────────
export const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go',
  'Java', 'C++', 'C#', 'Swift', 'Kotlin',
  'Ruby', 'PHP', 'SQL', 'HTML/CSS', 'Bash', 'Other',
];

// ── XP multipliers ─────────────────────────────────────────────────────────
export const VIBE_MULTIPLIERS = {
  flow:  1.3,   // In the flow
  learn: 1.2,   // Learning mode
  grind: 1.0,   // Hard grind
  debug: 1.0,   // Debugging hell
  chill: 0.9,   // Chill session
};

// XP earned per hour before multipliers
export const BASE_XP_PER_HOUR = 30;

// Bonus XP for first use of a new language
export const NEW_LANG_BONUS = 25;

// Max streak multiplier bonus (capped at +50%)
export const MAX_STREAK_BONUS = 0.5;

// Streak bonus per consecutive day (5% per day)
export const STREAK_BONUS_PER_DAY = 0.05;

// Idle decay threshold (hours before mood decays)
export const IDLE_DECAY_HOURS = 48;

// Mood decay amount
export const MOOD_DECAY = 5;

// XP required for each level: 50 * level^1.4
export function xpForLevel(level) {
  return Math.round(50 * Math.pow(level, 1.4));
}

// Badge definitions
export const BADGES = [
  { id: 'first_session',  name: 'First Session',    desc: 'Logged your first coding session',          icon: '🎯' },
  { id: 'first_habit',    name: 'Habit Starter',     desc: 'Completed your first daily habits',         icon: '✅' },
  { id: 'streak_3',       name: '3-Day Streak',      desc: 'Coded 3 days in a row',                    icon: '🔥' },
  { id: 'streak_7',       name: '7-Day Streak',      desc: 'Coded 7 days in a row',                    icon: '🔥🔥' },
  { id: 'streak_30',      name: '30-Day Streak',     desc: 'Coded 30 days in a row',                   icon: '🔥🔥🔥' },
  { id: 'hours_10',       name: '10 Hours Coded',    desc: 'Accumulated 10 hours of coding',           icon: '⏱️' },
  { id: 'hours_50',       name: '50 Hours Coded',    desc: 'Accumulated 50 hours of coding',           icon: '⏱️⏱️' },
  { id: 'hours_100',      name: '100 Hours Coded',   desc: 'Accumulated 100 hours of coding',          icon: '⏱️⏱️⏱️' },
  { id: 'langs_3',        name: 'Polyglot',           desc: 'Used 3 different languages',               icon: '🌍' },
  { id: 'langs_5',        name: 'Linguist',           desc: 'Used 5 different languages',               icon: '🗣️' },
  { id: 'evolve_2',       name: 'Evolved',            desc: 'Reached Apprentice stage',                 icon: '✨' },
  { id: 'evolve_4',       name: 'Senior Dev',         desc: 'Reached Senior Dev stage',                 icon: '⭐' },
  { id: 'evolve_6',       name: 'Syntaxlord',         desc: 'Reached Syntaxlord stage',                 icon: '👑' },
  { id: 'xp_500',         name: 'XP Collector',       desc: 'Earned 500 total XP',                      icon: '💎' },
  { id: 'xp_1000',        name: 'XP Master',          desc: 'Earned 1000 total XP',                     icon: '💎💎' },
  { id: 'xp_2500',        name: 'XP Legend',          desc: 'Earned 2500 total XP',                     icon: '💎💎💎' },
];

// ── Weekly challenges ──────────────────────────────────────────────────────
export const WEEKLY_CHALLENGES = [
  { id: 'hours_5',   text: 'Code for 5 hours this week',    target: 5,   unit: 'hours', reward: 100 },
  { id: 'hours_10',  text: 'Code for 10 hours this week',   target: 10,  unit: 'hours', reward: 250 },
  { id: 'sessions_5',text: 'Log 5 sessions this week',      target: 5,   unit: 'sessions', reward: 150 },
  { id: 'streak_5',  text: 'Maintain a 5-day streak',       target: 5,   unit: 'days', reward: 200 },
];

// ── Pet inventory items ────────────────────────────────────────────────────
export const INVENTORY_ITEMS = [
  { id: 'coffee',    name: 'Coffee',     emoji: '☕', desc: 'Boosts XP by 10% for 1 hour',     boost: 0.1,  duration: 60 },
  { id: 'duck',      name: 'Rubber Duck', emoji: '🦆', desc: 'Boosts XP by 15% for 2 hours',    boost: 0.15, duration: 120 },
  { id: 'keyboard',  name: 'Mech Keyboard', emoji: '⌨️', desc: 'Boosts XP by 20% for 3 hours',  boost: 0.2,  duration: 180 },
  { id: 'monitor',   name: 'Ultrawide',   emoji: '🖥️', desc: 'Boosts XP by 25% for 4 hours',   boost: 0.25, duration: 240 },
];

// ── Accent color presets ───────────────────────────────────────────────────
export const ACCENT_PRESETS = {
  green:  { accent: '#39ff14', accent2: '#00d4ff', accent3: '#ff6b9d', name: 'Neon Green' },
  purple: { accent: '#a855f7', accent2: '#ec4899', accent3: '#06b6d4', name: 'Cyber Purple' },
  orange: { accent: '#f97316', accent2: '#eab308', accent3: '#ef4444', name: 'Sunset Orange' },
};
