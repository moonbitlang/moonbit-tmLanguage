// SYNTAX TEST "source.moonbit" "compiler keywords"

///|
extend Int with Show::{to_string}
//<----- keyword.moonbit

///|
enumview Example { Zero; Other } for Int with as_example(x) {
//<------- keyword.moonbit
  if x == 0 { Zero } else { Other }
}

///|
fn check_keywords() -> Unit {
  var count = 0
//^^^ keyword.moonbit
  proof_assert count == 0
//^^^^^^^^^^^^ keyword.control.moonbit
  proof_let previous = count
//^^^^^^^^^ keyword.moonbit
  let except = 1
//    ^^^^^^ variable.other.moonbit - keyword
  let recur = 2
//    ^^^^^ variable.other.moonbit - keyword
  ignore((previous, except, recur))
}
