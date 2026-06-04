// SYNTAX TEST "source.moonbit" "handwritten imports and package paths"
import "ffi"
// <- keyword.control.import.moonbit
//     ^^^^^ string.quoted.double.moonbit

using @moonbitlang/core/array(make)
// <- keyword.control.import.moonbit
//    ^ entity.name.namespace.moonbit

fn use_imports {
// ^^^^^^^^^^^ entity.name.function.moonbit
  let values = @moonbitlang/core/array.make(3, 0)
  values.length() |> ignore()
}
