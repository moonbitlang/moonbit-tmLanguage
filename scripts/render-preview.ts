import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, relative, resolve } from 'node:path';
import oniguruma from 'vscode-oniguruma';
import vsctm from 'vscode-textmate';

const [sourceArg, outArg] = process.argv.slice(2);
const fixtureRoot = resolve('tests/fixtures');
const grammarPaths = new Map([
  ['source.moonbit', resolve('grammars/moonbit.tmLanguage.json')],
  ['source.moonbit.config', resolve('grammars/moonbit-config.tmLanguage.json')],
]);
const wasmPath = resolve('node_modules/vscode-oniguruma/release/onig.wasm');

const wasm = await readFile(wasmPath);
await oniguruma.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength));

const registry = new vsctm.Registry({
  onigLib: Promise.resolve({
    createOnigScanner: patterns => new oniguruma.OnigScanner(patterns),
    createOnigString: value => new oniguruma.OnigString(value),
  }),
  loadGrammar: async scopeName => {
    const grammarPath = grammarPaths.get(scopeName);
    if (!grammarPath) return null;
    return vsctm.parseRawGrammar(await readFile(grammarPath, 'utf8'), grammarPath);
  },
});

function scopeForSource(path: string): string {
  return path.endsWith('.mbt') || path.endsWith('.mbtp') ? 'source.moonbit' : 'source.moonbit.config';
}

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const lightModern = {
  editorBackground: '#FFFFFF',
  editorForeground: '#3B3B3B',
  lineNumberForeground: '#6E7681',
};

const lightModernTokenColors = [
  // Light+ token overrides, inherited by Light Modern.
  { scope: 'entity.name.function', color: '#795E26' },
  { scope: 'support.function', color: '#795E26' },
  { scope: 'support.class', color: '#267F99' },
  { scope: 'support.type', color: '#267F99' },
  { scope: 'entity.name.type', color: '#267F99' },
  { scope: 'entity.name.namespace', color: '#267F99' },
  { scope: 'entity.name.class', color: '#267F99' },
  { scope: 'entity.other.inherited-class', color: '#267F99' },
  { scope: 'keyword.control', color: '#AF00DB' },
  { scope: 'keyword.other.using', color: '#AF00DB' },
  { scope: 'keyword.other.directive.using', color: '#AF00DB' },
  { scope: 'keyword.other.operator', color: '#AF00DB' },
  { scope: 'entity.name.operator', color: '#AF00DB' },
  { scope: 'variable.other.constant', color: '#0070C1' },
  { scope: 'variable.other.enummember', color: '#0070C1' },
  { scope: 'variable.language', color: '#0000FF' },
  { scope: 'variable', color: '#001080' },
  { scope: 'meta.definition.variable.name', color: '#001080' },
  { scope: 'support.variable', color: '#001080' },
  { scope: 'entity.name.variable', color: '#001080' },
  { scope: 'support.constant.property-value', color: '#0451A5' },
  { scope: 'support.constant.font-name', color: '#0451A5' },
  { scope: 'support.constant.media-type', color: '#0451A5' },
  { scope: 'support.constant.media', color: '#0451A5' },
  { scope: 'constant.other.color.rgb-value', color: '#0451A5' },
  { scope: 'constant.other.rgb-value', color: '#0451A5' },
  { scope: 'support.constant.color', color: '#0451A5' },
  { scope: 'constant.character.character-class.regexp', color: '#811F3F' },
  { scope: 'constant.other.character-class.set.regexp', color: '#811F3F' },
  { scope: 'constant.other.character-class.regexp', color: '#811F3F' },
  { scope: 'constant.character.set.regexp', color: '#811F3F' },
  { scope: 'keyword.operator.quantifier.regexp', color: '#000000' },
  { scope: 'keyword.operator.or.regexp', color: '#EE0000' },
  { scope: 'keyword.control.anchor.regexp', color: '#EE0000' },
  { scope: 'constant.character.escape', color: '#EE0000' },
  // Light (Visual Studio) base token colors inherited through Light+.
  { scope: 'comment', color: '#008000' },
  { scope: 'constant.language', color: '#0000FF' },
  { scope: 'constant.numeric', color: '#098658' },
  { scope: 'keyword.operator.plus.exponent', color: '#098658' },
  { scope: 'keyword.operator.minus.exponent', color: '#098658' },
  { scope: 'constant.regexp', color: '#811F3F' },
  { scope: 'entity.name.tag', color: '#800000' },
  { scope: 'entity.name.selector', color: '#800000' },
  { scope: 'entity.other.attribute-name', color: '#E50000' },
  { scope: 'constant.character', color: '#0000FF' },
  { scope: 'meta.preprocessor', color: '#0000FF' },
  { scope: 'entity.name.function.preprocessor', color: '#0000FF' },
  { scope: 'meta.preprocessor.string', color: '#A31515' },
  { scope: 'meta.preprocessor.numeric', color: '#098658' },
  { scope: 'storage', color: '#0000FF' },
  { scope: 'storage.type', color: '#0000FF' },
  { scope: 'storage.modifier', color: '#0000FF' },
  { scope: 'string.regexp', color: '#811F3F' },
  { scope: 'string', color: '#A31515' },
  { scope: 'keyword.operator.expression', color: '#0000FF' },
  { scope: 'keyword.operator.cast', color: '#0000FF' },
  { scope: 'keyword.operator.instanceof', color: '#0000FF' },
  { scope: 'keyword.operator.wordlike', color: '#0000FF' },
  { scope: 'keyword.operator', color: '#000000' },
  { scope: 'keyword', color: '#0000FF' },
] as const;

