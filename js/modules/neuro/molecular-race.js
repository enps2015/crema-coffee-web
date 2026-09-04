/**
 * Neuro Section — Corrida pelo Receptor (A₁ / A₂A Competitive Antagonism)
 * Editorial & Micro-Cinematographic Visualization Module
 *
 * Adheres strictly to the Frozen Design Spec (Phase 2B.1 / 2B.2)
 */

import { $ } from '../../utils/dom.js';

// Qualitative Visual States Definition (SPEC FREEZE)
const VISUAL_STATES = {
  BASAL: {
    stateLabel: 'Equilíbrio basal',
    signalLabel: 'Predominante',
    signalClass: 'sig-high',
    caffeineRatio: 0,
    dockAllocation: ['adenosine', 'adenosine', 'adenosine', 'adenosine']
  },
  INFLUX: {
    stateLabel: 'Influxo e competição inicial',
    signalLabel: 'Em transição',
    signalClass: 'sig-mid',
    caffeineRatio: 0.45,
    dockAllocation: ['caffeine', 'adenosine', 'caffeine', 'adenosine']
  },
  ANTAGONIST: {
    stateLabel: 'Predominância antagonista',
    signalLabel: 'Atenuada',
    signalClass: 'sig-low',
    caffeineRatio: 0.85,
    dockAllocation: ['caffeine', 'caffeine', 'caffeine', 'adenosine']
  },
  CLEARANCE: {
    stateLabel: 'Transição em desescalada',
    signalLabel: 'Retomando influência',
    signalClass: 'sig-trans',
    caffeineRatio: 0.35,
    dockAllocation: ['adenosine', 'caffeine', 'adenosine', 'adenosine']
  },
  OFFSET: {
    stateLabel: 'Retomada da influência da adenosina',
    signalLabel: 'Maior influência relativa',
    signalClass: 'sig-high',
    caffeineRatio: 0.1,
    dockAllocation: ['adenosine', 'adenosine', 'adenosine', 'adenosine']
  }
};

/**
 * Classify visual state strictly as a heuristic threshold.
 * Priority-based evaluation ensures states are mutually exclusive.
 * Visual heuristic only. Not a receptor occupancy model.
 * @param {number} timeMinutes
 * @param {number} concentrationMgL
 */
function classifyVisualState(timeMinutes, concentrationMgL) {
  // Priority 1: Basal equilibrium (very early, low concentration)
  if (timeMinutes <= 15 && concentrationMgL < 0.15) return VISUAL_STATES.BASAL;
  
  // Priority 2: Full offset (very late, low concentration)
  if (timeMinutes > 300 && concentrationMgL < 0.35) return VISUAL_STATES.OFFSET;
  
  // Priority 3: Clearance phase (late, dropping concentration)
  if (timeMinutes > 120 && concentrationMgL < 1.30) return VISUAL_STATES.CLEARANCE;
  
  // Priority 4: Antagonist predominance (high concentration)
  if (concentrationMgL >= 1.00) return VISUAL_STATES.ANTAGONIST;
  
  // Priority 5: Influx / transition (everything else)
  return VISUAL_STATES.INFLUX;
}

export class MolecularRace {
  constructor(options = {}) {
    this.options = options;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.svg = null;
    this.stateLabelEl = null;
    this.signalLabelEl = null;

    this.width = 460;
    this.height = 220;
    this.dpr = 1;

    this.particles = [];
    this.receptors = [];
    this.activeState = VISUAL_STATES.BASAL;

    this.rafId = null;
    this.lastTime = 0;
    this.isVisible = false;
    this.isReducedMotion = false;
    this.observer = null;
    this.resizeHandler = null;
    this.isInitialized = false;

    this.wavePhase = 0;
  }

  /**
   * Initialize canvas, SVG overlay, receptors, and particle system
   * @param {string|HTMLElement} [containerSelector]
   */
  init(containerSelector = '#molecularStage') {
    this.container = typeof containerSelector === 'string'
      ? $(containerSelector)
      : containerSelector;

    if (!this.container) return;

    this.canvas = this.container.querySelector('#molecularCanvas') || $('#molecularCanvas');
    this.svg = this.container.querySelector('#receptorSvg') || $('#receptorSvg');
    this.stateLabelEl = this.container.querySelector('#molStateLabel') || $('#molStateLabel');
    this.signalLabelEl = this.container.querySelector('#molSignalLabel') || $('#molSignalLabel');

    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    // Detect reduced motion
    this.isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.setupViewport();
    this.initReceptors();
    this.initParticles();
    this.setupObserver();

    this.resizeHandler = () => {
      this.setupViewport();
      this.initReceptors();
    };
    window.addEventListener('resize', this.resizeHandler, { passive: true });

    this.isInitialized = true;
    this.updateReadout(this.activeState);

    if (this.isVisible && !this.isReducedMotion) {
      this.startLoop();
    } else {
      this.render();
    }
  }

