// Dados da aplicação. Num sistema real viriam de uma API.

export const CATEGORIAS = {
  programacao: {
    nome: 'Programação',
    badge: 'badge--primaria',
    midia: '',
    icone: 'M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
  },
  infraestrutura: {
    nome: 'Hardware e redes',
    badge: 'badge--secundaria',
    midia: 'card__midia--secundaria',
    icone: 'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
  },
  'inclusao-digital': {
    nome: 'Inclusão digital',
    badge: 'badge--destaque',
    midia: 'card__midia--destaque',
    icone: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
  },
};

export const STATUS = {
  andamento: { nome: 'Em andamento', badge: 'badge--sucesso' },
  captando: { nome: 'Captando', badge: 'badge--aviso' },
  urgente: { nome: 'Urgente', badge: 'badge--erro' },
};

export const PROJETOS = [
  {
    id: 'primeiro-codigo',
    titulo: 'Primeiro Código',
    categoria: 'programacao',
    descricao: 'Curso de 6 meses de lógica de programação e desenvolvimento web para jovens de 16 a 24 anos.',
    meta: 50000,
    arrecadado: 36000,
    status: 'andamento',
    destaque: true,
  },
  {
    id: 'dev-delas',
    titulo: 'Dev Delas',
    categoria: 'programacao',
    descricao: 'Formação em front-end com HTML, CSS e JavaScript para mulheres em transição de carreira.',
    meta: 40000,
    arrecadado: 12000,
    status: 'captando',
  },
  {
    id: 'bancada-aberta',
    titulo: 'Bancada Aberta',
    categoria: 'infraestrutura',
    descricao: 'Formação técnica em montagem, manutenção de computadores e redes, com laboratório prático.',
    meta: 40000,
    arrecadado: 18000,
    status: 'andamento',
    destaque: true,
  },
  {
    id: 'recicla-tech',
    titulo: 'Recicla Tech',
    categoria: 'infraestrutura',
    descricao: 'Alunos recondicionam computadores doados, que depois equipam escolas e famílias da região.',
    meta: 60000,
    arrecadado: 60000,
    status: 'andamento',
  },
  {
    id: 'conecta-60',
    titulo: 'Conecta 60+',
    categoria: 'inclusao-digital',
    descricao: 'Informática básica, internet segura e serviços digitais para pessoas acima de 60 anos.',
    meta: 30000,
    arrecadado: 27000,
    status: 'andamento',
    destaque: true,
  },
  {
    id: 'lab-na-escola',
    titulo: 'Lab na Escola',
    categoria: 'inclusao-digital',
    descricao: 'Montagem de laboratórios de informática com internet em escolas públicas do bairro.',
    meta: 20000,
    arrecadado: 3000,
    status: 'urgente',
  },
];

export const TURNOS = {
  manha: 'Manhã',
  tarde: 'Tarde',
  'fim-de-semana': 'Fins de semana',
};

export const ESTADOS = ['MG', 'PR', 'RJ', 'SP'];

export const MENTORES_BASE = 140;
