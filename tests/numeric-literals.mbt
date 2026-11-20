// SYNTAX TEST "source.moonbit" "numeric literals and tuple indices"

fn numeric_literals() -> Unit {
  0b1010_0011U |> ignore()
//^^^^^^^^^^^^ constant.numeric.moonbit
  0o7_1UL |> ignore()
//^^^^^^^ constant.numeric.moonbit
  1.25F |> ignore()
//^^^^^ constant.numeric.moonbit
  0x1.ffp-2F |> ignore()
//^^^^^^^^^^ constant.numeric.moonbit
  let tuple = (0, (1, 2))
  tuple.1.0 |> ignore()
//      ^ constant.numeric.moonbit
//       ^ - constant.numeric.moonbit
//        ^ constant.numeric.moonbit
}
