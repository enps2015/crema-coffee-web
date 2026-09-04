/**
 * Neuro Section — Pharmacokinetics Mathematical Engine & Plasma Curve Visualizer
 */
import { $, $$ } from '../../utils/dom.js';
import { clamp, calcPlasmaConcentration, PHARMA } from '../../utils/math.js';
import { fmtBR } from '../../utils/formatters.js';
import { DOSE_PRESETS } from '../../data/neuro.js';

/**
 * Determine clinical state description from plasma concentration
 * @param {number} concentration
 * @returns {[string, string]} [label, cssModifierClass]
 */
export function getStateClassification(concentration) {
  if (concentration < 0.3) return ['Estado: basal', ''];
  if (concentration < 1) return ['Estado: aquecendo — primeiros sinais de alerta', ''];
  if (concentration < 3) return ['Estado: modo foco — adenosina bloqueada', 's2'];
  if (concentration < 5) return ['Estado: alerta máximo — limiar do jitter em sensíveis', 's3'];
  return ['Estado: sobrecarga — ansiedade e taquicardia leve prováveis', 's4'];
}

export class PharmacokineticsEngine {
  /**
   * @param {Object} options
   * @param {(state: { dose: number, time: number, concentration: number }) => void} [options.onStateChange]
   */
  constructor(options = {}) {
    this.onStateChange = options.onStateChange || (() => {});
    this.sDose = $('#sDose');
    this.sClock = $('#sClock');
    this.curveSvg = $('#plasmaCurve');
    this.tipEl = $('#plasmaTip');
    this.pillEl = $('#statePill');
    this.oDoseEl = $('#oDose');
    this.oClockEl = $('#oClock');
    this.presetsContainer = $('#dosePresets');
    this.cTop = 2;
  }

  init() {
    if (!this.sDose || !this.sClock || !this.curveSvg) return;

    this.renderPresets();
    this.bindEvents();
    this.drawCurve();
    this.update();
  }

  renderPresets() {
    if (!this.presetsContainer) return;

    this.presetsContainer.innerHTML = DOSE_PRESETS.map(
      p => `<button class="preset${p[0] === 95 ? ' on' : ''}" data-d="${p[0]}" type="button">${p[1]} · ${p[0]}mg</button>`
    ).join('');

    $$('#dosePresets .preset').forEach(b => {
      b.addEventListener('click', () => {
        this.setDose(+b.dataset.d);
        $$('#dosePresets .preset').forEach(x => x.classList.toggle('on', x === b));
      });
    });
  }

  bindEvents() {
    this.sDose.addEventListener('input', () => {
      $$('#dosePresets .preset').forEach(x => x.classList.remove('on'));
      this.drawCurve();
      this.update();
    });

    this.sClock.addEventListener('input', () => {
      this.update();
    });
  }

  setDose(doseMg) {
    if (this.sDose) {
      this.sDose.value = doseMg;
      this.drawCurve();
      this.update();
    }
  }

  setTime(timeMinutes) {
    if (this.sClock) {
      this.sClock.value = timeMinutes;
      this.update();
    }
  }

  drawCurve() {
    const W = 460, H = 190, L = 42, R = 14, T = 14, B = 34;
    const doseVal = +this.sDose.value;
    this.cTop = Math.max(1.2, calcPlasmaConcentration(doseVal, 720) * 1.08);

    const x = m => L + (m / 720) * (W - L - R);
    const y = c => T + (1 - clamp(c, 0, this.cTop) / this.cTop) * (H - T - B);

    let g = '';
    for (let h = 0; h <= 12; h += 2) {
      g += `<line x1="${x(h * 60)}" x2="${x(h * 60)}" y1="${T}" y2="${H - B}" class="axis"/><text x="${x(h * 60)}" y="${H - 16}" text-anchor="middle" class="axis-t">${h}h</text>`;
    }
    for (let i = 1; i <= 3; i++) {
      g += `<line x1="${L}" x2="${W - R}" y1="${y((this.cTop * i) / 4)}" y2="${y((this.cTop * i) / 4)}" class="axis"/><text x="${L - 6}" y="${y((this.cTop * i) / 4) + 3}" text-anchor="end" class="axis-t">${fmtBR((this.cTop * i) / 4, this.cTop < 4 ? 1 : 0)}</text>`;
    }

    let path = '';
    for (let m = 0; m <= 720; m += 5) {
      path += (m ? 'L' : 'M') + x(m).toFixed(1) + ' ' + y(calcPlasmaConcentration(doseVal, m)).toFixed(1) + ' ';
    }

    g += `<path d="${path}L ${x(720)} ${H - B} L ${x(0)} ${H - B} Z" fill="rgba(181,122,51,.12)"/>`;
    g += `<path d="${path}" fill="none" stroke="#B57A33" stroke-width="2.5"/>`;
    g += `<line id="curX" x1="0" x2="0" y1="${T}" y2="${H - B}" stroke="#211710" stroke-width="1" stroke-dasharray="3 4" opacity=".5"/><circle id="curDot" r="5" fill="#14100C"/>`;
    g += `<text x="${L}" y="${H - 4}" class="axis-t">concentração plasmática estimada (mg/L)</text>`;

    this.curveSvg.innerHTML = g;
  }

  update() {
    const dose = +this.sDose.value;
    const time = +this.sClock.value;

    if (this.oDoseEl) {
      this.oDoseEl.textContent = dose + ' mg' + (dose > 400 ? ' — acima do limite EFSA/FDA' : '');
    }
    if (this.oClockEl) {
      this.oClockEl.textContent = time < 60 ? `T+${fmtBR(time)} min` : `T+${fmtBR(time / 60, 1)} h`;
    }

    const W = 460, H = 190, L = 42, R = 14, T = 14, B = 34;
    const x = m => L + (m / 720) * (W - L - R);
    const y = c => T + (1 - clamp(c, 0, this.cTop) / this.cTop) * (H - T - B);

    const concentration = calcPlasmaConcentration(dose, time);
    const cx = x(time);
    const cy = y(concentration);

    const cur = this.curveSvg.querySelector('#curX');
    const dot = this.curveSvg.querySelector('#curDot');
    if (cur && dot) {
      cur.setAttribute('x1', cx);
      cur.setAttribute('x2', cx);
      dot.setAttribute('cx', cx);
      dot.setAttribute('cy', cy);
    }

    if (this.tipEl) {
      this.tipEl.style.opacity = 1;
      this.tipEl.style.left = (cx / 460 * 100) + '%';
      this.tipEl.style.top = (cy / 190 * 100) + '%';
      this.tipEl.innerHTML = `<b>${fmtBR(concentration, 2)} mg/L</b> · ~${fmtBR(Math.exp(-PHARMA.KE * time / 60) * 100, 0)}% ainda por eliminar`;
    }

    const [stateTitle, stateClass] = getStateClassification(concentration);
    if (this.pillEl) {
      this.pillEl.className = 'state-pill ' + stateClass;
      const bEl = this.pillEl.querySelector('b');
      if (bEl) bEl.textContent = stateTitle;
    }

    this.onStateChange({ dose, time, concentration });
  }

  getCurrentState() {
    const dose = +this.sDose.value;
    const time = +this.sClock.value;
    const concentration = calcPlasmaConcentration(dose, time);
    return { dose, time, concentration, cTop: this.cTop };
  }
}

export function createPharmacokineticsEngine(options) {
  const engine = new PharmacokineticsEngine(options);
  engine.init();
  return engine;
}
