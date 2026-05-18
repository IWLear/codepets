import { HABITS, LANGUAGES, xpForLevel } from './data.js';
import { getEvolution } from './state.js';
import { startPetAnimation } from './pet.js';

// ── Root render ────────────────────────────────────────────────────────────
export function renderAll(state) {
  renderPetCard(state);
  renderStats(state);
  renderHabits(state);
  renderLog(state);
}

// ── Pet card ───────────────────────────────────────────────────────────────
function renderPetCard(state) {
  const evo = getEvolution(state.totalXP);
  const xpNeeded = xpForLevel(state.level);
  const pct = Math.min(100, Math.round((state.xp / xpNeeded) * 100));

  document.getElementById('pet-evo-name').textContent = evo.name;
  document.getElementById('pet-evo-stage').textContent = evo.stage;
  document.getElementById('pet-evo-desc').textContent = evo.desc;
  document.getElementById('pet-header-name').textContent = evo.name;
  document.getElementById('level-display').textContent = state.level;
  document.getElementById('xp-label').textContent = `${state.xp} / ${xpNeeded}`;
  document.getElementById('xp-fill').style.width = `${pct}%`;

  const canvas = document.getElementById('pet-canvas');
  startPetAnimation(canvas, evo);
}

// ── Stats ──────────────────────────────────────────────────────────────────
function renderStats(state) {
  document.getElementById('stat-streak').textContent = state.streak;
  document.getElementById('stat-hours').textContent = +state.totalHours.toFixed(1);
  document.getElementById('stat-langs').textContent = state.languages.length;
}

// ── Habits panel ───────────────────────────────────────────────────────────
export function renderHabits(state) {
  const list = document.getElementById('habits-list');
  list.innerHTML = '';

  HABITS.forEach(h => {
    const checked = state.habitsToday.includes(h.id);
    const item = document.createElement('div');
    item.className = `habit-item${checked ? ' checked' : ''}`;
    item.dataset.habitId = h.id;
    item.innerHTML = `
      <div class="habit-check">${checked ? '✓' : ''}</div>
      <span class="habit-text">${h.text}</span>
      <span class="habit-xp">+${h.xp} XP</span>
    `;
    list.appendChild(item);
  });
}

// ── History log ────────────────────────────────────────────────────────────
export function renderLog(state) {
  const list = document.getElementById('log-list');

  if (!state.sessions.length) {
    list.innerHTML = '<div class="empty-state">No sessions yet. Start coding!</div>';
    return;
  }

  list.innerHTML = '';
  [...state.sessions].reverse().slice(0, 30).forEach(s => {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
      <div>
        <div class="log-project">${s.project || 'Session'}</div>
        <div class="log-meta">${s.lang} · ${s.hours}h · ${s.vibe} · ${s.date}</div>
      </div>
      <div class="log-xp">+${s.xp} XP</div>
    `;
    list.appendChild(entry);
  });
}

// ── Build static HTML ──────────────────────────────────────────────────────
export function buildHTML() {
  const langOptions = LANGUAGES.map(l => `<option>${l}</option>`).join('');

  return `
    <div class="header">
      <div class="title-block">
        <p class="eyebrow">CodePet</p>
        <h1 id="pet-header-name">Egg</h1>
      </div>
      <div class="level-badge">
        <div class="lv">LEVEL</div>
        <div class="ln" id="level-display">1</div>
      </div>
    </div>

    <div class="pet-stage">
      <canvas class="pet-canvas" id="pet-canvas" width="96" height="96"></canvas>
      <div class="pet-info">
        <div class="pet-name-row">
          <span class="pet-name" id="pet-evo-name">Egg</span>
          <span class="pet-evo-badge" id="pet-evo-stage">stage 0</span>
        </div>
        <p class="pet-desc" id="pet-evo-desc">Still dormant. Log your first session or habits to hatch!</p>
        <div>
          <div class="xp-label">
            <span>XP</span>
            <span id="xp-label">0 / 50</span>
          </div>
          <div class="xp-bar">
            <div class="xp-fill" id="xp-fill" style="width: 0%"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Streak</div>
        <div class="stat-value" id="stat-streak" style="color: var(--accent2)">0</div>
        <div class="stat-sub">days in a row</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Hours coded</div>
        <div class="stat-value" id="stat-hours" style="color: var(--accent3)">0</div>
        <div class="stat-sub">total</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Languages</div>
        <div class="stat-value" id="stat-langs" style="color: var(--accent)">0</div>
        <div class="stat-sub">unique</div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn active" data-tab="session">Log session</button>
      <button class="tab-btn" data-tab="habits">Daily habits</button>
      <button class="tab-btn" data-tab="history">History</button>
    </div>

    <div class="panel active" id="panel-session">
      <div class="form-row">
        <div class="form-group">
          <label for="proj-input">Project / task</label>
          <input type="text" id="proj-input" placeholder="e.g. Built auth flow" />
        </div>
        <div class="form-group">
          <label for="lang-select">Language</label>
          <select id="lang-select">
            <option value="">-- pick one --</option>
            ${langOptions}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="duration-input">Duration (hrs)</label>
          <input type="number" id="duration-input" min="0.25" max="24" step="0.25" placeholder="e.g. 1.5" />
        </div>
        <div class="form-group">
          <label for="vibe-select">Vibe</label>
          <select id="vibe-select">
            <option value="flow">In the flow</option>
            <option value="grind">Hard grind</option>
            <option value="learn">Learning mode</option>
            <option value="debug">Debugging hell</option>
            <option value="chill">Chill session</option>
          </select>
        </div>
      </div>
      <button class="btn-primary" id="log-session-btn">+ Log session &amp; earn XP</button>
    </div>

    <div class="panel" id="panel-habits">
      <div class="habits-list" id="habits-list"></div>
      <button class="btn-primary" id="claim-habits-btn">Claim daily habit XP</button>
    </div>

    <div class="panel" id="panel-history">
      <div class="log-list" id="log-list">
        <div class="empty-state">No sessions yet. Start coding!</div>
      </div>
    </div>

    <div class="toast" id="toast"></div>
  `;
}