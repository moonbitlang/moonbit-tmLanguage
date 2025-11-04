// SYNTAX TEST "source.moonbit" "not"

fn a() -> Unit raise {
  fail("error")
}

fn b() -> Unit noraise {
  ignore(try? a())
//       ^^^^ keyword.control.moonbit
  try! a()
//^^^^ keyword.control.moonbit
}

fn main {
  if !true {
//   ^ keyword.operator.logical.moonbit
  }
  if !!true {
//   ^ keyword.operator.logical.moonbit
//    ^ keyword.operator.logical.moonbit
  }
  b()
}
