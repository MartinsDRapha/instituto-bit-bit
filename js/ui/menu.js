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

// Submenu suspenso (desktop): abre por CSS, com :hover e :focus-within. A
// tecla Esc o recolhe sem exigir que o ponteiro saia; ele volta a abrir
// normalmente depois que o ponteiro ou o foco deixam o item.
document.querySelectorAll('.nav__item:has(> .submenu)').forEach((item) => {
  const liberar = () => item.classList.remove('nav__item--recolhido');
  item.addEventListener('mouseleave', liberar);
  item.addEventListener('focusout', (evento) => {
    if (!item.contains(evento.relatedTarget)) liberar();
  });
});

document.addEventListener('keydown', (evento) => {
  if (evento.key !== 'Escape') return;
  document.querySelectorAll('.nav__item:has(> .submenu)').forEach((item) => {
    if (item.matches(':hover, :focus-within')) item.classList.add('nav__item--recolhido');
  });
});

// Clique fora do cabeçalho fecha o menu.
document.addEventListener('click', (evento) => {
  if (estaAberto() && !evento.target.closest('.header')) fecharMenu();
});
