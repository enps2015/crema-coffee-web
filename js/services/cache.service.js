/**
 * LocalStorage Cache Service with TTL Support
 */
import { CONFIG } from '../config.js';

export function saveTerminalCache(data) {
  try {
    localStorage.setItem(
      CONFIG.CACHE.TERMINAL_KEY,
      JSON.stringify({
        t: Date.now(),
        d: data
      })
    );
  } catch (e) {
    console.warn('[CacheService] Failed to save to localStorage:', e);
  }
}

export function loadTerminalCache() {
  try {
    const raw = localStorage.getItem(CONFIG.CACHE.TERMINAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.warn('[CacheService] Failed to read from localStorage:', e);
    return null;
  }
}

export function isCacheValid(cached) {
  if (!cached || !cached.t || !cached.d) return false;
  return Date.now() - cached.t < CONFIG.CACHE.TERMINAL_TTL_MS;
}
