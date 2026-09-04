/**
 * CREMA° Anatomy 3D Lab — Master Controller (FASE C Hardening)
 * Features:
 * - Progressive Lazy Loading & On-Demand Architecture
 * - 7 Topics (Brain, Heart, Lungs, Liver, Kidneys, Intestines, Muscles)
 * - Real In-Flight Production Telemetry
 * - Idle Background Prefetcher
 */
import { GhostAnatomyScene } from './scene.js';
import { ProgressiveHuBMAPLoader, ORGAN_CONFIGS } from './loader.js';
import { ProgressiveLabInteraction } from './interaction.js';
import { FallbackManager } from './fallback.js';
import { ORGAN_DICTIONARY } from './organ-data.js';

class AnatomyLabController {
  constructor() {
    this.scene = null;
    this.loader = null;
    this.interaction = null;
    this.fallback = null;

    this.activeOrganKey = 'heart';
    this.isGhostShellVisible = true;
    this.isLoopRunning = false;
    this.animationId = null;

    // Idle Prefetcher state
    this.prefetchTimer = null;
    this.prefetchIndex = 0;
    this.prefetchQueue = ['brain', 'liver', 'kidneys', 'intestines', 'lungs'];
  }

  async init() {
    // 1. Diagnostics & Fallback Manager
    this.fallback = new FallbackManager({
      onOrganSelect: key => this.selectOrgan(key)
    });

    const diagnostics = this.fallback.getWebGLDiagnostics();
    this.updateDiagnosticsUI(diagnostics);

    if (!diagnostics.supported) {
      this.fallback.activateFallback('WebGL não suportado');
      return;
    }

    // 2. Initialize Ghost Anatomy 3D Scene
    const container = document.getElementById('canvasWrapper');
    if (!container) return;

    try {
      this.scene = new GhostAnatomyScene(container);
      this.scene.init();

      // 3. Progressive Loader Setup
      this.loader = new ProgressiveHuBMAPLoader('./assets/models/hubmap/');
      this.scene.loader = this.loader;
      this.scene.modelGroup.add(this.loader.compositionGroup);

      // 4. Interaction Engine Setup
      this.interaction = new ProgressiveLabInteraction({
        sceneManager: this.scene,
        camera: this.scene.camera,
        renderer: this.scene.renderer,
        modelGroup: this.scene.modelGroup,
        container: container,
        loader: this.loader,
        onInteractionChange: () => this.scene.requestRender(),
        onSelect: key => this.selectOrgan(key, false)
      });
      this.interaction.init();

      // 5. Setup UI Bindings
      this.bindUI();

      // 6. Start Render Loop
      this.isLoopRunning = true;
      this.startLoop();

      // 7. Load Priority Initial Organ (Heart) & 3D Body
      const loaderMsg = document.getElementById('loaderMsg');
      const loaderEl = document.getElementById('viewportLoader');

      if (loaderMsg) loaderMsg.textContent = 'Carregando Órgãos 3D...';
      await Promise.all([
        this.loader.loadOrgan('heart'),
        this.loader.loadBodyReference()
      ]);

      if (loaderEl) loaderEl.classList.add('hidden');

      // Select default priority organ
      this.selectOrgan('heart', false);
      if (this.interaction) this.interaction.selectOrgan('heart', false);
      this.updateTelemetry();

      // 8. Carregar imediatamente todos os demais órgãos HuBMAP em paralelo (apenas ~4.8 MB total)
      const remainingOrgans = ['brain', 'lungs', 'liver', 'kidneys', 'intestines'];
      Promise.all(remainingOrgans.map(key => this.loader.loadOrgan(key))).then(() => {
        console.log('[Anatomy Lab] Todos os 6 órgãos HuBMAP estão 100% carregados e visíveis na cena 3D!');
        document.querySelectorAll('.organ-chip').forEach(chip => chip.classList.add('loaded'));
        this.updateTelemetry();
        this.scene.requestRender();
      });

      console.log(`[CREMA Anatomy 3D Lab FASE C] TTFR: ${this.scene.timeToFirstRenderMs} ms. Órgãos 3D ativos.`);
    } catch (err) {
      console.error('[CREMA Anatomy 3D Lab] Erro no bootstrap:', err);
      this.fallback.activateFallback(err.message);
    }
  }

  startLoop() {
    const loop = () => {
      if (!this.isLoopRunning) return;

      const needsUpdate = this.interaction ? this.interaction.update() : false;
      if (needsUpdate || (this.scene && (this.scene.needsRender || this.scene.isCameraAnimating))) {
        this.scene.render();
        this.updateLiveTelemetry();
      }

      this.animationId = requestAnimationFrame(loop);
    };

    loop();
  }

