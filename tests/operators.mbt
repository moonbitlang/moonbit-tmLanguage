// SYNTAX TEST "source.moonbit" "multi-character operators and iterator delimiters"

fn operators() -> Unit {
  let mut i = 0
  i += 1
//  ^^ keyword.operator.assignment.moonbit - keyword.operator.math
  (i == 1) |> ignore()
//   ^^ keyword.operator.comparison.moonbit - keyword.operator.assignment
  ("yes" =~ re"yes") |> ignore()
//       ^^ keyword.operator.other.moonbit - keyword.operator.assignment
  for count in 1..<5 { ignore(count) }
//             ^ constant.numeric.moonbit
//              ^^^ keyword.operator.range.moonbit - keyword.operator.comparison
  for count in 10>=..0 { ignore(count) }
//               ^^^^ keyword.operator.range.moonbit - keyword.operator.comparison
  [|1, 2|] |> ignore()
//^^ punctuation.brackets.iterator.moonbit - keyword.operator.bitwise
//      ^^ punctuation.brackets.iterator.moonbit - keyword.operator.bitwise
  [|for n in [1, 2] => n|] |> ignore()
//                  ^^ storage.type.function.arrow.moonbit
  (1 | 2) |> ignore()
//   ^ keyword.operator.bitwise.moonbit
}
