// Abre e fecha modais com gestão de foco: o foco entra no modal, fica preso
// nele enquanto aberto e volta ao elemento de origem ao fechar.

const FOCAVEIS = 'a[href], button:not(:disabled), input:not(:disabled), select, textarea';

let modalAberto = null;
let origemDoFoco = null;

export function abrirModal(modal) {
  origemDoFoco = document.activeElement;
  modalAberto = modal;
  modal.classList.add('modal--aberto');
  modal.querySelector(FOCAVEIS)?.focus();
}

export function fecharModal() {
  if (!modalAberto) return;
  modalAberto.classList.remove('modal--aberto');
  modalAberto = null;
  origemDoFoco?.focus();
}

document.addEventListener('keydown', (evento) => {
  if (!modalAberto) return;

  if (evento.key === 'Escape') {
    fecharModal();
    return;
  }

  if (evento.key === 'Tab') {
    const focaveis = [...modalAberto.querySelectorAll(FOCAVEIS)];
    const primeiro = focaveis[0];
    const ultimo = focaveis.at(-1);
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }
});
