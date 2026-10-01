import { html, renderizar } from '../templates.js';
import { CATEGORIAS, TURNOS, ESTADOS } from '../dados.js';
import {
  listarVoluntarios,
  salvarVoluntario,
  removerVoluntario,
  lerRascunho,
  salvarRascunho,
  limparRascunho,
} from '../storage.js';
import { validarCampo, validarFormulario, MASCARAS } from '../validacao.js';
import { mostrarToast } from '../ui/toast.js';

// Templates -------------------------------------------------------------------

function campo({ nome, rotulo, tipo = 'text', classe = '', ajuda = '', obrigatorio = true, extras = '' }) {
  return html`
    <div class="campo ${classe}">
      <label class="campo__rotulo ${obrigatorio ? 'campo__rotulo--obrigatorio' : ''}" for="${nome}">${rotulo}</label>
      <input class="campo__controle" type="${tipo}" id="${nome}" name="${nome}"
        aria-describedby="erro-${nome}" ${obrigatorio ? html`aria-required="true"` : ''} ${extras}>
      ${ajuda && html`<span class="campo__ajuda">${ajuda}</span>`}
      <span class="campo__erro" id="erro-${nome}" data-erro-de="${nome}"></span>
    </div>
  `;
}

function listaSalvos() {
  const voluntarios = listarVoluntarios();
  if (voluntarios.length === 0) {
    return html`<p class="u-texto-suave">Nenhum cadastro enviado neste navegador ainda.</p>`;
  }
  return html`
    <ul class="lista-salvos">
      ${voluntarios.map(
        (v) => html`
          <li class="lista-salvos__item">
            <span>
              <span class="lista-salvos__nome">${v.nome}</span>
              ${v.area.map((id) => CATEGORIAS[id]?.nome).join(', ')} · ${TURNOS[v.turno]}
            </span>
            <button class="btn btn--contorno btn--pequeno" type="button" data-remover="${v.id}"
              aria-label="Remover cadastro de ${v.nome}">Remover</button>
          </li>
        `
      )}
    </ul>
  `;
}

