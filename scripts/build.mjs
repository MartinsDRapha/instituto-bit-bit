// Gera a versão de produção em dist/:
//   - JavaScript: módulos reunidos em um único arquivo e minificados
//   - CSS: @imports reunidos em um único arquivo e minificado
//   - HTML: index.html na raiz, com caminhos ajustados e versão nos arquivos
//   - Imagens: copiadas apenas as que a página usa
// Uso: npm run build

import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, stat, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const SAIDA = path.join(RAIZ, 'dist');
const IMAGENS_USADAS = ['favicon.svg', 'logo-simbolo.png'];

const origem = (...partes) => path.join(RAIZ, ...partes);
const destino = (...partes) => path.join(SAIDA, ...partes);

async function tamanhoDaPasta(pasta, extensao) {
  let total = 0;
  for (const item of await readdir(pasta, { withFileTypes: true, recursive: true })) {
    if (item.isFile() && item.name.endsWith(extensao)) {
      total += (await stat(path.join(item.parentPath, item.name))).size;
    }
  }
  return total;
}

// Sufixo de versão: muda quando o conteúdo muda, forçando o navegador a
// baixar o arquivo novo em vez de usar o que está em cache.
async function versao(arquivo) {
  return createHash('sha256').update(await readFile(arquivo)).digest('hex').slice(0, 8);
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

await rm(SAIDA, { recursive: true, force: true });
await mkdir(destino('imagens'), { recursive: true });

const opcoesComuns = { bundle: true, minify: true, logLevel: 'warning', target: 'es2022' };

await Promise.all([
  // O Chart.js continua vindo do CDN, sob demanda; por isso fica fora do pacote.
  build({ ...opcoesComuns, entryPoints: [origem('js/main.js')], outfile: destino('js/main.js'), format: 'esm', external: ['https://*'] }),
  // Script clássico que aplica o tema antes do desenho da página.
  build({ ...opcoesComuns, entryPoints: [origem('js/tema-inicial.js')], outfile: destino('js/tema-inicial.js'), format: 'iife' }),
  build({ ...opcoesComuns, entryPoints: [origem('css/main.css')], outfile: destino('css/main.css') }),
  ...IMAGENS_USADAS.map((nome) => cp(origem('imagens', nome), destino('imagens', nome))),
]);

const [vCss, vJs, vTema] = await Promise.all([
  versao(destino('css/main.css')),
  versao(destino('js/main.js')),
  versao(destino('js/tema-inicial.js')),
]);

let html = await readFile(origem('html/index.html'), 'utf8');
html = html
  // Em produção o index.html fica na raiz, ao lado de css/, js/ e imagens/.
  .replaceAll('../css/main.css', `css/main.css?v=${vCss}`)
  .replaceAll('../js/main.js', `js/main.js?v=${vJs}`)
  .replaceAll('../js/tema-inicial.js', `js/tema-inicial.js?v=${vTema}`)
  .replaceAll('../imagens/', 'imagens/')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/^\s+/gm, '')
  .replace(/\n{2,}/g, '\n');

if (html.includes('../')) {
  throw new Error('Sobrou um caminho relativo "../" no index.html de produção.');
}
await writeFile(destino('index.html'), html);

const antes = {
  js: await tamanhoDaPasta(origem('js'), '.js'),
  css: await tamanhoDaPasta(origem('css'), '.css'),
  html: (await stat(origem('html/index.html'))).size,
};
const depois = {
  js: await tamanhoDaPasta(destino('js'), '.js'),
  css: await tamanhoDaPasta(destino('css'), '.css'),
  html: (await stat(destino('index.html'))).size,
};

console.log('Build concluído em dist/\n');
for (const tipo of ['js', 'css', 'html']) {
  const reducao = Math.round((1 - depois[tipo] / antes[tipo]) * 100);
  console.log(`  ${tipo.toUpperCase().padEnd(5)} ${kb(antes[tipo]).padStart(9)} -> ${kb(depois[tipo]).padStart(9)}  (-${reducao}%)`);
}
