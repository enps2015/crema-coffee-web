/**
 * Roasting Profiles & Sensory Spectrum Module
 */
import { $, $$ } from '../utils/dom.js';
import { ROASTS } from '../data/neuro.js';

export function initRoastModule() {
  const stepsContainer = $('#roastSteps');
  if (!stepsContainer) return;

  let roastIdx = 1; // Default: Média-clara

  function renderRoast() {
    const r = ROASTS[roastIdx];
    if (!r) return;

    $('#rName').textContent = r.n;
    $('#rTemp').textContent = r.t;
    $('#rDesc').innerHTML = r.d;

    r.p.forEach((v, i) => {
      const bar = $('#rb' + i);
      if (bar) bar.style.width = v + '%';
    });

    $$('#roastSteps .r-step').forEach((b, i) => b.classList.toggle('active', i === roastIdx));
  }

  stepsContainer.innerHTML = ROASTS.map(
    r => `<button class="r-step" type="button"><span class="sw" style="background:${r.sw}"></span><span><b>${r.n}</b><span>${r.t}</span></span></button>`
  ).join('');

  $$('#roastSteps .r-step').forEach((b, i) =>
    b.addEventListener('click', () => {
      roastIdx = i;
      renderRoast();
    })
  );

  renderRoast();
}
