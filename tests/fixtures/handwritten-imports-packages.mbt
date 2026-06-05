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
  let pkg_field = @pkg.filed
//                ^^^^ entity.name.namespace.moonbit
//                     ^^^^^ variable.other.property.moonbit
  let type_field = type.field
//                 ^^^^ storage.type.moonbit
//                      ^^^^^ variable.other.property.moonbit
}
