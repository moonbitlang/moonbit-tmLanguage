// SYNTAX TEST "source.moonbit" "handwritten patterns and lexmatch"
fn classify_labels(info : Info) -> String {
// ^^^^^^^^^^^^^^^ entity.name.function.moonbit
  match info {
// <~~----- keyword.control.conditional.moonbit
    OptionInfo(long~, short~, ..) => "option"
    FlagInfo(long=Some(name), ..) => name
    _ => "other"
  }
}

fn lex(input : String) -> Unit {
// ^^ entity.name.function.moonbit
  lexmatch? input with token {
// <~~--------- keyword.control.conditional.moonbit
    "abc" => ()
    _ => ()
  }
}
