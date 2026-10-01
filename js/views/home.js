import { html } from '../templates.js';
import { PROJETOS, MENTORES_BASE } from '../dados.js';
import { listarVoluntarios } from '../storage.js';
import { formatarNumero } from '../formato.js';
import { cardProjeto } from '../componentes/cardProjeto.js';
import { foto } from '../componentes/foto.js';

export const home = {
  titulo: 'Educação técnica em informática',

  render() {
    const destaques = PROJETOS.filter((projeto) => projeto.destaque);
    const mentores = MENTORES_BASE + listarVoluntarios().length;

    return html`
      <section class="hero hero--com-foto">
        ${foto({
          nome: 'hero',
          larguras: [768, 1280, 1920],
          tamanhos: '100vw',
          largura: 1280,
          altura: 853,
          // Decorativa: o conteúdo do banner está no texto.
          alt: '',
          classe: 'hero__foto',
          prioritaria: true,
        })}
        <div class="container">
          <div class="hero__conteudo">
            <h1>Tecnologia se aprende bit a bit</h1>
            <p class="hero__texto">Há 9 anos oferecemos cursos técnicos gratuitos de informática para jovens e adultos de comunidades periféricas. Ajude a formar a próxima geração de profissionais de TI.</p>
            <div class="hero__acoes">
              <button class="btn btn--secundario" type="button" data-acao="abrir-doacao">Quero doar</button>
              <a class="btn btn--claro" href="#/cadastro">Quero ser mentor</a>
            </div>
          </div>
        </div>
      </section>

      <section class="secao secao--escura" aria-label="Nosso impacto">
        <div class="container">
          <div class="grid">
            <div class="stat col-6 col-md-3"><span class="stat__numero">9</span><span class="stat__rotulo">anos de atuação</span></div>
            <div class="stat col-6 col-md-3"><span class="stat__numero">${formatarNumero(3200)}</span><span class="stat__rotulo">alunos formados</span></div>
            <div class="stat col-6 col-md-3"><span class="stat__numero">68%</span><span class="stat__rotulo">empregados em TI</span></div>
            <div class="stat col-6 col-md-3"><span class="stat__numero">${formatarNumero(mentores)}</span><span class="stat__rotulo">mentores voluntários</span></div>
          </div>
        </div>
      </section>

      <section class="secao">
        <div class="container">
          <header class="secao__cabecalho">
            <h2>Projetos em destaque</h2>
            <p class="secao__subtitulo">Conheça as turmas e os laboratórios que estão captando recursos neste momento.</p>
          </header>
          <div class="grid">
            ${destaques.map((projeto) => html`<div class="col-md-6 col-lg-4">${cardProjeto(projeto)}</div>`)}
          </div>
          <p class="u-texto-centro u-mt-4 u-mb-0">
            <a class="btn btn--contorno" href="#/projetos">Ver todos os projetos</a>
          </p>
        </div>
      </section>

      <section class="secao secao--destaque" id="sobre">
        <div class="container">
          <div class="grid">
            <div class="col-lg-7">
              <h2>Quem somos</h2>
              <p>O Instituto Bit a Bit é uma organização sem fins lucrativos criada por professores e profissionais de TI que acreditam que o acesso à formação técnica muda trajetórias.</p>
              <p>Nossos cursos são gratuitos, presenciais e com certificado. Os relatórios financeiros são publicados a cada trimestre e auditados de forma independente.</p>
              <ul class="tags">
                <li class="tag">Ensino gratuito</li>
                <li class="tag">Software livre</li>
                <li class="tag">Empregabilidade</li>
                <li class="tag">Transparência</li>
              </ul>
            </div>
            <div class="col-lg-5">
              <div class="alerta alerta--sucesso u-mb-2">
                <div><strong class="alerta__titulo">Laboratório novo inaugurado!</strong>20 computadores recondicionados já estão em uso.</div>
              </div>
              <div class="alerta alerta--aviso u-mb-2">
                <div><strong class="alerta__titulo">Precisamos de mentores</strong>Faltam 8 voluntários para a turma de redes de março.</div>
              </div>
              <div class="alerta">
                <div><strong class="alerta__titulo">Inscrições abertas</strong>Turmas do 1º semestre recebem inscrições até o dia 28.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="secao">
        <div class="container u-texto-centro">
          <h2>Seu conhecimento também transforma</h2>
          <p class="secao__subtitulo">Doe algumas horas por mês como mentor ou instrutor e acompanhe a evolução dos alunos.</p>
          <a class="btn btn--primario u-mt-2" href="#/cadastro">Cadastrar como voluntário</a>
        </div>
      </section>
    `;
  },
};
