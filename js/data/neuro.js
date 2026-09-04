/**
 * Neuroscience, Pharmacokinetics & Roasting Data
 */

export const ORGANS = {
  intestino: {
    n: 'Intestino delgado — a porta de entrada',
    t: 'A cafeína é quase toda absorvida aqui: cerca de 99% em até 45 minutos. Estômago cheio atrasa a chegada — mas não reduz a quantidade absorvida. É por isso que o "café com fome bate mais forte".',
    w: [0, 45]
  },
  cerebro: {
    n: 'Cérebro — o teatro do bloqueio',
    t: 'Com os receptores A₁ e A₂A de adenosina bloqueados, o sinal de "está na hora de dormir" é silenciado: vigilância, tempo de reação e humor sobem. Em doses altas ou em pessoas sensíveis (variantes ADORA2A), vem o reverso: ansiedade, tremor fino e inquietação.',
    w: [15, 300]
  },
  coracao: {
    n: 'Coração — um empurrãozinho discreto',
    t: 'A cafeína tem efeito inotrópico e cronotrópico leve: batimentos e pressão sobem discretamente, sobretudo em quem não consome regularmente. Em consumidores habituais a tolerância minimiza o efeito — e as revisões de grande porte não associam consumo moderado a maior risco cardiovascular.',
    w: [20, 150]
  },
  pulmoes: {
    n: 'Pulmões — o broncodilatador acidental',
    t: 'O bloqueio de adenosina relaxa a musculatura bronquial: broncodilatação leve e mensurável. A teofilina — prima e metabólito da cafeína — foi remédio padrão para asma por décadas.',
    w: [20, 120]
  },
  figado: {
    n: 'Fígado — a fábrica de desmontagem',
    t: 'Aqui a molécula é desmontada pela enzima CYP1A2: ~80% viram paraxantina, o resto teobromina e teofilina. Variantes no gene CYP1A2 criam metabolizadores rápidos e lentos — a razão biológica de seu amigo tomar três cafés e dormir como uma pedra.',
    w: [45, 720]
  },
  rins: {
    n: 'Rins — o mito da desidratação',
    t: 'O efeito diurético é leve e aparece sobretudo em não-habituais; quem consome regularmente desenvolve tolerância. A EFSA considera que bebidas com cafeína contribuem normalmente para a hidratação diária.',
    w: [60, 360]
  },
  musculos: {
    n: 'Músculos — o combustível mobilizado',
    t: 'A cafeína favorece a lipólise (mobiliza ácidos graxos como combustível) e é ergogênica comprovada para endurance: protocolos esportivos usam 3–6 mg/kg — cerca de 200–420 mg para um adulto de 70 kg — 30 a 60 min antes do exercício.',
    w: [30, 210]
  }
};

export const DOSE_PRESETS = [
  [63, 'Espresso'],
  [95, '1 xícara'],
  [190, '2 xícaras'],
  [285, '3 xícaras'],
  [80, 'Energy'],
  [400, 'Limite EFSA']
];

export const ROASTS = [
  {
    n: 'Clara',
    t: 'Primeira fenda · ~196 °C',
    sw: '#B98A50',
    d: 'O grão termina de estalar e sai da máquina cedo. Preserva o máximo da <strong>origem</strong>: floral, cítrico, chá, doçura de fruta. Acidez viva é a estrela — corpo é coadjuvante.',
    p: [90, 70, 35, 25]
  },
  {
    n: 'Média-clara',
    t: 'Logo após a 1ª fenda',
    sw: '#96602F',
    d: 'O ponto preferido dos baristas campeões: <strong>equilíbrio entre acidez e caramelo</strong>. As notas de origem ainda cantam, mas a doçura de mel e rapadura entra em cena.',
    p: [75, 88, 55, 35]
  },
  {
    n: 'Média',
    t: 'Fim do desenvolvimento',
    sw: '#7A4820',
    d: 'O clássico brasileiro de cafeteira: <strong>caramelização no pico</strong>, corpo médio, amargor gentil. O terroir começa a ceder lugar ao sabor de torra — com sabedoria.',
    p: [55, 85, 70, 50]
  },
  {
    n: 'Média-escura',
    t: 'Início da 2ª fenda · ~224 °C',
    sw: '#543014',
    d: 'Óleos afloram à superfície. <strong>Corpo alto, amargor achocolatado intenso</strong> — o território do espresso cremoso de padaria e do "extraforte" bem-feito.',
    p: [30, 65, 85, 75]
  },
  {
    n: 'Escura',
    t: '2ª fenda avançada',
    sw: '#2E1A0B',
    d: 'O sabor de torra domina: <strong>fumaça, cacau amargo, casca tostada</strong>. Acidez praticamente zerada. É o café de hotel do mundo — reconhecível em qualquer aeroporto do planeta.',
    p: [12, 40, 92, 92]
  }
];
