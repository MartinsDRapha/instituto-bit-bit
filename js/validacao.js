// Validação e máscaras do formulário de cadastro.
// Cada regra recebe o valor do campo e devolve a mensagem de erro, ou '' se válido.

const soDigitos = (texto) => texto.replace(/\D/g, '');

function cpfValido(cpf) {
  const digitos = soDigitos(cpf);
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false;

  const verificador = (tamanho) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(digitos[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return verificador(9) === Number(digitos[9]) && verificador(10) === Number(digitos[10]);
}

function idadeEm(dataIso) {
  const nascimento = new Date(`${dataIso}T00:00:00`);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade--;
  return idade;
}

const obrigatorio = (mensagem) => (valor) => (valor ? '' : mensagem);

const REGRAS = {
  nome: [
    obrigatorio('Informe seu nome completo.'),
    (v) => (v.split(/\s+/).length >= 2 ? '' : 'Informe nome e sobrenome.'),
    (v) => (/^[\p{L}\s'.-]+$/u.test(v) ? '' : 'O nome deve conter apenas letras.'),
  ],
  email: [
    obrigatorio('Informe seu e-mail.'),
    (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Informe um e-mail válido, como voce@exemplo.com.'),
  ],
  telefone: [
    obrigatorio('Informe seu telefone.'),
    (v) => ([10, 11].includes(soDigitos(v).length) ? '' : 'Informe DDD e número, como (11) 91234-5678.'),
  ],
  cpf: [
    obrigatorio('Informe seu CPF.'),
    (v) => (soDigitos(v).length === 11 ? '' : 'O CPF deve ter 11 dígitos.'),
    (v) => (cpfValido(v) ? '' : 'CPF inválido. Confira os números digitados.'),
  ],
  nascimento: [
    obrigatorio('Informe sua data de nascimento.'),
    (v) => {
      const idade = idadeEm(v);
      if (Number.isNaN(idade) || idade < 0 || idade > 120) return 'Informe uma data de nascimento válida.';
      return idade >= 16 ? '' : 'É preciso ter pelo menos 16 anos para se voluntariar.';
    },
  ],
  cep: [
    obrigatorio('Informe seu CEP.'),
    (v) => (soDigitos(v).length === 8 ? '' : 'O CEP deve ter 8 dígitos.'),
  ],
  endereco: [obrigatorio('Informe seu endereço.')],
  cidade: [obrigatorio('Informe sua cidade.')],
  estado: [obrigatorio('Selecione um estado.')],
  area: [(v) => (v.length > 0 ? '' : 'Escolha pelo menos uma área.')],
  turno: [obrigatorio('Escolha um turno.')],
  mensagem: [(v) => (v.length <= 500 ? '' : 'A mensagem deve ter até 500 caracteres.')],
  termos: [(v) => (v ? '' : 'É preciso aceitar o termo para continuar.')],
};

export function validarCampo(nome, valor) {
  for (const regra of REGRAS[nome] ?? []) {
    const erro = regra(valor);
    if (erro) return erro;
  }
  return '';
}

// Devolve apenas os campos com erro: { campo: mensagem }.
export function validarFormulario(valores) {
  const erros = {};
  for (const nome of Object.keys(REGRAS)) {
    const erro = validarCampo(nome, valores[nome]);
    if (erro) erros[nome] = erro;
  }
  return erros;
}

export const MASCARAS = {
  telefone(valor) {
    const d = soDigitos(valor).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    const corte = d.length === 11 ? 7 : 6;
    return `(${d.slice(0, 2)}) ${d.slice(2, corte)}-${d.slice(corte)}`;
  },
  cpf(valor) {
    const d = soDigitos(valor).slice(0, 11);
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  },
  cep(valor) {
    const d = soDigitos(valor).slice(0, 8);
    return d.replace(/^(\d{5})(\d)/, '$1-$2');
  },
};
