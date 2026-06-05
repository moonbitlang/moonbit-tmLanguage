// SYNTAX TEST "source.moonbit" "handwritten literal forms"
fn literals {
// ^^^^^^^^ entity.name.function.moonbit
  "hello\n" |> ignore()
// <~~- string.quoted.double.moonbit
  b"bytes" |> ignore()
// <~~- string.quoted.double.bytes.moonbit
  '🎉' |> ignore()
  b'a' |> ignore()
  re"ab+\{name}" |> ignore()
// <~~- string.regexp.moonbit
  $|hello \{name}
// <~~- string.quoted.other.multiline.interpolated.moonbit
//        ^^ punctuation.definition.template-expression.begin.moonbit
//          ^^^^ variable.other.readwrite.moonbit
//              ^ punctuation.definition.template-expression.end.moonbit
  #|raw line
// <~~- string.quoted.other.multiline.moonbit
}
