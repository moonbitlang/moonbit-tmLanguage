// SYNTAX TEST "source.moonbit" "byte and regular expression literals"

fn tagged_literals() -> Unit {
  b"ABC" |> ignore()
//^^^^^^ string.quoted.double.moonbit
  b'A' |> ignore()
//^^^^ string.quoted.single.moonbit
  ("test" =~ re"[a-z]+") |> ignore()
//           ^^^^^^^^^^ string.regexp.moonbit
  (b"ABC" =~ reb"[A-Z]+") |> ignore()
//           ^^^^^^^^^^^ string.regexp.moonbit
}