function scopeMatches(scopes: string[], selector: string): boolean {
  return scopes.some(scope => scope === selector || scope.startsWith(`${selector}.`));
}

function colorFor(scopes: string[]): string {
  return lightModernTokenColors.find(rule => scopeMatches(scopes, rule.scope))?.color
    ?? lightModern.editorForeground;
}

function isMoonBitFile(path: string): boolean {
  return path.endsWith('.mbt')
    || path.endsWith('.mbtp')
    || path.endsWith('/moon.pkg')
    || path.endsWith('/moon.mod');
}

async function collectMoonBitFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMoonBitFiles(fullPath));
    } else if (isMoonBitFile(fullPath)) {
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
    const relativePath = relative(fixtureRoot, sourcePath);
    const fixtureRelativePath = relativePath.endsWith('.mbt') || relativePath.endsWith('.mbtp')
      ? relativePath.replace(/\.mbtp?$/, '.svg')
      : `${relativePath}.svg`;
    return resolve('artifacts/previews', fixtureRelativePath);
  }

  const previewName = sourcePath.endsWith('.mbt') || sourcePath.endsWith('.mbtp')
    ? `${basename(sourcePath).replace(/\.mbtp?$/, '')}-preview.svg`
    : `${basename(sourcePath)}-preview.svg`;
  return resolve('artifacts', previewName);
}

async function renderFile(sourcePath: string, svgPath: string): Promise<void> {
  const scopeName = scopeForSource(sourcePath);
  const grammar = await registry.loadGrammar(scopeName);
  if (!grammar) throw new Error(`Unable to load ${scopeName} grammar.`);

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
    rows.push(`<text x="${padX}" y="${y}" fill="${lightModern.lineNumberForeground}" font-size="${fontSize}">${String(lineIndex + 1).padStart(2, ' ')}</text>`);

    for (const token of result.tokens) {
      const text = line.slice(token.startIndex, token.endIndex);
      if (text.length === 0) continue;

      const x = padX + gutterWidth + token.startIndex * charWidth;
      rows.push(`<text x="${x.toFixed(1)}" y="${y}" fill="${colorFor(token.scopes)}" font-size="${fontSize}">${escapeXml(text)}</text>`);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" rx="8" fill="${lightModern.editorBackground}"/>
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
