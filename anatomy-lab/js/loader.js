/**
 * CREMA° Anatomy 3D Lab — Progressive & Draco-Optimized HuBMAP Loader (FASE D.1)
 * Features:
 * - Draco Compression decompression via local WASM decoders
 * - 85.4% reduced transfer payload (31.2 MB -> 4.57 MB)
 * - In-memory organ cache
 * - Real-time network and parsing telemetry
 */
import * as THREE from 'three';
import { GLTFLoader } from '../../js/vendor/three/GLTFLoader.js';
import { DRACOLoader } from './vendor/draco/DRACOLoader.js';

export const COMPOSITION_SCALE = 2.6;
export const CENTROID_Y = 0.43;

export const ORGAN_CONFIGS = [
  {
    id: 'heart',
    name: 'Coração',
    files: ['heart.glb'],
    targetY: 0.48,
    cameraDistance: 1.15,
    isPriority: true,
    approxBytes: 425184 // ~415 KB Draco
  },
  {
    id: 'brain',
    name: 'Cérebro',
    files: ['brain.glb'],
    targetY: 0.83,
    cameraDistance: 1.35,
    approxBytes: 2560000 // ~2.44 MB Draco
  },
  {
    id: 'lungs',
    name: 'Pulmões',
    files: ['lungs.glb'],
    targetY: 0.50,
    cameraDistance: 1.55,
    approxBytes: 840000 // ~820 KB Draco
  },
  {
    id: 'liver',
    name: 'Fígado',
    files: ['liver.glb'],
    targetY: 0.37,
    cameraDistance: 1.30,
    approxBytes: 185000 // ~180 KB Draco
  },
  {
    id: 'kidneys',
    name: 'Rins',
    files: ['kidney_l.glb', 'kidney_r.glb'],
    targetY: 0.29,
    cameraDistance: 1.25,
    approxBytes: 520000 // ~508 KB Draco
  },
  {
    id: 'intestines',
    name: 'Intestinos',
    files: ['large_intestine.glb', 'small_intestine.glb'],
    targetY: 0.16,
    cameraDistance: 1.45,
    approxBytes: 240000 // ~234 KB Draco
  },
  {
    id: 'muscles',
    name: 'Músculos',
    files: [],
    targetY: 0.40,
    cameraDistance: 2.50,
    isSomatic: true,
    approxBytes: 0
  }
];

export class ProgressiveHuBMAPLoader {
  constructor(basePath = '../assets/models/hubmap/') {
    this.basePath = basePath;
    this.gltfLoader = new GLTFLoader();

    // Configure Draco Loader with local WASM decoder path
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./js/vendor/draco/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    // In-memory organ cache: organId -> { group, meshes, stats }
    this.cache = new Map();
    this.loadingPromises = new Map();

    this.compositionGroup = new THREE.Group();
    this.compositionGroup.name = 'HuBMAP_Draco_Composition';
    this.compositionGroup.scale.setScalar(COMPOSITION_SCALE);
    this.compositionGroup.position.set(0, -CENTROID_Y * COMPOSITION_SCALE, 0);

    // Cumulative telemetry
    this.totalDownloadedBytes = 0;
    this.cumulativeDownloadTimeMs = 0;
    this.cumulativeParseTimeMs = 0;
    this.organTelemetry = new Map();
  }

