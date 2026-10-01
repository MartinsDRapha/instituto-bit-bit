// Servidor estático mínimo para desenvolvimento e para conferir o build.
// Uso: node scripts/servidor.mjs <pasta> <porta>

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const pasta = path.resolve(process.argv[2] ?? '.');
const porta = Number(process.argv[3] ?? 5500);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

createServer(async (requisicao, resposta) => {
  const caminho = decodeURIComponent(new URL(requisicao.url, 'http://localhost').pathname);
  let arquivo = path.join(pasta, caminho);

  // Impede o acesso a arquivos fora da pasta servida.
  if (arquivo !== pasta && !arquivo.startsWith(pasta + path.sep)) {
    resposta.writeHead(403).end('Acesso negado');
    return;
  }

  try {
    if ((await stat(arquivo)).isDirectory()) arquivo = path.join(arquivo, 'index.html');
    const conteudo = await readFile(arquivo);
    resposta.writeHead(200, {
      'Content-Type': TIPOS[path.extname(arquivo)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    resposta.end(conteudo);
  } catch {
    resposta.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
  }
}).listen(porta, () => {
  console.log(`Servindo ${pasta} em http://localhost:${porta}`);
});
