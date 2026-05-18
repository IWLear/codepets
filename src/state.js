import { xpForLevel, EVOS, MAX_STREAK_BONUS } from './data.js';

const STORAGE_KEY = 'codepet_v1';

// ── Default state ──────────────────────────────────────────────────────────
function defaultState() {
  return {
    xp: 0,           // XP within current level
    totalXP: 0,       // All-time XP (drives evolution)
    level: 1,
    streak: 0,
    totalHours: 0,
    languages: [],    // Unique languages ever used
    sessions: [],     // Array of session log objects
    lastDay: null,    // Date string of last active day
    habitsToday: [],  // Habit IDs checked today
    habitsClaimed: false,
  };
}

// ── Persistence ────────────────────────────────────────────────────────────
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Derived helpers ────────────────────────────────────────────────────────
export function getEvolution(totalXP) {
  for (let i = EVOS.length - 1; i >= 0; i--) {
    if (totalXP >= EVOS[i].minXP) return EVOS[i];
  }
  return EVOS[0];
}

export function getStreakMultiplier(streak) {
  return 1 + Math.min(streak * 0.05, MAX_STREAK_BONUS);
}

// ── XP engine ──────────────────────────────────────────────────────────────
// Returns { newState, levelsGained }
export function awardXP(state, amount) {
  const s = { ...state, xp: state.xp + amount, totalXP: state.totalXP + amount };
  let levelsGained = 0;

  while (s.xp >= xpForLevel(s.level)) {
    s.xp -= xpForLevel(s.level);
    s.level++;
    levelsGained++;
  }

  return { newState: s, levelsGained };
}

// ── Day rollover ───────────────────────────────────────────────────────────
// Call before logging a session; handles streak and daily habit reset
export function rolloverDay(state) {
  const today = new Date().toDateString();
  if (state.lastDay === today) return state;

  const yesterday = new Date(Date.now() - 86_400_000).toDateString();
  const newStreak = state.lastDay === yesterday ? state.streak + 1 : 1;

  return {
    ...state,
    streak: newStreak,
    lastDay: today,
    habitsClaimed: false,
    habitsToday: [],
  };
}

// ── Session logging ────────────────────────────────────────────────────────
export function buildSession({ project, lang, hours, vibe, streakMultiplier, vibeMultiplier, isNewLang, newLangBonus, baseXpPerHour }) {
  let xp = Math.round(hours * baseXpPerHour * vibeMultiplier * streakMultiplier);
  if (isNewLang) xp += newLangBonus;

  return {
    project,
    lang,
    hours,
    vibe,
    xp,
    date: new Date().toLocaleDateString(),
  };
}
