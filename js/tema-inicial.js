// Aplica o tema salvo antes de a página ser desenhada, para evitar o "piscar"
// do tema claro. É um script clássico (não módulo) justamente para rodar cedo;
// a troca de tema em si fica em js/ui/tema.js.
(function () {
  var TEMAS = ['claro', 'escuro', 'contraste'];
  var tema = null;
  try {
    tema = JSON.parse(localStorage.getItem('bitabit:tema'));
  } catch (erro) {
    // armazenamento indisponível: segue para a preferência do sistema
  }
  // Sem escolha salva, valem as preferências do sistema operacional.
  if (TEMAS.indexOf(tema) === -1) {
    if (window.matchMedia('(prefers-contrast: more)').matches) tema = 'contraste';
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) tema = 'escuro';
    else tema = 'claro';
  }
  document.documentElement.dataset.tema = tema;
})();
