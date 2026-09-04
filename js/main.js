/**
 * CREMA° — Main Application Bootstrapper (ES Modules)
 */

import { initNavigation } from './modules/navigation.js';
import { initSteamSimulation } from './modules/steam-sim.js';
import { initMapModule } from './modules/map.js';
import { initNeuroModule } from './modules/neuro/neuro.controller.js';
import { initRoastModule } from './modules/roast.js';
import { initFlipcardsModule } from './modules/flipcards.js';
import { initExtractionModule } from './modules/extraction.js';
import { initDataLabModule } from './modules/datalab.js';
import { initLiveModule } from './modules/live.js';
import { initPlantsModule } from './modules/plants.js';
import { initTooltipsModule } from './modules/tooltips.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize UI icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Initialize application modules in lifecycle order
  initSteamSimulation();
  initMapModule();
  initNeuroModule();
  initRoastModule();
  initFlipcardsModule();
  initExtractionModule();
  initDataLabModule();
  initLiveModule();
  initPlantsModule();
  initTooltipsModule();
  initNavigation();

  // 3. Final icon pass for dynamically rendered components
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
