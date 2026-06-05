// SYNTAX TEST "source.moonbit" "complex string interpolation"
fn complex_string_interpolation(value : Int, name : String) -> String {
  let one = "before \{if value > 0 { "inner \{name}" } else { "none" }} after"
//          ^ string.quoted.double.moonbit punctuation.definition.string.begin.moonbit
//           ^^^^^^^ string.quoted.double.moonbit
//                  ^^ punctuation.definition.template-expression.begin.moonbit - string.quoted.double.moonbit
//                    ^^ keyword.control.conditional.moonbit
//                                 ^ punctuation.definition.block.moonbit - string.quoted.double.moonbit
//                                   ^ string.quoted.double.moonbit punctuation.definition.string.begin.moonbit
//                                    ^^^^^^ string.quoted.double.moonbit
//                                          ^^ punctuation.definition.template-expression.begin.moonbit - string.quoted.double.moonbit
//                                            ^^^^ variable.other.readwrite.moonbit - string.quoted.double.moonbit
//                                                ^ punctuation.definition.template-expression.end.moonbit - string.quoted.double.moonbit
//                                                   ^ punctuation.definition.block.moonbit - string.quoted.double.moonbit
//                                                          ^ punctuation.definition.block.moonbit - string.quoted.double.moonbit
//                                                                   ^ punctuation.definition.block.moonbit - string.quoted.double.moonbit
//                                                                    ^ punctuation.definition.template-expression.end.moonbit - string.quoted.double.moonbit
//                                                                     ^^^^^^ string.quoted.double.moonbit
//                                                                           ^ string.quoted.double.moonbit punctuation.definition.string.end.moonbit
  let two = $|prefix \{match value { 0 => "zero"; _ => "value \{value}" }} suffix
//          ^^ string.quoted.other.multiline.interpolated.moonbit punctuation.definition.string.begin.moonbit
//            ^^^^^^^ string.quoted.other.multiline.interpolated.moonbit
//                   ^^ punctuation.definition.template-expression.begin.moonbit - string.quoted.other.multiline.interpolated.moonbit
//                     ^^^^^ keyword.control.conditional.moonbit
//                                 ^ punctuation.definition.block.moonbit - string.quoted.other.multiline.interpolated.moonbit
//                                        ^ string.quoted.double.moonbit punctuation.definition.string.begin.moonbit
//                                         ^^^^ string.quoted.double.moonbit
//                                                     ^ string.quoted.double.moonbit punctuation.definition.string.begin.moonbit
//                                                      ^^^^^^ string.quoted.double.moonbit
//                                                            ^^ punctuation.definition.template-expression.begin.moonbit - string.quoted.double.moonbit string.quoted.other.multiline.interpolated.moonbit
//                                                              ^^^^^ variable.other.readwrite.moonbit - string.quoted.double.moonbit string.quoted.other.multiline.interpolated.moonbit
//                                                                   ^ punctuation.definition.template-expression.end.moonbit - string.quoted.double.moonbit string.quoted.other.multiline.interpolated.moonbit
//                                                                      ^ punctuation.definition.block.moonbit - string.quoted.other.multiline.interpolated.moonbit
//                                                                       ^ punctuation.definition.template-expression.end.moonbit - string.quoted.other.multiline.interpolated.moonbit
//                                                                        ^^^^^^^ string.quoted.other.multiline.interpolated.moonbit
  let three = re"^item-\{value}$"
//            ^^ string.regexp.moonbit
//              ^ string.regexp.moonbit punctuation.definition.string.begin.moonbit
//               ^^^^^^ string.regexp.moonbit
//                     ^^ punctuation.definition.template-expression.begin.moonbit - string.regexp.moonbit
//                       ^^^^^ variable.other.readwrite.moonbit - string.regexp.moonbit
//                            ^ punctuation.definition.template-expression.end.moonbit - string.regexp.moonbit
//                             ^ string.regexp.moonbit
//                              ^ string.regexp.moonbit punctuation.definition.string.end.moonbit
  one + two + three
}
