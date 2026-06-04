// SYNTAX TEST "source.moonbit" "handwritten type highlighting"
struct Point
// <- storage.type.moonbit
//     ^^^^^ entity.name.type.moonbit

enum Shape {
// <- storage.type.moonbit
//   ^^^^^ entity.name.type.moonbit
  Circle(Point)
//^^^^^^ entity.name.type.moonbit
//       ^^^^^ entity.name.type.moonbit
}

trait Drawable {
// <- storage.type.moonbit
//    ^^^^^^^^ entity.name.type.moonbit
  draw(Self) -> Unit
//     ^^^^ entity.name.type.moonbit
//              ^^^^ entity.name.type.moonbit
}

struct Task[X] {
//     ^^^^ entity.name.type.moonbit
//          ^ entity.name.type.moonbit
  value : Ref[X?]
//        ^^^ entity.name.type.moonbit
//            ^^ entity.name.type.moonbit
  coro : @coroutine.Coroutine
//       ^^^^^^^^^^ entity.name.namespace.moonbit
//                  ^^^^^^^^^ entity.name.type.moonbit
}

impl Drawable for Shape with fn draw(self : Shape) -> Unit {
// <- storage.type.moonbit
//   ^^^^^^^^ entity.name.type.moonbit
//            ^^^ keyword.other.impl.moonbit
//                ^^^^^ entity.name.type.moonbit
//                      ^^^^ keyword.other.moonbit
//                           ^^ storage.type.function.moonbit
//                              ^^^^ entity.name.function.moonbit
//                                          ^^^^^ entity.name.type.moonbit
//                                                    ^^^^ entity.name.type.moonbit
  ()
}

typealias Array as ArrayAlias
// <- storage.type.moonbit
//        ^^^^^ entity.name.type.moonbit
//                 ^^^^^^^^^^ entity.name.type.moonbit

traitalias Hashable = Hash
// <- storage.type.moonbit
//         ^^^^^^^^ entity.name.type.moonbit
//                    ^^^^ entity.name.type.moonbit
