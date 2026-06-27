// ── Reactive Store with Pub/Sub + localStorage persistence ─────────────────
import { EVOS, BADGES, WEEKLY_CHALLENGES, INVENTORY_ITEMS, MOOD_DECAY, IDLE_DECAY_HOURS } from './data.js';

const STORAGE_KEY = 'v1:codepet:state';
const SCHEMA_VERSION = 1;

// ── Default state factory ──────────────────────────────────────────────────
function createDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    // Pet identity
    petName: '',
    // Core progression
    xp: 0,
    totalXP: 0,
    level: 1,
    // Activity tracking
    streak: 0,
    totalHours: 0,
    totalSessions: 0,
    languages: [],
    sessions: [],
    lastActiveDate: null,
    // Habits
    habitsToday: [],
    habitsClaimed: false,
    // Mood system
    mood: 100,
    lastSessionDate: null,
    // Badges
    badges: [],
    // Weekly challenges
    weeklyChallenges: [],
    weekStartDate: null,
    // Inventory
    inventory: [],
    activeBoosts: [],
    // Settings
    theme: 'dark',
    accentPreset: 'green',
    soundEnabled: false,
    // Onboarding
    onboardingComplete: false,
    // Leaderboard
    leaderboardCode: null,
    leaderboardOptIn: false,
  };
}

// ── Store class ────────────────────────────────────────────────────────────
class Store {
  constructor() {
    this._state = null;
    this._listeners = new Map();
    this._batching = false;
    this._pendingNotify = false;
  }

  // ── State access ────────────────────────────────────────────────────────
  getState() {
    return this._state;
  }

  // ── Persistence ─────────────────────────────────────────────────────────
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // Merge with defaults to handle schema migrations
        const defaults = createDefaultState();
        this._state = { ...defaults, ...saved };
        // Ensure schema version is current
        if (this._state.schemaVersion !== SCHEMA_VERSION) {
          this._migrateSchema(this._state);
        }
      } else {
        this._state = createDefaultState();
      }
    } catch (e) {
      console.warn('Failed to load state, using defaults:', e);
      this._state = createDefaultState();
    }
    return this._state;
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  _migrate(state) {
    // Handle future schema migrations here
    state.schemaVersion = SCHEMA_VERSION;
  }

  // ── Pub/Sub ─────────────────────────────────────────────────────────────
  subscribe(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    this._listeners.get(key).add(callback);
    return () => this._listeners.get(key).delete(callback);
  }

  notify(key, payload) {
    if (this._batching) {
      this._pendingNotify = true;
      this._pendingKey = key;
      this._pendingPayload = payload;
      return;
    }
    const listeners = this._listeners.get(key);
    if (listeners) {
      listeners.forEach(cb => {
        try { cb(payload, this._state); } catch (e) { console.error('Listener error:', e); }
      });
    }
  }

  batch(fn) {
    this._batching = true;
    this._pendingNotify = false;
    try {
      fn();
    } finally {
      this._batching = false;
      if (this._pendingNotify) {
        this.notify(this._pendingKey, this._pendingPayload);
        this._pendingNotify = false;
      }
    }
  }

  // ── State mutations ─────────────────────────────────────────────────────
  setState(updates, notifyKeys = ['state']) {
    this.batch(() => {
      if (typeof updates === 'function') {
        this._state = { ...this._state, ...updates(this._state) };
      } else {
        this._state = { ...this._state, ...updates };
      }
      this.save();
    });
    notifyKeys.forEach(key => this.notify(key, this._state));
  }

  // ── Derived getters ─────────────────────────────────────────────────────
  getEvolution() {
    const totalXP = this._state.totalXP;
    for (let i = EVOS.length - 1; i >= 0; i--) {
      if (totalXP >= EVOS[i].minXP) return EVOS[i];
    }
    return EVOS[0];
  }

  getStreakMultiplier() {
    const streak = this._state.streak;
    return 1 + Math.min(streak * 0.05, 0.5);
  }

  getXPForNextLevel() {
    return Math.round(50 * Math.pow(this._state.level, 1.4));
  }

  getXPProgress() {
    const needed = this.getXPForNextLevel();
    return Math.min(100, Math.round((this._state.xp / needed) * 100));
  }

  getMoodStatus() {
    const mood = this._state.mood;
    if (mood >= 80) return { status: 'happy', emoji: '😊', label: 'Happy' };
    if (mood >= 50) return { status: 'okay', emoji: '😐', label: 'Okay' };
    if (mood >= 25) return { status: 'sad', emoji: '😢', label: 'Sad' };
    return { status: 'depressed', emoji: '😭', label: 'Depressed' };
  }

  getActiveBoost() {
    const now = Date.now();
    const active = this._state.activeBoosts.find(b => b.expiresAt > now);
    return active || null;
  }

  getBoostMultiplier() {
    const boost = this.getActiveBoost();
    return boost ? 1 + boost.amount : 1;
  }

  getWeeklyProgress() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekSessions = this._state.sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= weekStart;
    });
    
    const weekHours = weekSessions.reduce((sum, s) => sum + s.hours, 0);
    const weekStreak = this._calculateWeeklyStreak();
    
    return { weekSessions, weekHours, weekStreak };
  }

  _calculateWeeklyStreak() {
    // Simplified: return current overall streak
    return this._state.streak;
  }

  // ── Idle decay check ────────────────────────────────────────────────────
  checkIdleDecay() {
    const now = Date.now();
    const lastSession = this._state.lastSessionDate;
    if (!lastSession) return;
    
    const hoursSinceLastSession = (now - lastSession) / (1000 * 60 * 60);
    if (hoursSinceLastSession >= IDLE_DECAY_HOURS) {
      const newMood = Math.max(0, this._state.mood - MOOD_DECAY);
      if (newMood !== this._state.mood) {
        this.setState({ mood: newMood }, ['mood']);
      }
    }
  }

  // ── Badge checking ──────────────────────────────────────────────────────
  checkBadges() {
    const state = this._state;
    const newBadges = [...state.badges];
    let added = false;

    const check = (id, condition) => {
      if (!newBadges.includes(id) && condition) {
        newBadges.push(id);
        added = true;
      }
    };

    // First session
    check('first_session', state.totalSessions >= 1);
    // First habit
    check('first_habit', state.badges.includes('first_session') && state.totalSessions >= 1);
    // Streaks
    check('streak_3', state.streak >= 3);
    check('streak_7', state.streak >= 7);
    check('streak_30', state.streak >= 30);
    // Hours
    check('hours_10', state.totalHours >= 10);
    check('hours_50', state.totalHours >= 50);
    check('hours_100', state.totalHours >= 100);
    // Languages
    check('langs_3', state.languages.length >= 3);
    check('langs_5', state.languages.length >= 5);
    // Evolution
    const evo = this.getEvolution();
    check('evolve_2', EVOS.indexOf(evo) >= 2);
    check('evolve_4', EVOS.indexOf(evo) >= 4);
    check('evolve_6', EVOS.indexOf(evo) >= 6);
    // XP milestones
    check('xp_500', state.totalXP >= 500);
    check('xp_1000', state.totalXP >= 1000);
    check('xp_2500', state.totalXP >= 2500);

    if (added) {
      this.setState({ badges: newBadges }, ['badges']);
    }
    return added ? newBadges.filter(b => !state.badges.includes(b)) : [];
  }
}

// ── Singleton ──────────────────────────────────────────────────────────────
export const store = new Store();
