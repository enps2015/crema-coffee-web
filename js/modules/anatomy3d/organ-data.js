/**
 * CREMA° Anatomy 3D Lab — Scientific Organ Dictionary (FASE C Hardening)
 * Rigorously audited pharmacological and anatomical dataset.
 * Classifications:
 * 1. Bem suportada (Ensaios clínicos randomizados, meta-análises, consensos médicos internacionais)
 * 2. Simplificação aceitável (Mecanismo molecular com validação in vitro e plausibilidade in vivo)
 * 3. Contextualmente incompleta (Necessita de distinção de dose ou via metabólica secundária)
 */

export const ORGAN_DICTIONARY = {
  brain: {
    id: 'brain',
    title: 'Cérebro — Neurofarmacologia e Antagonismo de Adenosina',
    subtitle: 'Sistema Nervoso Central · Córtex Cerebral & Núcleos da Base',
    hubmapModel: '3d-allen-m-brain.glb (Allen Brain Institute / HuBMAP CCF v1.4)',
    evidenceLevel: 'Nível 1 — Bem suportada (Mecanismo Consolidado / Neuroimagem PET)',
    evidenceSource: 'Fredholm et al., Pharmacol Rev 1999; Volkow et al., Transl Psychiatry 2015; Elmenhorst et al., J Nucl Med 2012',
    tags: ['Receptores A₁/A₂A', 'Vigilância', 'Dopamina D2', 'SNC'],
    desc: 'No encéfalo humano, a cafeína atua como antagonista competitivo dos receptores purinérgicos de adenosina <strong>A₁ e A₂A</strong>. A adenosina endógena acumula-se continuamente no líquor durante a vigília como subproduto da quebra de ATP, ativando receptores que hiperpolarizam neurônios e induzem sonolência. A cafeína liga-se a esses receptores sem deflagrar a cascata inibitória, mantendo a excitabilidade neuronal e facilitando a transmissão dopaminérgica e noradrenérgica no estriado e córtex pré-frontal via heterômeros A₂A-D₂.',
    caffeineEffect: 'Aumento comprovado da vigilância sustentada, redução no tempo de reação psicomotora e alívio da fadiga cognitiva. Em doses nutricionais habituais (75–200 mg), a ocupação de receptores cerebrais gira em torno de 30% a 50%. Promove vasoconstrição cerebrovascular discreta (redução de 15–20% no fluxo sanguíneo cerebral global sem hipóxia), base de seu efeito analgésico adjuvante em cefaleias tensionais.',
    metrics: [
      { label: 'Janela de Ação', val: '15–300', sub: 'minutos no tecido cerebral' },
      { label: 'Ocupação de Receptores', val: '30–50%', sub: 'em dose habitual de 150–200 mg (PET)' },
      { label: 'Fluxo Sanguíneo Cerebral', val: '-15 a 20%', sub: 'vasoconstrição fisiológica leve' },
      { label: 'Alvos Moleculares', val: 'ADORA1 / ADORA2A', sub: 'antagonismo competitivo reversível' }
    ]
  },

  heart: {
    id: 'heart',
    title: 'Coração — Cronotropismo, Inotropismo e Tolerância',
    subtitle: 'Sistema Cardiovascular · Miocárdio & Nó Sinoatrial',
    hubmapModel: '3d-vh-m-heart.glb (Visible Human Male / HuBMAP CCF v1.3)',
    evidenceLevel: 'Nível 1 — Bem suportada (Meta-análises e Coortes Prospectivas)',
    evidenceSource: 'van Dam, Hu & Willett, N Engl J Med 2020; Noordzij et al., J Hypertens 2005; Kim et al., JAMA Intern Med 2021',
    tags: ['Inotropismo Leve', 'Pressão Arterial', 'Tolerância Rápida', 'Miocárdio'],
    desc: 'O miocárdio e os vasos expressam receptores de adenosina A₁ e A₂A que medeiam tônus inibitório sobre o nó sinoatrial e tônus vasodilatador. A cafeína atenua essa inibição e promove discreta liberação de catecolaminas adrenais, gerando <strong>inotrópico positivo leve</strong> (aumento sutil da força contrátil). A liberação intracelular direta de cálcio por canais RyR2 miocárdicos só ocorre em concentrações micromolares supra-fisiológicas e não em doses dietéticas habituais.',
    caffeineEffect: 'Elevação média de 2 a 4 mmHg na pressão sistólica em indivíduos abstêmios ou virgens de cafeína; em consumidores diários, ocorre regulação positiva rápida de receptores homeostáticos, tornando a resposta pressórica crônica praticamente nula. Meta-análises de longo prazo (NEJM, 2020) com centenas de milhares de participantes confirmam que o consumo moderado (3 a 5 xícaras/dia) não aumenta incidência de arritmias ou mortalidade cardiovascular.',
    metrics: [
      { label: 'Janela de Ação', val: '20–150', sub: 'minutos após ingestão' },
      { label: 'Pressão Sistólica Aguda', val: '+2 a 4', sub: 'mmHg (transitório em abstêmios)' },
      { label: 'Tolerância Cardiovascular', val: 'Completa', sub: 'desenvolvida em 3–5 dias de uso' },
      { label: 'Risco Cardiovascular', val: 'Neutro / Protetor', sub: 'em até 400 mg/dia (EFSA/FDA)' }
    ]
  },

  lungs: {
    id: 'lungs',
    title: 'Pulmões — Mecânica Ventilatória e Receptores Bronquiais',
    subtitle: 'Sistema Respiratório · Músculo Liso das Vias Aéreas & Centro Respiratório Bulbar',
    hubmapModel: '3d-vh-m-lung.glb (Visible Human Male / HuBMAP CCF v1.4)',
    evidenceLevel: 'Nível 1 — Bem suportada / Nível 2 — Mecanismo de Dose Diferenciado',
    evidenceSource: 'Welsh et al., Cochrane Database Syst Rev 2010; Becker et al., J Appl Physiol 1993',
    tags: ['Broncodilatação Discreta', 'Drive Respiratório', 'FEV₁', 'Receptores A2B'],
    desc: 'Ao contrário do senso comum que atribui a broncodilatação à inibição de fosfodiesterases (PDE), concentrações dietéticas de cafeína (10–30 µmol/L no plasma) são insuficientes para inibir PDE in vivo. A broncodilatação leve decorrente do consumo de café é mediada principalmente pelo <strong>antagonismo dos receptores de adenosina A₂B</strong> no músculo liso bronquial e mastócitos. A teofilina gerada por biotransformação (~4%) possui atividade potente, mas sua fração volumétrica em uma xícara é residual (~4 mg).',
    caffeineEffect: 'Revisão Cochrane formal demonstrou que a cafeína produz melhora modesta na mecânica pulmonar (aumento de 3% a 5% no Volume Expiratório Forçado no primeiro segundo — FEV₁) por até quatro horas. Estimula ainda a sensibilidade dos quimiorreceptores do centro respiratório bulbar ao CO₂, aumentando o volume minuto respiratório.',
    metrics: [
      { label: 'Janela de Ação', val: '30–240', sub: 'minutos ventilatórios' },
      { label: 'Ganho Funcional (FEV₁)', val: '+3 a 5%', sub: 'broncodilatação modesta (Cochrane)' },
      { label: 'Drive Respiratório', val: 'Estimulado', sub: 'quimiorreceptores bulbares ao CO₂' },
      { label: 'Mecanismo Real', val: 'Antagonismo A₂B', sub: 'PDE exige doses supra-fisiológicas' }
    ]
  },

  liver: {
    id: 'liver',
    title: 'Fígado — Depuração Microssomal e Citocromo CYP1A2',
    subtitle: 'Metabolismo Hepático · Hepatócitos & Cascata de N-desmetilação',
    hubmapModel: '3d-vh-m-liver.glb (Visible Human Male / HuBMAP CCF v1.2)',
    evidenceLevel: 'Nível 1 — Bem suportada (Farmacocinética e Farmacogenômica Consolidada)',
    evidenceSource: 'Miners & Birkett, Br J Clin Pharmacol 1996; Cornelis et al., JAMA 2006; Sachse et al., 1999',
    tags: ['CYP1A2', 'Paraxantina (84%)', 'Variabilidade Genética', 'Hepatócitos'],
    desc: 'Mais de <strong>95% da depuração sistêmica da cafeína</strong> ocorre no retículo endoplasmático liso dos hepatócitos pela enzima <strong>CYP1A2</strong> (família do citocromo P450). A via metabólica consiste em três reações paralelas de N-desmetilação que produzem: <strong>paraxantina (~84%)</strong> (1,7-dimetilxantina, responsável por estimular lipólise), <strong>teobromina (~12%)</strong> e <strong>teofilina (~4%)</strong>.',
    caffeineEffect: 'O gene CYP1A2 apresenta polimorfismos marcantes na população: o alelo *1A confere indução enzimática alta ("metabolizadores rápidos", meia-vida ~3 a 4 horas), enquanto o alelo mutante *1F confere taxa de eliminação lenta ("metabolizadores lentos", meia-vida de 6 a 10 horas). Fatores como tabagismo e consumo de brássicas aceleram a depuração, enquanto contraceptivos orais e gravidez dobram a meia-vida plasmática.',
    metrics: [
      { label: 'Depuração Hepática', val: '~95%', sub: 'do clearing corporal total' },
      { label: 'Paraxantina Gerada', val: '~84%', sub: 'metabólito primário ativo' },
      { label: 'Meia-vida Plasmática', val: '3,0 a 7,0 h', sub: 'alta variação farmacogenética' },
      { label: 'Enzima Limitante', val: 'CYP1A2', sub: 'isoforma do citocromo P450' }
    ]
  },

  kidneys: {
    id: 'kidneys',
    title: 'Rins — Filtração Glomerular, Natriurese e Tolerância Hídrica',
    subtitle: 'Sistema Renal · Néfrons, Córtex e Túbulos Contorcidos Proximais',
    hubmapModel: '3d-vh-m-kidney-l.glb / 3d-vh-m-kidney-r.glb (HuBMAP CCF v1.3)',
    evidenceLevel: 'Nível 1 — Bem suportada (Ensaios de Balanço Eletrolítico e Opinião EFSA)',
    evidenceSource: 'Killer, Blannin & Jeukendrup, PLOS ONE 2014; EFSA Scientific Opinion 2015; Maughan & Griffin, 2003',
    tags: ['Filtração Glomerular', 'Natriurese', 'Tolerância Renal', 'Hidratação Diária'],
    desc: 'Nos néfrons, o antagonismo de receptores A₁ nos túbulos contorcidos proximais inibe a reabsorção ativa de sódio (natriurese), acarretando discreto arraste osmótico de água. Há também discreta vasodilatação da arteríola aferente renal, aumentando a taxa de filtração glomerular por curto período.',
    caffeineEffect: 'O clássico mito de que o café causa desidratação crônica foi refutado por múltiplos ensaios clínicos controlados com traçadores de água corporal total: doses agudas moderadas (<300 mg) em consumidores habituais não produzem desidratação nem aumentam a osmolalidade sérica. A European Food Safety Authority (EFSA) e o Institute of Medicine (IOM) dos EUA reconhecem que o café consumido integra o balanço hídrico diário normalmente.',
    metrics: [
      { label: 'Janela de Ação', val: '45–180', sub: 'minutos renais' },
      { label: 'Filtração (eGFR)', val: '+5%', sub: 'elevação transitória de fluxo' },
      { label: 'Eliminação Intacta', val: '<2%', sub: 'excretada inalterada na urina' },
      { label: 'Balanço Hídrico', val: 'Neutro / Positivo', sub: 'sem risco de desidratação diária' }
    ]
  },

  intestines: {
    id: 'intestines',
    title: 'Intestinos — Absorção Entero-Sistêmica e Reflexo Gastro-Cólico',
    subtitle: 'Trato Gastrointestinal · Duodeno, Jejuno, Íleo e Cólon',
    hubmapModel: '3d-vh-m-small-intestine.glb / 3d-sbu-m-large-intestine.glb (HuBMAP CCF)',
    evidenceLevel: 'Nível 1 — Bem suportada (Estudos Farmacocinéticos e Manometria Cólica)',
    evidenceSource: 'Blanchard & Sawers, Eur J Clin Pharmacol 1983; Brown et al., Gut 1990; Rao et al., 1998',
    tags: ['Biodisponibilidade 99%', 'Difusão Passiva', 'Reflexo Gastro-Cólico', 'Tmax'],
    desc: 'Devido à sua moderada solubilidade em lipídios e água, a cafeína apresenta <strong>biodisponibilidade oral quase completa (~99%)</strong>. A absorção ocorre predominantemente no duodeno e jejuno proximal por difusão passiva não saturável, sem sofrer metabolismo de primeira passagem significativo na mucosa intestinal.',
    caffeineEffect: 'O pico plasmático (Tmax) ocorre rapidamente entre 30 e 60 minutos em jejum (estendendo-se até 90–120 minutos quando consumida com refeições sólidas lipídicas). No cólon retossigmóide, manometrias clínicas confirmaram que o café desencadeia reflexo gastro-cólico e estimula a motilidade peristáltica em cerca de 29% dos indivíduos dentro de 4 a 10 minutos após a ingestão, mediado por liberação de gastrina e colecistoquinina.',
    metrics: [
      { label: 'Biodisponibilidade Oral', val: '99%', sub: 'absorção enteral quase total' },
      { label: 'Pico Plasmático (Tmax)', val: '30–60 min', sub: 'em jejum (45 min na média)' },
      { label: 'Estímulo Motor Cólico', val: '+60% motor', sub: 'em 29% da população (manometria)' },
      { label: 'Mecanismo Absorptivo', val: 'Difusão Passiva', sub: 'sem degradação pré-hepática' }
    ]
  },

  muscles: {
    id: 'muscles',
    title: 'Músculos Esqueléticos — Ergogenia, Cálcio e Fadiga Periférica',
    subtitle: 'Sistema Musculoesquelético Somático · Receptores de Rianodina (RyR1) & Ação Ergogênica',
    hubmapModel: 'Modelo 3D muscular ainda não disponível no acervo HuBMAP CCF (apenas órgãos parenquimais)',
    evidenceLevel: 'Nível 1 — Bem suportada (Consensos Consistentes do COI e ISSN)',
    evidenceSource: 'Guest et al., J Int Soc Sports Nutr 2021; Maughan et al., Br J Sports Med 2018; Doherty & Smith, 2005',
    tags: ['Ergogenia Atlética', 'Rianodina (RyR1)', 'RPE (Percepção de Esforço)', 'Endurance'],
    desc: '<em>(Aviso do Laboratório: O acervo HuBMAP CCF atual foca em órgãos parenquimais internos. A malha volumétrica muscular não está disponível e será integrada em fase futura.)</em><br><br>No tecido musculoesquelético, a cafeína exerce ação ergogênica comprovada por uma combinação de efeitos neuromusculares: <strong>1) Efeito Central Primário:</strong> antagonismo de receptores A₁ cerebrais e na junção neuromuscular, atenuando a Percepção Subjetiva de Esforço (RPE em ~5,6%) e mantendo a frequência de disparo dos motoneurônios; <strong>2) Efeito Periférico:</strong> em doses de 3 a 6 mg/kg, facilita a liberação de cálcio ($Ca^{2+}$) pelo retículo sarcoplasmático ao sensibilizar os canais receptores de rianodina (RyR1), otimizando o acoplamento excitação-contração.',
    caffeineEffect: 'Posicionamentos formais do Comitê Olímpico Internacional (COI) e da International Society of Sports Nutrition (ISSN) atestam que a cafeína melhora de forma consistente a resistência aeróbica (endurance), tempo até exaustão, força máxima e potência muscular em atletas de diferentes modalidades. A mobilização de ácidos graxos livres (lipólise) contribui para a economia temporária de glicogênio muscular.',
    metrics: [
      { label: 'Janela Ergogênica', val: '30–210 min', sub: 'pico de performance motora' },
      { label: 'Dose Ótima (ISSN/COI)', val: '3 a 6 mg/kg', sub: 'cerca de 200–420 mg para 70 kg' },
      { label: 'Redução de Esforço (RPE)', val: '-5,6%', sub: 'meta-análise em exercício extenuante' },
      { label: 'Alvo Miofibrilar', val: 'RyR1 / Ca²⁺', sub: 'acoplamento excitação-contração' }
    ]
  }
};
