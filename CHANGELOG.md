# Changelog

Todas as mudanças relevantes do projeto são registradas aqui. O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [versionamento semântico](https://semver.org/lang/pt-BR/).

## [1.1.1] - 2026-10-01

### Corrigido

- As fotos do banner e dos cards não carregavam no site publicado: o caminho era calculado a partir do módulo JavaScript, que muda de pasta no empacotamento, e apontava para fora da subpasta do site no GitHub Pages. O caminho passou a ser relativo à página

## [1.1.0] - 2026-10-01

### Adicionado

- Fotos no banner da página inicial e nos cards de projeto, em WebP com várias larguras, JPEG de reserva e carregamento sob demanda
- Tema de alto contraste, no alternador de tema e por preferência do sistema (`prefers-contrast: more`)
- Comando `npm run imagens`, que gera as versões otimizadas das fotos
- Créditos das imagens no README

### Alterado

- Build: HTML minificado por completo e logotipo convertido para WebP
- As notificações passam a vir antes do rodapé na ordem de foco do teclado

### Removido

- Imagem `logo-instituto.png`, que não era usada por nenhuma página

## [1.0.1] - 2026-09-30

### Corrigido

- O aviso "Rascunho recuperado" aparecia no cadastro mesmo quando o formulário havia sido esvaziado

## [1.0.0] - 2026-09-30

Primeira versão publicada.

### Adicionado

- Aplicação de página única (SPA) com as rotas início, sobre, projetos e cadastro
- Design System em variáveis CSS, grid de 12 colunas e cinco breakpoints
- Página de projetos com filtro por área, barra de arrecadação e gráfico (Chart.js)
- Doação simulada, gravada no `localStorage`
- Cadastro de voluntários com validação, máscaras e rascunho automático
- Tema claro e escuro, com a preferência salva
- Build de produção com esbuild (`npm run build`)
- Deploy automático no GitHub Pages pelo GitHub Actions
- Documentação: instalação, uso, estrutura, acessibilidade, deploy e fluxo GitFlow

### Acessibilidade

- Conformidade com a WCAG 2.1 nível AA: contraste, foco visível, navegação por teclado, nomes acessíveis e mensagens de erro em texto

[1.1.1]: https://github.com/MartinsDRapha/instituto-bit-bit/releases/tag/v1.1.1
[1.1.0]: https://github.com/MartinsDRapha/instituto-bit-bit/releases/tag/v1.1.0
[1.0.1]: https://github.com/MartinsDRapha/instituto-bit-bit/releases/tag/v1.0.1
[1.0.0]: https://github.com/MartinsDRapha/instituto-bit-bit/releases/tag/v1.0.0
