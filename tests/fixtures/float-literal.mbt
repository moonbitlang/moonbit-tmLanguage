// SYNTAX TEST "source.moonbit" "numeric literals and tuple access"
fn main {
  1. |> ignore()
// <~~-- constant.numeric.double.moonbit
// <~~~~~-- keyword.operator.pipe.moonbit
  1.0 |> ignore()
// <~~--- constant.numeric.double.moonbit
  1.0e+1 |> ignore()
// <~~------ constant.numeric.double.moonbit
  1.0e-1 |> ignore()
  0x1. |> ignore()
// <~~---- constant.numeric.double.moonbit
  0x1.0 |> ignore()
  0x1.0p+1 |> ignore()
// <~~-------- constant.numeric.double.moonbit
  0x1.p+1 |> ignore()
  1.1_1 |> ignore()
  1_1.2_2 |> ignore()
  let buffer = StringBuilder::new()
  1..output(buffer)
// <~~- constant.numeric.integer.moonbit
// <~~~- punctuation.accessor.moonbit
// <~~~~- keyword.operator.range.moonbit
  let a = (0.0, (1.0, 2.0, (3.0, 4.0)))
  a.1.2 |> ignore()
// <~~~-- constant.numeric.integer.tuple-index.moonbit
// <~~~~~-- constant.numeric.integer.tuple-index.moonbit
}
