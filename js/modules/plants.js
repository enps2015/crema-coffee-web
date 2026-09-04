/**
 * Caffeine Producing Plants & Xanthine Chemistry Module
 */
import { $, $$ } from '../utils/dom.js';
import { PLANTS } from '../data/plants.js';

export function initPlantsModule() {
  const plantGrid = $('#plantGrid');
  if (!plantGrid) return;

  function showPlant(id) {
    const p = PLANTS.find(x => x.id === id);
    if (!p) return;

    $$('.plant').forEach(el => el.classList.toggle('on', el.dataset.id === id));
    $('#cfName').textContent = p.n + ' — ' + p.lat;
    $('#cfDesc').textContent = p.desc;
    $('#cfBar').style.width = p.mg + '%';
    $('#cfMg').textContent = '~' + p.mg + ' mg';

    $('#cfChem').innerHTML = p.chem
      .map(c => `<li><i data-lucide="flask-conical"></i><span><strong>${c[0]}:</strong> ${c[1]}</span></li>`)
      .join('');

    $('#cfAbs').innerHTML = p.abs
      .map(c => `<li><i data-lucide="${c[0]}"></i><span>${c[1]}</span></li>`)
      .join('');

    if (window.lucide) window.lucide.createIcons();
  }

  plantGrid.innerHTML = PLANTS.map(
    (p, i) => `
    <div class="plant ${i === 0 ? 'on' : ''}" data-id="${p.id}" role="button" tabindex="0">
      <div class="p-img"><img loading="lazy" src="${p.img}" alt="${p.n}" onerror="phArt(this,'${p.n}')"></div>
      <div class="p-body"><b>${p.n}</b><span>${p.lat}</span></div>
    </div>
  `
  ).join('');

  $$('.plant').forEach(el => {
    el.addEventListener('click', () => showPlant(el.dataset.id));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showPlant(el.dataset.id);
      }
    });
  });

  showPlant('cafe');
}
