// SYNTAX TEST "source.moonbit" "moonbitlang/core unit default"
// Source: moonbitlang/core unit/unit.mbt
///|
/// same as `Unit::default`
#deprecated("Use `Unit::default` instead")
// <- entity.name.function.decorator.moonbit
//          ^ punctuation.definition.string.begin.moonbit
//           ^^^^^^^^^^^^^^^^^^^^^^^^^^^ string.quoted.double.moonbit
//                                      ^ punctuation.definition.string.end.moonbit
pub fn default() -> Unit {
// <- storage.modifier.moonbit
//  ^^ storage.type.function.moonbit
//     ^^^^^^^ entity.name.function.moonbit
  ()
}
