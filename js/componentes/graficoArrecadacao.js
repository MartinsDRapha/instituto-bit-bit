// Gráfico de arrecadação por área, feito com a biblioteca externa Chart.js.
// A biblioteca é carregada sob demanda (import dinâmico) e fica isolada neste
// módulo; se o carregamento falhar, a tabela com os mesmos dados permanece.

import { html } from '../templates.js';
import { PROJETOS, CATEGORIAS } from '../dados.js';
import { formatarMoeda } from '../formato.js';
import { situacaoDoProjeto } from './cardProjeto.js';

const CHART_JS = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/auto/+esm';

let grafico = null;
let containerAtual = null;

function resumoPorCategoria() {
  return Object.entries(CATEGORIAS).map(([id, categoria]) => {
    const projetos = PROJETOS.filter((projeto) => projeto.categoria === id);
    return {
      nome: categoria.nome,
      arrecadado: projetos.reduce((soma, projeto) => soma + situacaoDoProjeto(projeto).arrecadado, 0),
      meta: projetos.reduce((soma, projeto) => soma + projeto.meta, 0),
    };
  });
}

export function secaoGrafico() {
  return html`
    <section class="secao secao--destaque">
      <div class="container">
        <header class="secao__cabecalho">
          <h2>Arrecadação por área</h2>
          <p class="secao__subtitulo">Quanto cada frente de atuação já captou em relação à meta.</p>
        </header>
        <div class="grafico" hidden>
          <canvas id="grafico-arrecadacao" aria-hidden="true"></canvas>
        </div>
        <table class="tabela" id="tabela-arrecadacao">
          <caption class="u-visualmente-oculto">Arrecadação e meta por área de atuação</caption>
          <thead>
            <tr><th scope="col">Área</th><th scope="col">Arrecadado</th><th scope="col">Meta</th></tr>
          </thead>
          <tbody>
            ${resumoPorCategoria().map(
              (linha) => html`
                <tr>
                  <th scope="row">${linha.nome}</th>
                  <td>${formatarMoeda(linha.arrecadado)}</td>
                  <td>${formatarMoeda(linha.meta)}</td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

export async function montarGrafico(container) {
  const canvas = container.querySelector('#grafico-arrecadacao');
  const tabela = container.querySelector('#tabela-arrecadacao');

  let Chart;
  try {
    ({ default: Chart } = await import(CHART_JS));
  } catch {
    return; // sem a biblioteca, a tabela continua visível
  }

  // A pessoa pode ter mudado de página enquanto a biblioteca carregava.
  if (!canvas.isConnected) return;

  const estilos = getComputedStyle(document.documentElement);
  const cor = (variavel) => estilos.getPropertyValue(variavel).trim();
  const dados = resumoPorCategoria();

  grafico?.destroy();
  canvas.parentElement.hidden = false;
  // A tabela segue disponível para leitores de tela.
  tabela.classList.add('u-visualmente-oculto');

  grafico = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: dados.map((linha) => linha.nome),
      datasets: [
        { label: 'Arrecadado', data: dados.map((linha) => linha.arrecadado), backgroundColor: cor('--cor-primaria-500'), borderRadius: 4 },
        { label: 'Meta', data: dados.map((linha) => linha.meta), backgroundColor: cor('--cor-neutra-300'), borderRadius: 4 },
      ],
    },
    options: {
      maintainAspectRatio: false,
      color: cor('--cor-texto-medio'),
      scales: {
        x: { ticks: { color: cor('--cor-texto-medio') }, grid: { color: cor('--cor-borda') } },
        y: {
          beginAtZero: true,
          ticks: { color: cor('--cor-texto-medio'), callback: (valor) => formatarMoeda(valor) },
          grid: { color: cor('--cor-borda') },
        },
      },
      plugins: {
        tooltip: {
          callbacks: { label: (item) => `${item.dataset.label}: ${formatarMoeda(item.parsed.y)}` },
        },
      },
    },
  });
  containerAtual = container;
}

// As cores do gráfico são lidas das variáveis CSS no momento do desenho,
// então ele precisa ser refeito quando o tema muda.
document.addEventListener('temachange', () => {
  if (containerAtual?.isConnected && grafico) montarGrafico(containerAtual);
});
