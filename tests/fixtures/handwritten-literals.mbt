// SYNTAX TEST "source.moonbit" "handwritten literal forms"
fn literals {
// ^^^^^^^^ entity.name.function.moonbit
  "hello\n" |> ignore()
//^ punctuation.definition.string.begin.moonbit
// ^^^^^ string.quoted.double.moonbit
//      ^^ constant.character.escape.moonbit
//        ^ punctuation.definition.string.end.moonbit
  b"bytes" |> ignore()
// <~~- string.quoted.double.bytes.moonbit
  '🎉' |> ignore()
  b'a' |> ignore()
  re"ab+\{name}" |> ignore()
//^^ string.regexp.moonbit
//  ^ punctuation.definition.string.begin.moonbit
//   ^^^ string.regexp.moonbit
//      ^^ punctuation.definition.template-expression.begin.moonbit - string.regexp.moonbit
//        ^^^^ variable.other.readwrite.moonbit - string.regexp.moonbit
//            ^ punctuation.definition.template-expression.end.moonbit - string.regexp.moonbit
//             ^ punctuation.definition.string.end.moonbit
  $|hello \{name}
//^^ punctuation.definition.string.begin.moonbit
//  ^^^^^^ string.quoted.other.multiline.interpolated.moonbit
//        ^^ punctuation.definition.template-expression.begin.moonbit - string.quoted.other.multiline.interpolated.moonbit
//          ^^^^ variable.other.readwrite.moonbit - string.quoted.other.multiline.interpolated.moonbit
//              ^ punctuation.definition.template-expression.end.moonbit - string.quoted.other.multiline.interpolated.moonbit
  #|raw line
// <~~- string.quoted.other.multiline.moonbit
}
