import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { generateTmLanguage } from '../vendor/monogram/src/gen-tm.ts';
import configGrammar from '../src/moonbit-config.monogram.ts';
import sourceGrammar from '../src/moonbit.monogram.ts';

type TmPattern = {
  include?: string;
  name?: string;
  match?: string;
  begin?: string;
  end?: string;
  captures?: Record<string, TmPattern>;
  beginCaptures?: Record<string, TmPattern>;
  endCaptures?: Record<string, TmPattern>;
  patterns?: TmPattern[];
};

type TmGrammar = {
  repository: Record<string, TmPattern>;
  patterns: TmPattern[];
};

function insertPatternsBefore(patterns: TmPattern[], beforeInclude: string, additions: TmPattern[]): void {
  const existing = new Set(patterns.map(pattern => pattern.include).filter(Boolean));
  const missing = additions.filter(pattern => !pattern.include || !existing.has(pattern.include));
  if (missing.length === 0) return;

  const index = patterns.findIndex(pattern => pattern.include === beforeInclude);
  patterns.splice(index === -1 ? patterns.length : index, 0, ...missing);
}

function moonBitInterpolationPattern(): TmPattern {
  return {
    name: 'meta.embedded.expression.moonbit',
    begin: String.raw`\\\{`,
    beginCaptures: {
      '0': { name: 'punctuation.definition.template-expression.begin.moonbit' },
    },
    end: String.raw`\}`,
    endCaptures: {
      '0': { name: 'punctuation.definition.template-expression.end.moonbit' },
    },
    patterns: [
      { include: '#moonbit-interpolation-braces' },
      { include: '$self' },
    ],
  };
}

function moonBitEscapePattern(): TmPattern {
  return {
    match: String.raw`\\(?:['"\\nrtbf/ ]|x[0-9a-fA-F]{2}|o[0-3][0-7]{2}|u[0-9a-fA-F]{4}|u\{[0-9a-fA-F]+\}|.)`,
    name: 'constant.character.escape.moonbit',
  };
}

function moonBitStringDelimiterScope(stringScope: string, edge: 'begin' | 'end'): TmPattern {
  return {
    name: `${stringScope}.moonbit punctuation.definition.string.${edge}.moonbit`,
  };
}

function addMoonBitStringInterpolation(tmLanguage: TmGrammar): void {
  tmLanguage.repository['moonbit-interpolation-braces'] = {
    begin: String.raw`\{`,
    beginCaptures: {
      '0': { name: 'punctuation.definition.block.moonbit' },
    },
    end: String.raw`\}`,
    endCaptures: {
      '0': { name: 'punctuation.definition.block.moonbit' },
    },
    patterns: [
      { include: '#moonbit-interpolation-braces' },
      { include: '$self' },
    ],
  };

  const interpolationPattern = moonBitInterpolationPattern();
  tmLanguage.repository['string-double'] = {
    begin: '"',
    beginCaptures: {
      '0': moonBitStringDelimiterScope('string.quoted.double', 'begin'),
    },
    end: '"|$',
    endCaptures: {
      '0': moonBitStringDelimiterScope('string.quoted.double', 'end'),
    },
    patterns: [
      interpolationPattern,
      moonBitEscapePattern(),
      { match: String.raw`[^"\\]+`, name: 'string.quoted.double.moonbit' },
    ],
  };

  tmLanguage.repository['regexliteral'] = {
    begin: String.raw`(re)(")`,
    beginCaptures: {
      '1': { name: 'string.regexp.moonbit' },
      '2': moonBitStringDelimiterScope('string.regexp', 'begin'),
    },
    end: '"|$',
    endCaptures: {
      '0': moonBitStringDelimiterScope('string.regexp', 'end'),
    },
    patterns: [
      interpolationPattern,
      moonBitEscapePattern(),
      { match: String.raw`(?:\\(?!\{)|[^"\\])+`, name: 'string.regexp.moonbit' },
    ],
  };

  tmLanguage.repository['multilineinterp'] = {
    begin: String.raw`\$\|`,
    beginCaptures: {
      '0': moonBitStringDelimiterScope('string.quoted.other.multiline.interpolated', 'begin'),
    },
    end: '$',
    patterns: [
      moonBitInterpolationPattern(),
      { match: String.raw`(?:\\(?!\{)|[^\\\n])+`, name: 'string.quoted.other.multiline.interpolated.moonbit' },
    ],
  };
}

function addMoonBitImplHeader(tmLanguage: TmGrammar): void {
  tmLanguage.repository['moonbit-impl-header'] = {
    name: 'meta.impl.header.moonbit',
    begin: String.raw`\b(impl)\b`,
    beginCaptures: {
      '1': { name: 'storage.type.moonbit' },
    },
    end: String.raw`(?=\bwith\b|[;{]|$)`,
    patterns: [
      { match: String.raw`\b(for)\b`, name: 'keyword.other.impl.moonbit' },
      { include: '#type-inner' },
      { include: '$self' },
    ],
  };

  insertPatternsBefore(tmLanguage.patterns, '#scope-storage-type', [
    { include: '#moonbit-impl-header' },
  ]);
}

function patchMoonBitTmLanguage(tmLanguage: TmGrammar): TmGrammar {
  addMoonBitStringInterpolation(tmLanguage);
  addMoonBitImplHeader(tmLanguage);
  return tmLanguage;
}

const grammars = [
  {
    outPath: resolve('grammars/moonbit.tmLanguage.json'),
    generated: JSON.stringify(
      patchMoonBitTmLanguage(generateTmLanguage(sourceGrammar, sourceGrammar.name)),
      null,
      2,
    ) + '\n',
  },
  {
    outPath: resolve('grammars/moonbit-config.tmLanguage.json'),
    generated: JSON.stringify(
      generateTmLanguage(configGrammar, configGrammar.name),
      null,
      2,
    ) + '\n',
  },
];
const check = process.argv.includes('--check');

let failed = false;
for (const { outPath, generated } of grammars) {
  if (check) {
    const current = await readFile(outPath, 'utf8');
    if (current !== generated) {
      console.error(`${outPath} is out of date. Run npm run generate.`);
      failed = true;
    } else {
      console.log(`${outPath} is up to date.`);
    }
  } else {
    await writeFile(outPath, generated);
    console.log(`Generated ${outPath}.`);
  }
}

if (failed) process.exit(1);