function pagina() {
  return html`
    <section class="hero hero--compacto">
      <div class="container">
        <div class="hero__conteudo">
          <h1>Seja voluntário</h1>
          <p class="hero__texto">Compartilhe o que você sabe de tecnologia como mentor ou instrutor. Preencha o cadastro e nossa equipe entra em contato em até 5 dias úteis.</p>
        </div>
      </div>
    </section>

    <section class="secao">
      <div class="container">
        <div class="grid">
          <div class="col-lg-8">
            <form class="form" id="form-cadastro" novalidate>
              <div id="resumo-erros"></div>
              <p class="u-texto-suave">Os campos marcados com <span aria-hidden="true">*</span><span class="u-visualmente-oculto">asterisco</span> são obrigatórios.</p>

              <fieldset class="form__grupo">
                <legend class="form__legenda">Dados pessoais</legend>
                <div class="grid">
                  ${campo({ nome: 'nome', rotulo: 'Nome completo', extras: html`autocomplete="name"` })}
                  ${campo({ nome: 'email', rotulo: 'E-mail', tipo: 'email', classe: 'col-md-6', extras: html`placeholder="voce@exemplo.com" autocomplete="email"` })}
                  ${campo({ nome: 'telefone', rotulo: 'Telefone', tipo: 'tel', classe: 'col-md-6', ajuda: 'Com DDD. A formatação é automática.', extras: html`placeholder="(11) 91234-5678" autocomplete="tel"` })}
                  ${campo({ nome: 'cpf', rotulo: 'CPF', classe: 'col-md-6', extras: html`placeholder="000.000.000-00" inputmode="numeric"` })}
                  ${campo({ nome: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date', classe: 'col-md-6', extras: html`autocomplete="bday"` })}
                </div>
              </fieldset>

              <fieldset class="form__grupo">
                <legend class="form__legenda">Endereço</legend>
                <div class="grid">
                  ${campo({ nome: 'cep', rotulo: 'CEP', classe: 'col-md-4', extras: html`placeholder="00000-000" inputmode="numeric" autocomplete="postal-code"` })}
                  ${campo({ nome: 'endereco', rotulo: 'Endereço', classe: 'col-md-8', extras: html`autocomplete="street-address"` })}
                  ${campo({ nome: 'cidade', rotulo: 'Cidade', classe: 'col-md-8', extras: html`autocomplete="address-level2"` })}
                  <div class="campo col-md-4">
                    <label class="campo__rotulo campo__rotulo--obrigatorio" for="estado">Estado</label>
                    <select class="campo__controle" id="estado" name="estado" aria-required="true" aria-describedby="erro-estado" autocomplete="address-level1">
                      <option value="">Selecione</option>
                      ${ESTADOS.map((uf) => html`<option>${uf}</option>`)}
                    </select>
                    <span class="campo__erro" id="erro-estado" data-erro-de="estado"></span>
                  </div>
                </div>
              </fieldset>

              <fieldset class="form__grupo">
                <legend class="form__legenda">Como você quer ajudar?</legend>
                <div class="grid">
                  <div class="campo col-md-6" role="group" aria-labelledby="rotulo-area" aria-describedby="erro-area">
                    <span class="campo__rotulo campo__rotulo--obrigatorio" id="rotulo-area">Áreas de interesse</span>
                    ${Object.entries(CATEGORIAS).map(
                      ([id, categoria]) => html`
                        <label class="opcao"><input class="opcao__controle" type="checkbox" name="area" value="${id}">${categoria.nome}</label>
                      `
                    )}
                    <span class="campo__erro" id="erro-area" data-erro-de="area"></span>
                  </div>
                  <div class="campo col-md-6" role="radiogroup" aria-labelledby="rotulo-turno" aria-describedby="erro-turno" aria-required="true">
                    <span class="campo__rotulo campo__rotulo--obrigatorio" id="rotulo-turno">Turno disponível</span>
                    ${Object.entries(TURNOS).map(
                      ([id, nome]) => html`
                        <label class="opcao"><input class="opcao__controle" type="radio" name="turno" value="${id}">${nome}</label>
                      `
                    )}
                    <span class="campo__erro" id="erro-turno" data-erro-de="turno"></span>
                  </div>
                  <div class="campo">
                    <label class="campo__rotulo" for="mensagem">Conte sobre sua experiência com tecnologia</label>
                    <textarea class="campo__controle" id="mensagem" name="mensagem" aria-describedby="erro-mensagem"></textarea>
                    <span class="campo__ajuda">Opcional. <span id="contador-mensagem">0</span>/500 caracteres.</span>
                    <span class="campo__erro" id="erro-mensagem" data-erro-de="mensagem"></span>
                  </div>
                </div>
              </fieldset>

              <div class="campo u-mb-4">
                <label class="opcao">
                  <input class="opcao__controle" type="checkbox" name="termos" aria-required="true" aria-describedby="erro-termos">
                  <span>Li e aceito o termo de voluntariado e a política de privacidade.</span>
                </label>
                <span class="campo__erro" id="erro-termos" data-erro-de="termos"></span>
              </div>

              <div class="form__acoes">
                <button class="btn btn--primario" type="submit">Enviar cadastro</button>
                <button class="btn btn--contorno" type="reset">Limpar</button>
              </div>
            </form>
          </div>

          <aside class="col-lg-4">
            <div class="alerta u-mb-2">
              <div><strong class="alerta__titulo">Seus dados estão protegidos</strong>O rascunho é salvo neste navegador enquanto você digita. CPF, telefone e endereço não são gravados.</div>
            </div>
            <div class="alerta alerta--aviso u-mb-2">
              <div><strong class="alerta__titulo">Idade mínima</strong>É preciso ter pelo menos 16 anos. Menores de 18 precisam de autorização do responsável.</div>
            </div>
            <h2 class="u-mt-4">Cadastros enviados</h2>
            <div id="lista-salvos">${listaSalvos()}</div>
          </aside>
        </div>
      </div>
    </section>
  `;
}

// Comportamento -----------------------------------------------------------------

const CAMPOS_DO_RASCUNHO = ['nome', 'email', 'nascimento', 'cidade', 'estado', 'area', 'turno', 'mensagem'];

function lerValores(form) {
  const dados = new FormData(form);
  const texto = (nome) => (dados.get(nome) ?? '').trim();
  return {
    nome: texto('nome'),
    email: texto('email'),
    telefone: texto('telefone'),
    cpf: texto('cpf'),
    nascimento: texto('nascimento'),
    cep: texto('cep'),
    endereco: texto('endereco'),
    cidade: texto('cidade'),
    estado: texto('estado'),
    area: dados.getAll('area'),
    turno: texto('turno'),
    mensagem: texto('mensagem'),
    termos: dados.has('termos'),
  };
}

function controlesDe(form, nome) {
  const controle = form.elements[nome];
  return controle instanceof RadioNodeList ? [...controle] : [controle];
}

function mostrarErro(form, nome, mensagem) {
  const saida = form.querySelector(`[data-erro-de="${nome}"]`);
  const grupo = saida.closest('.campo');
  saida.textContent = mensagem;
  grupo.classList.toggle('campo--erro', Boolean(mensagem));
  grupo.classList.toggle('campo--ok', !mensagem);
  controlesDe(form, nome).forEach((controle) => controle.setAttribute('aria-invalid', String(Boolean(mensagem))));
}

