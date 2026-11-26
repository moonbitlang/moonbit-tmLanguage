// SYNTAX TEST "source.moonbit" "prefixed and iterator literals"
fn main {
  re"a\.\"b" |> ignore
// <~~---------- string.regexp.moonbit
//    ^^^^ constant.character.escape.moonbit
//           ^^ keyword.operator.other.moonbit
  reb"[a-z]" |> ignore
// <~~---------- string.regexp.moonbit
  b"\x41\{b"B"}" |> ignore
// <~~- string.quoted.double.bytes.moonbit
//  ^^^^ constant.character.escape.moonbit
//      ^^ punctuation.section.embedded.begin.moonbit
//        ^^^^ string.quoted.double.bytes.moonbit
  [|1 | 2|] |> ignore
// <~~-- punctuation.brackets.iterator.moonbit
//    ^ keyword.operator.bitwise.moonbit
//       ^^ punctuation.brackets.iterator.moonbit
  ignore([|1|])
//       ^^ punctuation.brackets.iterator.moonbit
//          ^^ punctuation.brackets.iterator.moonbit
  lexmatch "ab" {
    re"a\{re"b"}" => ()
//      ^^ punctuation.section.embedded.begin.moonbit
//        ^^^^^ source.moonbit string.regexp.moonbit
    _ => ()
  }
}
