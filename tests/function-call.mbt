// SYNTAX TEST "source.moonbit" "function call"
///|
fn foo() -> Unit {
// ^^^ entity.name.function.moonbit
}

///|
fn bar () -> Unit {
// ^^^ entity.name.function.moonbit
}

///|
fn main {
  foo()
  // <--- entity.name.function.moonbit
  bar ()
  // <--- entity.name.function.moonbit
}

///|
fn[T] 问候(x : T) -> T { x }
//<- keyword.moonbit
// ^ entity.name.type.moonbit
//    ^^ entity.name.function.moonbit - meta.function.call

///|
fn unicode_call() -> Unit {
  问候("MoonBit") |> ignore()
//^^ entity.name.function.moonbit
}
