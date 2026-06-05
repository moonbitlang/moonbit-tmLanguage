// SYNTAX TEST "source.moonbit" "language surface"
/// A documented record.
// <- comment.line.documentation.moonbit
#derive(Show)
// <- entity.name.function.decorator.moonbit
pub struct Point {
// <- storage.modifier.moonbit
//  ^^^^^^ storage.type.moonbit
  pub x : Int
  pub y : Int
}

enum Shape {
// <- storage.type.moonbit
  Circle(Double)
  Rect(Point, Point)
}

trait Drawable {
// <- storage.type.moonbit
  draw(Self) -> Unit
}

impl Drawable for Shape with {
// <- storage.type.moonbit
  fn draw(self : Shape) -> Unit {
    match self {
      Circle(radius) => println("circle \{radius}")
//                                      ^^ punctuation.definition.template-expression.begin.moonbit
//                                        ^^^^^^ variable.other.readwrite.moonbit
//                                              ^ punctuation.definition.template-expression.end.moonbit
      Rect({ x, y }, _) => println("rect")
    }
  }
}

fn distance(a : Point, b : Point) -> Double {
// ^^^^^^^^ entity.name.function.moonbit
  let dx = a.x - b.x
  let dy = a.y - b.y
  (dx * dx + dy * dy).to_double()
}

fn use_package {
  let xs = @moonbitlang/core/array.make(3, 0)
  guard xs.length() > 0 else { return }
  for item in xs {
    item |> ignore()
  }
  try? distance(Point::{ x: 0, y: 0 }, Point::{ x: 1, y: 1 })
  re"ab+\{name}" |> ignore()
}
