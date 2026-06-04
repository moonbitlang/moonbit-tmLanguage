// SYNTAX TEST "source.moonbit" "moonbitlang/core argparse value range excerpt"
// Source: moonbitlang/core argparse/value_range.mbt
///|
/// Number-of-values constraint for an argument.
#warnings("-deprecated_syntax-deprecated")
// <- entity.name.function.decorator.moonbit
// <~~~~~~~~~~- string.quoted.double.moonbit
pub struct ValueRange {
// <- storage.modifier.moonbit
//  ^^^^^^ storage.type.moonbit
  priv lower : Int
  priv upper : Int?
} derive(Eq, Show, @debug.Debug)

///|
/// Create a value-count range.
pub fn ValueRange::ValueRange(lower? : Int = 0, upper? : Int) -> ValueRange {
// <- storage.modifier.moonbit
//  ^^ storage.type.function.moonbit
  { lower, upper }
}

///|
/// Exact single-value range (`1..1`).
pub fn ValueRange::single() -> ValueRange {
  ValueRange(lower=1, upper=1)
}
