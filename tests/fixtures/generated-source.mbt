// SYNTAX TEST "source.moonbit" "generated source multiline interpolation"
fn generated_source(
// <- storage.type.function.moonbit
// ^^^^^^^^^^^^^^^^ entity.name.function.moonbit
  base~ : String,
//^^^^ variable.other.readwrite.moonbit
//        ^^^^^^ entity.name.type.moonbit
  function_name~ : String,
//^^^^^^^^^^^^^ variable.other.readwrite.moonbit
//                 ^^^^^^ entity.name.type.moonbit
  markdown~ : String,
//^^^^^^^^ variable.other.readwrite.moonbit
//            ^^^^^^ entity.name.type.moonbit
) -> String {
//^^ storage.type.function.arrow.moonbit
//   ^^^^^^ entity.name.type.moonbit
  let lines: Iter[StringView] = markdown.split("\n")
//^^^ storage.type.moonbit
//    ^^^^^ variable.other.moonbit
//           ^^^^ entity.name.type.moonbit
//                ^^^^^^^^^^ entity.name.type.moonbit
//                                       ^^^^^ entity.name.function.moonbit
//                                              ^^ constant.character.escape.moonbit
  (
    $|// Generated from \{base} by moon dev_build. DO NOT EDIT.
//  ^^ punctuation.definition.string.begin.moonbit
//                      ^^ punctuation.definition.template-expression.begin.moonbit
//                        ^^^^ variable.other.readwrite.moonbit
//                            ^ punctuation.definition.template-expression.end.moonbit
    $|///|
//  ^^ punctuation.definition.string.begin.moonbit
//    ^^^^ string.quoted.other.multiline.interpolated.moonbit
    $|fn \{function_name}() -> String {
//  ^^ punctuation.definition.string.begin.moonbit
//       ^^ punctuation.definition.template-expression.begin.moonbit
//         ^^^^^^^^^^^^^ variable.other.readwrite.moonbit
//                      ^ punctuation.definition.template-expression.end.moonbit
    $|  (
//  ^^ punctuation.definition.string.begin.moonbit
//    ^^^ string.quoted.other.multiline.interpolated.moonbit
    $|\{out => for line in lines { out <+ str"    #|\{line}\n" }}  )
//  ^^ punctuation.definition.string.begin.moonbit
//    ^^ punctuation.definition.template-expression.begin.moonbit
//      ^^^ variable.other.readwrite.moonbit
//          ^^ storage.type.function.arrow.moonbit
//             ^^^ keyword.control.loop.moonbit
//                 ^^^^ variable.other.readwrite.moonbit
//                      ^^ keyword.control.loop.moonbit
//                         ^^^^^ variable.other.readwrite.moonbit
//                                     ^ keyword.operator.comparison.moonbit
//                                      ^ keyword.operator.arithmetic.moonbit
//                                        ^^^ variable.other.readwrite.moonbit
//                                           ^ punctuation.definition.string.begin.moonbit
//                                                  ^^ punctuation.definition.template-expression.begin.moonbit
//                                                    ^^^^ variable.other.readwrite.moonbit
//                                                        ^ punctuation.definition.template-expression.end.moonbit
//                                                         ^^ constant.character.escape.moonbit
//                                                           ^ punctuation.definition.string.end.moonbit
//                                                             ^ punctuation.definition.block.moonbit
//                                                              ^ punctuation.definition.template-expression.end.moonbit
    $|}
//  ^^ punctuation.definition.string.begin.moonbit
//    ^ string.quoted.other.multiline.interpolated.moonbit
    $|
//  ^^ punctuation.definition.string.begin.moonbit
  )
}
