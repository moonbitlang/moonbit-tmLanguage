// SYNTAX TEST "source.moonbit" "moonbitlang/async task excerpt"
// Source: moonbitlang/async src/task.mbt
///|
/// `Task[X]` represents a running task with result type `X`,
/// it can be used to wait and retrieve the result value of the task.
struct Task[X] {
// <- storage.type.moonbit
  value : Ref[X?]
  coro : @coroutine.Coroutine
}

///|
/// Wait for a task and retrieve its result value.
pub async fn[X] Task::wait(self : Task[X]) -> X {
// <- storage.modifier.moonbit
//  ^^^^^ storage.modifier.moonbit
//        ^^ storage.type.function.moonbit
  self.coro.wait()
  self.value.val.unwrap()
}

///|
/// Try to obtain the result of the task.
pub fn[X] Task::try_wait(self : Task[X]) -> X? raise {
// <- storage.modifier.moonbit
//  ^^ storage.type.function.moonbit
  self.coro.check_error()
  self.value.val
}

///|
/// Cancel a task. Subsequent attempt to wait for the task will receive error.
pub fn[X] Task::cancel(self : Task[X]) -> Unit {
  self.coro.cancel()
}
