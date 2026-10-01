import { html } from '../templates.js';
import { PROJETOS, CATEGORIAS } from '../dados.js';
import { cardProjeto } from '../componentes/cardProjeto.js';
import { secaoGrafico, montarGrafico } from '../componentes/graficoArrecadacao.js';

function filtro(rotulo, categoria, atual) {
  const destino = categoria ? `#/projetos?categoria=${categoria}` : '#/projetos';
  const ativa = categoria === atual;
  return html`
    <li>
      <a class="tag ${ativa ? 'tag--ativa' : ''}" href="${destino}" ${ativa ? html`aria-current="true"` : ''}>${rotulo}</a>
    </li>
  `;
}

export const projetos = {
  titulo: 'Projetos',

  // A categoria vem da URL (#/projetos?categoria=...), então o filtro
  // sobrevive ao recarregar a página e pode ser compartilhado por link.
  render(params) {
    const pedida = params.get('categoria');
    const atual = pedida && Object.hasOwn(CATEGORIAS, pedida) ? pedida : null;
    const visiveis = atual ? PROJETOS.filter((projeto) => projeto.categoria === atual) : PROJETOS;

    return html`
      <section class="hero hero--compacto">
        <div class="container">
          <div class="hero__conteudo">
            <h1>Nossos projetos</h1>
            <p class="hero__texto">Cada curso nasce de uma demanda real do mercado de TI e é acompanhado por indicadores públicos de conclusão e empregabilidade.</p>
          </div>
        </div>
      </section>

      <section class="secao">
        <div class="container">
          <ul class="tags u-mb-4" aria-label="Filtrar por área">
            ${filtro('Todos', null, atual)}
            ${Object.entries(CATEGORIAS).map(([id, categoria]) => filtro(categoria.nome, id, atual))}
          </ul>
          <p class="u-texto-suave" aria-live="polite">${visiveis.length} ${visiveis.length === 1 ? 'projeto' : 'projetos'}</p>
          <div class="grid">
            ${visiveis.map((projeto) => html`<div class="col-md-6 col-xl-4">${cardProjeto(projeto, { titulo: 'h2' })}</div>`)}
          </div>
        </div>
      </section>

      ${secaoGrafico()}
    `;
  },

  aoMontar(container) {
    montarGrafico(container);
  },
};
