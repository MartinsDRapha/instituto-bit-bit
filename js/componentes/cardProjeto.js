import { html, bruto } from '../templates.js';
import { CATEGORIAS, STATUS } from '../dados.js';
import { totalDoado } from '../storage.js';
import { formatarMoeda } from '../formato.js';
import { foto } from './foto.js';

// Soma o valor inicial do projeto às doações registradas neste navegador.
export function situacaoDoProjeto(projeto) {
  const arrecadado = projeto.arrecadado + totalDoado(projeto.id);
  return {
    arrecadado,
    percentual: Math.min(100, Math.round((arrecadado / projeto.meta) * 100)),
    concluido: arrecadado >= projeto.meta,
  };
}

export function cardProjeto(projeto, { titulo = 'h3' } = {}) {
  const categoria = CATEGORIAS[projeto.categoria];
  const { arrecadado, percentual, concluido } = situacaoDoProjeto(projeto);
  const status = concluido ? { nome: 'Meta atingida', badge: '' } : STATUS[projeto.status];

  return html`
    <article class="card">
      <div class="card__midia ${categoria.midia}">
        ${foto({
          nome: `projeto-${projeto.id}`,
          larguras: [400, 800],
          // Largura ocupada pelo card em cada faixa de tela (ver o grid).
          tamanhos: '(min-width: 1200px) 380px, (min-width: 768px) 50vw, 100vw',
          largura: 800,
          altura: 450,
          alt: projeto.fotoAlt,
          classe: 'card__foto',
        })}
      </div>
      <div class="card__corpo">
        <span class="badge ${categoria.badge}">${categoria.nome}</span>
        <${bruto(titulo)} class="card__titulo">${projeto.titulo}</${bruto(titulo)}>
        <p class="card__texto">${projeto.descricao}</p>
        <div class="progresso" style="--valor: ${percentual}%" role="progressbar"
          aria-label="Arrecadação de ${projeto.titulo}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentual}">
          <div class="progresso__barra"></div>
        </div>
        <div class="progresso__legenda">
          <span>${formatarMoeda(arrecadado)} de ${formatarMoeda(projeto.meta)}</span>
          <span>${percentual}%</span>
        </div>
      </div>
      <div class="card__rodape">
        <span class="badge ${status.badge}">${status.nome}</span>
        ${concluido
          ? html`<button class="btn btn--primario btn--pequeno" type="button" disabled>Encerrado</button>`
          : html`<button class="btn btn--primario btn--pequeno" type="button" data-acao="abrir-doacao" data-projeto="${projeto.id}" aria-label="Apoiar o projeto ${projeto.titulo}">Apoiar</button>`}
      </div>
    </article>
  `;
}
