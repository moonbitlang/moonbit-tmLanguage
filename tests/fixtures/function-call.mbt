// SYNTAX TEST "source.moonbit" "function declarations and calls"
fn foo() -> Unit {
// ^^^ entity.name.function.moonbit
  ()
}

fn bar() -> Unit {
// ^^^ entity.name.function.moonbit
  foo()
}

fn main {
// ^^^^ entity.name.function.moonbit
  foo()
  bar()
  StringBuilder::new().write_string("done")
}
