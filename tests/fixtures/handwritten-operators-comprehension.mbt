// SYNTAX TEST "source.moonbit" "handwritten operators lambdas and comprehensions"
fn operators(xs : Array[Int]) -> Array[Int] {
// ^^^^^^^^^ entity.name.function.moonbit
  let half_open = 0..<10
  let inclusive = 0..=10
  let shifted = (1 << 2) | 3 & 7
  let result = xs.map(x => x * x).filter(x => x > 3)
  [for x in result if x != 0 => x]
// <~~~--- keyword.control.loop.moonbit
}
