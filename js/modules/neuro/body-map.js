/**
 * Neuro Section — Anatomical Body Map (SVG Controller)
 */
import { $$ } from '../../utils/dom.js';
import { ORGANS } from '../../data/neuro.js';

export class BodyMap {
  /**
   * @param {Object} options
   * @param {(organKey: string) => void} [options.onOrganSelect]
   */
  constructor(options = {}) {
    this.onOrganSelect = options.onOrganSelect || (() => {});
    this.selectedOrganKey = null;
  }

  /**
   * Initialize SVG organ click listeners and accessibility
   */
  init() {
    const organNodes = $$('#organs .organ');
    organNodes.forEach(g => {
      // Add keyboard navigation support for SVG groups
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', g.querySelector('title')?.textContent || g.dataset.o || 'Órgão');

      const handleSelect = () => {
        const organKey = g.dataset.o;
        if (!organKey) return;

        this.selectOrgan(organKey);
        this.onOrganSelect(organKey);
      };

      g.addEventListener('click', handleSelect);
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      });
    });
  }

  /**
   * Update selection outline on the chosen organ
   * @param {string} organKey
   */
  selectOrgan(organKey) {
    this.selectedOrganKey = organKey;
    $$('#organs .organ').forEach(x => {
      x.classList.toggle('sel', x.dataset.o === organKey);
    });
  }

  /**
   * Update active glowing state of organs based on current pharmacokinetics
   * @param {number} timeMinutes
   * @param {number} concentrationMgL
   * @returns {string[]} Array of active organ keys
   */
  updateActiveOrgans(timeMinutes, concentrationMgL) {
    const activeKeys = [];

    $$('#organs .organ').forEach(g => {
      const organKey = g.dataset.o;
      const organ = ORGANS[organKey];
      if (!organ) return;

      const isActive =
        timeMinutes >= organ.w[0] &&
        timeMinutes <= organ.w[1] &&
        concentrationMgL > 0.15;

      g.classList.toggle('on', isActive);
      if (isActive) {
        activeKeys.push(organKey);
      }
    });

    return activeKeys;
  }
}

export function createBodyMap(options) {
  const map = new BodyMap(options);
  map.init();
  return map;
}
