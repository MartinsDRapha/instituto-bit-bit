// Persistência em localStorage. Todo acesso passa por aqui, com tratamento
// de erro: o armazenamento pode estar bloqueado, cheio ou com dado corrompido.

const PREFIXO = 'bitabit:';

function ler(chave, padrao) {
  try {
    const texto = localStorage.getItem(PREFIXO + chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch {
    return padrao;
  }
}

function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

function remover(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    // sem armazenamento disponível não há o que remover
  }
}

// Doações -------------------------------------------------------------------

// O conteúdo do localStorage pode ter sido editado ou corrompido: além de ser
// JSON válido, precisa ter o formato esperado. Itens fora do formato são
// descartados para que o restante da aplicação possa confiar nos dados.
function lerLista(chave, itemValido) {
  const valor = ler(chave, []);
  return Array.isArray(valor) ? valor.filter((item) => item && itemValido(item)) : [];
}

export const listarDoacoes = () =>
  lerLista('doacoes', (d) => typeof d.projetoId === 'string' && Number.isFinite(d.valor) && d.valor > 0);

export function registrarDoacao(projetoId, valor) {
  const doacoes = listarDoacoes();
  doacoes.push({ projetoId, valor, data: new Date().toISOString() });
  return salvar('doacoes', doacoes);
}

export const totalDoado = (projetoId) =>
  listarDoacoes()
    .filter((doacao) => doacao.projetoId === projetoId)
    .reduce((soma, doacao) => soma + doacao.valor, 0);

// Voluntários ---------------------------------------------------------------
// Guarda só o necessário para a listagem: CPF, telefone e endereço não são
// gravados no navegador.

export const listarVoluntarios = () =>
  lerLista(
    'voluntarios',
    (v) => typeof v.nome === 'string' && Array.isArray(v.area) && typeof v.turno === 'string'
  );

export function salvarVoluntario({ nome, email, area, turno }) {
  const voluntarios = listarVoluntarios();
  voluntarios.push({ id: Date.now(), nome, email, area, turno });
  return salvar('voluntarios', voluntarios);
}

export function removerVoluntario(id) {
  return salvar('voluntarios', listarVoluntarios().filter((v) => v.id !== id));
}

// Preferência de tema ('claro' ou 'escuro') -----------------------------------
// A leitura acontece em js/tema-inicial.js, antes de a página ser desenhada.

export const salvarTema = (tema) => salvar('tema', tema);

// Rascunho do formulário de cadastro ------------------------------------------

export function lerRascunho() {
  const rascunho = ler('rascunho-cadastro', null);
  const ehObjeto = rascunho && typeof rascunho === 'object' && !Array.isArray(rascunho);
  return ehObjeto ? rascunho : null;
}
export const salvarRascunho = (dados) => salvar('rascunho-cadastro', dados);
export const limparRascunho = () => remover('rascunho-cadastro');
