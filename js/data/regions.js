/**
 * Coffee Regions, Production & Botanical Comparisons Data
 */

export const REGIONS = [
  {
    id: 'sm',
    lat: -21.55,
    lon: -45.43,
    uf: '31',
    st: 'MG',
    n: 'Sul de Minas',
    type: 'ara',
    alt: '800–1.350 m',
    colh: 'maio–set',
    why: 'A <strong>maior bacia cafeeira do país</strong>: perto de um terço de todo o café brasileiro sai daqui, entre montanhas e microclimas. Berço de inúmeros vencedores do Cup of Excellence e do "cereja descascado" que o Brasil ensinou ao mundo.',
    notes: ['chocolate', 'toffee', 'doçura alta']
  },
  {
    id: 'cm',
    lat: -18.94,
    lon: -46.99,
    uf: '31',
    st: 'MG',
    n: 'Cerrado Mineiro',
    type: 'ara',
    alt: '800–1.250 m',
    colh: 'maio–ago',
    why: 'Primeira <strong>Denominação de Origem cafeeira do Brasil</strong> (2013). Planalto seco e ensolarado viabiliza colheita quase 100% mecanizada e secagem natural — consistência que virou cartão de visitas do café brasileiro de especialidade.',
    notes: ['caramelo', 'chocolate ao leite', 'nozes']
  },
  {
    id: 'mm',
    lat: -20.26,
    lon: -42.03,
    uf: '31',
    st: 'MG',
    n: 'Matas de Minas',
    type: 'ara',
    alt: '550–1.200 m',
    colh: 'abr–set',
    why: 'Relevo montanhoso que inviabiliza máquinas: <strong>milhares de pequenos produtores colhem à mão</strong> — o que permite seleção cereja fruto a fruto, ideal para microlotes e fermentações finas.',
    notes: ['frutas amarelas', 'cítrico', 'floral']
  },
  {
    id: 'mtq',
    lat: -22.32,
    lon: -45.55,
    uf: '31',
    st: 'MG',
    n: 'Mantiqueira de Minas',
    type: 'ara',
    alt: '900–1.500 m',
    colh: 'abr–set',
    why: 'Serras de altitude com IG própria e cultura de microlotes: uma das <strong>maiores concentrações de cafés 90+ pontos do país</strong>. Noite fria, dia ameno — maturação lenta que preserva aromas.',
    notes: ['floral', 'cítrico', 'doçura fina']
  },
  {
    id: 'mo',
    lat: -20.54,
    lon: -47.40,
    uf: '35',
    st: 'SP',
    n: 'Mogiana Paulista',
    type: 'ara',
    alt: '800–1.200 m',
    colh: 'maio–set',
    why: 'Tradição desde a <strong>Companhia Mogiana de Estradas de Ferro</strong> (séc. XIX), que abriu o oeste paulista ao café. Terroir consolidado, cooperativas centenárias e perfil clássico "de cafeteria".',
    notes: ['achocolotado', 'amêndoa', 'rapadura']
  },
  {
    id: 'go',
    lat: -16.77,
    lon: -47.62,
    uf: '52',
    st: 'GO',
    n: 'Cerrado Goiano',
    type: 'ara',
    alt: '800–1.100 m',
    colh: 'maio–ago',
    why: 'Planalto mecanizável com <strong>irrigação suplementar</strong>: safras estáveis mesmo nos anos de quebra do Centro-Sul. A fronteira tecnológica da arábica brasileira.',
    notes: ['perfil limpo', 'nozes', 'doçura linear']
  },
  {
    id: 'ba',
    lat: -14.86,
    lon: -40.84,
    uf: '29',
    st: 'BA',
    n: 'Planalto da Bahia',
    type: 'ara',
    alt: '700–1.100 m',
    colh: 'abr–set',
    why: 'O <strong>Cerrado baiano</strong>: sistemas irrigados de alta tecnologia e crescente cena de especiais. Safras baianas pontuam alto em concursos nacionais ano após ano.',
    notes: ['frutas amarelas', 'caramelo', 'final doce']
  },
  {
    id: 'cap',
    lat: -20.55,
    lon: -41.65,
    uf: '32',
    st: 'ES',
    n: 'Caparaó (ES/MG)',
    type: 'ara',
    alt: '800–1.300 m',
    colh: 'abr–set',
    why: 'Pico da arábica de montanha capixaba: cafés de serra com <strong>acidez fina e notas florais</strong> que vinham sendo ofuscados pelo conilon vizinho — e agora somam pontos em degustações nacionais.',
    notes: ['floral', 'mel', 'acidez viva']
  },
  {
    id: 'es',
    lat: -19.36,
    lon: -40.55,
    uf: '32',
    st: 'ES',
    n: 'Conilon Capixaba',
    type: 'con',
    alt: '0–500 m',
    colh: 'mai–set',
    why: '<strong>Maior produtor de conilon do Brasil</strong>. Manejo profissional, clones selecionados e processos finos elevaram o canephora capixaba a patamares de especial — com recorde de safra em 2024.',
    notes: ['cacau', 'amêndoa torrada', 'corpo pesado']
  },
  {
    id: 'ro',
    lat: -11.52,
    lon: -61.01,
    uf: '11',
    st: 'RO',
    n: 'Robusta Amazônico',
    type: 'con',
    alt: '90–300 m',
    colh: 'abr–set',
    why: 'O <strong>Robusta Amazônico</strong> com Denominação de Origem (2019): prova de que clima quente não impede xícara fina — cacau intenso, baixa acidez e doçura surpreendente, na floresta.',
    notes: ['cacau intenso', 'terroso', 'baixa acidez']
  },
  {
    id: 'ma',
    lat: -7.53,
    lon: -46.04,
    uf: '21',
    st: 'MA/PI',
    n: 'MATOPIBA',
    type: 'ara',
    alt: '800–1.000 m',
    colh: 'abr–jul',
    why: 'A <strong>nova fronteira cafeeira</strong> no Cerrado do Maranhão e Piauí: áreas planas gigantescas, mecanização total e perfis limpos e doces — o futuro olhando para o norte.',
    notes: ['perfil limpo', 'nozes', 'doçura linear']
  },
  {
    id: 'pr',
    lat: -23.11,
    lon: -50.37,
    uf: '41',
    st: 'PR',
    n: 'Norte Pioneiro do PR',
    type: 'ara',
    alt: '500–900 m',
    colh: 'abr–ago',
    why: 'Berço histórico do café paranaense, decimado pelas geadas de 1975 — <strong>hoje renasce com variedades resistentes e foco em qualidade</strong>.',
    notes: ['chocolate', 'torrado suave', 'corpo médio']
  }
];

