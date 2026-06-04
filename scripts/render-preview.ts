import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, relative, resolve } from 'node:path';
import oniguruma from 'vscode-oniguruma';
import vsctm from 'vscode-textmate';

const [sourceArg, outArg] = process.argv.slice(2);
const fixtureRoot = resolve('tests/fixtures');
const grammarPath = resolve('grammars/moonbit.tmLanguage.json');
const wasmPath = resolve('node_modules/vscode-oniguruma/release/onig.wasm');

const wasm = await readFile(wasmPath);
await oniguruma.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength));

const registry = new vsctm.Registry({
  onigLib: Promise.resolve({
    createOnigScanner: patterns => new oniguruma.OnigScanner(patterns),
    createOnigString: value => new oniguruma.OnigString(value),
  }),
  loadGrammar: async scopeName => {
    if (scopeName !== 'source.moonbit') return null;
    return vsctm.parseRawGrammar(await readFile(grammarPath, 'utf8'), grammarPath);
  },
});

const grammar = await registry.loadGrammar('source.moonbit');
if (!grammar) throw new Error('Unable to load source.moonbit grammar.');

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function colorFor(scopes: string[]): string {
  const scope = scopes.join(' ');
  if (scope.includes('comment.')) return '#6A9955';
  if (scope.includes('string.regexp')) return '#D16969';
  if (scope.includes('string.')) return '#CE9178';
  if (scope.includes('constant.numeric')) return '#B5CEA8';
  if (scope.includes('constant.language.boolean')) return '#569CD6';
  if (scope.includes('constant.character')) return '#D7BA7D';
  if (scope.includes('keyword.control')) return '#C586C0';
  if (scope.includes('keyword.operator')) return '#D4D4D4';
  if (scope.includes('storage.modifier')) return '#569CD6';
  if (scope.includes('storage.type.function')) return '#569CD6';
  if (scope.includes('storage.type')) return '#4EC9B0';
  if (scope.includes('support.type.primitive')) return '#4EC9B0';
  if (scope.includes('support.class')) return '#4EC9B0';
  if (scope.includes('entity.name.function')) return '#DCDCAA';
  if (scope.includes('entity.name.namespace')) return '#4EC9B0';
  if (scope.includes('entity.name.function.decorator')) return '#DCDCAA';
  if (scope.includes('entity.other.property')) return '#9CDCFE';
  if (scope.includes('variable.')) return '#9CDCFE';
  return '#D4D4D4';
}

async function collectMoonBitFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMoonBitFiles(fullPath));
    } else if (entry.name.endsWith('.mbt')) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function withSvgExtension(path: string): string {
  return path.endsWith('.svg') ? path : `${path}.svg`;
}

function defaultSvgPathFor(sourcePath: string): string {
  if (sourcePath.startsWith(`${fixtureRoot}/`)) {
    const fixtureRelativePath = relative(fixtureRoot, sourcePath).replace(/\.mbt$/, '.svg');
    return resolve('artifacts/previews', fixtureRelativePath);
  }

  return resolve('artifacts', `${basename(sourcePath).replace(/\.mbt$/, '')}-preview.svg`);
}

async function renderFile(sourcePath: string, svgPath: string): Promise<void> {
  const source = (await readFile(sourcePath, 'utf8'))
    .split(/\r?\n/)
    .filter(line => !line.startsWith('// SYNTAX TEST') && !/^\/\/\s*(\^|<[~-]*-)/.test(line))
    .join('\n')
    .trimEnd();

  const lines = source.length > 0 ? source.split('\n') : [''];
  const fontSize = 15;
  const lineHeight = 22;
  const charWidth = 8.6;
  const padX = 26;
  const padY = 28;
  const gutterWidth = 34;
  const maxColumns = Math.max(...lines.map(line => line.length));
  const width = Math.ceil(padX * 2 + gutterWidth + maxColumns * charWidth);
  const height = padY * 2 + lines.length * lineHeight;
  const rows: string[] = [];
  let ruleStack = vsctm.INITIAL;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const result = grammar.tokenizeLine(line, ruleStack);
    ruleStack = result.ruleStack;

    const y = padY + lineIndex * lineHeight + fontSize;
    rows.push(`<text x="${padX}" y="${y}" fill="#858585" font-size="${fontSize}">${String(lineIndex + 1).padStart(2, ' ')}</text>`);

    for (const token of result.tokens) {
      const text = line.slice(token.startIndex, token.endIndex);
      if (text.length === 0) continue;

      const x = padX + gutterWidth + token.startIndex * charWidth;
      rows.push(`<text x="${x.toFixed(1)}" y="${y}" fill="${colorFor(token.scopes)}" font-size="${fontSize}">${escapeXml(text)}</text>`);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" rx="8" fill="#1e1e1e"/>
  <g font-family="SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace" xml:space="preserve">
    ${rows.join('\n    ')}
  </g>
</svg>
`;

  await mkdir(dirname(svgPath), { recursive: true });
  await writeFile(svgPath, svg);
  console.log(`Wrote ${svgPath}`);
}

if (sourceArg) {
  const sourcePath = resolve(sourceArg);
  await renderFile(sourcePath, withSvgExtension(resolve(outArg ?? defaultSvgPathFor(sourcePath))));
} else {
  const fixtureFiles = await collectMoonBitFiles(fixtureRoot);
  for (const fixtureFile of fixtureFiles) {
    await renderFile(fixtureFile, defaultSvgPathFor(fixtureFile));
  }
  console.log(`Rendered ${fixtureFiles.length} fixture previews.`);
}
