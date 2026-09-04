/**
 * CREMA° Anatomy 3D Lab — Multi-Organ & Somatic Interaction Engine (FASE C Hardening)
 * Handles raycasting, hover, isolation, somatic muscle highlights and smooth camera navigation.
 */
import * as THREE from 'three';
import { OrbitControls } from '../../vendor/three/OrbitControls.js';
import { ORGAN_CONFIGS } from './loader.js';

export class ProgressiveLabInteraction {
  constructor(options) {
    this.sceneManager = options.sceneManager;
    this.camera = options.camera;
    this.renderer = options.renderer;
    this.modelGroup = options.modelGroup;
    this.container = options.container;
    this.loader = options.loader;
    this.onInteractionChange = options.onInteractionChange || (() => {});
    this.onSelect = options.onSelect || (() => {});

    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredOrganId = null;
    this.selectedOrganId = null;

    this.isPulsing = false;
    this.pulseStartTime = 0;
    this.tooltipEl = null;

    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerLeave = this.handlePointerLeave.bind(this);
    this.onClick = this.handleClick.bind(this);
  }

  init() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.enablePan = false; // Prevent viscera from panning off-screen
    this.controls.minDistance = 1.6;
    this.controls.maxDistance = 5.8;
    this.controls.minPolarAngle = Math.PI * 0.15;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 0.8;

    this.controls.addEventListener('start', () => {
      this.sceneManager.isInteracting = true;
    });
    this.controls.addEventListener('end', () => {
      this.sceneManager.isInteracting = false;
    });
    this.controls.addEventListener('change', () => {
      this.onInteractionChange();
    });

    // Tooltip
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'lab-tooltip';
    this.container.appendChild(this.tooltipEl);

