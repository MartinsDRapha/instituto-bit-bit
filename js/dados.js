// Dados da aplicação. Num sistema real viriam de uma API.
// A foto de cada projeto fica em imagens/projeto-<id>*; `fotoAlt` é o texto
// alternativo dela.

export const CATEGORIAS = {
  programacao: {
    nome: 'Programação',
    badge: 'badge--primaria',
    midia: '',
  },
  infraestrutura: {
    nome: 'Hardware e redes',
    badge: 'badge--secundaria',
    midia: 'card__midia--secundaria',
  },
  'inclusao-digital': {
    nome: 'Inclusão digital',
    badge: 'badge--destaque',
    midia: 'card__midia--destaque',
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
    fotoAlt: 'Tela de computador exibindo código de uma página web.',
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
    fotoAlt: 'Mulher programando diante de dois monitores.',
    titulo: 'Dev Delas',
    categoria: 'programacao',
    descricao: 'Formação em front-end com HTML, CSS e JavaScript para mulheres em transição de carreira.',
    meta: 40000,
    arrecadado: 12000,
    status: 'captando',
  },
  {
    id: 'bancada-aberta',
    fotoAlt: 'Pessoa instalando uma placa em um gabinete de computador.',
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
    fotoAlt: 'Fileira de computadores antigos sobre uma mesa.',
    titulo: 'Recicla Tech',
    categoria: 'infraestrutura',
    descricao: 'Alunos recondicionam computadores doados, que depois equipam escolas e famílias da região.',
    meta: 60000,
    arrecadado: 60000,
    status: 'andamento',
  },
  {
    id: 'conecta-60',
    fotoAlt: 'Homem idoso sorridente usando um notebook.',
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
    fotoAlt: 'Laboratório de informática com fileiras de computadores.',
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
