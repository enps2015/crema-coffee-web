/**
 * Navigation, Scrollspy, Reveals, Marquee, Hero Ticker & Parallax Module
 */
import { $, $$ } from '../utils/dom.js';
import { toast } from '../utils/dom.js';
import { fmtBR } from '../utils/formatters.js';
import { CONFIG } from '../config.js';

const MARQUEE_WORDS = [
  'floral', 'achocolotado', 'cítrico', 'caramelo', 'frutas vermelhas',
  'mel', 'especiarias', 'amêndoa torrada', 'rapadura', 'herbal',
  'vinhoso', 'terroso', 'notas fermentadas', 'cacau', 'jasmin', 'casca de laranja'
];

const SECTIONS = ['origem', 'brasil', 'neuro', 'vicio', 'metodos', 'datalab', 'live', 'cafeina', 'futuro'];

export function initNavigation() {
  // 1. Reading progress bar
  const prog = $('#progress');
  if (prog) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    }, { passive: true });
  }

  // 2. Mobile Menu
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  // 3. Scroll Spy
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.nav-links a').forEach(a => {
          a.classList.toggle('on', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  // 4. Marquee Track
  const mqTrack = $('#mqTrack');
  if (mqTrack) {
    const html = MARQUEE_WORDS.map(w => `<span>${w}</span>`).join('');
    mqTrack.innerHTML = html + html;
  }

  // 5. Scroll Reveal Observer
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal:not(.in)').forEach(el => revealObserver.observe(el));

  // 6. Hero Cup Ticker
  const cupTicker = $('#cupTicker');
  if (cupTicker) {
    let count = 0;
    let lastTime = 0;
    function tickCups(t) {
      if (!lastTime) lastTime = t;
      count += ((t - lastTime) / 1000) * CONFIG.HERO.CUPS_PER_SECOND;
      lastTime = t;
      cupTicker.textContent = fmtBR(Math.floor(count));
      requestAnimationFrame(tickCups);
    }
    requestAnimationFrame(tickCups);
  }

  // 7. Parallax Scroll Handler
  const parallaxImages = $$('.plx');
  if (parallaxImages.length) {
    let tick = false;
    function updateParallax() {
      const vh = window.innerHeight;
      parallaxImages.forEach(img => {
        const parent = img.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        img.style.transform = `translateY(${(r.top + r.height / 2 - vh / 2) * -0.07}px) scale(1.04)`;
      });
      tick = false;
    }

    window.addEventListener('scroll', () => {
      if (!tick) {
        requestAnimationFrame(updateParallax);
        tick = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // 8. CTA Newsletter Form
  const ctaForm = $('#ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = $('#ctaEmail');
      const val = emailInput ? emailInput.value.trim() : '';
      if (!val || !val.includes('@')) {
        toast('Hmm, esse e-mail não parece completo.');
        return;
      }
      if (emailInput) emailInput.value = '';
      toast('Bem-vindo(a) à mesa! O primeiro Boletim da Colheita sai com a próxima safra.');
    });
  }
}
