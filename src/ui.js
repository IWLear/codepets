// ── UI Rendering & Interactions ─────────────────────────────────────────────
import { store } from './store.js';
import { EVOS, BADGES, LANGUAGES, ACCENT_PRESETS, INVENTORY_ITEMS, HABITS } from './data.js';
import { getPetSprite, generatePetName } from './pet.js';
import { getRecentSessions, getSessionStats } from './sessions.js';
import { getTodayHabits, canClaimHabits } from './habits.js';

// ── Current view state ──────────────────────────────────────────────────────
let currentView = 'pet';
let previousEvoId = null;

// ── Subscribe to store changes ──────────────────────────────────────────────
export function initUI() {
  store.subscribe('state', () => renderAll());
  store.subscribe('evolution', (state) => handleEvolution(state));
  store.subscribe('xp', (state) => handleXPChange(state));
  store.subscribe('badges', (state) => handleNewBadges(state));
}

// ── Main render orchestrator ────────────────────────────────────────────────
export function renderAll() {
  const state = store.getState();
  renderPetCard(state);
  renderStats(state);
  renderHabits(state);
  renderHistory(state);
  renderBadges(state);
  renderInventory(state);
  renderSettings(state);
  updateTheme(state);
  updateAccentPreset(state);
}

// ── Pet Card ────────────────────────────────────────────────────────────────
function renderPetCard(state) {
  const evo = store.getEvolution();
  const mood = store.getMoodStatus();
  const boost = store.getActiveBoost();
  const xpNeeded = store.getXPForNextLevel();
  const pct = store.getXPProgress();

  document.getElementById('pet-name').textContent = state.petName || 'Your Pet';
  document.getElementById('pet-evo-name').textContent = evo.name;
  document.getElementById('pet-evo-stage').textContent = evo.stage;
  document.getElementById('pet-evo-desc').textContent = evo.desc;
  document.getElementById('pet-evo-emoji').textContent = evo.emoji;
  document.getElementById('level-display').textContent = state.level;
  document.getElementById('xp-label').textContent = `${state.xp} / ${xpNeeded} XP`;
  document.getElementById('xp-fill').style.width = `${pct}%`;
  document.getElementById('mood-emoji').textContent = mood.emoji;
  document.getElementById('mood-label').textContent = mood.label;
  document.getElementById('mood-bar-fill').style.width = `${state.mood}%`;
  
  if (boost) {
    document.getElementById('boost-indicator').style.display = 'flex';
    document.getElementById('boost-timer').textContent = formatTimeLeft(boost.expiresAt - Date.now());
  } else {
    document.getElementById('boost-indicator').style.display = 'none';
  }

  // Update pet SVG
  const petContainer = document.getElementById('pet-sprite');
  petContainer.innerHTML = getPetSprite(evo.id);
  petContainer.style.color = evo.color;
}

// ── Stats Panel ─────────────────────────────────────────────────────────────
function renderStats(state) {
  const stats = getSessionStats();
  document.getElementById('stat-streak').textContent = state.streak;
  document.getElementById('stat-hours').textContent = (state.totalHours).toFixed(1);
  document.getElementById('stat-sessions').textContent = state.totalSessions;
  document.getElementById('stat-xp').textContent = state.totalXP.toLocaleString();
  document.getElementById('stat-langs').textContent = state.languages.length;
  
  // Streak fire emoji chain
  const streakContainer = document.getElementById('streak-fire');
  if (state.streak >= 3) {
    const fireCount = Math.min(state.streak, 14);
    streakContainer.textContent = '🔥'.repeat(Math.floor(fireCount / 3)) + (state.streak >= 7 ? '✨' : '');
    streakContainer.style.display = 'inline';
  } else {
    streakContainer.style.display = 'none';
  }
}

// ── Habits Panel ────────────────────────────────────────────────────────────
function renderHabits(state) {
  const habits = getTodayHabits();
  const list = document.getElementById('habits-list');
  list.innerHTML = '';

  habits.forEach(h => {
    const item = document.createElement('div');
    item.className = `habit-item${h.completed ? ' checked' : ''}`;
    item.dataset.habitId = h.id;
    item.innerHTML = `
      <div class="habit-check">${h.completed ? '✓' : ''}</div>
      <span class="habit-text">${h.text}</span>
      <span class="habit-xp">+${h.xp} XP</span>
    `;
    item.addEventListener('click', () => handleHabitToggle(h.id));
    list.appendChild(item);
  });

  // Update claim button
  const claimBtn = document.getElementById('claim-habits-btn');
  if (state.habitsClaimed) {
    claimBtn.textContent = '✓ Claimed today';
    claimBtn.disabled = true;
    claimBtn.classList.add('disabled');
  } else if (state.habitsToday.length === 0) {
    claimBtn.textContent = 'Select habits to claim';
    claimBtn.disabled = true;
    claimBtn.classList.add('disabled');
  } else {
    claimBtn.textContent = `Claim ${state.habitsToday.length} habit${state.habitsToday.length > 1 ? 's' : ''}`;
    claimBtn.disabled = false;
    claimBtn.classList.remove('disabled');
    
    const allComplete = state.habitsToday.length === HABITS.length;
    if (allComplete) {
      claimBtn.textContent += ' (+50% bonus!)';
      claimBtn.classList.add('bonus');
    }
  }
}

