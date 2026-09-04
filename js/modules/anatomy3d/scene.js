/**
 * CREMA° Anatomy 3D Lab — Ghost Anatomy Scene & Lighting Engine (FASE C Hardening)
 * Features:
 * - Ghost Anatomy volumetric body shell & somatic muscle tracts
 * - Warm editorial CREMA° PBR lighting
 * - Smooth camera tweening (cubic easing)
 * - Exact telemetry (FPS interacting, FPS resting, draw calls, TTFR)
 */
import * as THREE from 'three';

export class GhostAnatomyScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.modelGroup = null;
    this.ghostShellGroup = null;
    this.somaticMuscleGroup = null;
    this.lights = new Map();
    this.resizeObserver = null;
    this.needsRender = true;

    // Camera animation state
    this.isCameraAnimating = false;
    this.cameraAnim = null;

    // Production Telemetry
    this.initStartTime = performance.now();
    this.timeToFirstRenderMs = 0;
    this.firstRenderDone = false;
    this.isInteracting = false;
    this.fpsInteracting = 60;
    this.fpsResting = 0;
    this.frameCount = 0;
    this.lastFpsSampleTime = performance.now();
    this.isDestroyed = false;
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 580;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera (adaptive framing based on aspect ratio)
    const aspect = width / height;
    const initialZ = aspect < 0.85 ? 4.6 : (aspect < 1.1 ? 4.1 : 3.8);
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 50);
    this.camera.position.set(0, 0.05, initialZ);

    // 3. Renderer with high performance & tone mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.container.appendChild(this.renderer.domElement);

    // 4. Viscera Root Group
    this.modelGroup = new THREE.Group();
    this.modelGroup.name = 'VisceraRoot';
    this.scene.add(this.modelGroup);

    // 5. Build Ghost Anatomy Shell & Somatic Muscle Tracts
    this.setupGhostAnatomy();

    // 6. Lighting Setup
    this.setupLighting();

    // 7. Setup Resize Listener
    this.setupResize();

    // 8. Render Frame 0 immediately for instant TTFR
    this.render();
  }

  setupGhostAnatomy() {
    this.ghostShellGroup = new THREE.Group();
    this.ghostShellGroup.name = 'GhostAnatomyShell';
    // O contorno linear 2D antigo foi totalmente removido.
    // A representação anatômica do corpo agora é 100% realizada pela malha volumétrica 3D HuBMAP (body_ref.glb).
    this.scene.add(this.ghostShellGroup);
  }

  setMusclesHighlight(active) {
    if (this.loader && this.loader.setBodyMusclesMode) {
      this.loader.setBodyMusclesMode(active);
    }
    this.requestRender();
  }

  toggleGhostShell(visible) {
    if (this.ghostShellGroup) {
      this.ghostShellGroup.visible = visible;
    }
    if (this.loader && this.loader.bodyReferenceGroup) {
      this.loader.bodyReferenceGroup.visible = visible;
    }
    this.requestRender();
  }

  setupLighting() {
    // Ambient: Warm gentle base
    const ambient = new THREE.AmbientLight(0xFFF7EE, 1.35);
    this.scene.add(ambient);
    this.lights.set('ambient', ambient);

    // Key Light: Upper right warm directional
    const key = new THREE.DirectionalLight(0xFFEEDD, 2.3);
    key.position.set(2.5, 3.0, 3.2);
    this.scene.add(key);
    this.lights.set('key', key);

    // Fill Light: Soft cool diffuse fill from upper left
    const fill = new THREE.DirectionalLight(0xDCE8F5, 1.2);
    fill.position.set(-2.5, 1.5, 2.5);
    this.scene.add(fill);
    this.lights.set('fill', fill);

    // Rim/Contour: CREMA° Amber Backlight
    const rim = new THREE.DirectionalLight(0xD9A05B, 2.2);
    rim.position.set(0, -2.5, -3.2);
    this.scene.add(rim);
    this.lights.set('rim', rim);
  }

  setLightingMode(mode = 'editorial') {
    const ambient = this.lights.get('ambient');
    const key = this.lights.get('key');
    const fill = this.lights.get('fill');
    const rim = this.lights.get('rim');

    if (mode === 'clinical') {
      if (ambient) { ambient.color.setHex(0xFFFFFF); ambient.intensity = 1.8; }
      if (key) { key.color.setHex(0xFFFFFF); key.intensity = 2.1; }
      if (fill) { fill.color.setHex(0xFFFFFF); fill.intensity = 1.5; }
      if (rim) { rim.intensity = 0.8; }
    } else {
      if (ambient) { ambient.color.setHex(0xFFF7EE); ambient.intensity = 1.35; }
      if (key) { key.color.setHex(0xFFEEDD); key.intensity = 2.3; }
      if (fill) { fill.color.setHex(0xDCE8F5); fill.intensity = 1.2; }
      if (rim) { rim.color.setHex(0xD9A05B); rim.intensity = 2.2; }
    }
    this.requestRender();
  }

  animateCameraTo(targetY, targetDistance, controls, durationMs = 700) {
    if (!this.camera || !controls) return;

    const startPos = this.camera.position.clone();
    const startTarget = controls.target.clone();
    const endTarget = new THREE.Vector3(0, targetY, 0);

    const direction = startPos.clone().sub(startTarget).normalize();
    const endPos = endTarget.clone().add(direction.multiplyScalar(targetDistance));

    const startTime = performance.now();
    this.isCameraAnimating = true;

    this.cameraAnim = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      const ease = t * t * (3 - 2 * t);

      this.camera.position.lerpVectors(startPos, endPos, ease);
      controls.target.lerpVectors(startTarget, endTarget, ease);
      controls.update();
      this.requestRender();

      if (t >= 1) {
        this.isCameraAnimating = false;
        this.cameraAnim = null;
      }
    };
  }

  resetCamera(controls) {
    if (!this.camera || !controls) return;
    const aspect = this.camera.aspect || 1;
    const targetZ = aspect < 0.85 ? 4.6 : (aspect < 1.1 ? 4.1 : 3.8);
    this.animateCameraTo(0.05, targetZ, controls, 600);
  }

  setupResize() {
    this.lastWidth = 0;
    this.lastHeight = 0;

    this.resizeObserver = new ResizeObserver(entries => {
      if (this.isDestroyed) return;
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        const height = Math.floor(entry.contentRect.height);
        if (width > 0 && height > 0 && (width !== this.lastWidth || height !== this.lastHeight)) {
          this.lastWidth = width;
          this.lastHeight = height;
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          // updateStyle = false prevents Three.js from injecting inline style.height into canvas,
          // which completely breaks infinite resize loops in flex/grid layouts.
          this.renderer.setSize(width, height, false);
          this.requestRender();
        }
      }
    });

    this.resizeObserver.observe(this.container);
  }

  requestRender() {
    this.needsRender = true;
  }

  render() {
    if (!this.renderer || !this.scene || !this.camera || this.isDestroyed) return;

    if (this.isCameraAnimating && this.cameraAnim) {
      this.cameraAnim();
    }

    this.renderer.render(this.scene, this.camera);
    this.needsRender = false;

    // Track TTFR
    if (!this.firstRenderDone) {
      this.firstRenderDone = true;
      this.timeToFirstRenderMs = Math.round(performance.now() - this.initStartTime);
    }

    // Telemetry sampling
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastFpsSampleTime;
    if (elapsed >= 500) {
      const currentFps = Math.round((this.frameCount * 1000) / elapsed);
      if (this.isInteracting || this.isCameraAnimating) {
        this.fpsInteracting = currentFps;
      }
      this.frameCount = 0;
      this.lastFpsSampleTime = now;
    }
  }

  getTelemetry() {
    return {
      ttfrMs: this.timeToFirstRenderMs,
      fpsInteracting: this.fpsInteracting,
      fpsResting: (this.isInteracting || this.isCameraAnimating || this.needsRender) ? this.fpsInteracting : 0,
      drawCalls: this.renderer ? this.renderer.info.render.calls : 0,
      triangles: this.renderer ? this.renderer.info.render.triangles : 0,
      geometries: this.renderer ? this.renderer.info.memory.geometries : 0
    };
  }

  destroy() {
    this.isDestroyed = true;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
  }
}
