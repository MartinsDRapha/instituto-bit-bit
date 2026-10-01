// Alternador de tema claro/escuro. O tema inicial já foi aplicado por
// js/tema-inicial.js; aqui tratamos o clique e gravamos a preferência.

import { salvarTema } from '../storage.js';

const raiz = document.documentElement;
const botao = document.getElementById('tema-botao');

function atualizarBotao() {
  const escuro = raiz.dataset.tema === 'escuro';
  botao.setAttribute('aria-pressed', String(escuro));
  botao.setAttribute('aria-label', escuro ? 'Ativar tema claro' : 'Ativar tema escuro');
}

botao.addEventListener('click', () => {
  raiz.dataset.tema = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
  salvarTema(raiz.dataset.tema);
  atualizarBotao();
  // Avisa componentes que leem cores por JavaScript (ex.: o gráfico).
  document.dispatchEvent(new CustomEvent('temachange'));
});

atualizarBotao();
