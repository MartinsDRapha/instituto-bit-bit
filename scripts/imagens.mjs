// Gera as versões otimizadas das fotos a partir de imagens/originais/:
// cada foto sai em WebP, em mais de uma largura (para o navegador escolher
// a adequada à tela), e em um JPEG de reserva.
// Rode quando adicionar ou trocar uma foto: npm run imagens

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ORIGINAIS = path.join(RAIZ, 'imagens', 'originais');
const SAIDA = path.join(RAIZ, 'imagens');

// Fotos dos cards: recortadas em 16:9. O banner mantém a proporção original.
const PERFIS = {
  projeto: { larguras: [400, 800], proporcao: 16 / 9, reserva: 800 },
  hero: { larguras: [768, 1280, 1920], proporcao: null, reserva: 1280 },
};

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

function redimensionar(arquivo, largura, proporcao) {
  const opcoes = proporcao
    ? { width: largura, height: Math.round(largura / proporcao), fit: 'cover', position: 'attention' }
    : { width: largura };
  return sharp(arquivo).resize(opcoes);
}

for (const nome of (await readdir(ORIGINAIS)).filter((arquivo) => arquivo.endsWith('.jpg'))) {
  const base = nome.replace(/\.jpg$/, '');
  const perfil = base.startsWith('hero') ? PERFIS.hero : PERFIS.projeto;
  const origem = path.join(ORIGINAIS, nome);
  const gerados = [];

  for (const largura of perfil.larguras) {
    const destino = path.join(SAIDA, `${base}-${largura}.webp`);
    await redimensionar(origem, largura, perfil.proporcao).webp({ quality: 72 }).toFile(destino);
    gerados.push(`${largura}w ${kb((await stat(destino)).size)}`);
  }

  const reserva = path.join(SAIDA, `${base}.jpg`);
  await redimensionar(origem, perfil.reserva, perfil.proporcao).jpeg({ quality: 72, mozjpeg: true }).toFile(reserva);
  gerados.push(`jpg ${kb((await stat(reserva)).size)}`);

  console.log(`${base.padEnd(26)} ${kb((await stat(origem)).size).padStart(9)} -> ${gerados.join(' | ')}`);
}
