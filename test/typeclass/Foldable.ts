import { pipe } from "@effect/data/Function"
import * as N from "@effect/data/Number"
import * as O from "@effect/data/Option"
import * as RA from "@effect/data/ReadonlyArray"
import * as _ from "@effect/data/typeclass/Foldable"
import * as U from "../util"

describe.concurrent("Foldable", () => {
  it("reduceComposition", () => {
    const reduce = _.reduceComposition(RA.Foldable, RA.Foldable)
    const f = (b: string, a: string) => b + a
    U.deepStrictEqual(reduce([], "-", f), "-")
    U.deepStrictEqual(reduce([[]], "-", f), "-")
    U.deepStrictEqual(reduce([["a", "c"], ["b", "d"]], "-", f), "-acbd")
  })

  it("toArray", () => {
    const toArray = _.toArray(O.Foldable)
    U.deepStrictEqual(toArray(O.none()), [])
    U.deepStrictEqual(toArray(O.some(2)), [2])
  })

  it("toArrayMap", () => {
    const toArrayMap = _.toArrayMap(O.Foldable)
    U.deepStrictEqual(toArrayMap(O.none(), U.double), [])
    U.deepStrictEqual(toArrayMap(O.some(2), U.double), [4])
  })

  it("combineMap", () => {
    const combineMap = _.combineMap(RA.Foldable)
    U.deepStrictEqual(combineMap(N.MonoidSum)([1, 2, 3], U.double), 12)
  })

  it("reduceKind", () => {
    const reduceKind = _.reduceKind(RA.Foldable)(O.Monad)
    U.deepStrictEqual(reduceKind([], "-", () => O.none()), O.some("-"))
    U.deepStrictEqual(reduceKind(["a"], "-", () => O.none()), O.none())
    U.deepStrictEqual(
      reduceKind(["a", "b", "c"], "-", (b, a) => O.some(b + a)),
      O.some("-abc")
    )
    U.deepStrictEqual(
      reduceKind(["a", "b", "c"], "-", (b, a) => a === "b" ? O.none() : O.some(b + a)),
      O.none()
    )
  })

  it("coproductMapKind", () => {
    const coproductMapKind = _.coproductMapKind(RA.Foldable)(O.Alternative)
    U.deepStrictEqual(pipe([], coproductMapKind(() => O.none())), O.none())
    U.deepStrictEqual(pipe(["a"], coproductMapKind(() => O.none())), O.none())
    U.deepStrictEqual(pipe(["a", "b", "c"], coproductMapKind((a) => O.some(a))), O.some("a"))
    U.deepStrictEqual(
      pipe(["a", "b", "c"], coproductMapKind((a) => a === "b" ? O.none() : O.some(a))),
      O.some("a")
    )
  })

  it("length", () => {
    const length = _.length(RA.Foldable)
    U.deepStrictEqual(pipe([], length), 0)
    U.deepStrictEqual(pipe([1], length), 1)
    U.deepStrictEqual(pipe([1, 2], length), 2)
  })

  it("isEmpty", () => {
    const isEmpty = _.isEmpty(RA.Foldable)
    U.deepStrictEqual(pipe([], isEmpty), true)
    U.deepStrictEqual(pipe([1], isEmpty), false)
    U.deepStrictEqual(pipe([""], isEmpty), false)
  })

  it("contains", () => {
    const contains = _.contains(RA.Foldable)(N.Equivalence)
    U.deepStrictEqual(pipe([], contains(1)), false)
    U.deepStrictEqual(pipe([0], contains(1)), false)
    U.deepStrictEqual(contains([0, 1], 1), true)
    U.deepStrictEqual(contains([3, 2, 1], 1), true)
  })

  it("sum", () => {
    const sum = _.sum(RA.Foldable)
    U.deepStrictEqual(pipe([], sum), 0)
    U.deepStrictEqual(pipe([0], sum), 0)
    U.deepStrictEqual(pipe([1], sum), 1)
    U.deepStrictEqual(pipe([1, 2], sum), 3)
  })

  it("sumBigint", () => {
    const sumBigint = _.sumBigint(RA.Foldable)
    U.deepStrictEqual(pipe([], sumBigint), 0n)
    U.deepStrictEqual(pipe([0n], sumBigint), 0n)
    U.deepStrictEqual(pipe([1n], sumBigint), 1n)
    U.deepStrictEqual(pipe([1n, 2n], sumBigint), 3n)
  })

  it("product", () => {
    const product = _.product(RA.Foldable)
    U.deepStrictEqual(pipe([], product), 1)
    U.deepStrictEqual(pipe([0], product), 0)
    U.deepStrictEqual(pipe([1], product), 1)
    U.deepStrictEqual(pipe([1, 2], product), 2)
  })

  it("productBigint", () => {
    const productBigint = _.productBigint(RA.Foldable)
    U.deepStrictEqual(pipe([], productBigint), 1n)
    U.deepStrictEqual(pipe([0n], productBigint), 0n)
    U.deepStrictEqual(pipe([1n], productBigint), 1n)
    U.deepStrictEqual(pipe([1n, 2n], productBigint), 2n)
  })

  it("and", () => {
    const and = _.and(RA.Foldable)
    U.deepStrictEqual(pipe([], and), true)
    U.deepStrictEqual(pipe([true], and), true)
    U.deepStrictEqual(pipe([false], and), false)
    U.deepStrictEqual(pipe([true, false], and), false)
    U.deepStrictEqual(pipe([true, true], and), true)
  })

  it("or", () => {
    const or = _.or(RA.Foldable)
    U.deepStrictEqual(pipe([], or), false)
    U.deepStrictEqual(pipe([true], or), true)
    U.deepStrictEqual(pipe([false], or), false)
    U.deepStrictEqual(pipe([true, false], or), true)
    U.deepStrictEqual(pipe([true, true], or), true)
  })

  it("every", () => {
    const every = _.every(RA.Foldable)
    const isEven = (n: number) => n % 2 === 0

    U.deepStrictEqual(pipe([], every(isEven)), true)
    U.deepStrictEqual(pipe([2], every(isEven)), true)
    U.deepStrictEqual(pipe([1], every(isEven)), false)
    U.deepStrictEqual(pipe([1, 2], every(isEven)), false)
    U.deepStrictEqual(pipe([2, 4], every(isEven)), true)
  })

  it("any", () => {
    const any = _.any(RA.Foldable)
    const isEven = (n: number) => n % 2 === 0

    U.deepStrictEqual(pipe([], any(isEven)), false)
    U.deepStrictEqual(pipe([2], any(isEven)), true)
    U.deepStrictEqual(pipe([1], any(isEven)), false)
    U.deepStrictEqual(pipe([1, 2], any(isEven)), true)
    U.deepStrictEqual(pipe([1, 2, 3], any(isEven)), true)
  })
})
