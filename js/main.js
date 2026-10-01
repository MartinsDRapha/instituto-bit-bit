// Ponto de entrada: liga os módulos e trata as ações globais por delegação
// de eventos (um único ouvinte serve para elementos criados dinamicamente).

import { iniciarRouter, atualizarRota } from './router.js';
import { abrirDoacao, iniciarDoacao } from './componentes/doacao.js';
import { fecharModal } from './ui/modal.js';
import './ui/tema.js';

const ACOES = {
  'abrir-doacao': (elemento) => abrirDoacao(elemento.dataset.projeto),
  'fechar-modal': () => fecharModal(),
};

document.addEventListener('click', (evento) => {
  const elemento = evento.target.closest('[data-acao]');
  if (!elemento) return;
  ACOES[elemento.dataset.acao]?.(elemento);
});

iniciarDoacao({ aoDoar: atualizarRota });
iniciarRouter(document.getElementById('conteudo'));
