// SYNTAX TEST "source.moonbit" "list spread and list pattern preview"
test {
// <---- storage.type.moonbit
  let xs = []
// <~~--- storage.type.moonbit
  match xs {
// <~~----- keyword.control.conditional.moonbit
    [] => ()
// <~~~~~~~-- storage.type.function.arrow.moonbit
    [x, .. xs] => ()
// <~~~~~~~~-- keyword.operator.range.moonbit
// <~~~~~~~~~~~~~~~-- storage.type.function.arrow.moonbit
  }
  let ys = [..xs]
// <~~--- storage.type.moonbit
// <~~~~~~~~~~~~-- keyword.operator.range.moonbit
}
