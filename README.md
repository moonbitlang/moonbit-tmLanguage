# MoonBit TmLanguage Grammar

The TmLanguage grammar definition for the [MoonBit](https://www.moonbitlang.com) programming language.

## Development

`grammars/moonbit.tmLanguage.json` is generated from `src/moonbit.monogram.ts` with
[Monogram](https://github.com/johnsoncodehk/monogram), vendored as the
`vendor/monogram` submodule.

```sh
git submodule update --init --recursive
npm install
npm run generate
npm test
```

To render SVG previews of the generated highlighting for every fixture:

```sh
npm run preview:highlight
```

The preview script writes SVGs under `artifacts/previews`. To render one file:

```sh
npm run preview:highlight -- tests/fixtures/async.mbt artifacts/async-preview
```
