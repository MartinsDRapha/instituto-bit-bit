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

Não há etapa de build nem dependências para instalar.

## Como executar

Os módulos JavaScript exigem um servidor HTTP; abrir o arquivo com duplo clique não funciona.

1. Clone o repositório e entre na pasta.
2. Inicie um servidor estático na raiz do projeto. Com Python:

   ```bash
   python -m http.server 5500
   ```

   Ou use a extensão Live Server do VS Code.
3. Acesse `http://localhost:5500/html/`.

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

## Manutenção

- **Novo projeto**: acrescente um objeto ao array `PROJETOS` em `js/dados.js`.
- **Nova área de atuação**: acrescente uma entrada em `CATEGORIAS`, no mesmo arquivo.
- **Cores, tipografia e espaçamento**: altere as variáveis em `css/tokens.css`.
- **Nova página**: crie uma view em `js/views/` e registre a rota em `js/router.js`.
- **Nova regra de validação**: edite o objeto `REGRAS` em `js/validacao.js`.

## Autoria

Raphaela Fernandes
