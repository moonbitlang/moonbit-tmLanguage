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
fn except() -> Unit {
// ^^^^^^ entity.name.function.moonbit
}

///|
fn main {
  foo()
  // <--- entity.name.function.moonbit
  bar ()
  // <--- entity.name.function.moonbit
  except()
// <~~------ entity.name.function.moonbit
  let except = 1
//    ^^^^^^ variable.other.moonbit
}