  /**
   * Loads an organ on-demand if not already cached.
   * @param {string} organId
   * @param {(status: string) => void} onStatus
   * @returns {Promise<{ group: THREE.Group, meshes: Array<THREE.Mesh>, stats: Object, fromCache: boolean }>}
   */
  async loadOrgan(organId, onStatus = () => {}) {
    const config = ORGAN_CONFIGS.find(c => c.id === organId);
    if (!config) {
      throw new Error(`[ProgressiveHuBMAPLoader] Órgão desconhecido: ${organId}`);
    }

    if (config.isSomatic) {
      return {
        group: new THREE.Group(),
        meshes: [],
        stats: { triangles: 0, vertices: 0, bytes: 0, downloadMs: 0, parseMs: 0 },
        fromCache: true
      };
    }

    if (this.cache.has(organId)) {
      const cached = this.cache.get(organId);
      cached.group.visible = true;
      return { ...cached, fromCache: true };
    }

    if (this.loadingPromises.has(organId)) {
      return this.loadingPromises.get(organId);
    }

    const loadPromise = (async () => {
      onStatus(`Buscando ${config.name} (Draco)...`);
      const organGroup = new THREE.Group();
      organGroup.name = `organ_${organId}`;
      organGroup.userData.organId = organId;

      const meshList = [];
      let organTriangles = 0;
      let organVertices = 0;
      let organBytes = 0;
      let organDownloadMs = 0;
      let organParseMs = 0;

      for (const file of config.files) {
        const url = `${this.basePath}${file}`;

        // 1. Measure Network Download
        const t0Download = performance.now();
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Falha HTTP ${response.status} ao carregar ${file}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const downloadDuration = performance.now() - t0Download;

        organBytes += arrayBuffer.byteLength;
        organDownloadMs += downloadDuration;

        // 2. Measure CPU/WASM Parse and Draco Decompression
        onStatus(`Descompactando Draco ${config.name}...`);
        const t0Parse = performance.now();
        const gltf = await this.parseGLB(arrayBuffer, this.basePath);
        const parseDuration = performance.now() - t0Parse;
        organParseMs += parseDuration;

        const model = gltf.scene;
        organGroup.add(model);

        model.traverse(child => {
          if (child.isMesh) {
            child.userData.organId = organId;
            meshList.push(child);

            // Metrics
            if (child.geometry) {
              if (child.geometry.index) {
                organTriangles += child.geometry.index.count / 3;
              } else if (child.geometry.attributes.position) {
                organTriangles += child.geometry.attributes.position.count / 3;
              }
              if (child.geometry.attributes.position) {
                organVertices += child.geometry.attributes.position.count;
              }
            }

            // Material tuning
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach(mat => {
                mat.transparent = true;
                mat.opacity = 1.0;
                mat.roughness = Math.max(mat.roughness || 0.4, 0.38);
                mat.metalness = Math.min(mat.metalness || 0.05, 0.12);
                if (!mat.emissive) mat.emissive = new THREE.Color(0x000000);
                child.userData.defaultEmissive = mat.emissive.clone();
                child.userData.defaultOpacity = mat.opacity;
              });
            }
          }
        });
      }

      this.compositionGroup.add(organGroup);

      const stats = {
        triangles: Math.round(organTriangles),
        vertices: Math.round(organVertices),
        bytes: organBytes,
        downloadMs: Math.round(organDownloadMs),
        parseMs: Math.round(organParseMs)
      };

      this.totalDownloadedBytes += organBytes;
      this.cumulativeDownloadTimeMs += organDownloadMs;
      this.cumulativeParseTimeMs += organParseMs;
      this.organTelemetry.set(organId, stats);

      const result = { group: organGroup, meshes: meshList, stats, fromCache: false };
      this.cache.set(organId, result);
      this.loadingPromises.delete(organId);

      onStatus(`${config.name} pronto`);
      return result;
    })();

    this.loadingPromises.set(organId, loadPromise);
    return loadPromise;
  }

  parseGLB(buffer, path) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.parse(buffer, path, resolve, reject);
    });
  }

  isOrganLoaded(organId) {
    return this.cache.has(organId);
  }

  getActiveTriangles() {
    let total = 0;
    for (const [id, item] of this.cache.entries()) {
      if (item.group.visible) {
        total += item.stats.triangles;
      }
    }
    return total;
  }

  async loadBodyReference() {
    if (this.bodyReferenceGroup) return this.bodyReferenceGroup;

    try {
      const url = `${this.basePath}body_ref.glb`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await response.arrayBuffer();
      const gltf = await this.parseGLB(buffer, this.basePath);

      this.bodyReferenceGroup = gltf.scene;
      this.bodyReferenceGroup.name = 'HuBMAP_Human_Body_Reference';

      this.bodyReferenceGroup.traverse(child => {
        if (child.isMesh) {
          this.bodyMesh = child;
          child.userData.isHumanBody = true;
          child.renderOrder = 10; // Renders after solid organs
          // Clean up vertex colors if present so uniform color applies
          if (child.geometry && child.geometry.attributes.color) {
            delete child.geometry.attributes.color;
          }
          child.material = new THREE.MeshStandardMaterial({
            color: 0xC89A68, // Warm editorial amber skin
            emissive: new THREE.Color(0x1A0F08),
            roughness: 0.45,
            metalness: 0.08,
            opacity: 0.16, // Delicate glass envelope: internal organs pop out with 100% clarity
            transparent: true,
            depthWrite: false,
            side: THREE.FrontSide
          });
        }
      });

      this.compositionGroup.add(this.bodyReferenceGroup);
      this.totalDownloadedBytes += buffer.byteLength;
      return this.bodyReferenceGroup;
    } catch (e) {
      console.warn('[ProgressiveHuBMAPLoader] Falha ao carregar body_ref:', e);
      return null;
    }
  }

  setBodyMusclesMode(isMusclesMode) {
    if (this.bodyMesh && this.bodyMesh.material) {
      const mat = this.bodyMesh.material;
      if (isMusclesMode) {
        // Dramatic muscular somatic focus: solidifies into glowing sculpted bronze
        mat.opacity = 0.82;
        mat.roughness = 0.55;
        mat.color.setHex(0xE2BC96);
        mat.emissive.setHex(0x5A351B);
        mat.depthWrite = true;
      } else {
        // Visceral internal organ focus: subtle translucent protective glass shell
        mat.opacity = 0.16;
        mat.roughness = 0.45;
        mat.color.setHex(0xC89A68);
        mat.emissive.setHex(0x1A0F08);
        mat.depthWrite = false;
      }
    }
  }

  getLoadedBytes() {
    return this.totalDownloadedBytes;
  }

  getLoadedCount() {
    return this.cache.size;
  }

  dispose() {
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
      this.dracoLoader = null;
    }
  }
}
