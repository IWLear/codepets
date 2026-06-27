// ── Habits System ───────────────────────────────────────────────────────────
import { store } from './store.js';
import { HABITS } from './data.js';

// ── Toggle habit ────────────────────────────────────────────────────────────
export function toggleHabit(habitId) {
  const state = store.getState();
  if (state.habitsClaimed) return { success: false, reason: 'already_claimed' };

  const habitsToday = state.habitsToday.includes(habitId)
    ? state.habitsToday.filter(id => id !== habitId)
    : [...state.habitsToday, habitId];

  store.setState({ habitsToday }, ['habits']);
  return { success: true };
}

// ── Claim habits XP ─────────────────────────────────────────────────────────
export function claimHabitsXP() {
  const state = store.getState();
  if (state.habitsClaimed) return { success: false, reason: 'already_claimed' };
  if (state.habitsToday.length === 0) return { success: false, reason: 'no_habits' };

  // Calculate XP from habits
  const habitXP = state.habitsToday.reduce((sum, id) => {
    const habit = HABITS.find(h => h.id === id);
    return sum + (habit ? habit.xp : 0);
  }, 0);

  // Streak bonus: completing all 4 habits gives extra multiplier
  const allComplete = state.habitsToday.length === HABITS.length;
  const bonusMultiplier = allComplete ? 1.5 : 1;
  const totalXP = Math.round(habitXP * bonusMultiplier);

  // Update state
  let updated = { ...state, habitsClaimed: true };
  
  // Award XP
  const { xp, totalXP: newTotalXP, level } = calculateLevel(updated.xp + totalXP, updated.totalXP + totalXP, updated.level);
  updated.xp = xp;
  updated.totalXP = newTotalXP;
  updated.level = level;

  // Improve mood
  updated.mood = Math.min(100, updated.mood + 15);

  store.setState(updated, ['state', 'habits', 'xp', 'badges']);

  return {
    success: true,
    xpEarned: totalXP,
    baseXP: habitXP,
    bonus: allComplete,
    allComplete,
  };
}

// ── Level calculation ───────────────────────────────────────────────────────
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

// ── Get habit streak ────────────────────────────────────────────────────────
export function getHabitStreak() {
  const state = store.getState();
  // Simplified: return current overall streak
  return state.streak;
}

// ── Get today's habits status ───────────────────────────────────────────────
export function getTodayHabits() {
  const state = store.getState();
  return HABITS.map(h => ({
    ...h,
    completed: state.habitsToday.includes(h.id),
  }));
}

// ── Check if habits can be claimed ─────────────────────────────────────────
export function canClaimHabits() {
  const state = store.getState();
  return !state.habitsClaimed && state.habitsToday.length > 0;
}
