# Instituto Bit a Bit

Plataforma web de uma ONG fictícia de educação técnica gratuita em informática. Permite divulgar projetos, registrar doações e cadastrar voluntários.

Projeto acadêmico da disciplina de Desenvolvimento Front-End. A organização, os projetos, os números e os contatos são fictícios.

## Funcionalidades

- **SPA** com rotas `#/`, `#/sobre`, `#/projetos` e `#/cadastro`, sem recarregar a página
- **Projetos** com filtro por área, barra de arrecadação e gráfico por área de atuação
- **Doação simulada**, gravada no navegador e refletida nas barras e no gráfico
- **Cadastro de voluntários** com validação (CPF, idade mínima, e-mail, telefone, CEP), máscaras e rascunho automático
- **Tema claro e escuro**, com a preferência salva
- **Layout responsivo** mobile-first, com grid de 12 colunas e cinco breakpoints

## Tecnologias

- HTML5 semântico
- CSS3 com variáveis (Design System), Grid e Flexbox
- JavaScript puro em módulos ES6
- [Chart.js 4.4.4](https://www.chartjs.org/), carregado por CDN apenas na página de projetos

- [esbuild](https://esbuild.github.io/), usado apenas no build de produção

## Como executar

Requer [Node.js](https://nodejs.org/) 20 ou superior. Os módulos JavaScript exigem um servidor HTTP; abrir o arquivo com duplo clique não funciona.

```bash
git clone <endereço-do-repositório>
cd <pasta-do-projeto>
npm install
npm run dev
```

Acesse `http://localhost:5500/html/`.

## Build de produção

```bash
npm run build
npm run preview
```

O build gera a pasta `dist/`, que é o que vai para a hospedagem, e `npm run preview` a serve em `http://localhost:4173` para conferência.

| Etapa | O que faz |
|---|---|
| JavaScript | Reúne os 20 módulos em um arquivo e minifica |
| CSS | Reúne os 7 arquivos em um e minifica |
| HTML | Coloca o `index.html` na raiz de `dist/`, ajusta os caminhos e remove comentários |
| Cache | Acrescenta `?v=<hash>` aos arquivos; o endereço muda quando o conteúdo muda |
| Imagens | Copia apenas as que a página usa |

O Chart.js continua sendo carregado do CDN sob demanda e não entra no pacote.

## Estrutura

```text
├── html/
│   └── index.html          casca única da aplicação
├── css/
│   ├── main.css            importa os demais, na ordem da cascata
│   ├── tokens.css          variáveis do Design System e tema escuro
│   ├── base.css            reset e tipografia
│   ├── layout.css          grid, cabeçalho, rodapé
│   ├── components.css      botões, cards, formulários, modal, toast
│   ├── spa.css             estados controlados por JavaScript
│   └── utilities.css       classes auxiliares
├── imagens/
├── scripts/
│   ├── build.mjs           gera a versão de produção em dist/
│   └── servidor.mjs        servidor estático para desenvolvimento e preview
└── js/
    ├── main.js             ponto de entrada
    ├── router.js           navegação entre rotas
    ├── templates.js        sistema de templates com escape de HTML
    ├── dados.js            projetos e categorias
    ├── storage.js          acesso ao localStorage
    ├── validacao.js        regras e máscaras do formulário
    ├── formato.js          formatação de moeda e números
    ├── tema-inicial.js     aplica o tema antes do desenho da página
    ├── views/              uma página por arquivo
    ├── componentes/        card de projeto, doação e gráfico
    └── ui/                 modal, toast, menu e tema
```

## Dados gravados no navegador

Tudo fica no `localStorage`, com o prefixo `bitabit:`. Nada é enviado a servidores.

| Chave | Conteúdo |
|---|---|
| `bitabit:doacoes` | Doações simuladas (projeto, valor, data) |
| `bitabit:voluntarios` | Cadastros enviados (nome, e-mail, áreas, turno) |
| `bitabit:rascunho-cadastro` | Formulário em preenchimento |
| `bitabit:tema` | Tema escolhido |

CPF, telefone e endereço são validados, mas não são gravados.

## Acessibilidade

O projeto segue as diretrizes da WCAG 2.1, nível AA.

| Aspecto | Como é atendido |
|---|---|
| Contraste (1.4.3, 1.4.11) | Texto com no mínimo 4,5:1 e bordas de campos, tags e foco com no mínimo 3:1, nos temas claro e escuro |
| Teclado (2.1.1, 2.1.2) | Tudo é operável por teclado; o modal prende o foco e fecha com Esc; o submenu fecha com Esc |
| Foco (2.4.3, 2.4.7) | Indicador em dois tons, visível em fundos claros e escuros; a troca de rota leva o foco ao título da página |
| Navegação (2.4.1, 2.4.2) | Link "Pular para o conteúdo" e título da aba atualizado a cada rota |
| Formulários (1.3.1, 3.3.1, 3.3.2) | Rótulos em todos os campos, obrigatoriedade indicada, erro em texto ligado ao campo e resumo de erros no envio |
| Nome e função (4.1.2) | Botões com nome acessível, barra de arrecadação com `role="progressbar"`, estados com `aria-expanded`, `aria-pressed`, `aria-invalid` e `aria-current` |
| Conteúdo não textual (1.1.1) | Ícones decorativos ocultos de leitores de tela; o gráfico tem uma tabela equivalente |
| Tempo e movimento (2.2.1, 2.3.3) | Notificações pausam com o ponteiro ou o foco sobre elas; animações respeitam `prefers-reduced-motion` |

Os contrastes foram calculados pela fórmula da WCAG. Recomenda-se complementar com o Lighthouse e a extensão axe DevTools, e com um teste em leitor de tela (NVDA ou VoiceOver).

## Manutenção

- **Novo projeto**: acrescente um objeto ao array `PROJETOS` em `js/dados.js`.
- **Nova área de atuação**: acrescente uma entrada em `CATEGORIAS`, no mesmo arquivo.
- **Cores, tipografia e espaçamento**: altere as variáveis em `css/tokens.css`.
- **Nova página**: crie uma view em `js/views/` e registre a rota em `js/router.js`.
- **Nova regra de validação**: edite o objeto `REGRAS` em `js/validacao.js`.

## Autoria

Raphaela Fernandes
