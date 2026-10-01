// Marcação de fotos responsivas. Cada foto existe em WebP, em várias larguras,
// e em um JPEG de reserva (gerados por `npm run imagens`). O navegador escolhe
// o arquivo conforme o formato que aceita e o espaço que a imagem ocupa.

import { html } from '../templates.js';

// A pasta é resolvida a partir deste módulo, o que funciona tanto no
// desenvolvimento (página em /html/) quanto no build (página na raiz).
const PASTA = new URL('../../imagens/', import.meta.url).href;

export function foto({ nome, larguras, tamanhos, largura, altura, alt = '', classe = '', prioritaria = false }) {
  const srcset = larguras.map((l) => `${PASTA}${nome}-${l}.webp ${l}w`).join(', ');
  return html`
    <picture>
      <source type="image/webp" srcset="${srcset}" sizes="${tamanhos}">
      <img class="${classe}" src="${PASTA}${nome}.jpg" width="${largura}" height="${altura}" alt="${alt}"
        decoding="async" ${prioritaria ? html`fetchpriority="high"` : html`loading="lazy"`}>
    </picture>
  `;
}