function limparEstados(form) {
  form.querySelectorAll('.campo').forEach((grupo) => grupo.classList.remove('campo--erro', 'campo--ok'));
  form.querySelectorAll('[data-erro-de]').forEach((saida) => (saida.textContent = ''));
  form.querySelectorAll('[aria-invalid]').forEach((controle) => controle.removeAttribute('aria-invalid'));
  renderizar(form.querySelector('#resumo-erros'), '');
}

function preencher(form, dados) {
  for (const [nome, valor] of Object.entries(dados)) {
    if (nome === 'area' || nome === 'turno') {
      controlesDe(form, nome).forEach((controle) => (controle.checked = [].concat(valor).includes(controle.value)));
    } else if (form.elements[nome]) {
      form.elements[nome].value = valor;
    }
  }
}

// Um rascunho só vale se ao menos um campo tiver conteúdo (texto ou opção).
const temConteudo = (rascunho) => Object.values(rascunho).some((valor) => valor?.length > 0);

function guardarRascunho(form) {
  const valores = lerValores(form);
  const rascunho = Object.fromEntries(CAMPOS_DO_RASCUNHO.map((nome) => [nome, valores[nome]]));
  // Se a pessoa apagou tudo, não sobra rascunho a recuperar.
  if (temConteudo(rascunho)) salvarRascunho(rascunho);
  else limparRascunho();
}

export const cadastro = {
  titulo: 'Seja voluntário',

  render: pagina,

  aoMontar(container) {
    const form = container.querySelector('#form-cadastro');
    const resumo = form.querySelector('#resumo-erros');
    const lista = container.querySelector('#lista-salvos');
    const contador = form.querySelector('#contador-mensagem');
    const atualizarContador = () => (contador.textContent = form.elements.mensagem.value.length);

    const rascunho = lerRascunho();
    if (rascunho && temConteudo(rascunho)) {
      preencher(form, rascunho);
      atualizarContador();
      mostrarToast({ titulo: 'Rascunho recuperado', mensagem: 'Continuamos de onde você parou.' });
    }

    // Máscaras e validação durante a digitação: o erro só some enquanto a
    // pessoa corrige; ele só aparece ao sair do campo ou ao enviar.
    form.addEventListener('input', (evento) => {
      const { name: nome } = evento.target;
      if (MASCARAS[nome]) evento.target.value = MASCARAS[nome](evento.target.value);
      if (nome === 'mensagem') atualizarContador();

      const grupo = evento.target.closest('.campo');
      if (grupo?.classList.contains('campo--erro') || evento.target.type === 'checkbox' || evento.target.type === 'radio') {
        mostrarErro(form, nome, validarCampo(nome, lerValores(form)[nome]));
      }
      guardarRascunho(form);
    });

    form.addEventListener('focusout', (evento) => {
      const { name: nome, type: tipo } = evento.target;
      if (!nome || tipo === 'checkbox' || tipo === 'radio') return;
      const valor = lerValores(form)[nome];
      if (valor || evento.target.closest('.campo').classList.contains('campo--erro')) {
        mostrarErro(form, nome, validarCampo(nome, valor));
      }
    });

    form.addEventListener('reset', () => {
      limparEstados(form);
      limparRascunho();
      contador.textContent = 0;
    });

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const valores = lerValores(form);
      const erros = validarFormulario(valores);
      Object.keys(valores).forEach((nome) => mostrarErro(form, nome, erros[nome] ?? ''));

      const quantidade = Object.keys(erros).length;
      if (quantidade > 0) {
        renderizar(
          resumo,
          html`
            <div class="alerta alerta--erro u-mb-4" role="alert">
              <div>
                <strong class="alerta__titulo">${quantidade === 1 ? 'Há 1 campo para corrigir' : `Há ${quantidade} campos para corrigir`}</strong>
                Revise os campos destacados em vermelho.
              </div>
            </div>
          `
        );
        controlesDe(form, Object.keys(erros)[0])[0].focus();
        return;
      }

      if (!salvarVoluntario(valores)) {
        mostrarToast({
          titulo: 'Não foi possível salvar',
          mensagem: 'O armazenamento do navegador está indisponível.',
          tipo: 'erro',
        });
        return;
      }

      form.reset();
      renderizar(lista, listaSalvos());
      mostrarToast({
        titulo: 'Cadastro enviado!',
        mensagem: `Obrigado, ${valores.nome.split(' ')[0]}. Entraremos em contato em até 5 dias úteis.`,
        tipo: 'sucesso',
      });
    });

    lista.addEventListener('click', (evento) => {
      const botao = evento.target.closest('[data-remover]');
      if (!botao) return;
      removerVoluntario(Number(botao.dataset.remover));
      renderizar(lista, listaSalvos());
      mostrarToast({ titulo: 'Cadastro removido', mensagem: 'O registro foi apagado deste navegador.' });
    });
  },
};
