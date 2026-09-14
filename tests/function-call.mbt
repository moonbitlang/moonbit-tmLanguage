// SYNTAX TEST "source.moonbit" "function call"
///|
fn foo() -> Unit {
// ^^^ entity.name.function.moonbit
}

///|
fn bar () -> Unit {
// ^^^ entity.name.function.moonbit
}

///|
fn main {
  foo()
  // <--- entity.name.function.moonbit
  bar ()
  // <--- entity.name.function.moonbit
}
