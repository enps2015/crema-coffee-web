/**
 * Myths & Evidence 3D Flip Cards & Withdrawal Wave Module
 */
import { $, $$ } from '../utils/dom.js';
import { FLIPS } from '../data/myths.js';

export function initFlipcardsModule() {
  const flipGrid = $('#flipGrid');
  if (!flipGrid) return;

  // Render Flip Cards
  flipGrid.innerHTML = FLIPS.map(
    (f, i) => `
    <div class="flip reveal" style="--d:${i * 0.06}s" tabindex="0" role="button" aria-label="Virar card">
      <div class="flip-in">
        <div class="face front">
          <span class="f-tag">Mito ou ciência?</span>
          <h4>${f.m}</h4>
          <span class="f-hint"><i data-lucide="rotate-cw"></i>clique para ver a evidência</span>
        </div>
        <div class="face back">
          <span class="f-tag">O que os estudos mostram</span>
          <p>${f.b}</p>
          <span class="src">Fonte: ${f.s}</span>
        </div>
      </div>
    </div>
  `
  ).join('');

  $$('.flip').forEach(f => {
    const toggle = () => f.classList.toggle('on');
    f.addEventListener('click', toggle);
    f.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Render Withdrawal Wave Animation Bars
  const waveContainer = $('#withdrawWave');
  if (waveContainer) {
    waveContainer.innerHTML = Array.from({ length: 22 }, (_, i) => {
      const h = i < 4 ? 18 : i < 8 ? 44 : i < 15 ? 36 : 10;
      return `<i style="height:${h}px;animation-delay:${i * 40}ms"></i>`;
    }).join('');
  }
}