  armIdlePrefetcher() {
    clearTimeout(this.prefetchTimer);
    this.prefetchTimer = setTimeout(() => {
      this.prefetchNextOrgan();
    }, 2800); // 2.8s after idle
  }

  async prefetchNextOrgan() {
    if (this.prefetchIndex >= this.prefetchQueue.length) return;
    const nextId = this.prefetchQueue[this.prefetchIndex++];

    if (!this.loader.isOrganLoaded(nextId)) {
      try {
        await this.loader.loadOrgan(nextId);
        // Dim newly loaded organ if another organ is currently selected
        if (this.activeOrganKey && this.activeOrganKey !== nextId) {
          const cached = this.loader.cache.get(nextId);
          if (cached) {
            cached.meshes.forEach(mesh => {
              if (mesh.material) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach(m => { m.opacity = 0.20; });
              }
            });
          }
        }
        this.updateChipStatus(nextId, true);
        this.updateTelemetry();
      } catch (e) {
        console.warn(`[Prefetcher] Falha ao prefetch ${nextId}:`, e);
      }
    }

    // Schedule next prefetch during continued idle
    this.armIdlePrefetcher();
  }

  bindUI() {
    // Mode toggles
    const btn3D = document.getElementById('btnMode3D');
    const btn2D = document.getElementById('btnMode2D');
    if (btn3D && btn2D) {
      btn3D.addEventListener('click', () => {
        this.fallback.activate3D();
        this.scene.requestRender();
      });
      btn2D.addEventListener('click', () => {
        this.fallback.activateFallback('Seleção manual de modo 2D');
      });
    }

    // Camera reset
    const btnResetCam = document.getElementById('btnResetCam');
    if (btnResetCam) {
      btnResetCam.addEventListener('click', () => {
        if (this.interaction) this.interaction.showAllOrgans();
        this.scene.resetCamera(this.interaction ? this.interaction.controls : null);
      });
    }

    // Ghost Shell toggle
    const btnGhostShell = document.getElementById('btnBodyGuide');
    if (btnGhostShell) {
      btnGhostShell.addEventListener('click', () => {
        this.isGhostShellVisible = !this.isGhostShellVisible;
        this.scene.toggleGhostShell(this.isGhostShellVisible);
        btnGhostShell.innerHTML = `<i data-lucide="${this.isGhostShellVisible ? 'user-check' : 'user-x'}"></i> Ghost Shell: ${this.isGhostShellVisible ? 'ON' : 'OFF'}`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Lighting toggle
    const btnLighting = document.getElementById('btnLighting');
    let currentLightMode = 'editorial';
    if (btnLighting) {
      btnLighting.addEventListener('click', () => {
        currentLightMode = currentLightMode === 'editorial' ? 'clinical' : 'editorial';
        this.scene.setLightingMode(currentLightMode);
        btnLighting.innerHTML = `<i data-lucide="sun"></i> ${currentLightMode === 'editorial' ? 'Luz Editorial' : 'Luz Clínica'}`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Organ Chips (On-Demand Lazy Loading trigger)
    document.querySelectorAll('.organ-chip').forEach(chip => {
      chip.addEventListener('click', async () => {
        const key = chip.dataset.organ;
        if (!key) return;

        // Reset idle prefetcher on user interaction
        this.armIdlePrefetcher();

        // On-demand load if not in cache
        if (!this.loader.isOrganLoaded(key) && key !== 'muscles') {
          const originalText = chip.innerHTML;
          chip.innerHTML = `<span class="chip-spinner"></span> Carregando...`;
          try {
            await this.loader.loadOrgan(key);
            this.updateChipStatus(key, true);
          } finally {
            chip.innerHTML = originalText;
          }
        }

        if (this.interaction) {
          this.interaction.selectOrgan(key, true);
        } else {
          this.selectOrgan(key, true);
        }
      });
    });

    // Show All Button
    const btnShowAll = document.getElementById('btnShowAll');
    if (btnShowAll) {
      btnShowAll.addEventListener('click', () => {
        if (this.interaction) this.interaction.showAllOrgans();
        this.scene.resetCamera(this.interaction ? this.interaction.controls : null);
        document.querySelectorAll('.organ-chip').forEach(c => c.classList.remove('active'));
        const statusTag = document.getElementById('viewportStatus');
        if (statusTag) {
          statusTag.innerHTML = `<span class="pulse-dot"></span> Visão Geral Completa · Todos os 6 Órgãos Ativos`;
        }
      });
    }
  }

  selectOrgan(organId, animateCam = false) {
    this.activeOrganKey = organId;
    const data = ORGAN_DICTIONARY[organId] || ORGAN_DICTIONARY.heart;

    // Update Text Card
    const titleEl = document.getElementById('organTitle');
    const catEl = document.getElementById('organCat');
    const modelBadgeEl = document.getElementById('organModelBadge');
    const evidenceEl = document.getElementById('organEvidenceBadge');
    const descEl = document.getElementById('organDesc');
    const caffeineEl = document.getElementById('organCaffeine');
    const tagsContainer = document.getElementById('organTags');
    const metricsContainer = document.getElementById('organMetrics');

    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.textContent = data.subtitle;
    if (modelBadgeEl) modelBadgeEl.textContent = data.hubmapModel;
    if (evidenceEl) evidenceEl.textContent = data.evidenceLevel;
    if (descEl) descEl.innerHTML = data.desc;
    if (caffeineEl) caffeineEl.innerHTML = `<strong>Ação Farmacológica:</strong> ${data.caffeineEffect}`;

    if (tagsContainer && data.tags) {
      tagsContainer.innerHTML = data.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');
    }

    if (metricsContainer && data.metrics) {
      metricsContainer.innerHTML = data.metrics.map(m => `
        <div class="metric-box">
          <span class="metric-label">${m.label}</span>
          <span class="metric-val">${m.val}</span>
          <span class="metric-sub">${m.sub}</span>
        </div>
      `).join('');
    }

    // Active chip highlight
    document.querySelectorAll('.organ-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.organ === organId);
    });

    // Update viewport status tag
    const statusTag = document.getElementById('viewportStatus');
    if (statusTag) {
      if (organId === 'muscles') {
        statusTag.innerHTML = `<span class="pulse-dot"></span> Modo Somático · Malha Muscular Ativa`;
      } else {
        statusTag.innerHTML = `<span class="pulse-dot"></span> Ghost Anatomy 3D · Lazy Loading Ativo`;
      }
    }

    if (animateCam && this.interaction) {
      const config = ORGAN_CONFIGS.find(c => c.id === organId);
      if (config) {
        const worldTargetY = (config.targetY - 0.43) * 2.6;
        this.scene.animateCameraTo(worldTargetY, config.cameraDistance, this.interaction.controls, 700);
      }
    }

    this.scene.requestRender();
    this.updateTelemetry();
  }

  updateChipStatus(organId, isLoaded) {
    const chip = document.querySelector(`.organ-chip[data-organ="${organId}"]`);
    if (chip) {
      chip.classList.toggle('loaded', isLoaded);
    }
  }

  updateDiagnosticsUI(diag) {
    const glVersionEl = document.getElementById('teleGlVersion');
    const glRendererEl = document.getElementById('teleGlRenderer');
    if (glVersionEl) glVersionEl.textContent = diag.version;
    if (glRendererEl) glRendererEl.textContent = diag.renderer;
  }

  updateTelemetry() {
    const ttfrEl = document.getElementById('teleTtfr');
    const cacheEl = document.getElementById('teleCacheCount');
    const bytesEl = document.getElementById('teleBytesLoaded');
    const triCountEl = document.getElementById('teleTriangles');

    if (ttfrEl && this.scene) ttfrEl.textContent = `${this.scene.timeToFirstRenderMs} ms`;
    if (cacheEl && this.loader && typeof this.loader.getLoadedCount === 'function') {
      cacheEl.textContent = `${this.loader.getLoadedCount()} / 6 GLBs em cache`;
    }
    if (bytesEl && this.loader && typeof this.loader.getLoadedBytes === 'function') {
      const mb = (this.loader.getLoadedBytes() / (1024 * 1024)).toFixed(1);
      bytesEl.textContent = `${mb} MB carregados`;
    }
    if (triCountEl && this.loader && typeof this.loader.getActiveTriangles === 'function') {
      triCountEl.textContent = `${this.loader.getActiveTriangles().toLocaleString('pt-BR')} triângulos`;
    }
  }

  updateLiveTelemetry() {
    if (!this.scene) return;
    const info = this.scene.getTelemetry();

    const fpsEl = document.getElementById('teleFps');
    const drawCallsEl = document.getElementById('teleDrawCalls');

    if (fpsEl) {
      fpsEl.textContent = `${info.fpsInteracting} FPS (interação) / ${info.fpsResting} (repouso)`;
    }
    if (drawCallsEl) {
      drawCallsEl.textContent = `${info.drawCalls} chamadas`;
    }
  }
}

let labInstance = null;

export function initAnatomyLab() {
  if (labInstance) return labInstance;
  if (window.lucide) window.lucide.createIcons();
  labInstance = new AnatomyLabController();
  labInstance.init();
  return labInstance;
}

export function getAnatomyLab() {
  return labInstance;
}
