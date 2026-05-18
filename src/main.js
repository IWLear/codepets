import './styles.css';
import { HABITS, VIBE_MULTIPLIERS, BASE_XP_PER_HOUR, NEW_LANG_BONUS } from './data.js';
import {
  loadState, saveState, awardXP, rolloverDay, buildSession, getEvolution
} from './state.js';
import { renderAll, renderHabits, renderLog, buildHTML } from './ui.js';

// ── Boot ───────────────────────────────────────────────────────────────────
let state = loadState();

document.getElementById('app').innerHTML = buildHTML();
renderAll(state);
bindEvents();

// ── Event wiring ───────────────────────────────────────────────────────────
function bindEvents() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`panel-${tab}`).classList.add('active');
    });
  });

  // Log session
  document.getElementById('log-session-btn').addEventListener('click', handleLogSession);

  // Habit toggle
  document.getElementById('habits-list').addEventListener('click', e => {
    const item = e.target.closest('.habit-item');
    if (!item) return;
    if (state.habitsClaimed) { showToast('Already claimed today!'); return; }

    const id = item.dataset.habitId;
    if (state.habitsToday.includes(id)) {
      state.habitsToday = state.habitsToday.filter(x => x !== id);
    } else {
      state.habitsToday = [...state.habitsToday, id];
    }

    saveState(state);
    renderHabits(state);
  });

  // Claim habits
  document.getElementById('claim-habits-btn').addEventListener('click', handleClaimHabits);
}

// ── Session handler ────────────────────────────────────────────────────────
function handleLogSession() {
  const project  = document.getElementById('proj-input').value.trim() || 'Coding session';
  const lang     = document.getElementById('lang-select').value;
  const hours    = parseFloat(document.getElementById('duration-input').value);
  const vibe     = document.getElementById('vibe-select').value;

  if (!lang)            { showToast('Pick a language!'); return; }
  if (!hours || hours <= 0) { showToast('Enter a valid duration!'); return; }

  // Roll over day (handles streak logic)
  state = rolloverDay(state);

  const isNewLang = !state.languages.includes(lang);
  if (isNewLang) state = { ...state, languages: [...state.languages, lang] };

  const session = buildSession({
    project,
    lang,
    hours,
    vibe,
    streakMultiplier: 1 + Math.min(state.streak * 0.05, 0.5),
    vibeMultiplier: VIBE_MULTIPLIERS[vibe] ?? 1,
    isNewLang,
    newLangBonus: NEW_LANG_BONUS,
    baseXpPerHour: BASE_XP_PER_HOUR,
  });

  state = {
    ...state,
    totalHours: state.totalHours + hours,
    sessions: [...state.sessions, session],
  };

  const { newState, levelsGained } = awardXP(state, session.xp);
  state = newState;
  saveState(state);

  // Clear form
  document.getElementById('proj-input').value = '';
  document.getElementById('duration-input').value = '';

  renderAll(state);
  showToast(`+${session.xp} XP earned!`);
  if (levelsGained > 0) setTimeout(() => showToast(`Level up! Now level ${state.level} 🎉`), 800);
  if (isNewLang) setTimeout(() => showToast(`New language bonus! +${NEW_LANG_BONUS} XP`), 400);
}

// ── Habit claim handler ────────────────────────────────────────────────────
function handleClaimHabits() {
  if (state.habitsClaimed) { showToast('Already claimed today!'); return; }
  if (!state.habitsToday.length) { showToast('Check at least one habit!'); return; }

  const total = state.habitsToday.reduce((sum, id) => {
    const h = HABITS.find(x => x.id === id);
    return sum + (h?.xp ?? 0);
  }, 0);

  state = { ...state, habitsClaimed: true };
  const { newState, levelsGained } = awardXP(state, total);
  state = newState;
  saveState(state);

  renderAll(state);
  showToast(`+${total} XP from habits!`);
  if (levelsGained > 0) setTimeout(() => showToast(`Level up! Now level ${state.level} 🎉`), 800);
}

// ── Toast helper ───────────────────────────────────────────────────────────
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2300);
}
