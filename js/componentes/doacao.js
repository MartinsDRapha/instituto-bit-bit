// Fluxo de doação: abre o modal, grava a doação no localStorage e avisa
// quem chamou para que a tela seja redesenhada com os novos valores.

import { html, renderizar } from '../templates.js';
import { PROJETOS } from '../dados.js';
import { registrarDoacao } from '../storage.js';
import { formatarMoeda } from '../formato.js';
import { abrirModal, fecharModal } from '../ui/modal.js';
import { mostrarToast } from '../ui/toast.js';
import { situacaoDoProjeto } from './cardProjeto.js';

const modal = document.getElementById('modal-doacao');
const form = document.getElementById('form-doacao');
const seletor = document.getElementById('doacao-projeto');

export function abrirDoacao(projetoId) {
  const abertos = PROJETOS.filter((projeto) => !situacaoDoProjeto(projeto).concluido);
  renderizar(
    seletor,
    html`${abertos.map((projeto) => html`<option value="${projeto.id}">${projeto.titulo}</option>`)}`
  );
  if (projetoId) seletor.value = projetoId;
  abrirModal(modal);
}

export function iniciarDoacao({ aoDoar }) {
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const dados = new FormData(form);
    const projeto = PROJETOS.find((p) => p.id === dados.get('projeto'));
    const valor = Number(dados.get('valor'));

    const gravou = registrarDoacao(projeto.id, valor);
    fecharModal();

    if (!gravou) {
      mostrarToast({
        titulo: 'Não foi possível registrar',
        mensagem: 'O armazenamento do navegador está indisponível.',
        tipo: 'erro',
      });
      return;
    }

    mostrarToast({
      titulo: 'Obrigado pelo apoio!',
      mensagem: `Sua doação de ${formatarMoeda(valor)} para ${projeto.titulo} foi registrada.`,
      tipo: 'sucesso',
    });
    aoDoar();
  });
}
