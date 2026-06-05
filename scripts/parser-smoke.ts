import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createParser } from '../vendor/monogram/src/gen-parser.ts';
import configGrammar from '../src/moonbit-config.monogram.ts';
import sourceGrammar from '../src/moonbit.monogram.ts';

const sourceParser = createParser(sourceGrammar);
const configParser = createParser(configGrammar);
const fixtureRoot = resolve('tests/fixtures');
const ignoredDirs = new Set(['.git', '_build', 'node_modules', 'target']);

function isMoonBitFile(path: string): boolean {
  return path.endsWith('.mbt')
    || path.endsWith('.mbtp')
    || path.endsWith('/moon.pkg')
    || path.endsWith('/moon.mod');
}

function fileKind(path: string): number {
  // Keep the default official-root limit focused on extensionless config files.
  return path.endsWith('/moon.pkg') || path.endsWith('/moon.mod') ? 0 : 1;
}

function parserFor(path: string): typeof sourceParser {
  return path.endsWith('.mbt') || path.endsWith('.mbtp') ? sourceParser : configParser;
}

async function collectMoonBitFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || ignoredDirs.has(entry.name)) continue;
      files.push(...await collectMoonBitFiles(full));
    }
    else if (isMoonBitFile(full)) files.push(full);
  }
  return files.sort((a, b) => fileKind(a) - fileKind(b) || a.localeCompare(b));
}

async function parseFiles(files: string[], label: string): Promise<number> {
  let failed = 0;
  for (const file of files) {
    const code = await readFile(file, 'utf8');
    try {
      parserFor(file).parse(code);
    } catch (error) {
      failed++;
      console.error(`FAIL ${label}: ${file}`);
      console.error(`  ${(error as Error).message}`);
    }
  }
  return failed;
}

const fixtureFiles = await collectMoonBitFiles(fixtureRoot);
let failed = await parseFiles(fixtureFiles, 'fixture');
console.log(`${fixtureFiles.length - failed}/${fixtureFiles.length} checked-in fixtures parsed.`);

const officialRoot = process.env.MOONBIT_OFFICIAL_ROOT;
if (officialRoot) {
  const root = resolve(officialRoot);
  const all = await collectMoonBitFiles(root);
  const limit = Number(process.env.MOONBIT_OFFICIAL_LIMIT ?? '200');
  const officialFiles = all.slice(0, Number.isFinite(limit) && limit > 0 ? limit : all.length);
  const officialFailed = await parseFiles(officialFiles, 'official');
  failed += officialFailed;
  console.log(`${officialFiles.length - officialFailed}/${officialFiles.length} official smoke files parsed from ${root}.`);
}

if (failed > 0) process.exit(1);
