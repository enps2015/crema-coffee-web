# CREMA° — Do Grão ao Neurônio · Atlas Vivo do Café

[![Deploy to GitHub Pages](https://github.com/enps2015/crema-coffee-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/enps2015/crema-coffee-web/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![HuBMAP CCF](https://img.shields.io/badge/Anatomy-HuBMAP%20CCF%20(CC%20BY%204.0)-blue.svg)](https://hubmapconsortium.org/)

> **CREMA°** é um atlas editorial, científico e interativo sobre a cultura cafeeira. O projeto explora as conexões profundas entre história socioeconômica, farmacologia molecular, anatomia humana em 3D, cartografia agrícola oficial e telemetria de mercado em tempo real.

🌐 **Acesse online:** [https://enps2015.github.io/crema-coffee-web/](https://enps2015.github.io/crema-coffee-web/)

---

## ☕ Visão Geral & Capítulos do Atlas

1. **01 · Origem & História:** Da Kaffa etíope e dos sufis no Iêmen (século XV) à expansão global e às cafeterias iluministas europeias.
2. **02 · Brasil & Terroirs:** Cartografia dinâmica dos terroirs brasileiros (Sul de Minas, Matas de Minas, Cerrado, Alta Mogiana, Chapada Diamantina, Conilon capixaba e Canéfora amazônico) integrando malha vetorial do IBGE.
3. **03 · Neurociência & Farmacocinética:**
   - Mecanismo molecular de bloqueio competitivo dos receptores de adenosina ($A_1$ e $A_{2A}$).
   - Painel farmacocinético monocompartimental interativo com curvas de absorção e depuração plasmática.
   - **CREMA° Anatomy 3D Lab:** Viewport tridimensional interativo renderizado com Three.js e Draco WASM, mapeando os impactos sistêmicos da cafeína sobre o coração, cérebro, pulmões, fígado, rins, intestinos e músculos.
   - Fallback 2D acessível em SVG vetorial para dispositivos sem aceleração WebGL.
4. **04 · O Mito do Vício:** Esclarecimento clínico sobre a fronteira entre dependência química compulsiva (circuito de recompensa dopaminérgico) e tolerância funcional/abstinência temporária (DSM-5 e NEJM).
5. **05 · Métodos de Preparo & Laboratório SCA:** Modelagem termodinâmica da extração cafeeira (V60, Aeropress, Prensa Francesa, Espresso, Chemex, Cold Brew), avaliando TDS e rendimento na zona ideal (18–22%).
6. **06 · Data Lab & Séries Temporais:** Análise visual de séries temporais históricas de produção, consumo, comércio exterior e preços com fontes oficiais.
7. **06.5 · Terminal Live:** Telemetria climática dos polos produtores via Open-Meteo e cotação cambial PTAX do Banco Central do Brasil em tempo real.
8. **07 · Plantas da Cafeína & Família das Xantinas:** Botânica evolutiva e química comparativa das metilxantinas (Cafeína, Teobromina e Teofilina) em diagramas vetoriais SVG de alta fidelidade estrutural.
9. **08 · Quarta Onda Cognitiva & Futuro:** Biotecnologia na pós-colheita, fermentações inoculadas por leveduras de precisão, sensores IoT agrícolas e o papel do café na cognição e longevidade.

---

## 🧬 Atribuição Científica dos Modelos Anatômicos 3D

Os modelos tridimensionais exibidos no **CREMA° Anatomy 3D Lab** foram desenvolvidos pelo **NIH Human Biomolecular Atlas Program (HuBMAP)**, **National Library of Medicine (Visible Human Project)** e **Allen Institute for Brain Science**, disponibilizados por meio da *HuBMAP CCF 3D Reference Object Library*.

- **Licença dos modelos:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Otimização de Malhas:** Draco 3D Compression (Google), decodificada em tempo de execução via WebAssembly.

---

## 📊 Fontes Primárias de Dados & APIs Públicas

- **Malha Cartográfica:** Instituto Brasileiro de Geografia e Estatística (IBGE)
- **Câmbio & PTAX:** Banco Central do Brasil (BCB)
- **Levantamentos de Safra:** Companhia Nacional de Abastecimento (Conab)
- **Telemetria Climática:** Open-Meteo API
- **Estatísticas Mundiais:** International Coffee Organization (ICO)
- **Séries Históricas de Preços:** ICE Futures US & Cepea/ESALQ
- **Acervo Fotográfico:** Unsplash (fotografia documental sob licença pública)

---

## 🛠️ Pilha Tecnológica

- **Estrutura:** HTML5 Semântico com dados estruturados Schema.org (JSON-LD)
- **Estilização:** Vanilla CSS modular com Design Tokens nativos (`tokens.css`), tipografia fluida (`clamp()`), glassmorphism e zero dependência de frameworks utilitários como Tailwind
- **Lógica & Módulos:** JavaScript nativo ES Modules (ESM)
- **Renderização Gráfica & 3D:** Three.js r128 + Draco WASM Decoder
- **Cartografia:** Leaflet.js 1.9.4
- **Iconografia:** Lucide Icons
- **Tipografia:** Fraunces (serifa display), Instrument Sans (prosa) e IBM Plex Mono (dados e telemetria)

---

## 🚀 Execução Local

Como o CREMA° é uma aplicação estática pura que utiliza ES Modules e Web Workers para o decodificador Draco, sirva os arquivos através de um servidor HTTP local:

```bash
# Clone o repositório
git clone https://github.com/enps2015/crema-coffee-web.git
cd crema-coffee-web

# Usando Python 3
python3 -m http.server 8080

# Ou usando Node / npx
npx serve .
```

Acesse no navegador: `http://localhost:8080`

---

## 👤 Autoria & Créditos

**Idealizado, pesquisado e desenvolvido por:**

**Eric Pimentel**  
*Cientista de Dados & Engenheiro de Software*  
- **LinkedIn:** [linkedin.com/in/ericpimentel-dados](https://www.linkedin.com/in/ericpimentel-dados/)  
- **GitHub:** [github.com/enps2015](https://github.com/enps2015)

---

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE) — ver o arquivo `LICENSE` para detalhes. Os modelos anatômicos da biblioteca HuBMAP CCF continuam sob a licença [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
