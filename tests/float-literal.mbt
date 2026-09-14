// SYNTAX TEST "source.moonbit" "function call"
fn main {
  1. |> ignore()
  // <-- constant.numeric.moonbit
  1.0 |> ignore()
  // <--- constant.numeric.moonbit
  1.0e+1 |> ignore()
  // <------ constant.numeric.moonbit
  1.0e-1 |> ignore()
  // <------ constant.numeric.moonbit
  0x1. |> ignore()
  // <---- constant.numeric.moonbit
  0x1.0 |> ignore()
  // <----- constant.numeric.moonbit
  0x1.0p+1 |> ignore()
  // <-------- constant.numeric.moonbit
  0x1.p+1 |> ignore()
  // <------- constant.numeric.moonbit
  let buffer = StringBuilder::new()
  1..output(buffer)
  1.1_1 |> ignore()
  // <----- constant.numeric.moonbit
  1_1.2_2 |> ignore()
  // <------- constant.numeric.moonbit
  let a = (0.0, (1.0, 2.0, (3.0, 4.0, 5.0, 6.0)))
  a.1.2.3 |> ignore()
}
