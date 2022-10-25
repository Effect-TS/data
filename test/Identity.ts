import { pipe } from "@fp-ts/data/Function"
import * as _ from "@fp-ts/data/Identity"
import * as O from "@fp-ts/data/Option"
import * as U from "./util"

describe.concurrent("Identity", () => {
  it("instances and derived exports", () => {
    expect(_.Invariant).exist
    expect(_.imap).exist
    expect(_.tupled).exist
    expect(_.bindTo).exist

    expect(_.Covariant).exist
    expect(_.map).exist
    expect(_.let).exist
    expect(_.flap).exist
    expect(_.as).exist
    expect(_.asUnit).exist

    expect(_.Of).exist
    expect(_.of).exist
    expect(_.Do).exist

    expect(_.Pointed).exist

    expect(_.FlatMap).exist
    expect(_.flatMap).exist
    expect(_.flatten).exist
    expect(_.andThen).exist
    expect(_.composeKleisliArrow).exist

    expect(_.Chainable).exist
    expect(_.bind).exist
    expect(_.tap).exist
    expect(_.andThenDiscard).exist

    expect(_.Monad).exist

    expect(_.NonEmptyProduct).exist
    expect(_.product).exist
    expect(_.productMany).exist

    expect(_.Product).exist
    expect(_.productAll).exist
    expect(_.tuple).exist
    expect(_.struct).exist

    expect(_.NonEmptyApplicative).exist
    expect(_.liftSemigroup).exist
    expect(_.lift2).exist
    expect(_.lift3).exist
    expect(_.ap).exist
    expect(_.andThenDiscard).exist
    expect(_.andThen).exist

    expect(_.Applicative).exist
    expect(_.liftMonoid).exist

    expect(_.NonEmptyCoproduct).exist
    expect(_.coproduct).exist
    expect(_.coproductMany).exist
    expect(_.getSemigroup).exist
    expect(_.coproductEither).exist

    expect(_.NonEmptyAlternative).exist

    expect(_.Foldable).exist
    expect(_.reduce).exist
    expect(_.reduceRight).exist
    expect(_.foldMap).exist
    expect(_.toReadonlyArray).exist
    expect(_.toReadonlyArrayWith).exist
    expect(_.reduceKind).exist
    expect(_.reduceRightKind).exist
    expect(_.foldMapKind).exist

    expect(_.Traversable).exist
    expect(_.traverse).exist
    expect(_.sequence).exist
    expect(_.traverseTap).exist
  })

  it("unit", () => {
    U.deepStrictEqual(_.unit, undefined)
  })

  it("of", () => {
    U.deepStrictEqual(_.of("a"), "a")
  })

  it("NonEmptyProduct", () => {
    U.deepStrictEqual(pipe("a", _.NonEmptyProduct.productMany(["b", "c"])), ["a", "b", "c"])
  })

  it("Product", () => {
    U.deepStrictEqual(_.Product.productAll([]), [])
    U.deepStrictEqual(_.Product.productAll(["a", "b", "c"]), ["a", "b", "c"])
  })

  it("flatMap", () => {
    U.deepStrictEqual(
      pipe("a", _.flatMap((a) => a + "b")),
      "ab"
    )
  })

  it("product", () => {
    U.deepStrictEqual(pipe("a", _.product("b")), ["a", "b"])
  })

  it("NonEmptyCoproduct", () => {
    U.deepStrictEqual(pipe("a", _.NonEmptyCoproduct.coproduct("b")), "a")
    U.deepStrictEqual(pipe("a", _.NonEmptyCoproduct.coproductMany(["b", "c"])), "a")
  })

  it("reduce", () => {
    U.deepStrictEqual(pipe("b", _.reduce("a", (b, a) => b + a)), "ab")
    U.deepStrictEqual(pipe("b", _.Foldable.reduce("a", (b, a) => b + a)), "ab")
  })

  it("reduceRight", () => {
    const f = (a: string, acc: string) => acc + a
    U.deepStrictEqual(pipe("a", _.reduceRight("", f)), "a")
    U.deepStrictEqual(pipe("a", _.Foldable.reduceRight("", f)), "a")
  })

  it("traverse", () => {
    U.deepStrictEqual(pipe(1, _.traverse(O.Applicative)(O.some)), O.some(1))
    U.deepStrictEqual(pipe(1, _.traverse(O.Applicative)(() => O.none)), O.none)

    U.deepStrictEqual(pipe(1, _.Traversable.traverse(O.Applicative)(O.some)), O.some(1))
    U.deepStrictEqual(pipe(1, _.Traversable.traverse(O.Applicative)(() => O.none)), O.none)
  })
})
