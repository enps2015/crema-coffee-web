/**
 * Extraction Methods & Lab Presets Data
 */

export const METHODS = [
  {
    id: 'espresso',
    name: 'Espresso',
    fam: 'Percolação sob pressão',
    specs: {
      Dose: '18 g',
      Água: '36 g · 1:2',
      'Temp.': '92–96 °C',
      Tempo: '25–30 s',
      Moagem: '1–2 · extrafina',
      Pressão: '9 bar'
    },
    story: 'Nasceu na Itália industrial do início do século XX com a promessa de "café em um minuto". Deu errado — e deu certo demais: virou a base de todas as cafeterias modernas.',
    taste: 'TDS de 8–12%, corpo xaroposo e a <strong>crema</strong>: emulsão de óleos, CO₂ e melanoidinas que só os 9 bar produzem. Concentração, não volume: pequeno, denso e teatral.',
    lab: { g: 1, t: 93, s: 27, r: 2 }
  },
  {
    id: 'moka',
    name: 'Moka (italiana)',
    fam: 'Pressão de vapor',
    specs: {
      Dose: 'até a válvula',
      Água: '1:8',
      'Temp.': '~98 °C',
      Tempo: '4–5 min',
      Moagem: '2–3 · fina',
      Pressão: '~1,5 bar'
    },
    story: 'Patenteada por Alfonso Bialetti em 1933, virou objeto de design e o coração de 90% dos lares italianos.',
    taste: 'Forte, denso e <strong>levemente amarga</strong>: o vapor empurra água quente demais pelo leito, extraindo amargos que o espresso controlado evita. É charmosa assim.',
    lab: { g: 2, t: 98, s: 170, r: 8 }
  },
  {
    id: 'cezve',
    name: 'Cezve / café turco',
    fam: 'Fervura',
    specs: {
      Dose: '7 g / xícara',
      Água: '1:10',
      'Temp.': 'fervura',
      Tempo: '3–4 min',
      Moagem: '1 · talco',
      Pressão: '—'
    },
    story: 'O método mais antigo ainda em uso — patrimônio cultural da UNESCO, servido desde o Império Otomano, borra e tudo.',
    taste: '<strong>Muito corpo, muito sedimento</strong>: o café ferve junto com a água. Doce ou amargo conforme a cultura — nunca filtrado. A xícara vira oráculo (ou não).',
    lab: { g: 1, t: 92, s: 200, r: 10 }
  },
  {
    id: 'pano',
    name: 'Coador de pano',
    fam: 'Filtragem · o método brasileiro',
    specs: {
      Dose: '2 colheres / L',
      Água: '1:14',
      'Temp.': '92–96 °C',
      Tempo: '~3 min',
      Moagem: '6 · média',
      Pressão: '—'
    },
    story: 'Herdeiro dos coadores coloniais, é <strong>o gosto de casa</strong> para a maioria dos brasileiros — simples, cálido, sem cerimônia.',
    taste: 'O pano retém parte dos óleos e acumula o próprio sabor com o tempo: xícara <strong>suave, redonda e nostálgica</strong>. Café de memória afetiva.',
    lab: { g: 6, t: 94, s: 180, r: 14 }
  },
  {
    id: 'v60',
    name: 'V60',
    fam: 'Filtragem · drip manual',
    specs: {
      Dose: '15 g',
      Água: '225 g · 1:15',
      'Temp.': '92–96 °C',
      Tempo: '2:30–3:30',
      Moagem: '4 · média-fina',
      Pressão: '—'
    },
    story: 'Cones cônicos com paredes em espiral (Hario, Japão) que forçam a água a atravessar toda a cama de café em fluxo livre.',
    taste: 'Máxima <strong>clareza e acidez brilhante</strong>: o papel segura óleos e sedimentos, e o terroir fala sem filtro — literalmente. A lupa das origens.',
    lab: { g: 4, t: 94, s: 210, r: 15 }
  },
  {
    id: 'chemex',
    name: 'Chemex',
    fam: 'Filtragem · papel grosso',
    specs: {
      Dose: '30 g',
      Água: '480 g · 1:16',
      'Temp.': '92–94 °C',
      Tempo: '4–5 min',
      Moagem: '5 · média',
      Pressão: '—'
    },
    story: 'Desenhada em 1941 pelo químico Peter Schlumbohm, é peça do MoMA — um funil de laboratório que virou ícone do design.',
    taste: 'O papel extra-grosso entrega a xícara <strong>mais límpida do mundo</strong>: chá de café, floral, elegante. Perfeita para degustações comparativas.',
    lab: { g: 5, t: 93, s: 270, r: 16 }
  },
  {
    id: 'french',
    name: 'French press',
    fam: 'Imersão',
    specs: {
      Dose: '30 g',
      Água: '450 g · 1:15',
      'Temp.': '93–96 °C',
      Tempo: '4 min',
      Moagem: '8 · grossa',
      Pressão: '—'
    },
    story: 'Patenteada na França em 1852 e aperfeiçoada pelos italianos: o êmbolo de malha metálica separa o café já extraído.',
    taste: 'A malha metálica <strong>deixa os óleos passarem</strong>: corpo sedoso, textura de vinho, notas de cacau em peso. O que o papel esconde, o metal entrega.',
    lab: { g: 8, t: 94, s: 240, r: 14 }
  },
  {
    id: 'aero',
    name: 'Aeropress',
    fam: 'Imersão + pressão',
    specs: {
      Dose: '15 g',
      Água: '180 g · 1:12',
      'Temp.': '80–90 °C',
      Tempo: '1–2 min',
      Moagem: '3 · fina',
      Pressão: 'manual'
    },
    story: 'Inventada em 2005 por Alan Adler (engenheiro do boomerang Aerobie). Tem campeonato mundial próprio, com receitas berrantes.',
    taste: 'O híbrido versátil: <strong>imersão dá doçura, o êmbolo dá corpo</strong>. Com papel fica limpa como V60; com metal, densa como prensa francesa. Uma camaleoa.',
    lab: { g: 3, t: 85, s: 90, r: 12 }
  },
  {
    id: 'sifao',
    name: 'Sifão (vacuum pot)',
    fam: 'Imersão a vácuo',
    specs: {
      Dose: '20 g',
      Água: '280 g · 1:14',
      'Temp.': '90–93 °C',
      Tempo: '1–2 min',
      Moagem: '5 · média',
      Pressão: 'vapor/vácuo'
    },
    story: 'Aparelho teatral do século XIX: o vapor empurra a água para cima, o café infunde, e o vácuo o puxa de volta filtrado — ciência como espetáculo.',
    taste: 'Imersão quente + filtro de tecido: <strong>corpo médio e aromas explosivos</strong>. A xícara mais "viva" do menu — e a mais divertida de servir para visitas.',
    lab: { g: 5, t: 92, s: 75, r: 14 }
  },
  {
    id: 'cold',
    name: 'Cold brew',
    fam: 'Imersão a frio',
    specs: {
      Dose: '100 g',
      Água: '1 L · 1:10',
      'Temp.': '10–22 °C',
      Tempo: '12–18 h',
      Moagem: '9 · extra grossa',
      Pressão: '—'
    },
    story: 'Renasce moderno, é milenar na essência: já se bebia café frio no Japão séculos atrás. Hoje domina o verão global.',
    taste: 'A água fria <strong>não arranca amargor nem acidez agressiva</strong>: só doçura suave e frutado. Sabe por que parece doce sem açúcar? Física. (E a cafeína, alta.)',
    lab: { g: 9, t: 20, s: 43200, r: 10 }
  }
];

export const LAB_PRESETS = [
  { n: 'Espresso', lab: METHODS[0].lab },
  { n: 'V60', lab: METHODS[4].lab },
  { n: 'Coador de pano', lab: METHODS[3].lab },
  { n: 'French press', lab: METHODS[6].lab },
  { n: 'Cold brew', lab: METHODS[9].lab },
  { n: 'Surpresa' }
];
