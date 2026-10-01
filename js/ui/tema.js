// Alternador de tema: claro -> escuro -> alto contraste. O tema inicial já
// foi aplicado por js/tema-inicial.js; aqui tratamos o clique e gravamos a
// preferência.

import { salvarTema } from '../storage.js';

const TEMAS = ['claro', 'escuro', 'contraste'];
const NOMES = { claro: 'claro', escuro: 'escuro', contraste: 'alto contraste' };

const raiz = document.documentElement;
const botao = document.getElementById('tema-botao');

const temaAtual = () => (TEMAS.includes(raiz.dataset.tema) ? raiz.dataset.tema : 'claro');
const proximoTema = () => TEMAS[(TEMAS.indexOf(temaAtual()) + 1) % TEMAS.length];

// O rótulo informa o tema em uso e o que o clique fará, já que o ícone
// sozinho não comunica isso a quem usa leitor de tela.
function atualizarBotao() {
  botao.setAttribute('aria-label', `Tema ${NOMES[temaAtual()]}. Mudar para tema ${NOMES[proximoTema()]}`);
}

botao.addEventListener('click', () => {
  raiz.dataset.tema = proximoTema();
  salvarTema(raiz.dataset.tema);
  atualizarBotao();
  // Avisa componentes que leem cores por JavaScript (ex.: o gráfico).
  document.dispatchEvent(new CustomEvent('temachange'));
});

atualizarBotao();