    // Event listeners
    const dom = this.renderer.domElement;
    dom.addEventListener('pointermove', this.onPointerMove);
    dom.addEventListener('pointerleave', this.onPointerLeave);
    dom.addEventListener('click', this.onClick);
  }

  updateNDC(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  handlePointerMove(e) {
    this.updateNDC(e);
    this.checkHover(e);
  }

  handlePointerLeave() {
    this.mouse.set(-999, -999);
    this.clearHover();
  }

  checkHover(e) {
    if (!this.modelGroup || this.modelGroup.children.length === 0) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.modelGroup.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const organId = hit.userData.organId;

      if (organId) {
        if (this.hoveredOrganId !== organId) {
          this.clearHover();
          this.setHover(organId);
        }

        if (this.tooltipEl && e) {
          const config = ORGAN_CONFIGS.find(c => c.id === organId);
          this.tooltipEl.textContent = config ? `${config.name} (HuBMAP 3D)` : organId;

          const rect = this.container.getBoundingClientRect();
          this.tooltipEl.style.left = `${e.clientX - rect.left}px`;
          this.tooltipEl.style.top = `${e.clientY - rect.top}px`;
          this.tooltipEl.classList.add('visible');
        }

        this.renderer.domElement.style.cursor = 'pointer';
        this.onInteractionChange();
        return;
      }
    }

    this.clearHover();
  }

  setHover(organId) {
    this.hoveredOrganId = organId;
    if (this.selectedOrganId === organId) return;

    const cached = this.loader.cache.get(organId);
    if (!cached) return;

    cached.meshes.forEach(mesh => {
      if (mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach(m => {
          if (m.emissive) m.emissive.setHex(0x4A2E14);
        });
      }
    });
  }

  clearHover() {
    if (this.hoveredOrganId) {
      if (this.selectedOrganId !== this.hoveredOrganId) {
        const cached = this.loader.cache.get(this.hoveredOrganId);
        if (cached) {
          cached.meshes.forEach(mesh => {
            if (mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach(m => {
                if (m.emissive) m.emissive.setHex(0x000000);
              });
            }
          });
        }
      }
      this.hoveredOrganId = null;
    }

    if (this.tooltipEl) {
      this.tooltipEl.classList.remove('visible');
    }

    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.style.cursor = 'grab';
    }

    this.onInteractionChange();
  }

  handleClick(e) {
    this.updateNDC(e);
    if (!this.modelGroup) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.modelGroup.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const organId = hit.userData.organId;
      if (organId) {
        this.selectOrgan(organId);
      }
    }
  }

  selectOrgan(organId, animateCam = true) {
    this.selectedOrganId = organId;

    if (organId === 'muscles') {
      // 1. Somatic muscular representation
      this.sceneManager.setMusclesHighlight(true);
      if (this.loader && this.loader.setBodyMusclesMode) {
        this.loader.setBodyMusclesMode(true);
      }

      // Dim all loaded visceral organs so the somatic body is the star
      for (const [, item] of this.loader.cache.entries()) {
        item.meshes.forEach(mesh => {
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(m => {
              m.opacity = 0.08;
              if (m.emissive) m.emissive.setHex(0x000000);
            });
          }
        });
      }

      if (animateCam) {
        this.sceneManager.animateCameraTo(0.18, 2.7, this.controls, 700);
      }

      this.onInteractionChange();
      this.onSelect(organId);
      return;
    }

    // 2. Visceral Organ Selection
    this.sceneManager.setMusclesHighlight(false);
    if (this.loader && this.loader.setBodyMusclesMode) {
      this.loader.setBodyMusclesMode(false);
    }

    for (const [id, item] of this.loader.cache.entries()) {
      const isSelected = id === organId;

      item.meshes.forEach(mesh => {
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach(m => {
            if (isSelected) {
              m.opacity = 1.0;
              if (m.emissive) m.emissive.setHex(0x5A3818);
            } else {
              m.opacity = 0.20; // Semi-transparent ghost viscera
              if (m.emissive) m.emissive.setHex(0x000000);
            }
          });
        }
      });
    }

    // Gentle pulse animation
    this.isPulsing = true;
    this.pulseStartTime = performance.now();

    // Camera Reframing
    if (animateCam) {
      const config = ORGAN_CONFIGS.find(c => c.id === organId);
      if (config) {
        const worldTargetY = (config.targetY - 0.43) * 2.6;
        this.sceneManager.animateCameraTo(worldTargetY, config.cameraDistance, this.controls, 700);
      }
    }

    this.onInteractionChange();
    this.onSelect(organId);
  }

  showAllOrgans() {
    this.selectedOrganId = null;
    this.isPulsing = false;
    this.sceneManager.setMusclesHighlight(false);
    if (this.loader && this.loader.setBodyMusclesMode) {
      this.loader.setBodyMusclesMode(false);
    }

    for (const [, item] of this.loader.cache.entries()) {
      item.group.visible = true;
      item.meshes.forEach(mesh => {
        mesh.visible = true;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach(m => {
            m.opacity = 1.0;
            m.transparent = false;
            if (m.emissive) m.emissive.setHex(0x1F1106);
          });
        }
      });
    }

    this.onInteractionChange();
  }

  update() {
    const controlsUpdated = this.controls ? this.controls.update() : false;

    if (this.isPulsing && this.selectedOrganId && this.selectedOrganId !== 'muscles') {
      const elapsed = (performance.now() - this.pulseStartTime) / 1000;
      const pulseVal = 0.18 + 0.18 * Math.sin(elapsed * 4.0);

      const cached = this.loader.cache.get(this.selectedOrganId);
      if (cached) {
        cached.meshes.forEach(mesh => {
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(m => {
              if (m.emissive) {
                m.emissive.setRGB(0.85 * pulseVal, 0.55 * pulseVal, 0.25 * pulseVal);
              }
            });
          }
        });
      }

      if (elapsed > 4.0) {
        this.isPulsing = false;
      }

      this.onInteractionChange();
    }

    return controlsUpdated || this.isPulsing;
  }

  destroy() {
    const dom = this.renderer ? this.renderer.domElement : null;
    if (dom) {
      dom.removeEventListener('pointermove', this.onPointerMove);
      dom.removeEventListener('pointerleave', this.onPointerLeave);
      dom.removeEventListener('click', this.onClick);
    }
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
  }
}
