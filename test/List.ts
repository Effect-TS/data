import * as E from "@fp-ts/data/Either"
import { equals } from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as L from "@fp-ts/data/List"
import * as LB from "@fp-ts/data/mutable/MutableListBuilder"
import * as Number from "@fp-ts/data/Number"
import * as O from "@fp-ts/data/Option"
import * as U from "@fp-ts/data/test/util"

describe.concurrent("List", () => {
  it("modifyOption", () => {
    expect(pipe(L.empty(), L.modifyOption(0, (n: number) => n * 2))).toEqual(O.none)
    expect(pipe(L.make(1, 2, 3), L.modifyOption(0, (n: number) => n * 2))).toEqual(
      O.some(L.make(2, 2, 3))
    )
  })

  it("modify", () => {
    expect(pipe(L.empty(), L.modify(0, (n: number) => n * 2))).toEqual(L.empty())
    expect(pipe(L.make(1, 2, 3), L.modify(0, (n: number) => n * 2))).toEqual(L.make(2, 2, 3))
  })

  it("replaceOption", () => {
    expect(pipe(L.empty(), L.replaceOption(0, 2))).toEqual(O.none)
    expect(pipe(L.make(1, 2, 3), L.replaceOption(0, 2))).toEqual(O.some(L.make(2, 2, 3)))
  })

  it("replace", () => {
    expect(pipe(L.empty(), L.replace(0, 2))).toEqual(L.empty())
    expect(pipe(L.make(1, 2, 3), L.replace(0, 2))).toEqual(L.make(2, 2, 3))
  })

  it("remove", () => {
    expect(pipe(L.empty(), L.remove(0))).toEqual(L.empty())
    expect(pipe(L.make(1, 2, 3), L.remove(0))).toEqual(L.make(2, 3))
  })

  it("take", () => {
    expect(pipe(L.make(1, 2, 3, 4), L.take(2))).toEqual(L.make(1, 2))
    // take(0)
    expect(pipe(L.make(1, 2, 3, 4), L.take(0))).toEqual(L.nil())
    // out of bounds
    expect(pipe(L.make(1, 2, 3, 4), L.take(-10))).toEqual(L.nil())
    expect(pipe(L.make(1, 2, 3, 4), L.take(10))).toEqual(L.make(1, 2, 3, 4))
  })

  it("splitAt", () => {
    expect(pipe(L.make(1, 2, 3, 4), L.splitAt(2))).toEqual([L.make(1, 2), L.make(3, 4)])
  })

  it("isNil", () => {
    U.deepStrictEqual(L.isNil(L.nil()), true)
    U.deepStrictEqual(L.isNil(L.make(1)), false)
  })

  it("isCons", () => {
    U.deepStrictEqual(L.isCons(L.make()), false)
    U.deepStrictEqual(L.isCons(L.make(1)), true)
  })

  it("prependAll", () => {
    expect(pipe(L.make(3), L.prependAll(L.make(1, 2)))).toStrictEqual(L.make(1, 2, 3))
  })

  it("concat", () => {
    expect(pipe(L.make(1, 2), L.concat(L.make(3, 4)))).toStrictEqual(L.make(1, 2, 3, 4))
  })

  it("partition", () => {
    expect(pipe(L.make(1, 2, 3, 4), L.partition((n) => n > 2))).toStrictEqual([
      L.make(1, 2),
      L.make(3, 4)
    ])
  })

  it("partitionMap", () => {
    expect(pipe(L.make(1, 2, 3, 4), L.partitionMap((n) => n > 2 ? E.right(n) : E.left(n))))
      .toStrictEqual([
        L.make(1, 2),
        L.make(3, 4)
      ])
  })

  it("head", () => {
    expect(pipe(L.make(), L.head)).toEqual(O.none)
    expect(pipe(L.make(1, 2, 3), L.head)).toEqual(O.some(1))
  })

  it("tail", () => {
    expect(pipe(L.make(), L.tail)).toEqual(O.none)
    expect(pipe(L.make(1, 2, 3), L.tail)).toEqual(O.some(L.make(2, 3)))
  })

  it("some", () => {
    expect(pipe(L.make(), L.some((n) => n > 2))).toEqual(false)
    expect(pipe(L.make(1, 2), L.some((n) => n > 2))).toEqual(false)
    expect(pipe(L.make(2, 3), L.some((n) => n > 2))).toEqual(true)
    expect(pipe(L.make(3, 4), L.some((n) => n > 2))).toEqual(true)
  })

  it("every", () => {
    expect(pipe(L.make(), L.every((n) => n > 2))).toEqual(true)
    expect(pipe(L.make(1, 2), L.every((n) => n > 2))).toEqual(false)
    expect(pipe(L.make(2, 3), L.every((n) => n > 2))).toEqual(false)
    expect(pipe(L.make(3, 4), L.every((n) => n > 2))).toEqual(true)
  })

  it("findFirst", () => {
    const item = (a: string, b: string) => ({ a, b })
    const itemToFind = item("a2", "b2")
    expect(
      pipe(
        L.make(item("a1", "b1"), itemToFind, item("a3", itemToFind.b)),
        L.findFirst(({ b }) => b === itemToFind.b)
      )
    ).toEqual(O.some(itemToFind))
  })

  it("reduce", () => {
    expect(pipe(L.make(), L.reduce("-", (b, a) => b + a))).toEqual("-")
    expect(pipe(L.make("a", "b", "c"), L.reduce("-", (b, a) => b + a))).toEqual("-abc")
  })

  it("constructs a list", () => {
    U.assertTrue(equals(Array.from(L.List(0, 1, 2, 3)), [0, 1, 2, 3]))
  })

  it("drop", () => {
    expect(pipe(L.make(1, 2, 3, 4), L.drop(2))).toEqual(L.make(3, 4))
  })

  it("map", () => {
    expect(pipe(L.make(1, 2, 3, 4), L.map((n) => n + 1))).toEqual(L.make(2, 3, 4, 5))
  })

  it("forEach", () => {
    const as: Array<number> = []
    pipe(L.make(1, 2, 3, 4), L.forEach((n) => as.push(n)))

    expect(as).toStrictEqual([1, 2, 3, 4])
  })

  it("flatMap", () => {
    expect(pipe(L.make(1, 2, 3, 4), L.flatMap((n) => L.make(n - 1, n + 1)))).toEqual(
      L.make(0, 2, 1, 3, 2, 4, 3, 5)
    )
  })

  it("unsafeLast", () => {
    expect(() => pipe(L.make(), L.unsafeLast)).toThrowError(
      new Error("Expected List to be not empty")
    )
    expect(pipe(L.make(1, 2, 3, 4), L.unsafeLast)).toEqual(4)
  })

  it("instances and derived exports", () => {
    expect(L.Invariant).exist
    expect(L.imap).exist
    expect(L.tupled).exist
    expect(L.bindTo).exist

    expect(L.Covariant).exist
    expect(L.map).exist
    expect(L.let).exist
    expect(L.flap).exist
    expect(L.as).exist
    expect(L.asUnit).exist

    expect(L.Of).exist
    expect(L.unit).exist
    expect(L.of).exist
    expect(L.Do).exist

    expect(L.Pointed).exist

    expect(L.FlatMap).exist
    expect(L.flatMap).exist
    expect(L.flatten).exist
    expect(L.andThen).exist
    expect(L.composeKleisliArrow).exist

    expect(L.Chainable).exist
    expect(L.bind).exist
    expect(L.tap).exist
    expect(L.andThenDiscard).exist

    expect(L.Monad).exist

    expect(L.SemiProduct).exist
    expect(L.product).exist
    expect(L.productMany).exist
    expect(L.andThenBind).exist
    expect(L.productFlatten).exist

    expect(L.Product).exist
    expect(L.productAll).exist
    expect(L.tuple).exist
    expect(L.struct).exist

    expect(L.SemiApplicative).exist
    expect(L.liftSemigroup).exist
    expect(L.lift2).exist
    expect(L.lift3).exist
    expect(L.ap).exist
    expect(L.andThenDiscard).exist
    expect(L.andThen).exist

    expect(L.Applicative).exist
    expect(L.liftMonoid).exist

    expect(L.Foldable).exist
    expect(L.reduce).exist
    expect(L.reduceRight).exist
    expect(L.foldMap).exist
    expect(L.toReadonlyArray).exist
    expect(L.toReadonlyArrayWith).exist
    expect(L.reduceKind).exist
    expect(L.reduceRightKind).exist
    expect(L.foldMapKind).exist

    expect(L.Traversable).exist
    expect(L.traverse).exist
    expect(L.sequence).exist
    expect(L.traverseTap).exist

    expect(L.Compactable).exist
    expect(L.compact).exist
    expect(L.separate).exist

    expect(L.Filterable).exist
    expect(L.filterMap).exist
    expect(L.filter).exist
    expect(L.partition).exist
    expect(L.partitionMap).exist

    expect(L.TraversableFilterable).exist
    expect(L.traverseFilterMap).exist
    expect(L.traversePartitionMap).exist
    expect(L.traverseFilter).exist
    expect(L.traversePartition).exist
  })

  it("constructs a list via builder", () => {
    const builder = LB.empty<number>()
    for (let i = 0; i <= 3; i++) {
      pipe(builder, LB.append(i))
    }
    U.assertTrue(pipe(builder, LB.toList, equals(L.List(0, 1, 2, 3))))
  })

  it("sort", () => {
    expect(pipe(L.List(0, 1, 3, 2), L.sort(Number.Order))).toStrictEqual(L.List(0, 1, 2, 3))
  })
})