  setupViewport() {
    if (!this.canvas || !this.canvas.parentElement) return;

    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = Math.max(300, Math.floor(rect.width || 460));
    this.height = Math.max(180, Math.floor(rect.height || 220));

    this.dpr = Math.min(2.0, window.devicePixelRatio || 1);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  initReceptors() {
    const isMobile = this.width < 480;
    const receptorCount = isMobile ? 3 : 4;
    const receptorTypes = isMobile ? ['A₁', 'A₂A', 'A₁'] : ['A₁', 'A₂A', 'A₁', 'A₂A'];

    const membraneY = this.height - 34;
    const stepX = this.width / (receptorCount + 1);

    this.receptors = [];
    for (let i = 0; i < receptorCount; i++) {
      const rx = stepX * (i + 1);
      const ry = membraneY;
      this.receptors.push({
        id: i,
        name: receptorTypes[i],
        x: rx,
        y: ry,
        targetType: this.activeState.dockAllocation[i % this.activeState.dockAllocation.length] || 'adenosine',
        dockedParticle: null,
        signalPulse: 0
      });
    }

    this.renderSvgMembrane();
  }

  renderSvgMembrane() {
    if (!this.svg) return;

    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);

    const membraneY = this.height - 34;
    let svgHtml = `
      <defs>
        <linearGradient id="memGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(181, 122, 51, 0.35)" />
          <stop offset="100%" stop-color="rgba(33, 23, 16, 0.85)" />
        </linearGradient>
      </defs>
      <!-- Post-synaptic Membrane Boundary -->
      <path d="M 0 ${membraneY} Q ${this.width * 0.5} ${membraneY - 6} ${this.width} ${membraneY} L ${this.width} ${this.height} L 0 ${this.height} Z" fill="url(#memGrad)" opacity="0.45"/>
      <path d="M 0 ${membraneY} Q ${this.width * 0.5} ${membraneY - 6} ${this.width} ${membraneY}" fill="none" stroke="rgba(217, 160, 91, 0.4)" stroke-width="1.5" stroke-dasharray="3 4"/>
    `;

    // Render Receptor Docking Pockets
    this.receptors.forEach(r => {
      const pocketW = 28;
      const pocketH = 14;
      svgHtml += `
        <g class="rec-group" transform="translate(${r.x}, ${r.y})">
          <!-- Docking Pocket Outline -->
          <path d="M ${-pocketW / 2} -4 C ${-pocketW / 2} ${pocketH}, ${pocketW / 2} ${pocketH}, ${pocketW / 2} -4" fill="rgba(20, 14, 10, 0.85)" stroke="rgba(217, 160, 91, 0.6)" stroke-width="1.5"/>
          <!-- Receptor Label -->
          <text x="0" y="16" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.5" fill="rgba(233, 223, 206, 0.6)" letter-spacing="0.05em">${r.name}</text>
        </g>
      `;
    });

    this.svg.innerHTML = svgHtml;
  }

  initParticles() {
    const isMobile = this.width < 480;
    const totalCount = isMobile ? 12 : 22;

    this.particles = [];
    const cafTarget = Math.round(totalCount * this.activeState.caffeineRatio);

    for (let i = 0; i < totalCount; i++) {
      const isCaff = i < cafTarget;
      this.particles.push({
        id: i,
        type: isCaff ? 'caffeine' : 'adenosine',
        x: 20 + Math.random() * (this.width - 40),
        y: 18 + Math.random() * (this.height - 75),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        angle: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.015,
        state: 'free', // 'free' | 'docking' | 'docked'
        targetDock: null,
        dockProgress: 0,
        opacity: 0.95
      });
    }
  }

