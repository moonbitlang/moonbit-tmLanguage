// SYNTAX TEST "source.moonbit" "async"

///|
fn async_run(f : async () -> Unit) -> Unit = "%async.run"
//               ^^^^^ keyword.control.moonbit.async

///|
async fn[T, E : Error] async_suspend(
// <----- keyword.control.moonbit.async
  f : ((T) -> Unit, (E) -> Unit) -> Unit
) -> Unit = "%async.suspend"
