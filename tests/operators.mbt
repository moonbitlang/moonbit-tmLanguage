// SYNTAX TEST "source.moonbit" "async"

fn path_join(a : StringView, b : StringView) -> String {
  "\{a}/\{b}"
}

///|
fn main {
  let buffer = @buffer.new()
  buffer
  ..write_char('h')
//^^ keyword.operator.other.moonbit
  ..write_char('e')
//^^ keyword.operator.other.moonbit
  ..write_char('l')
  ..write_char('l')
  ..write_char('o')
  "a"
  |> path_join("b")
//^^ keyword.operator.other.moonbit
  |> println()
}
