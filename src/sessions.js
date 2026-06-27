// ── Session Logging & XP Calculation ───────────────────────────────────────
import { store } from './store.js';
import { VIBE_MULTIPLIERS, BASE_XP_PER_HOUR, NEW_LANG_BONUS, EVOS } from './data.js';

// ── Day rollover ────────────────────────────────────────────────────────────
export function rolloverDay(state) {
  const today = new Date().toDateString();
  if (state.lastActiveDate === today) return state;

  const yesterday = new Date(Date.now() - 86_400_000).toDateString();
  const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;

  return {
    ...state,
    streak: newStreak,
    lastActiveDate: today,
    habitsClaimed: false,
    habitsToday: [],
  };
}

// ── Build session object ────────────────────────────────────────────────────
export function buildSession({ project, language, duration, vibe }) {
  const streakMultiplier = store.getStreakMultiplier();
  const vibeMultiplier = VIBE_MULTIPLIERS[vibe] || 1;
  const boostMultiplier = store.getBoostMultiplier();
  
  const isNewLang = !store.getState().languages.includes(language);
  
  let xp = Math.round(duration * BASE_XP_PER_HOUR * vibeMultiplier * streakMultiplier * boostMultiplier);
  if (isNewLang) xp += NEW_LANG_BONUS;

  return {
    id: crypto.randomUUID(),
    project: project || 'Coding session',
    language,
    duration, // minutes
    vibe,
    xp,
    date: new Date().toISOString(),
    isNewLang,
  };
}

// ── Log a session ───────────────────────────────────────────────────────────
export function logSession(sessionData) {
  const state = store.getState();
  
  // Roll over day
  let updated = rolloverDay(state);
  
  // Check for new language
  const isNewLang = !updated.languages.includes(sessionData.language);
  if (isNewLang) {
    updated = { ...updated, languages: [...updated.languages, sessionData.language] };
  }

  // Build session
  const session = buildSession(sessionData);
  
  // Update state
  const newState = {
    ...updated,
    totalHours: updated.totalHours + (session.duration / 60),
    totalSessions: updated.totalSessions + 1,
    sessions: [...updated.sessions, session],
    lastSessionDate: Date.now(),
    mood: Math.min(100, updated.mood + 10), // Logging session improves mood
  };

  // Award XP
  const { xp, totalXP, level } = calculateLevel(newState.xp + session.xp, newState.totalXP + session.xp, newState.level);
  newState.xp = xp;
  newState.totalXP = totalXP;
  newState.level = level;

  // Check for evolution
  const newEvo = checkEvolution(newState);
  const oldEvo = checkEvolution(state);
  const evolved = newEvo.id !== oldEvo.id;

  store.setState(newState, ['state', 'evolution', 'xp', 'badges']);
  
  return { session, evolved, newEvo, isNewLang };
}

// ── XP & Level calculation ──────────────────────────────────────────────────
export function calculateLevel(xp, totalXP, currentLevel) {
  let remainingXP = xp;
  let level = currentLevel;
  
  while (remainingXP >= xpForLevel(level)) {
    remainingXP -= xpForLevel(level);
    level++;
  }
  
  return { xp: remainingXP, totalXP, level };
}

export function xpForLevel(level) {
  return Math.round(50 * Math.pow(level, 1.4));
}

// ── Evolution check ─────────────────────────────────────────────────────────
export function checkEvolution(state) {
  const totalXP = state.totalXP;
  for (let i = EVOS.length - 1; i >= 0; i--) {
    if (totalXP >= EVOS[i].minXP) return EVOS[i];
  }
  return EVOS[0];
}

// ── Get recent sessions ─────────────────────────────────────────────────────
export function getRecentSessions(limit = 10) {
  const state = store.getState();
  return [...state.sessions].reverse().slice(0, limit);
}

// ── Get session stats ───────────────────────────────────────────────────────
export function getSessionStats() {
  const state = store.getState();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weekSessions = state.sessions.filter(s => new Date(s.date) >= weekAgo);
  const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);
  
  return {
    totalSessions: state.totalSessions,
    weekSessions: weekSessions.length,
    weekMinutes,
    totalMinutes: state.sessions.reduce((sum, s) => sum + s.duration, 0),
  };
}
