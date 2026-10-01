// Gera a versão de produção em dist/:
//   - JavaScript: módulos reunidos em um único arquivo e minificados
//   - CSS: @imports reunidos em um único arquivo e minificado
//   - HTML: index.html na raiz, minificado, com caminhos ajustados e versão
//     nos arquivos
//   - Imagens: apenas as usadas; PNG recomprimido e convertido para WebP
// Uso: npm run build

import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, stat, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const SAIDA = path.join(RAIZ, 'dist');
const IMAGENS_OTIMIZADAS = ['logo-simbolo.png'];
// As fotos já chegam otimizadas por `npm run imagens` e são apenas copiadas;
// a pasta imagens/originais/ fica de fora.
const IMAGENS_COPIADAS = (await readdir(path.join(RAIZ, 'imagens'), { withFileTypes: true }))
  .filter((item) => item.isFile() && !IMAGENS_OTIMIZADAS.includes(item.name))
  .map((item) => item.name);

const origem = (...partes) => path.join(RAIZ, ...partes);
const destino = (...partes) => path.join(SAIDA, ...partes);
const semExtensao = (nome) => nome.replace(/\.png$/, '');

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

// Cada PNG gera dois arquivos: a versão WebP, servida aos navegadores que a
// aceitam, e o PNG recomprimido, que fica como reserva.
async function otimizarImagem(nome) {
  const imagem = sharp(origem('imagens', nome));
  await Promise.all([
    imagem.clone().webp({ quality: 82 }).toFile(destino('imagens', `${semExtensao(nome)}.webp`)),
    imagem.clone().png({ compressionLevel: 9, palette: true }).toFile(destino('imagens', nome)),
  ]);
}

// Troca <img src="imagens/x.png"> por <picture> com a alternativa WebP.
function usarWebp(html) {
  return IMAGENS_OTIMIZADAS.reduce((texto, nome) => {
    const base = semExtensao(nome);
    const img = new RegExp(`<img[^>]*src="imagens/${base}\\.png"[^>]*>`, 'g');
    return texto.replace(
      img,
      (tag) => `<picture><source srcset="imagens/${base}.webp" type="image/webp">${tag}</picture>`
    );
  }, html);
}

// Remove comentários e colapsa os espaços em branco. É seguro aqui porque o
// index.html não tem <pre>, <textarea> preenchido nem scripts embutidos.
function minificarHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .trim();
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
  ...IMAGENS_COPIADAS.map((nome) => cp(origem('imagens', nome), destino('imagens', nome))),
  ...IMAGENS_OTIMIZADAS.map(otimizarImagem),
]);

const [vCss, vJs, vTema] = await Promise.all([
  versao(destino('css/main.css')),
  versao(destino('js/main.js')),
  versao(destino('js/tema-inicial.js')),
]);

const fonte = await readFile(origem('html/index.html'), 'utf8');
const html = minificarHtml(
  usarWebp(
    fonte
      // Em produção o index.html fica na raiz, ao lado de css/, js/ e imagens/.
      .replaceAll('../css/main.css', `css/main.css?v=${vCss}`)
      .replaceAll('../js/main.js', `js/main.js?v=${vJs}`)
      .replaceAll('../js/tema-inicial.js', `js/tema-inicial.js?v=${vTema}`)
      .replaceAll('../imagens/', 'imagens/')
  )
);

if (html.includes('../')) {
  throw new Error('Sobrou um caminho relativo "../" no index.html de produção.');
}
await writeFile(destino('index.html'), html);

const linha = (rotulo, de, para) => {
  const reducao = Math.round((1 - para / de) * 100);
  console.log(`  ${rotulo.padEnd(18)} ${kb(de).padStart(9)} -> ${kb(para).padStart(9)}  (-${reducao}%)`);
};

console.log('Build concluído em dist/\n');
linha('JS', await tamanhoDaPasta(origem('js'), '.js'), await tamanhoDaPasta(destino('js'), '.js'));
linha('CSS', await tamanhoDaPasta(origem('css'), '.css'), await tamanhoDaPasta(destino('css'), '.css'));
linha('HTML', (await stat(origem('html/index.html'))).size, (await stat(destino('index.html'))).size);
for (const nome of IMAGENS_OTIMIZADAS) {
  const original = (await stat(origem('imagens', nome))).size;
  linha(`${semExtensao(nome)}.webp`, original, (await stat(destino('imagens', `${semExtensao(nome)}.webp`))).size);
  linha(nome, original, (await stat(destino('imagens', nome))).size);
}
