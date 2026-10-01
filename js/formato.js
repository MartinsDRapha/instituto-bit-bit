const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export const formatarMoeda = (valor) => moeda.format(valor);

export const formatarNumero = (valor) => new Intl.NumberFormat('pt-BR').format(valor);
