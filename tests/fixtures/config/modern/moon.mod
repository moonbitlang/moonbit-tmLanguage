// SYNTAX TEST "source.moonbit.config" "modern moon.mod config"
name = "username/moon_config"
// <- support.type.property-name.moonbit.config
//     ^^^^^^^^^^^^^^^^^^^^^^ string.quoted.double.moonbit.config
version = "0.1.0"
readme = "README.md"
license = "Apache-2.0"
keywords = ["lsp", "config"]
// <- support.type.property-name.moonbit.config
warnings = "+test_unqualified_package"

options(
// <- support.function.moonbit.config
  "preferred-target": "wasm-gc",
//^^^^^^^^^^^^^^^^^^ support.type.property-name.moonbit.config
  deps: {
    "moonbitlang/x": {
      "version": "0.1.0",
    },
  },
  scripts: {
    "test": "moon test",
  },
)

rule(name: "mod-gen", command: "echo gen")
// <- support.function.moonbit.config
