// SYNTAX TEST "source.moonbit" "handwritten aliases and externs"
#deprecated("use now")
// <- entity.name.function.decorator.moonbit
// <~~~~~~~~~~~~- string.quoted.double.moonbit
extern "js" fn runtime_now() -> Double = "Date.now"
// <- storage.modifier.moonbit

typealias Array as ArrayAlias
// <- storage.type.moonbit

traitalias Hashable = Hash

fnalias runtime_now as now
// <- storage.type.moonbit
