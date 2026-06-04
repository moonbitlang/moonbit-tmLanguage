import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { generateTmLanguage } from '../vendor/monogram/src/gen-tm.ts';
import grammar from '../src/moonbit.monogram.ts';

const outPath = resolve('grammars/moonbit.tmLanguage.json');
const generated = JSON.stringify(generateTmLanguage(grammar, grammar.name), null, 2) + '\n';
const check = process.argv.includes('--check');

if (check) {
  const current = await readFile(outPath, 'utf8');
  if (current !== generated) {
    console.error(`${outPath} is out of date. Run npm run generate.`);
    process.exit(1);
  }
  console.log(`${outPath} is up to date.`);
} else {
  await writeFile(outPath, generated);
  console.log(`Generated ${outPath}.`);
}
