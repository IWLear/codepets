// ── CodePets Entry Point ────────────────────────────────────────────────────
import './styles.css';
import { store } from './store.js';
import { initUI, renderAll, navigateTo, showOnboarding, completeOnboarding, handleLogSession, handleClaimHabits, toggleTheme, toggleSound, showConfetti } from './ui.js';
import { EVOS } from './data.js';

// ── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Load state
  store.load();
  
  // Check idle decay
  store.checkIdleDecay();
  
  // Build the app
  buildApp();
  
  // Initialize UI
  initUI();
  
  // Initial render
  renderAll();
  
  // Show onboarding if needed
  const state = store.getState();
  if (!state.onboardingComplete) {
    showOnboarding();
  } else {
    navigateTo('pet');
  }
  
  // Bind global events
  bindGlobalEvents();
  
  // Check for badges
  store.checkBadges();
  
  // Track previous evolution for change detection

});

// ── Build App Shell ─────────────────────────────────────────────────────────
function buildApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Confetti Canvas -->
    <canvas id="confetti-canvas" style="display: none; position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;"></canvas>
    
    <!-- Onboarding Modal -->
    <div id="onboarding-modal" class="modal">
      <div class="modal-content">
        <div class="onboarding-header">
          <div class="onboarding-emoji">🥚</div>
          <h2>Welcome to CodePets!</h2>
          <p>Your digital companion that grows with your coding journey.</p>
        </div>
        <div class="onboarding-form">
          <label for="pet-name-input">Name your pet:</label>
          <input type="text" id="pet-name-input" placeholder="e.g. Byte, CodeCat..." maxlength="20" />
          <button id="start-btn" class="btn-primary btn-large">Start Coding! 🚀</button>
        </div>
      </div>
    </div>
    
    <!-- Main App -->
    <div id="main-app" class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <div class="eyebrow">CODEPETS</div>
          <h1 class="app-title">CodePet</h1>
        </div>
        <div class="header-right">
          <button id="settings-btn" class="icon-btn" title="Settings">⚙️</button>
        </div>
      </header>
      
      <!-- Pet Card -->
      <div id="pet-card" class="pet-card">
        <div class="pet-display">
          <div id="pet-sprite" class="pet-sprite"></div>
          <div class="pet-meta">
            <div class="pet-name-row">
              <span id="pet-name" class="pet-name">Your Pet</span>
              <span id="pet-evo-emoji" class="pet-evo-emoji">🥚</span>
            </div>
            <div id="pet-evo-name" class="pet-evo-name">Egg</div>
            <div id="pet-evo-stage" class="pet-evo-stage">Stage 0</div>
            <p id="pet-evo-desc" class="pet-evo-desc">Still dormant. Log your first session or habits to hatch!</p>
          </div>
        </div>
        
        <!-- XP Bar -->
        <div class="xp-section">
          <div class="xp-header">
            <span class="xp-label">XP</span>
            <span id="xp-label" class="xp-value">0 / 50</span>
            <span id="level-display" class="level-badge">Lv.1</span>
          </div>
          <div class="xp-bar">
            <div id="xp-fill" class="xp-fill" style="width: 0%"></div>
          </div>
        </div>
        
        <!-- Mood Bar -->
        <div class="mood-section">
          <div class="mood-header">
            <span id="mood-emoji" class="mood-emoji">😊</span>
            <span id="mood-label" class="mood-label">Happy</span>
            <span id="boost-indicator" class="boost-indicator" style="display: none;">
              ⚡ <span id="boost-timer">0m</span>
            </span>
          </div>
          <div class="mood-bar">
            <div id="mood-bar-fill" class="mood-bar-fill" style="width: 100%"></div>
          </div>
        </div>
      </div>
      
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value" id="stat-streak">0</div>
          <div class="stat-label">Streak</div>
          <div id="streak-fire" class="streak-fire"></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value" id="stat-hours">0</div>
          <div class="stat-label">Hours</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-value" id="stat-sessions">0</div>
          <div class="stat-label">Sessions</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💎</div>
          <div class="stat-value" id="stat-xp">0</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🌍</div>
          <div class="stat-value" id="stat-langs">0</div>
          <div class="stat-label">Languages</div>
        </div>
      </div>
      
      <!-- Bottom Navigation -->
      <nav id="bottom-nav" class="bottom-nav">
        <button class="nav-btn active" data-view="pet">
          <span class="nav-icon">🐾</span>
          <span class="nav-label">Pet</span>
        </button>
        <button class="nav-btn" data-view="log">
          <span class="nav-icon">➕</span>
          <span class="nav-label">Log</span>
        </button>
        <button class="nav-btn" data-view="habits">
          <span class="nav-icon">✅</span>
          <span class="nav-label">Habits</span>
        </button>
        <button class="nav-btn" data-view="history">
          <span class="nav-icon">📜</span>
          <span class="nav-label">History</span>
        </button>
        <button class="nav-btn" data-view="badges">
          <span class="nav-icon">🏆</span>
          <span class="nav-label">Badges</span>
        </button>
      </nav>
      
      <!-- View Panels -->
      <div class="view-panels">
        <!-- Pet View (default) -->
        <div class="view-panel active" data-view="pet">
          <div class="panel-content">
            <h3 class="panel-title">Your Companion</h3>
            <p class="panel-subtitle">Keep coding to help your pet evolve!</p>
            <div class="evolution-progress">
              ${EVOS.map((evo, i) => `
                <div class="evo-step ${i === 0 ? 'active' : ''}" data-evo="${evo.id}">
                  <div class="evo-emoji">${evo.emoji}</div>
                  <div class="evo-name">${evo.name}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <!-- Log Session View -->
        <div class="view-panel" data-view="log">
          <div class="panel-content">
            <h3 class="panel-title">Log Session</h3>
            <form id="session-form" class="session-form">
              <div class="form-group">
                <label for="project-input">Project / Task</label>
                <input type="text" id="project-input" placeholder="e.g. Built auth flow" autocomplete="off" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="language-select">Language</label>
                  <select id="language-select">
                    <option value="">-- pick one --</option>
                    ${LANGUAGES.map(l => `<option value="${l}">${l}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="duration-input">Duration (min)</label>
                  <input type="number" id="duration-input" min="1" max="720" step="1" placeholder="e.g. 60" />
                </div>
              </div>
              <div class="form-group">
                <label for="vibe-select">Vibe</label>
                <select id="vibe-select">
                  <option value="flow">In the flow (+30%)</option>
                  <option value="learn">Learning mode (+20%)</option>
                  <option value="grind">Hard grind (normal)</option>
                  <option value="debug">Debugging hell (normal)</option>
                  <option value="chill">Chill session (-10%)</option>
                </select>
              </div>
              <div class="form-group">
                <label for="notes-input">Notes (optional)</label>
                <textarea id="notes-input" placeholder="What did you work on?" rows="2"></textarea>
              </div>
              <button type="submit" class="btn-primary btn-large">+ Log Session & Earn XP</button>
            </form>
          </div>
        </div>
        
        <!-- Habits View -->
        <div class="view-panel" data-view="habits">
          <div class="panel-content">
            <h3 class="panel-title">Daily Habits</h3>
            <p class="panel-subtitle">Complete all 4 for a bonus multiplier!</p>
            <div id="habits-list" class="habits-list"></div>
            <button id="claim-habits-btn" class="btn-primary">Claim daily habit XP</button>
          </div>
        </div>
        
        <!-- History View -->
        <div class="view-panel" data-view="history">
          <div class="panel-content">
            <h3 class="panel-title">Session History</h3>
            <div id="log-list" class="log-list">
              <div class="empty-state">No sessions yet. Start coding!</div>
            </div>
          </div>
        </div>
        
        <!-- Badges View -->
        <div class="view-panel" data-view="badges">
          <div class="panel-content">
            <h3 class="panel-title">Badge Collection</h3>
            <p class="panel-subtitle">Earn badges by hitting milestones!</p>
            <div id="badges-grid" class="badges-grid"></div>
          </div>
        </div>
      </div>
      
      <!-- Toast -->
      <div id="toast" class="toast"></div>
    </div>
  `;
  
  // Bind view navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });
  
  // Bind onboarding
  document.getElementById('start-btn').addEventListener('click', () => {
    const name = document.getElementById('pet-name-input').value.trim();
    if (name) {
      completeOnboarding(name);
    } else {
      completeOnboarding(generatePetName());
    }
  });
  
  // Bind session form
  document.getElementById('session-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      project: document.getElementById('project-input').value,
      language: document.getElementById('language-select').value,
      duration: document.getElementById('duration-input').value,
      vibe: document.getElementById('vibe-select').value,
      notes: document.getElementById('notes-input').value,
    };
    if (handleLogSession(formData)) {
      e.target.reset();
    }
  });
  
  // Bind claim habits
  document.getElementById('claim-habits-btn').addEventListener('click', handleClaimHabits);
  
  // Bind settings
  document.getElementById('settings-btn').addEventListener('click', () => {
    // Simple settings toggle - cycle through accent presets
    const state = store.getState();
    const presets = Object.keys(ACCENT_PRESETS);
    const currentIndex = presets.indexOf(state.accentPreset);
    const nextIndex = (currentIndex + 1) % presets.length;
    store.setState({ accentPreset: presets[nextIndex] }, ['state']);
    showToast(`Theme: ${ACCENT_PRESETS[presets[nextIndex]].name}`);
  });
}

// ── Global Event Bindings ───────────────────────────────────────────────────
function bindGlobalEvents() {
  // Keyboard shortcut: L to open log session
  document.addEventListener('keydown', (e) => {
    if (e.key === 'l' || e.key === 'L') {
      // Don't trigger if user is typing in an input
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      navigateTo('log');
      setTimeout(() => document.getElementById('project-input')?.focus(), 100);
    }
  });
  
  // Handle window resize for confetti canvas
  window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
}
