import { EVOS } from './data.js';

let animFrame = null;

// ── Public API ─────────────────────────────────────────────────────────────
export function startPetAnimation(canvas, evo) {
  stopPetAnimation();
  loop(canvas, evo);
}

export function stopPetAnimation() {
  if (animFrame) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
  }
}

// ── Animation loop ─────────────────────────────────────────────────────────
function loop(canvas, evo) {
  animFrame = requestAnimationFrame(() => {
    drawPet(canvas, evo);
    loop(canvas, evo);
  });
}

// ── Main draw dispatcher ───────────────────────────────────────────────────
function drawPet(canvas, evo) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() / 1000;
  const bob = Math.sin(t * 1.8) * 3;
  const stage = EVOS.indexOf(evo);

  ctx.save();
  ctx.translate(w / 2, h / 2 + bob);

  switch (stage) {
    case 0: drawEgg(ctx, t); break;
    case 1: drawByteling(ctx, evo.color); break;
    case 2: drawCodeling(ctx, evo.color, t); break;
    case 3: drawDebugmon(ctx, evo.color); break;
    case 4: drawArchimander(ctx, evo.color, t); break;
    default: drawSyntaxlord(ctx, evo.color, t); break;
  }

  ctx.restore();
}

// ── Stage drawers ──────────────────────────────────────────────────────────
function drawEgg(ctx) {
  ctx.fillStyle = '#2a2a38';
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 5, 22, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Shine
  ctx.fillStyle = '#4a4a60';
  ctx.beginPath();
  ctx.ellipse(-8, -6, 5, 7, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawByteling(ctx, color) {
  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 4, 18, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-6, -2, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, -2, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(-6, -1, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -1, 2.5, 0, Math.PI * 2); ctx.fill();
  // Foot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 18, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCodeling(ctx, color, t) {
  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 2, 20, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.ellipse(-5, -5, 12, 14, -0.2, 0, Math.PI);
  ctx.fill();
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-7, -4, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(7, -4, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.arc(-7, -3, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(7, -3, 3, 0, Math.PI * 2); ctx.fill();
  // Antennae (wobble with time)
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  const wobble = Math.sin(t * 2) * 3;
  ctx.beginPath(); ctx.moveTo(-14, 4); ctx.quadraticCurveTo(-26 + wobble, -4, -20, -14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14, 4); ctx.quadraticCurveTo(26 - wobble, -4, 20, -14); ctx.stroke();
}

function drawDebugmon(ctx, color) {
  // Dark body
  ctx.fillStyle = '#1e1e28';
  ctx.beginPath();
  ctx.moveTo(0, -28); ctx.lineTo(20, -10);
  ctx.lineTo(20, 20); ctx.lineTo(-20, 20); ctx.lineTo(-20, -10);
  ctx.closePath();
  ctx.fill();
  // Crown spike
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -28); ctx.lineTo(20, -10); ctx.lineTo(14, -10);
  ctx.lineTo(0, -22); ctx.lineTo(-14, -10); ctx.lineTo(-20, -10);
  ctx.closePath();
  ctx.fill();
  // Side orbs
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(-8, 2, 6, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(8, 2, 6, 7, 0, 0, Math.PI * 2); ctx.fill();
  // Eye whites
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-8, 1, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(8, 1, 3, 0, Math.PI * 2); ctx.fill();
  // Pupils
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(-8, 1, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(8, 1, 1.5, 0, Math.PI * 2); ctx.fill();
}

function drawArchimander(ctx, color, t) {
  // Orbiting particles
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + t * 0.8;
    const px = Math.cos(angle) * 32;
    const py = Math.sin(angle) * 18;
    const alpha = 0.3 + 0.4 * Math.abs(Math.sin(angle));
    ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  // Inner glow ring
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 17, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-6, -3, 4.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, -3, 4.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(-6, -2, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -2, 2.5, 0, Math.PI * 2); ctx.fill();
}

function drawSyntaxlord(ctx, color, t) {
  // Spinning crown spikes
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i / 8) * Math.PI * 2 + t * 0.25);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(10, -26); ctx.lineTo(0, -22); ctx.lineTo(-10, -26);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? color : '#1e1e28';
    ctx.fill();
    ctx.restore();
  }
  // Core body
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
  // Inner ring pulse
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  ctx.strokeStyle = `rgba(255,255,255,${0.1 + pulse * 0.3})`;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.stroke();
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-4.5, -1.5, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(4.5, -1.5, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(-4.5, -1, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4.5, -1, 1.8, 0, Math.PI * 2); ctx.fill();
}
