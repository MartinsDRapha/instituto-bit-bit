// Roteador por hash: cada rota (#/caminho?parametros) corresponde a uma view,
// que é renderizada dentro de <main> sem recarregar a página.

import { html, renderizar } from './templates.js';
import { fecharMenu, marcarRotaAtiva } from './ui/menu.js';
import { home } from './views/home.js';
import { projetos } from './views/projetos.js';
import { cadastro } from './views/cadastro.js';

const NOME_DO_SITE = 'Instituto Bit a Bit';

const naoEncontrada = {
  titulo: 'Página não encontrada',
  render: () => html`
    <section class="secao">
      <div class="container u-texto-centro">
        <h1>Página não encontrada</h1>
        <p class="secao__subtitulo">O endereço que você tentou acessar não existe.</p>
        <a class="btn btn--primario u-mt-2" href="#/">Voltar ao início</a>
      </div>
    </section>
  `,
};

const ROTAS = {
  '/': { view: home },
  '/sobre': { view: home, ancora: 'sobre' },
  '/projetos': { view: projetos },
  '/cadastro': { view: cadastro },
};

let app;
let rotaAtual = { caminho: '/', params: new URLSearchParams() };

// Hashes que não começam com "#/" são âncoras comuns (ex.: "pular para o
// conteúdo") e não mudam de rota.
function lerRota() {
  const { hash } = window.location;
  if (hash && !hash.startsWith('#/')) return null;
  const [caminho, consulta = ''] = (hash.slice(1) || '/').split('?');
  return { caminho, params: new URLSearchParams(consulta) };
}

function desenhar({ novaNavegacao }) {
  const rota = ROTAS[rotaAtual.caminho];
  const view = rota?.view ?? naoEncontrada;

  renderizar(app, view.render(rotaAtual.params));
  view.aoMontar?.(app, rotaAtual.params);

  document.title = `${view.titulo} — ${NOME_DO_SITE}`;
  marcarRotaAtiva(rotaAtual.caminho);

  if (!novaNavegacao) return;

  fecharMenu();
  app.classList.remove('pagina-entrada');
  void app.offsetWidth; // força o reinício da animação
  app.classList.add('pagina-entrada');

  const ancora = rota?.ancora && document.getElementById(rota.ancora);
  if (ancora) ancora.scrollIntoView();
  else window.scrollTo({ top: 0, behavior: 'instant' });
  app.focus({ preventScroll: true });
}

function navegar() {
  const rota = lerRota();
  if (!rota) return;
  rotaAtual = rota;
  desenhar({ novaNavegacao: true });
}

// Intercepta cliques em links de rota: cancela a navegação padrão do
// navegador e deixa a SPA atualizar o endereço e o conteúdo.
function interceptarLinks(evento) {
  const link = evento.target.closest('a[href^="#/"]');
  if (!link) return;
  // Cliques com tecla modificadora (abrir em nova aba, etc.) seguem normais.
  if (evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;

  evento.preventDefault();
  navegarPara(link.getAttribute('href'));
}

export function navegarPara(destino) {
  window.history.pushState(null, '', destino);
  navegar();
}

export function iniciarRouter(container) {
  app = container;
  document.addEventListener('click', interceptarLinks);
  // popstate cobre os botões voltar/avançar e a edição manual do endereço.
  window.addEventListener('popstate', navegar);
  if (lerRota()) navegar();
  else desenhar({ novaNavegacao: true });
}

// Redesenha a rota atual sem rolar a página (usado após uma doação).
export function atualizarRota() {
  desenhar({ novaNavegacao: false });
}
