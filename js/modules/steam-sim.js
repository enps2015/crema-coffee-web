/**
 * Hero Cup Steam Particle Physics Simulation
 */
import { $ } from '../utils/dom.js';

export function initSteamSimulation() {
  const canvas = $('#steam');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scene = canvas.parentElement;
  if (!ctx || !scene) return;

  let width = 0;
  let height = 0;
  const particles = [];
  let mouseX = -999;
  let mouseY = -999;
  let lastSpawn = 0;
  let isVisible = true;

  function resize() {
    const rect = scene.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    width = rect.width;
    height = rect.height;
  }

  resize();
  window.addEventListener('resize', resize);

  scene.addEventListener('pointermove', e => {
    const rect = scene.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  scene.addEventListener('pointerleave', () => {
    mouseX = -999;
    mouseY = -999;
  });

  // Freeze animation when off-screen to preserve battery & CPU
  const visibilityObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  visibilityObserver.observe(scene);

  function spawn() {
    const rect = scene.getBoundingClientRect();
    const cup = $('.cup-svg');
    if (!cup) return;
    const cupRect = cup.getBoundingClientRect();

    particles.push({
      x: cupRect.left - rect.left + cupRect.width / 2 + (Math.random() * 36 - 18),
      y: cupRect.top - rect.top + cupRect.height * 0.30,
      vx: 0,
      age: 0,
      life: 150 + Math.random() * 90,
      r: 6 + Math.random() * 10,
      ph: Math.random() * 6.28
    });
  }

  function loop(time) {
    requestAnimationFrame(loop);
    if (!isVisible) return;

    if (time - lastSpawn > 110 && particles.length < 42) {
      spawn();
      lastSpawn = time;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age++;
      p.y -= 0.9;
      p.x += Math.sin(p.age * 0.03 + p.ph) * 0.45 + p.vx;

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      if (dx * dx + dy * dy < 6000) {
        p.vx += dx * 0.004;
        p.vx *= 0.94;
      } else {
        p.vx *= 0.96;
      }

      const progress = p.age / p.life;
      if (progress >= 1) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = progress < 0.25 ? progress / 0.25 : 1 - (progress - 0.25) / 0.75;
      ctx.beginPath();
      ctx.fillStyle = `rgba(226, 213, 196, ${alpha * 0.16})`;
      ctx.arc(p.x, p.y, p.r * (1 + progress * 2.4), 0, 6.28);
      ctx.fill();
    }
  }

  requestAnimationFrame(loop);
}
