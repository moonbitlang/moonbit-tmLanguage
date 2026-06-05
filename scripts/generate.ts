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
  patterns?: TmPattern[];
};

type TmGrammar = {
  fileTypes?: string[];
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

function removePatternsByInclude(patterns: TmPattern[], includes: Set<string>): void {
  for (let index = patterns.length - 1; index >= 0; index--) {
    const include = patterns[index].include;
    if (include && includes.has(include)) {
      patterns.splice(index, 1);
    }
  }
}

function removeInvalidDeclarationDestructures(tmLanguage: TmGrammar): void {
  const validDestructureRules = new Set(['let-destructure', 'const-destructure']);
  const invalidDestructureRules = Object.keys(tmLanguage.repository)
    .filter(key => key.endsWith('-destructure') && !validDestructureRules.has(key));
  const invalidIncludes = new Set(invalidDestructureRules.map(key => `#${key}`));

  removePatternsByInclude(tmLanguage.patterns, invalidIncludes);
  for (const key of invalidDestructureRules) {
    delete tmLanguage.repository[key];
  }
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
  const stringDouble = tmLanguage.repository['string-double'];
  if (stringDouble?.patterns) {
    stringDouble.patterns.unshift(interpolationPattern);
  }

  tmLanguage.repository['multilineinterp'] = {
    name: 'string.quoted.other.multiline.interpolated.moonbit',
    begin: String.raw`\$\|`,
    beginCaptures: {
      '0': { name: 'punctuation.definition.string.begin.moonbit' },
    },
    end: '$',
    patterns: [moonBitInterpolationPattern()],
  };
}

function addMoonBitTextMateOverlays(tmLanguage: TmGrammar): TmGrammar {
  tmLanguage.fileTypes = ['mbt', 'mbtx', 'mbtp'];
  removeInvalidDeclarationDestructures(tmLanguage);
  addMoonBitStringInterpolation(tmLanguage);

  // Monogram's generic TextMate inference is intentionally language-agnostic.
  // MoonBit's conventional UpperCamelCase type names benefit from a small
  // deterministic overlay, replacing the old handwritten type-name pattern while
  // keeping grammars/moonbit.tmLanguage.json generated.
  tmLanguage.repository['moonbit-typealias-declaration'] = {
    match: '\\b(typealias)\\b\\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\\s+(as)\\s+([a-zA-Z_][a-zA-Z0-9_]*))?',
    captures: {
      '1': { name: 'storage.type.moonbit' },
      '2': { name: 'entity.name.type.moonbit' },
      '3': { name: 'keyword.operator.expression.as.moonbit' },
      '4': { name: 'entity.name.type.moonbit' },
    },
  };

  tmLanguage.repository['moonbit-traitalias-declaration'] = {
    match: '\\b(traitalias)\\b\\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\\s*(=)\\s*([a-zA-Z_][a-zA-Z0-9_]*))?',
    captures: {
      '1': { name: 'storage.type.moonbit' },
      '2': { name: 'entity.name.type.moonbit' },
      '3': { name: 'keyword.operator.assignment.moonbit' },
      '4': { name: 'entity.name.type.moonbit' },
    },
  };

  tmLanguage.repository['moonbit-type-declaration'] = {
    match: '\\b(type|struct|enum|extenum|suberror|trait)\\b\\s*(!)?\\s+([a-zA-Z_][a-zA-Z0-9_]*)',
    captures: {
      '1': { name: 'storage.type.moonbit' },
      '2': { name: 'keyword.operator.moonbit' },
      '3': { name: 'entity.name.type.moonbit' },
    },
  };

  tmLanguage.repository['moonbit-qualified-type'] = {
    match: '(@[a-zA-Z_][a-zA-Z0-9_]*(?:/[a-zA-Z_][a-zA-Z0-9_]*)*)(\\.)([A-Z][A-Za-z0-9_]*\\?*)',
    captures: {
      '1': { name: 'entity.name.namespace.moonbit' },
      '2': { name: 'punctuation.accessor.moonbit' },
      '3': { name: 'entity.name.type.moonbit' },
    },
  };

  tmLanguage.repository['moonbit-type-name'] = {
    match: '\\b(?<!@)([A-Z][A-Za-z0-9_]*\\?*)',
    captures: {
      '1': { name: 'entity.name.type.moonbit' },
    },
  };

  // VS Code themes commonly color variable.other.property, while
  // entity.other.property is mostly used for markup attributes.
  tmLanguage.repository['property-access']!.captures!['2'] = {
    name: 'variable.other.property.moonbit',
  };

  if (tmLanguage.repository['optional-property-access']?.captures) {
    tmLanguage.repository['optional-property-access'].captures['2'] = {
      name: 'variable.other.property.moonbit',
    };
  }

  tmLanguage.repository['moonbit-impl-header'] = {
    name: 'meta.impl.header.moonbit',
    begin: '\\b(impl)\\b',
    beginCaptures: {
      '1': { name: 'storage.type.moonbit' },
    },
    end: '(?=\\bwith\\b|[;{]|$)',
    patterns: [
      { match: '\\b(for)\\b', name: 'keyword.other.impl.moonbit' },
      { include: '#moonbit-qualified-type' },
      { include: '#moonbit-type-name' },
      { include: '#scope-support-type-primitive' },
      { include: '#scope-support-class' },
      { include: '#scope-punctuation-separator-colon' },
      { include: '#scope-punctuation-separator-comma' },
      { include: '#scope-punctuation-bracket-square' },
      { include: '#scope-punctuation-accessor' },
    ],
  };

  insertPatternsBefore(tmLanguage.patterns, '#scope-storage-type', [
    { include: '#moonbit-impl-header' },
    { include: '#moonbit-typealias-declaration' },
    { include: '#moonbit-traitalias-declaration' },
    { include: '#moonbit-type-declaration' },
    { include: '#moonbit-qualified-type' },
    { include: '#moonbit-type-name' },
  ]);

  return tmLanguage;
}

function addMoonBitConfigTextMateOverlays(tmLanguage: TmGrammar): TmGrammar {
  tmLanguage.fileTypes = ['moon.pkg', 'moon.mod'];

  tmLanguage.repository['moonbit-config-property-name'] = {
    match: '((?:^|[,{(])\\s*)([A-Za-z_][A-Za-z0-9_]*|"(?:[^"\\\\\\n]|\\\\.)*")(\\s*)([:=])',
    captures: {
      '2': { name: 'support.type.property-name.moonbit.config' },
      '4': { name: 'keyword.operator.assignment.moonbit.config' },
    },
  };

  tmLanguage.repository['moonbit-config-module-header'] = {
    match: '\\b(module|package)\\b\\s+((?:[A-Za-z_][A-Za-z0-9_]*)(?:/[A-Za-z_][A-Za-z0-9_]*)*|"(?:[^"\\\\\\n]|\\\\.)*")',
    captures: {
      '1': { name: 'storage.type.moonbit.config' },
      '2': { name: 'entity.name.namespace.moonbit.config' },
    },
  };

  tmLanguage.repository['moonbit-config-alias-as'] = {
    match: '\\b(as)\\b(?=\\s*@)',
    captures: {
      '1': { name: 'keyword.operator.expression.moonbit.config' },
    },
  };

  insertPatternsBefore(tmLanguage.patterns, '#configstring-double', [
    { include: '#moonbit-config-property-name' },
    { include: '#moonbit-config-module-header' },
  ]);
  insertPatternsBefore(tmLanguage.patterns, '#scope-keyword-operator-expression-as', [
    { include: '#moonbit-config-alias-as' },
  ]);

  return tmLanguage;
}

const grammars = [
  {
    outPath: resolve('grammars/moonbit.tmLanguage.json'),
    generated: JSON.stringify(
      addMoonBitTextMateOverlays(generateTmLanguage(sourceGrammar, sourceGrammar.name) as TmGrammar),
      null,
      2,
    ) + '\n',
  },
  {
    outPath: resolve('grammars/moonbit-config.tmLanguage.json'),
    generated: JSON.stringify(
      addMoonBitConfigTextMateOverlays(generateTmLanguage(configGrammar, configGrammar.name) as TmGrammar),
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
