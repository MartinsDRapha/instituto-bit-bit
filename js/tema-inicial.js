// Aplica o tema salvo antes de a página ser desenhada, para evitar o "piscar"
// do tema claro. É um script clássico (não módulo) justamente para rodar cedo;
// a troca de tema em si fica em js/ui/tema.js.
(function () {
  var tema = null;
  try {
    tema = JSON.parse(localStorage.getItem('bitabit:tema'));
  } catch (erro) {
    // armazenamento indisponível: segue para a preferência do sistema
  }
  if (tema !== 'claro' && tema !== 'escuro') {
    tema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  }
  document.documentElement.dataset.tema = tema;
})();
