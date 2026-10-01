// Sistema de templates: a tag `html` monta strings de HTML escapando
// automaticamente todo valor interpolado, o que evita injeção de código (XSS).

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapar = (valor) => String(valor).replace(/[&<>"']/g, (c) => ESCAPES[c]);

// Marca um trecho como HTML já seguro, para não ser escapado de novo.
class HtmlSeguro {
  constructor(texto) {
    this.texto = texto;
  }

  toString() {
    return this.texto;
  }
}

export const bruto = (texto) => new HtmlSeguro(texto);

function interpolar(valor) {
  if (valor === null || valor === undefined || valor === false) return '';
  if (Array.isArray(valor)) return valor.map(interpolar).join('');
  if (valor instanceof HtmlSeguro) return valor.texto;
  return escapar(valor);
}

// Uso: html`<p>${texto}</p>` — templates aninhados e listas são aceitos.
export function html(partes, ...valores) {
  const texto = partes.reduce(
    (acumulado, parte, i) => acumulado + parte + (i < valores.length ? interpolar(valores[i]) : ''),
    ''
  );
  return new HtmlSeguro(texto);
}

export function renderizar(container, conteudo) {
  container.innerHTML = String(conteudo);
}
