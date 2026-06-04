// SYNTAX TEST "source.moonbit" "moonbitlang/async semaphore excerpt"
// Source: moonbitlang/async src/semaphore/semaphore.mbt
///|
priv struct Waiter {
// <- storage.modifier.moonbit
//   ^^^^^^ storage.type.moonbit
  mut acquired : Bool
  mut coro : @coroutine.Coroutine?
}

///|
pub struct Semaphore {
// <- storage.modifier.moonbit
//  ^^^^^^ storage.type.moonbit
  size : Int
  priv mut value : Int
  priv waiters : @deque.Deque[Waiter]
}

///|
/// Create a semaphore of size `size`,
/// the initial value of the semaphore
/// will be set to `initial_value` (`size` by default)
#alias(new, deprecated)
pub fn Semaphore::Semaphore(
// <- storage.modifier.moonbit
//  ^^ storage.type.function.moonbit
  size : Int,
  initial_value? : Int = size,
) -> Semaphore {
  guard initial_value >= 0 && initial_value <= size
  { value: initial_value, size, waiters: @deque.new() }
}

///|
/// Release a unit of resource back to the semaphore. This function never blocks.
pub fn Semaphore::release(self : Semaphore) -> Unit {
  if self.value >= self.size {
    abort("semaphore: too many release")
  }
  while self.waiters.pop_front() is Some(waiter) {
// <~~----- keyword.control.loop.moonbit
    if waiter.coro is Some(coro) {
      waiter.acquired = true
      coro.wake()
      break
    }
  } nobreak {
    self.value += 1
  }
}

///|
/// Acquire one unit of resource from the semaphore.
pub async fn Semaphore::acquire(self : Semaphore) -> Unit {
// <- storage.modifier.moonbit
//  ^^^^^ storage.modifier.moonbit
//        ^^ storage.type.function.moonbit
  if self.value > 0 {
    self.value -= 1
  } else {
    let waiter = { coro: Some(@coroutine.current_coroutine()), acquired: false }
    self.waiters.push_back(waiter)
    @coroutine.suspend() catch {
      _ if waiter.acquired => ()
      err => {
        waiter.coro = None
        raise err
      }
    }
  }
}
