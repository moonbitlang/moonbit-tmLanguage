// SYNTAX TEST "source.moonbit" "handwritten aliases and externs"
#deprecated("use now")
// <- entity.name.function.decorator.moonbit
//          ^ punctuation.definition.string.begin.moonbit
//           ^^^^^^^ string.quoted.double.moonbit
//                  ^ punctuation.definition.string.end.moonbit
extern "js" fn runtime_now() -> Double = "Date.now"
// <- storage.modifier.moonbit

typealias Array as ArrayAlias
// <- storage.type.moonbit

traitalias Hashable = Hash

fnalias runtime_now as now
// <- storage.type.moonbit
