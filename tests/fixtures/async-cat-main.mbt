// SYNTAX TEST "source.moonbit" "moonbitlang/async cat example"
// Source: moonbitlang/async examples/cat/main.mbt
///|
async fn main {
// <- storage.modifier.moonbit
//    ^^ storage.type.function.moonbit
//       ^^^^ entity.name.function.moonbit
  let args = @env.args()
  match args {
// <~~----- keyword.control.conditional.moonbit
    [] | [_] => @stdio.stdout.write_reader(@stdio.stdin)
    [_, .. files] =>
      for file in files {
// <~~~~~~--- keyword.control.loop.moonbit
        if file == "-" {
          @stdio.stdout.write_reader(@stdio.stdin)
        } else {
          let file = @fs.open(file, mode=ReadOnly)
          defer file.close()
// <~~~~~~~~~~----- keyword.control.flow.moonbit
          @stdio.stdout.write_reader(file)
        }
      }
  }
}
