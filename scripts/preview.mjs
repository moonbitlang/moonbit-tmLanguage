import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHighlighter } from 'shiki';

const root = new URL('../', import.meta.url);
const grammar = JSON.parse(await readFile(new URL('grammars/moonbit.tmLanguage.json', root), 'utf8'));
const themes = ['github-light', 'github-dark'];
const highlighter = await createHighlighter({ langs: [grammar], themes });

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

async function findSamples(directory) {
  const files = [];
  for (const entry of await readdir(new URL(directory, root), { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) files.push(...await findSamples(`${path}/`));
    else if (entry.isFile() && entry.name.endsWith('.mbt')) files.push(path);
  }
  return files.sort();
}

try {
  const files = await findSamples('tests/');
  if (files.length === 0) throw new Error('No tests/**/*.mbt samples found');
  const sections = [];
  for (const file of files) {
    const code = await readFile(new URL(file, root), 'utf8');
    const panels = themes.map(theme => `<div class="panel ${theme}">
      <h3>${theme}</h3>
      ${highlighter.codeToHtml(code, { lang: grammar.name, theme })}
    </div>`).join('\n');
    sections.push(`<section><h2>${escapeHtml(file)}</h2><div class="themes">${panels}</div></section>`);
  }

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MoonBit grammar preview</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px; background: #f6f8fa; color: #1f2328; font: 16px/1.5 system-ui, sans-serif; }
    main { max-width: 1800px; margin: auto; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    h2 { margin: 28px 0 12px; font-size: 18px; }
    h3 { margin: 0; padding: 12px 16px; border-bottom: 1px solid #8884; font-size: 14px; }
    p { margin: 8px 0; }
    .themes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .panel { min-width: 0; border: 1px solid #8884; border-radius: 8px; overflow: hidden; }
    .github-light { background: #fff; color: #24292e; }
    .github-dark { background: #24292e; color: #e1e4e8; }
    pre { margin: 0; padding: 16px; overflow-x: auto; font-size: 13px; line-height: 1.6; tab-size: 2; }
    code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
    @media (max-width: 900px) { body { padding: 16px; } .themes { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <h1>MoonBit grammar preview</h1>
    <p>Local <code>grammars/moonbit.tmLanguage.json</code> rendered with Shiki in GitHub light and dark themes.</p>
    <p>This is a visual preview, not GitHub's production renderer. Scope assertions remain visible for comparison.</p>
    ${sections.join('\n')}
  </main>
</body>
</html>
`;
  const output = new URL('preview.html', root);
  await writeFile(output, html);
  console.log(`Rendered ${files.length} samples in ${themes.length} themes: ${fileURLToPath(output)}`);
} finally {
  highlighter.dispose();
}
