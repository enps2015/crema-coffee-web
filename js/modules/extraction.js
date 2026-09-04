/**
 * Brewing Methods & Extraction Laboratory Simulation Module
 */
import { $, $$ } from '../utils/dom.js';
import { toast } from '../utils/dom.js';
import { clamp, lerp, lerpHex } from '../utils/math.js';
import { fmtBR, fmtTime } from '../utils/formatters.js';
import { METHODS, LAB_PRESETS } from '../data/methods.js';

export function initExtractionModule() {
  const mList = $('#mList');
  const mpContent = $('#mpContent');
  if (!mList || !mpContent) return;

  const sG = $('#sGrind');
  const sT = $('#sTemp');
  const sS = $('#sTime');
  const sR = $('#sRatio');

  const grindName = g =>
    g <= 2
      ? 'extrafina (espresso/turco)'
      : g <= 4
      ? 'fina (V60)'
      : g <= 6
      ? 'média (pano)'
      : g <= 8
      ? 'grossa (French press)'
      : 'extra grossa (cold brew)';

  const timeFromSlider = v => Math.pow(10, 1 + (3.8 * v) / 1000);
  const sliderFromTime = t => clamp(((Math.log10(t) - 1) / 3.8) * 1000, 0, 1000);

  function applyPreset({ g, t, s, r }) {
    if (sG) sG.value = g;
    if (sT) sT.value = t;
    if (sS) sS.value = sliderFromTime(s);
    if (sR) sR.value = r;
    updateLab();
  }

  function setChip(el) {
    $$('#labChips .chip').forEach(c => c.classList.toggle('on', c === el));
  }

  function updateLab() {
    if (!sG || !sT || !sS || !sR) return;

    const g = +sG.value;
    const t = +sT.value;
    const s = timeFromSlider(+sS.value);
    const r = +sR.value;

    $('#oGrind').textContent = `${g}/10 · ${grindName(g).split(' (')[0]}`;
    $('#oTemp').textContent = t + ' °C';
    $('#oTime').textContent = fmtTime(s);
    $('#oRatio').textContent = `1 : ${fmtBR(r, r % 1 ? 1 : 0)}`;
    $('#hRatio').textContent = `Dose de referência: 15 g de café → ${fmtBR(15 * r, 0)} g de água`;
    $('#hGrind').textContent = `1 = talco (turco/espresso) · 10 = pedregulho (cold brew) · agora: ${grindName(g)}`;

    const a = Math.pow((10 - g) / 9, 0.7);
    const tau = 8 + 6.2 * g;
    const b = s / (s + tau);
    const c = clamp((t - 80) / 18, 0, 1);
    const extr = 12 + 0.12 * (34 * a + 44 * b + 22 * c);
    const tds = extr / r;
    const caf = Math.round((15 * 14 * 0.55 * Math.min(extr, 26)) / 22);
    const tempK = t <= 40 ? Math.max(0.1, Math.pow(t / 95, 1.6)) : 1;

    const acid = clamp(95 - Math.abs(extr - 17) * 7.5, 0, 100) * tempK;
    const sweet = clamp((100 - Math.abs(extr - 19.5) * 9) * (t < 40 ? 1.08 : 1), 0, 100);
    const bitter = clamp((extr - 19) * 13 + (t > 92 ? (t - 92) * 4 : 0) + (g <= 2 && extr > 21.5 ? 8 : 0), 0, 100);
    const body = clamp(tds * 6.5 + (10 - g) * 2.2 + extr * 0.8, 0, 100);

    const setGauge = (id, val, out, txt) => {
      const bar = $(id);
      const outEl = $(out);
      if (bar) bar.style.width = val + '%';
      if (outEl) outEl.textContent = txt;
    };

    setGauge('#bAcid', acid, '#vAcid', `${fmtBR(acid, 0)}/100`);
    setGauge('#bSweet', sweet, '#vSweet', `${fmtBR(sweet, 0)}/100`);
    setGauge('#bBitter', bitter, '#vBitter', `${fmtBR(bitter, 0)}/100`);
    setGauge('#bBody', body, '#vBody', `${fmtBR(body, 0)}/100`);

    const bTds = $('#bTds');
    if (bTds) bTds.style.width = clamp(tds * 8.5, 0, 100) + '%';
    $('#vTds').textContent = `${fmtBR(tds, 1)}% · ~${caf} mg`;
    $('#vExtr').textContent = fmtBR(extr, 1) + '%';

    const needle = $('#needle');
    if (needle) needle.style.left = clamp((extr - 10) / 20, 0, 1) * 100 + '%';

    const k = Math.pow(clamp(tds / 12, 0, 1), 0.75);
    const liq = $('#liq');
    if (liq) {
      liq.style.fill = k < 0.5
        ? lerpHex('#D9A25F', '#6E421F', k * 2)
        : lerpHex('#6E421F', '#150C06', (k - 0.5) * 2);
    }

    const cremaL = $('#cremaL');
    if (cremaL) {
      cremaL.style.opacity = g <= 2 && r <= 4 ? 1 : 0;
    }

    const verdictBox = $('#verdictBox');
    if (verdictBox) {
      verdictBox.classList.remove('ok', 'bad');
      let title = '';
      let txt = '';

      if (t <= 40 && s >= 1800) {
        title = 'Extração a frio';
        txt = 'Água fria não arranca amargor nem acidez agressiva — só doçura suave e frutado. Pagou-se em horas o que o calor daria em minutos.';
      } else if (extr < 16) {
        verdictBox.classList.add('bad');
        title = 'Subextraído';
        txt = 'Os ácidos saíram primeiro, os açúcares ainda não: xícara azeda, rala e às vezes salgada. Moe mais fino, aumente a temperatura ou alongue o tempo.';
      } else if (extr < 18) {
        title = 'Bem perto da janela';
        txt = 'Sabor já honesto, mas a doçura ainda está tímida. Um nudge na moagem (mais fina) ou 20 segundos a mais de contato e você chega.';
      } else if (extr <= 22) {
        verdictBox.classList.add('ok');
        title = 'Na janela do ouro';
        txt = 'Dentro da faixa ideal de 18–22%: acidez, doçura e amargor em equilíbrio — é aqui que a origem fala mais alto. Deguste sem pressa.';
      } else if (extr <= 24) {
        verdictBox.classList.add('bad');
        title = 'Passou do ponto';
        txt = 'Os amargos pesados entraram na festa e estão roubando a doçura. Moe um pouco mais grosso ou corte o tempo de contato.';
      } else {
        verdictBox.classList.add('bad');
        title = 'Sobreextraído';
        txt = 'Amargor seco, adstringência, gosto de cinza: a água levou até o que não devia. Moagem mais grossa, temperatura menor ou tempo bem mais curto.';
      }

      $('#verdictTitle').textContent = title;
      $('#verdictText').textContent = txt;
    }
  }

  function showMethod(id) {
    const m = METHODS.find(x => x.id === id);
    if (!m) return;

    $$('.m-item').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    mpContent.innerHTML = `
      <p class="m-fam">${m.fam}</p>
      <h3>${m.name}</h3>
      <div class="m-specs">
        ${Object.entries(m.specs).map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}
      </div>
      <p class="story">${m.story}</p>
      <p class="taste"><b>No paladar:</b> ${m.taste}</p>
      <button class="btn btn-solid" type="button" id="btnLab" style="padding:12px 22px;font-size:14px">
        <i data-lucide="flask-conical"></i>Testar no laboratório
      </button>
    `;

    if (window.lucide) window.lucide.createIcons();

    const btnLab = $('#btnLab');
    if (btnLab) {
      btnLab.addEventListener('click', () => {
        applyPreset(m.lab);
        setChip(null);
        const labSection = document.getElementById('laboratorio');
        if (labSection) labSection.scrollIntoView({ behavior: 'smooth' });
        toast(`Parâmetros do ${m.name} carregados no laboratório`);
      });
    }
  }

  // Render Methods List
  mList.innerHTML = METHODS.map(
    m => `<button class="m-item" data-id="${m.id}" type="button"><b>${m.name}</b><span>${m.fam.split('·')[0].split('sob')[0].trim()}</span></button>`
  ).join('');

  $$('.m-item').forEach(b => b.addEventListener('click', () => showMethod(b.dataset.id)));
  showMethod('v60');

  // Render Lab Presets Chips
  const labChipsContainer = $('#labChips');
  if (labChipsContainer) {
    labChipsContainer.innerHTML = LAB_PRESETS.map(
      (p, i) => `<button class="chip" data-i="${i}" type="button">${p.n}</button>`
    ).join('');

    $$('#labChips .chip').forEach(c =>
      c.addEventListener('click', () => {
        const p = LAB_PRESETS[+c.dataset.i];
        if (p.n === 'Surpresa') {
          applyPreset({
            g: 1 + Math.floor(Math.random() * 10),
            t: Math.round(lerp(20, 98, Math.random())),
            s: Math.round(Math.pow(10, 1.6 + Math.random() * 3.4)),
            r: Math.round(lerp(2, 18, Math.random()))
          });
          setChip(null);
          toast('Experimento aleatório servido — boa sorte com a xícara');
        } else {
          applyPreset(p.lab);
          setChip(c);
        }
      })
    );
  }

  [sG, sT, sS, sR].forEach(s => {
    if (s) {
      s.addEventListener('input', () => {
        updateLab();
        setChip(null);
      });
    }
  });

  updateLab();
}
