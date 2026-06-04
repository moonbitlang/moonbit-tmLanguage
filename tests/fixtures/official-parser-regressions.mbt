// SYNTAX TEST "source.moonbit" "official parser regressions"
enum Lst[T] {
// <- storage.type.moonbit
  Nil
  Cons(T, Lst[T])
}

enumview[A: Show] ViewList {
// <- storage.type.moonbit
  VNil
  VCons(String, Lst[A])
} for Lst[A] with view(xs: Lst[A]) {
  match xs {
// <~~----- keyword.control.conditional.moonbit
    Nil => VNil
    Cons(x, xs) => VCons(x.to_string(), xs)
  }
}

pub extenum Expr[T] {
// <- storage.modifier.moonbit
//  ^^^^^^^ storage.type.moonbit
  Int(T)
  Add(Expr[T], Expr[T])
}

extenum Expr[T] += {
// <- storage.type.moonbit
  Mul(Expr[T], Expr[T])
}

trait Add {
  fn f(Int, Int) -> Int
}

impl Add with f(x : Int, y : Int) -> Int = "%i32.add"
// <- storage.type.moonbit

const COMMENT_START = re"/\*"
const COMMENT_END = re"\*/"
const BLANK_OPT = re"[ \t]*"
const ALT = re"b"
const SUFFIX = re"bc"

fn optionals(x? : Int = Some(0), y? : Int) -> Unit {
  f(x?=1)
  f(y?)
}

fn regressions(s : StringView, arr : Array[Int]) -> Unit {
// ^^^^^^^^^^^ entity.name.function.moonbit
  letrec even : (Int) -> Bool = x => true and odd = () => true
// <~~~~ storage.type.moonbit
  let _ = (a: Int)
  let _ = (a + b: Int)
  match arr {
    [.., y, z,] => ()
    [x, y, ..,] => ()
    [x, .. rest, z,] => ()
    _ => ()
  }
  if s lexmatch? (COMMENT_START BLANK_OPT (re".*?" as content) COMMENT_END) {
// <~~ keyword.control.conditional.moonbit
    println(content)
  }
  let _ = s =~ ((re"x" | ALT) + SUFFIX, before~, after~)
  println(&Add::f(1, 2))
}
