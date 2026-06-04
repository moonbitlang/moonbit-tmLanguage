// SYNTAX TEST "source.moonbit" "async syntax"
fn async_run(f : async () -> Unit) -> Unit = "%async.run"
// ^^^^^^^^^ entity.name.function.moonbit
//               ^^^^^ storage.modifier.moonbit

async fn async_suspend[T, E : Error](
// <- storage.modifier.moonbit
//    ^^ storage.type.function.moonbit
//       ^^^^^^^^^^^^^ entity.name.function.moonbit
  f : ((T) -> Unit, (E) -> Unit) -> Unit
) -> Unit = "%async.suspend"

async test "suspend" {
// <- storage.modifier.moonbit
//    ^^^^ storage.type.moonbit
  async_suspend(fn(resolve, _reject) { resolve(()) })
}
