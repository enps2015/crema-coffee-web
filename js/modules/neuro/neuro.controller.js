/**
 * Neuro Section — Master Controller & Coordinator
 * Orchestrates Pharmacokinetics, Body Map, Organ Panel, and Molecular Race
 */
import { createMolecularRace } from './molecular-race.js';
import { createPharmacokineticsEngine } from './pharmacokinetics.js';

export class NeuroController {
  constructor() {
    this.molecularRace = null;
    this.pkEngine = null;
    this.anatomyLab = null;
  }

  /**
   * Initialize all Neuro submodules in coordinated sequence
   */
  init() {
    // 1. Initialize Molecular Race module
    this.molecularRace = createMolecularRace({ container: '#molecularStage' });
    this.molecularRace.init('#molecularStage');

    // 2. Initialize Pharmacokinetics Engine & connect state updates
    this.pkEngine = createPharmacokineticsEngine({
      onStateChange: ({ time, concentration }) => {
        if (this.molecularRace) {
          this.molecularRace.update(time, concentration);
        }
      }
    });

    // 3. Lazy-Initialize Anatomy 3D Lab via IntersectionObserver
    const labSection = document.getElementById('anatomyLabSection');
    if (labSection) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              obs.disconnect();
              import('../anatomy3d/anatomy-lab.js').then(({ initAnatomyLab }) => {
                this.anatomyLab = initAnatomyLab();
              }).catch(err => {
                console.error('[CREMA Anatomy 3D Lab] Erro ao carregar módulo 3D:', err);
              });
            }
          });
        }, { rootMargin: '350px' });
        observer.observe(labSection);
      } else {
        import('../anatomy3d/anatomy-lab.js').then(({ initAnatomyLab }) => {
          this.anatomyLab = initAnatomyLab();
        });
      }
    }
  }

  /**
   * Programmatic API to update dose and time
   * @param {number} doseMg
   * @param {number} timeMinutes
   */
  setDoseAndTime(doseMg, timeMinutes) {
    if (this.pkEngine) {
      if (doseMg !== undefined) this.pkEngine.setDose(doseMg);
      if (timeMinutes !== undefined) this.pkEngine.setTime(timeMinutes);
    }
  }

  /**
   * Programmatic API to select an organ in the 3D lab
   * @param {string} organKey
   */
  selectOrgan(organKey) {
    import('../anatomy3d/anatomy-lab.js').then(({ getAnatomyLab }) => {
      const lab = getAnatomyLab();
      if (lab) lab.selectOrgan(organKey, true);
    }).catch(() => {});
  }

  /**
   * Retrieve current state snapshot
   */
  getState() {
    return this.pkEngine ? this.pkEngine.getCurrentState() : null;
  }
}

let neuroInstance = null;

export function initNeuroModule() {
  neuroInstance = new NeuroController();
  neuroInstance.init();
  return neuroInstance;
}

export function getNeuroController() {
  return neuroInstance;
}
