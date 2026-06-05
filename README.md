# MoonBit TmLanguage Grammar

The TmLanguage grammar definition for the [MoonBit](https://www.moonbitlang.com) programming language.

## Development

`grammars/moonbit.tmLanguage.json` is generated from `src/moonbit.monogram.ts`,
and `grammars/moonbit-config.tmLanguage.json` is generated from
`src/moonbit-config.monogram.ts`, with
[Monogram](https://github.com/johnsoncodehk/monogram), vendored as the
`vendor/monogram` submodule. The config grammar covers extensionless `moon.pkg`
and `moon.mod` files.

```sh
git submodule update --init --recursive
npm install
npm run generate
npm test
```

To render SVG previews of the generated highlighting for every `.mbt`,
`moon.pkg`, and `moon.mod` fixture:

```sh
npm run preview:highlight
```

The preview script writes SVGs under `artifacts/previews`. To render one file:

```sh
npm run preview:highlight -- tests/fixtures/async.mbt artifacts/async-preview
```
