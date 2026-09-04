/**
 * Data Lab & Historical Time Series Visualizations Module
 */
import { $, $$ } from '../utils/dom.js';
import { toast } from '../utils/dom.js';
import { clamp } from '../utils/math.js';
import { fmtBR } from '../utils/formatters.js';
import { PROD, ICE, CEP, DEST, CAP } from '../data/timeseries.js';

export function initDataLabModule() {
  // 1. Tab Switching
  $$('#dlTabs .tab').forEach(t =>
    t.addEventListener('click', () => {
      $$('#dlTabs .tab').forEach(x => x.classList.toggle('on', x === t));
      $$('.tabpane').forEach(p => p.classList.toggle('on', p.id === 'pane-' + t.dataset.t));
    })
  );

  // 2. Production Biennial Chart
  function drawProd(p = 1) {
    const svg = $('#prodChart');
    if (!svg) return;

    const W = 720, H = 300, L = 56, R = 16, T = 18, B = 42, yMax = 70;
    const y = v => T + (1 - v / yMax) * (H - T - B);
    const bw = (W - L - R) / PROD.length;

    let g = '';
    for (let v = 0; v <= 70; v += 10) {
      g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="axis"/><text x="${L - 8}" y="${y(v) + 3}" text-anchor="end" class="axis-t">${v}</text>`;
    }

    PROD.forEach(d => {
      const x = L + bw * (d[0] - 2017) + bw * 0.18;
      const w = bw * 0.64;
      const hh = (y(0) - y(d[1])) * p;
      const hot = d[0] === 2021;

      g += `<rect x="${x}" y="${y(0) - hh}" width="${w}" height="${hh}" rx="3" fill="${hot ? '#C25E43' : '#B57A33'}" opacity="${hot ? '.85' : '1'}"/>`;
      g += `<text x="${x + w / 2}" y="${H - B + 16}" text-anchor="middle" class="axis-t">${d[0]}</text>`;

      if (p === 1) {
        g += `<text x="${x + w / 2}" y="${y(0) - hh - 6}" text-anchor="middle" class="axis-t" style="font-weight:500;fill:#6B5947">${fmtBR(d[1], 1)}</text>`;
        if (hot) {
          g += `<text x="${x + w / 2}" y="${y(0) - hh - 20}" text-anchor="middle" class="axis-t" style="fill:#C25E43;font-weight:500">geada</text>`;
        }
        if (d[0] === 2020 || d[0] === 2022) {
          g += `<text x="${x + w / 2}" y="${y(0) - hh - 20}" text-anchor="middle" class="axis-t" style="fill:#B57A33;font-weight:500">recorde</text>`;
        }
      }
    });

    svg.innerHTML = g;
  }

  let prodAnim = null;
  function playProd() {
    if (prodAnim) cancelAnimationFrame(prodAnim);
    const t0 = performance.now();
    (function f(now) {
      const p = clamp((now - t0) / 900, 0, 1);
      const e = 1 - Math.pow(1 - p, 3);
      drawProd(e);
      if (p < 1) prodAnim = requestAnimationFrame(f);
      else prodAnim = null;
    })(t0);
  }

  const prodPlayBtn = $('#prodPlay');
  if (prodPlayBtn) prodPlayBtn.addEventListener('click', playProd);

  const prodChartEl = $('#prodChart');
  if (prodChartEl) {
    const pio = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            playProd();
            pio.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    pio.observe(prodChartEl);
  }

  // 3. Price Chart (ICE Futures vs. Cepea/ESALQ)
  const priceSvg = $('#priceChart');
  if (priceSvg) {
    const W = 720, H = 310, L = 52, R = 58, T = 18, B = 40;
    const x = t => L + ((t - 2019) / (2025.6 - 2019)) * (W - L - R);
    const y1 = v => T + (1 - v / 4.8) * (H - T - B);
    const y2 = v => T + (1 - v / 2600) * (H - T - B);
    const tl = t => {
      const m = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      return m[Math.round((t - Math.floor(t)) * 12) % 12] + '/' + Math.floor(t);
    };

    let g = '';
    for (let v = 0; v <= 4; v++) {
      g += `<line x1="${L}" x2="${W - R}" y1="${y1(v)}" y2="${y1(v)}" class="axis"/><text x="${L - 8}" y="${y1(v) + 3}" text-anchor="end" class="axis-t">${v}$</text>`;
    }
    for (let v = 500; v <= 2500; v += 500) {
      g += `<text x="${W - R + 8}" y="${y2(v) + 3}" class="axis-t">${v}</text>`;
    }
    [2019, 2020, 2021, 2022, 2023, 2024, 2025].forEach(t => {
      g += `<text x="${x(t)}" y="${H - 14}" text-anchor="middle" class="axis-t">${t}</text>`;
    });

    const p1 = ICE.map((p, i) => (i ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y1(p[1]).toFixed(1)).join(' ');
    const p2 = CEP.map((p, i) => (i ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y2(p[1]).toFixed(1)).join(' ');

    g += `<path d="${p1}" fill="none" stroke="#B57A33" stroke-width="2.5" stroke-linejoin="round"/><path d="${p2}" fill="none" stroke="#5F7048" stroke-width="2" stroke-dasharray="5 4"/>`;

    [
      [2021.55, 2.30, 'geada jul/2021'],
      [2024.78, 3.40, 'seca set/2024'],
      [2025.1, 4.35, 'recorde fev/2025']
    ].forEach(a => {
      g += `<circle cx="${x(a[0])}" cy="${y1(a[1])}" r="3.5" fill="#14100C"/><text x="${x(a[0])}" y="${y1(a[1]) - 10}" text-anchor="middle" class="axis-t" style="fill:#6B5947;font-weight:500">${a[2]}</text>`;
    });

    ICE.forEach((p, i) => {
      g += `<circle class="pt" data-v="${p[1]}" data-r="${CEP[i][1]}" data-l="${tl(p[0])}" cx="${x(p[0])}" cy="${y1(p[1])}" r="10" fill="transparent" style="cursor:pointer"/><circle cx="${x(p[0])}" cy="${y1(p[1])}" r="3" fill="#B57A33" pointer-events="none"/>`;
    });

    priceSvg.innerHTML = g;

    const tip = $('#priceTip');
    if (tip) {
      priceSvg.addEventListener('pointermove', e => {
        const t = e.target.closest('.pt');
        if (!t) {
          tip.style.opacity = 0;
          return;
        }
        const r = priceSvg.getBoundingClientRect();
        tip.style.left = (+t.getAttribute('cx') / 720 * r.width) + 'px';
        tip.style.top = (+t.getAttribute('cy') / 310 * r.height) + 'px';
        tip.innerHTML = `<b>ICE US$ ${fmtBR(+t.dataset.v, 2)}/lb</b> · Cepea R$ ${fmtBR(+t.dataset.r)}/saca · ${t.dataset.l}`;
        tip.style.opacity = 1;
      });

      priceSvg.addEventListener('pointerleave', () => {
        tip.style.opacity = 0;
      });
    }
  }

  // 4. Donut Export Chart
  const donutSvg = $('#donutExport');
  if (donutSvg) {
    const cx = 100, cy = 100, r = 74, C = 2 * Math.PI * r;
    let off = 0;
    let g = '';

    DEST.forEach(d => {
      const len = C * (d[1] / 100);
      g += `<circle class="donut-seg" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d[2]}" stroke-width="26" stroke-dasharray="0 ${C}" data-len="${len}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})"/>`;
      off += len;
    });

    g += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="Fraunces,serif" font-size="25" fill="#211710" font-weight="600">44,6 mi</text>`;
    g += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#6B5947" letter-spacing="1">SACAS · 2024</text>`;

    donutSvg.innerHTML = g;

    const dio = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            $$('#donutExport .donut-seg').forEach(s => (s.style.strokeDasharray = `${s.dataset.len} ${C}`));
            dio.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    dio.observe(donutSvg);
  }

  // 5. Destination Rows
  const destRows = $('#destRows');
  if (destRows) {
    destRows.innerHTML = DEST.map(
      (d, i) =>
        `<div class="hrow"><b>${d[0]}</b><div class="t"><i style="--w:${d[1] * 2.4}%;--d:${i * 0.07}s;background:${d[2]}"></i></div><em>~${d[1]}%</em></div>`
    ).join('');
  }

  // 6. Per Capita Rows
  const capRows = $('#capRows');
  if (capRows) {
    capRows.innerHTML = CAP.map(
      ([n, v], i) =>
        `<div class="hrow"><b>${n}${n === 'Brasil' ? ' ★' : ''}</b><div class="t"><i style="--w:${(v / 12) * 100}%;--d:${i * 0.05}s;${n === 'Brasil' ? 'background:#C25E43' : ''}"></i></div><em>${fmtBR(v, 1)}</em></div>`
    ).join('');
  }

  // 7. Copy APIs Button
  const copyBtn = $('#copyApis');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const txt =
        'Fontes abertas de dados sobre café:\n• IBGE SIDRA (tabela 5457): https://sidra.ibge.gov.br\n• IBGE API de Malhas: https://servicodados.ibge.gov.br\n• Comex Stat: https://comexstat.mdic.gov.br\n• Conab: https://www.conab.gov.br\n• ICO: https://www.ico.org\n• Cepea/ESALQ: https://cepea.esalq.usp.br\n• USDA FoodData Central: https://fdc.nal.usda.gov';
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
        .then(() => toast('Lista de fontes copiada — bons estudos!'))
        .catch(() => toast('Seu navegador bloqueou a cópia — a lista está no rodapé.'));
    });
  }
}
