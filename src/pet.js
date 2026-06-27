// ── Pet Evolution System ───────────────────────────────────────────────────
import { EVOS } from './data.js';

// ── SVG Pet Sprites ────────────────────────────────────────────────────────
export const PET_SPRITES = {
  egg: (color) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="eggGrad" cx="40%" cy="30%">
        <stop offset="0%" stop-color="#4a4a60"/>
        <stop offset="100%" stop-color="#2a2a38"/>
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="55" rx="22" ry="28" fill="url(#eggGrad)" stroke="#555" stroke-width="2"/>
    <ellipse cx="42" cy="45" rx="5" ry="7" fill="#4a4a60" opacity="0.6"/>
    <circle cx="50" cy="50" r="2" fill="#666" opacity="0.4"/>
  </svg>`,

  hatchling: (color) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="hatchGrad" cx="40%" cy="30%">
        <stop offset="0%" stop-color="${lighten(color, 30)}"/>
        <stop offset="100%" stop-color="${color}"/>
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="54" rx="18" ry="20" fill="url(#hatchGrad)"/>
    <ellipse cx="50" cy="72" rx="8" ry="5" fill="${color}"/>
    <circle cx="44" cy="50" r="4" fill="#fff"/>
    <circle cx="56" cy="50" r="4" fill="#fff"/>
    <circle cx="44" cy="50" r="2" fill="#000"/>
    <circle cx="56" cy="50" r="2" fill="#000"/>
    <ellipse cx="50" cy="58" rx="2" ry="1.5" fill="#000"/>
  </svg>`,

  apprentice: (color) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="appGrad" cx="40%" cy="30%">
        <stop offset="0%" stop-color="${lighten(color, 30)}"/>
        <stop offset="100%" stop-color="${color}"/>
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="52" rx="20" ry="22" fill="url(#appGrad)"/>
    <ellipse cx="42" cy="48" rx="12" ry="14" fill="rgba(255,255,255,0.12)"/>
    <circle cx="43" cy="46" r="4.5" fill="#fff"/>
    <circle cx="57" cy="46" r="4.5" fill="#fff"/>
    <circle cx="43" cy="46" r="2.5" fill="#1a1a2e"/>
    <circle cx="57" cy="46" r="2.5" fill="#1a1a2e"/>
    <ellipse cx="50" cy="56" rx="2.5" ry="1.5" fill="#000"/>
    <path d="M 36 38 Q 30 28 34 22" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="34" cy="22" r="2" fill="${color}"/>
    <path d="M 64 38 Q 70 28 66 22" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="66" cy="22" r="2" fill="${color}"/>
  </svg>`,

  dev: (color) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="devGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lighten(color, 20)}"/>
        <stop offset="100%" stop-color="${darken(color, 20)}"/>
      </linearGradient>
    </defs>
    <path d="M 50 22 L 68 36 L 68 68 L 32 68 L 32 36 Z" fill="url(#devGrad)" stroke="${color}" stroke-width="2"/>
    <path d="M 50 22 L 68 36 L 62 36 L 50 26 L 38 36 L 32 36 Z" fill="${color}"/>
    <circle cx="42" cy="48" r="3.5" fill="#fff"/>
    <circle cx="58" cy="48" r="3.5" fill="#fff"/>
    <circle cx="42" cy="48" r="1.8" fill="#000"/>
    <circle cx="58" cy="48" r="1.8" fill="#000"/>
    <ellipse cx="50" cy="58" rx="3" ry="2" fill="#000"/>
    <rect x="44" y="62" width="12" height="2" rx="1" fill="${color}" opacity="0.5"/>
  </svg>`,

  senior_dev: (color) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="seniorGrad" cx="50%" cy="40%">
        <stop offset="0%" stop-color="${lighten(color, 30)}"/>
        <stop offset="100%" stop-color="${color}"/>
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="52" rx="22" ry="24" fill="url(#seniorGrad)"/>
    <ellipse cx="50" cy="52" rx="14" ry="16" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <circle cx="42" cy="46" r="5" fill="#fff"/>
    <circle cx="58" cy="46" r="5" fill="#fff"/>
    <circle cx="42" cy="46" r="2.8" fill="${color}"/>
    <circle cx="58" cy="46" r="2.8" fill="${color}"/>
    <ellipse cx="50" cy="58" rx="3" ry="2" fill="#000"/>
    <path d="M 38 34 Q 50 28 62 34" stroke="${lighten(color, 20)}" stroke-width="2" fill="none"/>
    <circle cx="50" cy="30" r="3" fill="${lighten(color, 20)}"/>
  </svg>`,

  architect: (color) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="archGrad" cx="50%" cy="40%">
        <stop offset="0%" stop-color="${lighten(color, 40)}"/>
        <stop offset="100%" stop-color="${color}"/>
      </radialGradient>
    </defs>
    ${[0,1,2,3,4,5].map(i => {
      const angle = (i / 6) * Math.PI * 2;
      const x = 50 + Math.cos(angle) * 32;
      const y = 50 + Math.sin(angle) * 18;
      return `<circle cx="${x}" cy="${y}" r="3" fill="${color}" opacity="${0.3 + 0.4 * Math.abs(Math.sin(angle))}"/>`;
    }).join('')}
    <ellipse cx="50" cy="52" rx="20" ry="22" fill="url(#archGrad)"/>
    <ellipse cx="50" cy="52" rx="14" ry="16" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
    <circle cx="42" cy="46" r="4.5" fill="#fff"/>
    <circle cx="58" cy="46" r="4.5" fill="#fff"/>
    <circle cx="42" cy="46" r="2.5" fill="${darken(color, 30)}"/>
    <circle cx="58" cy="46" r="2.5" fill="${darken(color, 30)}"/>
    <ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#000"/>
    <path d="M 44 36 L 50 30 L 56 36" stroke="${lighten(color, 20)}" stroke-width="2" fill="none"/>
  </svg>`,

  syntaxlord: (color) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="syntaxGrad" cx="50%" cy="50%">
        <stop offset="0%" stop-color="${lighten(color, 50)}"/>
        <stop offset="100%" stop-color="${color}"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    ${[0,1,2,3,4,5,6,7].map(i => {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = 50 + Math.cos(angle) * 8;
      const y1 = 50 + Math.sin(angle) * 8;
      const x2 = 50 + Math.cos(angle) * 26;
      const y2 = 50 + Math.sin(angle) * 26;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${i % 2 === 0 ? color : '#1e1e28'}" stroke-width="3" stroke-linecap="round"/>`;
    }).join('')}
    <circle cx="50" cy="50" r="14" fill="url(#syntaxGrad)" filter="url(#glow)"/>
    <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5">
      <animate attributeName="r" values="9;11;9" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="44" cy="46" r="3.5" fill="#fff"/>
    <circle cx="56" cy="46" r="3.5" fill="#fff"/>
    <circle cx="44" cy="46" r="1.8" fill="#000"/>
    <circle cx="56" cy="46" r="1.8" fill="#000"/>
    <ellipse cx="50" cy="54" rx="2" ry="1.2" fill="#000"/>
  </svg>`,
};

// ── Color helpers ───────────────────────────────────────────────────────────
function lighten(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function darken(hex, percent) {
  return lighten(hex, -percent);
}

// ── Pet sprite getter ───────────────────────────────────────────────────────
export function getPetSprite(evoId) {
  const evo = EVOS.find(e => e.id === evoId) || EVOS[0];
  const spriteFn = PET_SPRITES[evoId] || PET_SPRITES.egg;
  return spriteFn(evo.color);
}

// ── Pet name generator ──────────────────────────────────────────────────────
export function generatePetName() {
  const prefixes = ['Bit', 'Byte', 'Code', 'Dev', 'Git', 'Hex', 'Loop', 'Node', 'Pix', 'Ram', 'Syn', 'Var'];
  const suffixes = ['bit', 'bug', 'cat', 'fox', 'kit', 'pet', 'pup', 'ryu', 'tux', 'wiz'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return prefix + suffix;
}

// ── Evolution check ─────────────────────────────────────────────────────────
export function checkEvolution(state) {
  const totalXP = state.totalXP;
  let newEvo = EVOS[0];
  for (let i = EVOS.length - 1; i >= 0; i--) {
    if (totalXP >= EVOS[i].minXP) {
      newEvo = EVOS[i];
      break;
    }
  }
  return newEvo;
}
