// SYNTAX TEST "source.moonbit" "moonbitlang/core cmp reverse excerpt"
// Source: moonbitlang/core cmp/cmp.mbt
///|
/// A newtype wrapper that reverses the comparison order of the wrapped value.
///
/// `Reverse[T]` is useful when you need to reverse the natural ordering of a type.
#warnings("-deprecated_syntax")
// <- entity.name.function.decorator.moonbit
//        ^ punctuation.definition.string.begin.moonbit
//         ^^^^^^^^^^^^^^^^^^ string.quoted.double.moonbit
//                           ^ punctuation.definition.string.end.moonbit
pub(all) struct Reverse[T](T) derive(Eq, Show, Hash, @debug.Debug)
// <- storage.modifier.moonbit
//       ^^^^^^ storage.type.moonbit

///|
pub impl[T : Compare] Compare for Reverse[T] with fn compare(a, b) {
// <- storage.modifier.moonbit
//  ^^^^ storage.type.moonbit
  -a.0.compare(b.0)
}

///|
pub fn[T, K : Compare] maximum_by_key(x : T, y : T, f : (T) -> K) -> T {
// <- storage.modifier.moonbit
//  ^^ storage.type.function.moonbit
  if f(x) > f(y) {
    x
  } else {
    y
  }
}
