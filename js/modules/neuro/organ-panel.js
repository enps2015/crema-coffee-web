/**
 * Neuro Section — Organ Information Panel & State Chips
 */
import { $, $$ } from '../../utils/dom.js';
import { ORGANS } from '../../data/neuro.js';

export class OrganPanel {
  constructor() {
    this.nameEl = $('#orgName');
    this.textEl = $('#orgText');
    this.chipsContainer = $('#orgChips');
  }

  /**
   * Initialize organ chips and panel defaults
   */
  init() {
    if (!this.chipsContainer) return;

    // Render organ chips
    this.chipsContainer.innerHTML = Object.keys(ORGANS)
      .map(k => `<span data-o="${k}">${k}</span>`)
      .join('');
  }

  /**
   * Update visual highlight on organ chips based on active status
   * @param {string[]} activeKeys
   */
  updateActiveChips(activeKeys) {
    $$('#orgChips span').forEach(s => {
      s.classList.toggle('on', activeKeys.includes(s.dataset.o));
    });
  }

  /**
   * Display organ details in the card
   * @param {string} organKey
   */
  displayOrgan(organKey) {
    const organ = ORGANS[organKey];
    if (!organ) return;

    if (this.nameEl) this.nameEl.textContent = organ.n;
    if (this.textEl) this.textEl.textContent = organ.t;
  }
}

export function createOrganPanel() {
  const panel = new OrganPanel();
  panel.init();
  return panel;
}
