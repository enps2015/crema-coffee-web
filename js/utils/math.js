/**
 * Mathematical & Pharmacokinetic Helpers
 */

/**
 * Constrain a value between min and max
 */
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * Linear interpolation between a and b
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Interpolate two hex colors (#RRGGBB)
 */
export const lerpHex = (a, b, t) => {
  const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16));
  const pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], t)).toString(16).padStart(2, '0')).join('');
};

/**
 * One-compartment open pharmacokinetic model for oral caffeine absorption & elimination
 * Ka = 3.2 h^-1 (absorption rate), Ke = 0.1386 h^-1 (elimination rate, t1/2 ~ 5h), Vd = 42 L (volume of distribution)
 */
export const PHARMA = {
  KA: 3.2,
  KE: 0.1386,
  VD: 42
};

export function calcPlasmaConcentration(doseMg, timeMinutes) {
  const t = timeMinutes / 60;
  if (t <= 0) return 0;
  return (
    ((doseMg * PHARMA.KA) / (PHARMA.VD * (PHARMA.KA - PHARMA.KE))) *
    (Math.exp(-PHARMA.KE * t) - Math.exp(-PHARMA.KA * t))
  );
}
