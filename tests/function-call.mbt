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
  ignore(not(false))
//       ^^^ entity.name.function.moonbit
  ignore(!false == true)
//       ^ keyword.operator.logical.moonbit
//              ^^ keyword.operator.comparison.moonbit
  ignore(1 != 2)
//         ^^ keyword.operator.comparison.moonbit
}
