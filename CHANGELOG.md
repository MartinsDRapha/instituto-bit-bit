# Changelog

Todas as mudanças relevantes do projeto são registradas aqui. O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [versionamento semântico](https://semver.org/lang/pt-BR/).

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

[1.0.0]: https://github.com/MartinsDRapha/instituto-bit-bit/releases/tag/v1.0.0
