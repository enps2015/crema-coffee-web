/**
 * CREMA° Anatomy 3D Lab — Fallback & Diagnostics Module (FASE C Hardening)
 * Full 7-topic SVG 2D fallback (Brain, Heart, Lungs, Liver, Kidneys, Intestines, Muscles).
 */

export class FallbackManager {
  constructor(options = {}) {
    this.fallbackContainer = options.fallbackContainer || document.getElementById('fallbackWrapper');
    this.canvasWrapper = options.canvasWrapper || document.getElementById('canvasWrapper');
    this.statusTag = options.statusTag || document.getElementById('viewportStatus');
    this.onOrganSelect = options.onOrganSelect || (() => {});
  }

  isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  getWebGLDiagnostics() {
    if (!this.isWebGLSupported()) {
      return { supported: false, version: 'None', renderer: 'Unavailable', vendor: 'Unavailable' };
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        supported: true,
        version: canvas.getContext('webgl2') ? 'WebGL 2.0' : 'WebGL 1.0',
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
      };
    } catch (e) {
      return { supported: true, version: 'WebGL (Limited)', renderer: 'Unknown', vendor: 'Unknown' };
    }
  }

  activateFallback(reason = 'WebGL indisponível') {
    console.warn(`[CREMA Anatomy 3D Lab] Ativando fallback SVG: ${reason}`);

    if (this.canvasWrapper) this.canvasWrapper.style.display = 'none';
    if (this.fallbackContainer) {
      this.fallbackContainer.style.display = 'flex';
      this.renderSvgFallback();
    }

    if (this.statusTag) {
      this.statusTag.innerHTML = `<span style="background:var(--cherry);width:7px;height:7px;border-radius:50%;display:inline-block"></span> Fallback SVG 2D (7 Tópicos Ativos)`;
    }

    const btn3D = document.getElementById('btnMode3D');
    const btn2D = document.getElementById('btnMode2D');
    if (btn3D) btn3D.classList.remove('active');
    if (btn2D) btn2D.classList.add('active');
  }

  activate3D() {
    if (this.fallbackContainer) this.fallbackContainer.style.display = 'none';
    if (this.canvasWrapper) this.canvasWrapper.style.display = 'block';

    if (this.statusTag) {
      this.statusTag.innerHTML = `<span class="pulse-dot"></span> Ghost Anatomy 3D · Lazy Loading Ativo`;
    }

    const btn3D = document.getElementById('btnMode3D');
    const btn2D = document.getElementById('btnMode2D');
    if (btn3D) btn3D.classList.add('active');
    if (btn2D) btn2D.classList.remove('active');
  }

  renderSvgFallback() {
    if (!this.fallbackContainer) return;

    this.fallbackContainer.innerHTML = `
      <svg viewBox="0 0 320 520" aria-label="Mapa corporal da cafeína (HuBMAP 2D Fallback)">
        <defs>
          <linearGradient id="bodyGradLab" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(217,160,91,.26)"/>
            <stop offset="45%" stop-color="rgba(217,160,91,.13)"/>
            <stop offset="100%" stop-color="rgba(33,23,16,.05)"/>
          </linearGradient>
        </defs>
        
        <!-- Silhueta Anatômica Humana Editorial (Proporções 1:1 Visible Human 3D) -->
        <g class="body-silhouette">
          <path d="M 160 20 L 174 21 L 182 29 L 184 44 L 181 58 L 175 68 L 169 76 L 169 82 L 171 92 L 184 96 L 202 101 L 222 107 L 235 114 L 240 122 L 242 134 L 237 146 L 234 160 L 229 178 L 226 192 L 223 208 L 218 228 L 210 244 L 205 255 L 202 268 L 198 278 L 193 282 L 190 274 L 196 252 L 203 226 L 207 200 L 210 176 L 207 154 L 198 144 L 195 158 L 190 176 L 185 194 L 184 206 L 188 220 L 193 234 L 194 244 L 193 262 L 190 288 L 185 318 L 180 346 L 176 362 L 175 376 L 179 396 L 177 420 L 172 446 L 168 468 L 167 486 L 170 495 L 164 497 L 161 495 L 163 478 L 164 462 L 167 432 L 168 408 L 166 378 L 165 364 L 166 338 L 167 308 L 166 280 L 163 260 L 160 254 L 157 260 L 154 280 L 153 308 L 154 338 L 155 364 L 154 378 L 152 408 L 153 432 L 156 462 L 157 478 L 159 495 L 156 497 L 150 495 L 153 486 L 152 468 L 148 446 L 143 420 L 141 396 L 145 376 L 144 362 L 140 346 L 135 318 L 130 288 L 127 262 L 126 244 L 127 234 L 132 220 L 136 206 L 135 194 L 130 176 L 125 158 L 122 144 L 113 154 L 110 176 L 113 200 L 117 226 L 124 252 L 130 274 L 127 282 L 122 278 L 118 268 L 115 255 L 110 244 L 102 228 L 97 208 L 94 192 L 91 178 L 86 160 L 83 146 L 78 134 L 80 122 L 85 114 L 98 107 L 118 101 L 136 96 L 149 92 L 151 82 L 151 76 L 145 68 L 139 58 L 136 44 L 138 29 L 146 21 Z" fill="url(#bodyGradLab)" stroke="rgba(217,160,91,.45)" stroke-width="1.4" stroke-linejoin="round"/>
          
          <!-- Linhas Anatômicas de Relevo Ósseo e Muscular (Visible Human) -->
          <path d="M160 96 Q184 92 214 100 M160 96 Q136 92 106 100" stroke="rgba(217,160,91,.32)" stroke-width="1.2" fill="none"/>
          <path d="M160 96 L160 206" stroke="rgba(217,160,91,.22)" stroke-dasharray="3 3" stroke-width="1" fill="none"/>
          <path d="M157 148 C172 150 194 147 202 136 M163 148 C148 150 126 147 118 136" stroke="rgba(217,160,91,.32)" stroke-width="1.2" fill="none"/>
          <path d="M160 162 C174 172 188 184 190 200 M160 162 C146 172 132 184 130 200" stroke="rgba(217,160,91,.2)" stroke-width="1" fill="none"/>
          <path d="M144 238 L160 252 L176 238" stroke="rgba(217,160,91,.25)" stroke-width="1" fill="none"/>
          <circle cx="143" cy="370" r="4.5" fill="none" stroke="rgba(217,160,91,.3)" stroke-width="1"/>
          <circle cx="177" cy="370" r="4.5" fill="none" stroke="rgba(217,160,91,.3)" stroke-width="1"/>
        </g>
        
        <!-- Órgãos Interativos (7 Tópicos HuBMAP) -->
        <g id="labOrgans">
          <!-- Cérebro -->
          <g class="lab-svg-organ" data-o="brain" style="cursor:pointer" tabindex="0" role="button">
            <title>Cérebro (SNC / Cognição)</title>
            <path d="M160 28 C176 28, 184 37, 183 48 C183 58, 175 64, 167 66 C163 67, 163 71, 160 71 C157 71, 157 67, 153 66 C145 64, 137 58, 137 48 C136 37, 144 28, 160 28 Z" fill="#B57A33" stroke="#F3EBDD" stroke-width="1.2"/>
          </g>
          <!-- Pulmões -->
          <g class="lab-svg-organ" data-o="lungs" style="cursor:pointer" tabindex="0" role="button">
            <title>Pulmões (Respiratório)</title>
            <path d="M136 118 C128 128, 126 150, 134 166 C142 164, 149 150, 151 138 Z" fill="#8B9E82" opacity="0.88"/>
            <path d="M184 118 C192 128, 194 150, 186 166 C178 164, 171 150, 169 138 Z" fill="#8B9E82" opacity="0.88"/>
          </g>
          <!-- Coração -->
          <g class="lab-svg-organ" data-o="heart" style="cursor:pointer" tabindex="0" role="button">
            <title>Coração (Cardiovascular)</title>
            <path d="M154 126 C148 126, 144 131, 145 138 C146 146, 153 154, 162 163 C168 157, 176 147, 176 138 C176 130, 170 126, 164 129 C160 127, 157 126, 154 126 Z" fill="#C25E43" stroke="#F3EBDD" stroke-width="1.6"/>
          </g>
          <!-- Fígado -->
          <g class="lab-svg-organ" data-o="liver" style="cursor:pointer" tabindex="0" role="button">
            <title>Fígado (Hepático / CYP1A2)</title>
            <path d="M142 173 C160 168, 179 170, 183 180 C183 190, 154 200, 141 193 C137 188, 137 178, 142 173 Z" fill="#9E5D38"/>
          </g>
          <!-- Rins -->
          <g class="lab-svg-organ" data-o="kidneys" style="cursor:pointer" tabindex="0" role="button">
            <title>Rins (Renal / eGFR)</title>
            <ellipse cx="142" cy="205" rx="8" ry="12" fill="#7A4E3A"/>
            <ellipse cx="178" cy="205" rx="8" ry="12" fill="#7A4E3A"/>
          </g>
          <!-- Intestinos -->
          <g class="lab-svg-organ" data-o="intestines" style="cursor:pointer" tabindex="0" role="button">
            <title>Intestinos (Enteral / Tmax)</title>
            <path d="M145 220 C154 213, 166 213, 175 220 C180 230, 178 245, 172 254 C160 260, 148 250, 145 238 Z" fill="#887E6A"/>
          </g>
          <!-- Músculos (Peitorais, Bíceps e Quadríceps) -->
          <g class="lab-svg-organ" data-o="muscles" style="cursor:pointer" tabindex="0" role="button">
            <title>Músculos Esqueléticos (Somático / RyR1)</title>
            <path d="M117 126 C131 123, 149 125, 154 135 C154 144, 142 152, 128 152 C117 152, 109 141, 117 126 Z" fill="#D9A05B" opacity=".7"/>
            <path d="M203 126 C189 123, 171 125, 166 135 C166 144, 178 152, 192 152 C203 152, 211 141, 203 126 Z" fill="#D9A05B" opacity=".7"/>
            <path d="M82 136 C92 139, 95 159, 92 176 C90 188, 82 188, 77 178 C73 166, 74 143, 82 136 Z" fill="#D9A05B" opacity=".7"/>
            <path d="M238 136 C228 139, 225 159, 228 176 C230 188, 238 188, 243 178 C247 166, 246 143, 238 136 Z" fill="#D9A05B" opacity=".7"/>
            <path d="M125 304 C139 298, 152 304, 155 322 C158 344, 156 372, 152 396 C149 406, 136 408, 130 398 C122 378, 117 340, 125 304 Z" fill="#D9A05B" opacity=".7"/>
            <path d="M195 304 C181 298, 168 304, 165 322 C162 344, 164 372, 168 396 C171 406, 184 408, 190 398 C198 378, 203 340, 195 304 Z" fill="#D9A05B" opacity=".7"/>
          </g>
        </g>
      </svg>
    `;

    this.fallbackContainer.querySelectorAll('.lab-svg-organ').forEach(el => {
      el.addEventListener('click', () => {
        const oKey = el.dataset.o;
        if (oKey) this.onOrganSelect(oKey);
      });
    });
  }
}
