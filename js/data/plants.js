/**
 * Caffeine & Xanthine Plants Data
 */

export const PLANTS = [
  {
    id: 'cafe',
    n: 'Café',
    lat: 'Coffea arabica · canephora',
    img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
    mg: 95,
    desc: 'O veículo mais famoso da cafeína. A molécula existe na semente como defesa contra insetos — e a torra a preserva quase intacta. É também a bebida com o coquetel aromático mais complexo da mesa do brasileiro.',
    chem: [
      ['Cafeína', '1,2–1,5% na arábica · 2,0–2,7% na robusta (grão seco)'],
      ['Ácidos clorogênicos', '4–10% — antioxidantes que definem amargor e adstringência'],
      ['Lipídios', '15–17% na arábica — carregam diterpenos (cafestol)'],
      ['Trigonelina', '~1% — vira niacina (B3) e pirazinas na torra']
    ],
    abs: [
      ['zap', 'Efeito no cérebro começa em ~15–20 minutos'],
      ['timer', 'Absorção rápida: pico plasmático em 30–120 min'],
      ['droplet', 'Filtro de papel retém diterpenos; prensa francesa não']
    ]
  },
  {
    id: 'cha',
    n: 'Chá',
    lat: 'Camellia sinensis',
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=600&auto=format&fit=crop',
    mg: 47,
    desc: 'A segunda fonte de cafeína do planeta. A mesma planta dá o chá verde, o oolong e o preto — o que muda é a oxidação das folhas. Além da cafeína, entrega L-teanina, um aminoácido que "arredonda" a estimulação.',
    chem: [
      ['Cafeína', '2–4% nas folhas secas · ~40–50 mg por xícara infundida'],
      ['L-teanina', 'aminoácido único — associado a "alerta calmo", com menos jitter'],
      ['Catequinas (EGCG)', 'antioxidantes dominantes do chá verde'],
      ['Taninos', 'promovem adstringência e modulam a absorção']
    ],
    abs: [
      ['waves', 'Taninos + teanina suavizam e prolongam o efeito da cafeína'],
      ['thermometer', 'Água menos quente (verde) extrai menos cafeína que fervura (preto)'],
      ['moon', 'Xícara à noite incomoda menos — dose menor por infusão']
    ]
  },
  {
    id: 'mate',
    n: 'Erva-mate',
    lat: 'Ilex paraguariensis',
    img: 'https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?q=80&w=600&auto=format&fit=crop',
    mg: 80,
    desc: 'A bebida do Cone Sul carrega cafeína, teobromina e ácidos clorogênicos num só recipiente. Estudos observacionais associam o mate habitual a perfis favoráveis de colesterol e glicemia — sempre com a ressalva da temperatura muito alta.',
    chem: [
      ['Cafeína', '0,4–0,9% nas folhas · ~70–85 mg por cuia preparada'],
      ['Teobromina + teofilina', 'as "irmãs" da cafeína, em doses traço'],
      ['Ácidos clorogênicos', 'alta concentração — perfil antioxidante que lembra o café'],
      ['Minerais', 'potássio e magnésio em quantidades relevantes']
    ],
    abs: [
      ['repeat', 'A cuia é reabastecida dezenas de vezes: dose fracionada ao longo de horas'],
      ['flame', 'IARC: bebidas muito quentes (>65 °C) são "provavelmente carcinogênicas" — deixe amornar'],
      ['leaf', 'Consumo tradicional associado a melhor perfil glicêmico em estudos observacionais']
    ]
  },
  {
    id: 'guarana',
    n: 'Guaraná',
    lat: 'Paullinia cupana',
    img: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=600&auto=format&fit=crop',
    mg: 70,
    desc: 'O campeão absoluto do reino vegetal: a semente de guaraná tem a maior concentração de cafeína entre as plantas de uso humano — 2 a 4,5%, até o triplo do grão de robusta. Os energéticos a usam desde os anos 1980; os Sateré-Mawé, há séculos.',
    chem: [
      ['Cafeína', '2–4,5% na semente seca — o maior teor vegetal conhecido de uso humano'],
      ['Taninos condensados', 'ligam-se à cafeína e retardam sua liberação'],
      ['Saponinas', 'dão a espuma característica do refrigerante de guaraná'],
      ['Amido', 'matriz que modula a dissolução do alcaloide']
    ],
    abs: [
      ['hourglass', 'Taninos + matriz amilácea = liberação lenta, efeito mais longo e suave'],
      ['zap', 'Energéticos: ~30–80 mg de cafeína por lata'],
      ['leaf', 'Uso tradicional Sateré-Mawé: guaraná ralado na cabaça, bebida milenar']
    ]
  },
  {
    id: 'cacau',
    n: 'Cacau',
    lat: 'Theobroma cacao',
    img: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=600&auto=format&fit=crop',
    mg: 20,
    desc: 'O nome do gênero já entrega: Theobroma = "alimento dos deuses". O alcaloide dominante do cacau não é a cafeína, mas a teobromina — dez vezes mais fraca no sistema nervoso central, porém vasodilatadora e levemente diurética.',
    chem: [
      ['Teobromina', '200–800 mg/100 g em chocolates 70–85% — o alcaloide dominante'],
      ['Cafeína', 'apenas 10–80 mg/100 g — dose pequena por porção'],
      ['Feniletilamina', 'composto associado à sensação de bem-estar do chocolate'],
      ['Anandamida + flavanóis', 'endocanabinoide vegetal + antioxidantes cardiovasculares']
    ],
    abs: [
      ['timer', 'A teobromina tem meia-vida de ~7–10 h: efeito longo, sutil, sem pico'],
      ['heart', 'Vasodilatação leve e queda discreta da pressão em estudos controlados'],
      ['leaf', 'Atenção: teobromina é tóxica para cães — nunca compartilhe o chocolate']
    ]
  }
];
