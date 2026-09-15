# MoonBit TmLanguage Grammar

The TmLanguage grammar definition for the [MoonBit](https://www.moonbitlang.com) programming language.

## Test and preview

```sh
npm ci
npm test
npm run preview
```

Open `preview.html` in a browser to inspect all `tests/**/*.mbt` samples side by
side in GitHub light and dark themes. The page is self-contained and works
offline. It preserves scope assertion comments so the expected scopes can be
compared with the highlighting.

The preview uses [Shiki](https://shiki.style/guide/load-lang) with this repository's
`grammars/moonbit.tmLanguage.json`, rather than Shiki's bundled MoonBit grammar.
It is a visual aid, not an exact reproduction of GitHub's production renderer
or a replacement for the automated scope assertions in `npm test`.

Refresh `preview.html` with `npm run preview` before committing grammar or sample
changes. CI also generates the page and uploads it as the
`moonbit-grammar-preview` artifact on the workflow run.