export const UF_PROD = {
  MG: 30,
  SP: 15,
  ES: 6,
  BA: 3.4,
  RO: 2.2,
  PR: 1.0,
  GO: 1.0,
  MA: 0.3
};

export const UF_NAMES = {
  MG: 'Minas Gerais',
  SP: 'São Paulo',
  ES: 'Espírito Santo',
  BA: 'Bahia',
  RO: 'Rondônia',
  PR: 'Paraná',
  GO: 'Goiás + DF',
  MA: 'Maranhão (MATOPIBA)'
};

export const UF_FILL = {
  '31': 0.5,
  '35': 0.34,
  '32': 0.34,
  '29': 0.26,
  '11': 0.26,
  '41': 0.15,
  '52': 0.15,
  '21': 0.12,
  '22': 0.12,
  '53': 0.1
};

export const METRICS = [
  { n: 'Cafeína (% do grão)', A: [1.3, '1,2–1,5%'], B: [2.4, '2,0–2,7%'], max: 2.4 },
  { n: 'Sacarose — doçura potencial', A: [8, '~8%'], B: [4, '~4%'], max: 8 },
  { n: 'Lipídios (% do grão)', A: [16, '15–17%'], B: [10, '10–11%'], max: 16 },
  { n: 'Ácidos clorogênicos', A: [5.5, '4–8%'], B: [8.5, '7–10%'], max: 8.5 },
  { n: 'Acidez na xícara', A: [8.5, 'alta · cítrica'], B: [4, 'baixa'], max: 10 },
  { n: 'Amargor na xícara', A: [4, 'moderado'], B: [8, 'intenso'], max: 10 },
  { n: 'Corpo / textura', A: [7, 'sedoso'], B: [9, 'denso'], max: 10 }
];
