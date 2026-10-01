// Notificações não obstrutivas, empilhadas no canto da tela.

import { html } from '../templates.js';

const area = document.getElementById('toast-area');
const MAXIMO = 3;

export function mostrarToast({ titulo, mensagem, tipo = 'info', duracao = 8000 }) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${tipo}`;
  toast.innerHTML = String(html`
    <div class="toast__conteudo">
      <strong class="toast__titulo">${titulo}</strong>
      ${mensagem}
    </div>
    <button class="toast__fechar" type="button" aria-label="Fechar notificação">&times;</button>
  `);

  const fechar = () => toast.remove();
  toast.querySelector('.toast__fechar').addEventListener('click', fechar);

  // A contagem para fechar é suspensa enquanto o ponteiro ou o foco estiver
  // sobre o toast, para dar tempo de leitura a quem precisa (WCAG 2.2.1).
  let temporizador = setTimeout(fechar, duracao);
  const pausar = () => clearTimeout(temporizador);
  const retomar = () => (temporizador = setTimeout(fechar, duracao));
  toast.addEventListener('mouseenter', pausar);
  toast.addEventListener('mouseleave', retomar);
  toast.addEventListener('focusin', pausar);
  toast.addEventListener('focusout', retomar);

  // Mantém no máximo MAXIMO notificações na tela, descartando as mais antigas.
  while (area.children.length >= MAXIMO) area.firstElementChild.remove();
  area.append(toast);
}
