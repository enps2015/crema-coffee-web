/**
 * Global Contextual Tooltips Module
 */
import { clamp } from '../utils/math.js';

export function initTooltipsModule() {
  const tipEl = document.createElement('div');
  tipEl.className = 'tooltip';
  document.body.appendChild(tipEl);

  let tipTarget = null;

  function tipPlace(el) {
    const r = el.getBoundingClientRect();
    const x = clamp(r.left + r.width / 2 - tipEl.offsetWidth / 2, 8, window.innerWidth - tipEl.offsetWidth - 8);
    let y = r.top - tipEl.offsetHeight - 10;
    if (y < 8) y = r.bottom + 10;
    tipEl.style.left = x + 'px';
    tipEl.style.top = y + 'px';
  }

  function tipShow(el) {
    tipTarget = el;
    tipEl.innerHTML = (el.dataset.tipTitle ? '<b>' + el.dataset.tipTitle + '</b>' : '') + (el.dataset.tip || '');
    tipEl.classList.add('show');
    tipPlace(el);
  }

  function tipHide() {
    tipTarget = null;
    tipEl.classList.remove('show');
  }

  document.addEventListener(
    'pointermove',
    e => {
      const el = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
      if (el) {
        tipTarget === el ? tipPlace(el) : tipShow(el);
      } else if (tipTarget) {
        tipHide();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      if (tipTarget) tipPlace(tipTarget);
    },
    { passive: true }
  );
}
