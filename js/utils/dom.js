/**
 * DOM Helper Utilities
 */
export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/**
 * Display a toast notification with auto-dismiss
 * @param {string} message 
 * @param {number} [duration=3600] 
 */
export function toast(message, duration = 3600) {
  const toastEl = $('#toast');
  const toastMsg = $('#toastMsg');
  if (!toastEl || !toastMsg) return;

  toastMsg.textContent = message;
  toastEl.classList.add('show');
  
  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

/**
 * Fallback visual generator for missing photos
 * @param {HTMLImageElement} img 
 * @param {string} label 
 */
export function phArt(img, label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#3A2C1E'/><stop offset='1' stop-color='#1D1712'/></linearGradient></defs><rect width='400' height='300' fill='url(%23g)'/><g transform='translate(200 150)' opacity='.9'><ellipse rx='34' ry='46' fill='#B57A33'/><path d='M0 -46 C10 -20 10 20 0 46 C-10 20 -10 -20 0 -46Z' fill='#14100C'/></g><text x='200' y='272' text-anchor='middle' font-family='Georgia,serif' font-style='italic' font-size='16' fill='%23E9DFCE'>${label || ''}</text></svg>`;
  img.src = 'data:image/svg+xml,' + svg.replace(/#/g, '%23');
}

// Make phArt globally available on window for inline img onerror="phArt(this, ...)" handlers
if (typeof window !== 'undefined') {
  window.phArt = phArt;
}