// ── History Panel ───────────────────────────────────────────────────────────
function renderHistory(state) {
  const list = document.getElementById('log-list');
  const sessions = getRecentSessions(10);

  if (sessions.length === 0) {
    list.innerHTML = '<div class="empty-state">No sessions yet. Start coding!</div>';
    return;
  }

  list.innerHTML = '';
  sessions.forEach(s => {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const date = new Date(s.date);
    entry.innerHTML = `
      <div class="log-info">
        <div class="log-project">${escapeHtml(s.project)}</div>
        <div class="log-meta">${s.language} · ${s.duration}min · ${formatDate(date)}</div>
      </div>
      <div class="log-xp">+${s.xp} XP</div>
    `;
    list.appendChild(entry);
  });
}

// ── Badges Panel ────────────────────────────────────────────────────────────
function renderBadges(state) {
  const grid = document.getElementById('badges-grid');
  grid.innerHTML = '';

  BADGES.forEach(badge => {
    const earned = state.badges.includes(badge.id);
    const el = document.createElement('div');
    el.className = `badge-item${earned ? ' earned' : ' locked'}`;
    el.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.desc}</div>
    `;
    grid.appendChild(el);
  });
}

// ── Inventory Panel ─────────────────────────────────────────────────────────
function renderInventory(state) {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';

  INVENTORY_ITEMS.forEach(item => {
    const owned = state.inventory.includes(item.id);
    const el = document.createElement('div');
    el.className = `inventory-item${owned ? ' owned' : ''}`;
    el.innerHTML = `
      <div class="inv-icon">${item.emoji}</div>
      <div class="inv-name">${item.name}</div>
      <div class="inv-desc">${item.desc}</div>
      ${owned ? '<div class="inv-owned">Owned</div>' : '<div class="inv-cost">Unlock at higher stages</div>'}
    `;
    grid.appendChild(el);
  });
}

// ── Settings Panel ──────────────────────────────────────────────────────────
function renderSettings(state) {
  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.textContent = state.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  
  // Sound toggle
  const soundBtn = document.getElementById('sound-toggle');
  soundBtn.textContent = state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
  
  // Export button
  document.getElementById('export-btn').addEventListener('click', exportData);
  
  // Reset button
  document.getElementById('reset-btn').addEventListener('click', resetData);
}

// ── Theme management ────────────────────────────────────────────────────────
function updateTheme(state) {
  const body = document.body;
  if (state.theme === 'light') {
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
  }
}

function updateAccentPreset(state) {
  const preset = ACCENT_PRESETS[state.accentPreset] || ACCENT_PRESETS.green;
  document.documentElement.style.setProperty('--accent', preset.accent);
  document.documentElement.style.setProperty('--accent2', preset.accent2);
  document.documentElement.style.setProperty('--accent3', preset.accent3);
}

// ── Event Handlers ──────────────────────────────────────────────────────────
function handleHabitToggle(habitId) {
  const result = toggleHabit(habitId);
  if (!result.success) {
    showToast(result.reason === 'already_claimed' ? 'Already claimed today!' : 'Cannot toggle');
  }
}

function handleXPChange(state) {
  // Trigger floating XP animation
  const xpGain = state._lastXPGain || 0;
  if (xpGain > 0) {
    showFloatingXP(xpGain);
    flashXPBar();
    if (state.soundEnabled) playSound('xp');
  }
}

function handleEvolution(state) {
  const evo = store.getEvolution();
  if (previousEvoId && previousEvoId !== evo.id) {
    // Evolution happened!
    showConfetti();
    showToast(`🎉 Evolved to ${evo.name}!`);
    if (state.soundEnabled) playSound('evolve');
  }
  previousEvoId = evo.id;
}

function handleNewBadges(state) {
  const newBadges = state._newBadges || [];
  newBadges.forEach(badgeId => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      showToast(`🏆 New badge: ${badge.name}!`);
    }
  });
}

// ── View Navigation ─────────────────────────────────────────────────────────
export function navigateTo(view) {
  currentView = view;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === view);
  });
  
  // Update panels
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.view === view);
  });
  
  // Show/hide bottom nav
  const bottomNav = document.getElementById('bottom-nav');
  if (view === 'onboarding') {
    bottomNav.style.display = 'none';
  } else {
    bottomNav.style.display = 'flex';
  }
}

// ── Onboarding ──────────────────────────────────────────────────────────────
export function showOnboarding() {
  const state = store.getState();
  if (state.onboardingComplete) {
    navigateTo('pet');
    return;
  }
  
  navigateTo('onboarding');
  
  const modal = document.getElementById('onboarding-modal');
  modal.classList.add('active');
  
  const input = document.getElementById('pet-name-input');
  input.value = state.petName || generatePetName();
  input.focus();
}

export function completeOnboarding(petName) {
  store.setState({
    petName,
    onboardingComplete: true,
  }, ['state']);
  
  document.getElementById('onboarding-modal').classList.remove('active');
  navigateTo('pet');
  showToast(`Welcome, ${petName}! 🎉`);
}

// ── Session Logging ─────────────────────────────────────────────────────────
export function handleLogSession(formData) {
  const { project, language, duration, vibe } = formData;
  
  if (!language) { showToast('Pick a language!'); return false; }
  if (!duration || duration <= 0) { showToast('Enter a valid duration!'); return false; }
  
  const result = logSession({ project, language, duration: parseInt(duration), vibe });
  
  if (result.isNewLang) {
    setTimeout(() => showToast(`New language bonus! +${25} XP`), 400);
  }
  
  return true;
}

// ── Habit Claiming ──────────────────────────────────────────────────────────
export function handleClaimHabits() {
  const result = claimHabitsXP();
  if (!result.success) {
    showToast(result.reason === 'already_claimed' ? 'Already claimed today!' : 'Select habits first!');
    return;
  }
  
  showToast(`+${result.xpEarned} XP from habits!${result.bonus ? ' (bonus!)' : ''}`);
}

// ── Toast Notifications ─────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Floating XP Animation ───────────────────────────────────────────────────
function showFloatingXP(amount) {
  const floater = document.createElement('div');
  floater.className = 'xp-floater';
  floater.textContent = `+${amount} XP`;
  document.getElementById('pet-card').appendChild(floater);
  
  setTimeout(() => floater.remove(), 1200);
}

function flashXPBar() {
  const fill = document.getElementById('xp-fill');
  fill.classList.add('flash');
  setTimeout(() => fill.classList.remove('flash'), 600);
}

// ── Confetti ────────────────────────────────────────────────────────────────
export function showConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const particles = [];
  const colors = ['#39ff14', '#ff6b9d', '#ffd700', '#00d4ff', '#ff6cab', '#a855f7'];
  
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 2,
      life: 1,
      decay: Math.random() * 0.02 + 0.005,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    
    particles.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // gravity
      p.life -= p.decay;
      
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    
    ctx.globalAlpha = 1;
    
    if (alive) {
      requestAnimationFrame(animate);
    } else {
      canvas.style.display = 'none';
    }
  }
  
  animate();
}

// ── Export Data ─────────────────────────────────────────────────────────────
function exportData() {
  const state = store.getState();
  const data = {
    exportDate: new Date().toISOString(),
    petName: state.petName,
    totalXP: state.totalXP,
    level: state.level,
    streak: state.streak,
    totalHours: state.totalHours,
    languages: state.languages,
    sessions: state.sessions,
    badges: state.badges,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `codepet-${state.petName || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported! 📦');
}

// ── Reset Data ──────────────────────────────────────────────────────────────
function resetData() {
  if (confirm('Are you sure? This will delete all your progress!')) {
    if (confirm('Really? This cannot be undone!')) {
      localStorage.removeItem('v1:codepet:state');
      location.reload();
    }
  }
}

// ── Theme Toggle ────────────────────────────────────────────────────────────
export function toggleTheme() {
  const state = store.getState();
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  store.setState({ theme: newTheme }, ['state']);
}

// ── Sound Toggle ────────────────────────────────────────────────────────────
export function toggleSound() {
  const state = store.getState();
  store.setState({ soundEnabled: !state.soundEnabled }, ['state']);
}

// ── Sound Effects (8-bit style) ─────────────────────────────────────────────
function playSound(type) {
  // Simple Web Audio API beeps
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'xp') {
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'evolve') {
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    }
  } catch (e) {
    // Audio not supported
  }
}

// ── Utility Functions ───────────────────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

function formatTimeLeft(ms) {
  if (ms <= 0) return '0m';
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}
