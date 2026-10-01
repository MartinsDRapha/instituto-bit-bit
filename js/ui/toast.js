// Notificações não obstrutivas, empilhadas no canto da tela.

import { html } from '../templates.js';

const area = document.getElementById('toast-area');
const MAXIMO = 3;

export function mostrarToast({ titulo, mensagem, tipo = 'info', duracao = 6000 }) {
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
  setTimeout(fechar, duracao);

  // Mantém no máximo MAXIMO notificações na tela, descartando as mais antigas.
  while (area.children.length >= MAXIMO) area.firstElementChild.remove();
  area.append(toast);
}
