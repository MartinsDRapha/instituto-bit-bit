// Menu de navegação: abre e fecha o hambúrguer e destaca a rota atual.

const botao = document.getElementById('nav-botao');
const nav = document.getElementById('nav-principal');

function definirAberto(aberto) {
  nav.classList.toggle('nav--aberta', aberto);
  botao.setAttribute('aria-expanded', String(aberto));
  botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

const estaAberto = () => botao.getAttribute('aria-expanded') === 'true';

export function fecharMenu() {
  definirAberto(false);
}

export function marcarRotaAtiva(caminho) {
  document.querySelectorAll('[data-rota]').forEach((link) => {
    const ativo = link.dataset.rota === caminho;
    link.classList.toggle('nav__link--ativo', ativo);
    if (ativo) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

botao.addEventListener('click', () => definirAberto(!estaAberto()));

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && estaAberto()) {
    fecharMenu();
    botao.focus();
  }
});

// Clique fora do cabeçalho fecha o menu.
document.addEventListener('click', (evento) => {
  if (estaAberto() && !evento.target.closest('.header')) fecharMenu();
});