  setupObserver() {
    if (!this.container || typeof IntersectionObserver === 'undefined') {
      this.isVisible = true;
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.isReducedMotion) {
            this.startLoop();
          } else {
            this.stopLoop();
          }
        });
      },
      { threshold: 0.1 }
    );

    this.observer.observe(this.container);
  }

  startLoop() {
    if (this.rafId) return;
    this.lastTime = performance.now();
    const frame = now => {
      const dt = Math.max(0, Math.min(64, now - this.lastTime));
      this.lastTime = now;
      this.updatePhysics(dt);
      this.render();
      this.rafId = requestAnimationFrame(frame);
    };
    this.rafId = requestAnimationFrame(frame);
  }

  stopLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Pure Consumer Update from NeuroController
   * @param {number} timeMinutes
   * @param {number} concentrationMgL
   */
  update(timeMinutes, concentrationMgL) {
    if (!this.isInitialized) return;

    const newState = classifyVisualState(timeMinutes, concentrationMgL);
    if (newState !== this.activeState) {
      this.activeState = newState;
      this.syncStateWithSimulation();
      this.updateReadout(newState);
    }

    if (this.isReducedMotion || !this.isVisible) {
      this.render();
    }
  }

  syncStateWithSimulation() {
    // 1. Update receptor target allocations
    this.receptors.forEach((r, idx) => {
      r.targetType = this.activeState.dockAllocation[idx % this.activeState.dockAllocation.length] || 'adenosine';
      if (r.dockedParticle && r.dockedParticle.type !== r.targetType) {
        // Eject mismatched particle
        r.dockedParticle.state = 'free';
        r.dockedParticle.targetDock = null;
        r.dockedParticle.vy = -0.6;
        r.dockedParticle = null;
      }
    });

    // 2. Adjust particle population type ratios smoothly
    const total = this.particles.length;
    const targetCaffCount = Math.round(total * this.activeState.caffeineRatio);
    let currentCaffCount = this.particles.filter(p => p.type === 'caffeine').length;

    if (currentCaffCount < targetCaffCount) {
      // Convert free adenosine to caffeine
      for (const p of this.particles) {
        if (currentCaffCount >= targetCaffCount) break;
        if (p.type === 'adenosine' && p.state === 'free') {
          p.type = 'caffeine';
          currentCaffCount++;
        }
      }
    } else if (currentCaffCount > targetCaffCount) {
      // Convert free caffeine to adenosine
      for (const p of this.particles) {
        if (currentCaffCount <= targetCaffCount) break;
        if (p.type === 'caffeine' && p.state === 'free') {
          p.type = 'adenosine';
          currentCaffCount--;
        }
      }
    }
  }

  updateReadout(state) {
    if (this.stateLabelEl) {
      this.stateLabelEl.textContent = state.stateLabel;
    }
    if (this.signalLabelEl) {
      this.signalLabelEl.textContent = state.signalLabel;
      this.signalLabelEl.className = `mol-signal ${state.signalClass}`;
    }
  }

  updatePhysics(dt) {
    const timeScale = dt / 16.67;
    this.wavePhase += 0.035 * timeScale;

    // 1. Manage receptor docking
    this.receptors.forEach(rec => {
      if (!rec.dockedParticle) {
        // Find nearest free particle matching targetType
        let bestCandidate = null;
        let bestDist = 120; // Docking capture radius

        for (const p of this.particles) {
          if (p.state === 'free' && p.type === rec.targetType) {
            const dx = rec.x - p.x;
            const dy = rec.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < bestDist) {
              bestDist = dist;
              bestCandidate = p;
            }
          }
        }

        if (bestCandidate) {
          bestCandidate.state = 'docking';
          bestCandidate.targetDock = rec;
          bestCandidate.dockProgress = 0;
          rec.dockedParticle = bestCandidate;
        }
      }
    });

    // 2. Update particle positions and docking interpolation
    const maxY = this.height - 52;

    this.particles.forEach(p => {
      if (p.state === 'docked') {
        if (p.targetDock) {
          p.x = p.targetDock.x;
          p.y = p.targetDock.y - 2;
          p.angle = 0;
        }
        return;
      }

      if (p.state === 'docking' && p.targetDock) {
        p.dockProgress = Math.min(1, p.dockProgress + 0.04 * timeScale);
        p.x += (p.targetDock.x - p.x) * 0.12 * timeScale;
        p.y += ((p.targetDock.y - 2) - p.y) * 0.12 * timeScale;
        p.angle += (0 - p.angle) * 0.15 * timeScale;

        if (p.dockProgress >= 0.98 || Math.hypot(p.targetDock.x - p.x, p.targetDock.y - 2 - p.y) < 1.5) {
          p.state = 'docked';
        }
        return;
      }

      // Free Stylized Diffusive Movement
      p.x += p.vx * timeScale;
      p.y += p.vy * timeScale;
      p.angle += p.vrot * timeScale;

      // Soft boundary collisions
      if (p.x < 14) { p.x = 14; p.vx = Math.abs(p.vx); }
      if (p.x > this.width - 14) { p.x = this.width - 14; p.vx = -Math.abs(p.vx); }
      if (p.y < 14) { p.y = 14; p.vy = Math.abs(p.vy); }
      if (p.y > maxY) { p.y = maxY; p.vy = -Math.abs(p.vy); }
    });
  }

  render() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Adenosinergic Signaling Waves (representação esquemática da sinalização associada à interação)
    this.receptors.forEach(rec => {
      if (rec.dockedParticle && rec.dockedParticle.type === 'adenosine') {
        this.renderSignalingWave(rec.x, rec.y + 4);
      }
    });

    // 2. Render all particles
    this.particles.forEach(p => {
      this.drawMolecule(p);
    });
  }

  renderSignalingWave(originX, originY) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(138, 155, 110, 0.45)';
    ctx.lineWidth = 1.2;

    for (let w = 0; w < 3; w++) {
      const rawRadius = (this.wavePhase * 18 + w * 14) % 42;
      const radius = Math.max(0, (rawRadius + 42) % 42);
      if (radius <= 0) continue;
      const alpha = Math.max(0, 1 - radius / 42) * 0.4;
      ctx.strokeStyle = `rgba(138, 155, 110, ${alpha})`;

      ctx.beginPath();
      ctx.arc(originX, originY, radius, 0.15 * Math.PI, 0.85 * Math.PI, false);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Draw stylized geometric molecule
   * @param {Object} p Particle data
   */
  drawMolecule(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    if (p.type === 'caffeine') {
      // CAFFEINE (Terracotta/Amber #C25E43): Compact Bicyclic Core + 3 Methyl Nodes (1, 3, 7)
      ctx.strokeStyle = '#C25E43';
      ctx.fillStyle = 'rgba(194, 94, 67, 0.22)';
      ctx.lineWidth = 1.6;

      // Hexagon + fused Pentagon Core
      ctx.beginPath();
      ctx.moveTo(-7, -4);
      ctx.lineTo(0, -8);
      ctx.lineTo(7, -4);
      ctx.lineTo(7, 4);
      ctx.lineTo(0, 8);
      ctx.lineTo(-7, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Methyl Group Nodes (CH3)
      ctx.fillStyle = '#D9A05B';
      [[-7, -4], [7, -4], [0, 8]].forEach(([mx, my]) => {
        ctx.beginPath();
        ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Internal Bond Accent
      ctx.strokeStyle = 'rgba(217, 160, 91, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-3, -2);
      ctx.lineTo(3, -2);
      ctx.stroke();
    } else {
      // ADENOSINE (Olive Sage #8A9B6E): Purine Core + Pentagon Ribose Ring
      ctx.strokeStyle = '#8A9B6E';
      ctx.fillStyle = 'rgba(138, 155, 110, 0.20)';
      ctx.lineWidth = 1.6;

      // Purine Double Ring (Elongated)
      ctx.beginPath();
      ctx.moveTo(-8, -6);
      ctx.lineTo(-2, -10);
      ctx.lineTo(4, -6);
      ctx.lineTo(4, 2);
      ctx.lineTo(-2, 6);
      ctx.lineTo(-8, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Linked Ribose Sugar (Pentagon attached below)
      ctx.strokeStyle = '#8A9B6E';
      ctx.fillStyle = 'rgba(138, 155, 110, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(4, 2);
      ctx.lineTo(9, 6);
      ctx.lineTo(7, 12);
      ctx.lineTo(1, 12);
      ctx.lineTo(-1, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Purine NH2 Group Node
      ctx.fillStyle = '#C2D1A4';
      ctx.beginPath();
      ctx.arc(-2, -10, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Cleanup method
   */
  destroy() {
    this.stopLoop();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    this.isInitialized = false;
  }
}

export function createMolecularRace(options) {
  const race = new MolecularRace(options);
  return race;
}
