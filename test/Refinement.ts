import * as Boolean from "@fp-ts/data/Boolean"
import { pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import * as Option from "@fp-ts/data/Option"
import * as Refinement from "@fp-ts/data/Refinement"
import * as Result from "@fp-ts/data/Result"
import * as String from "@fp-ts/data/String"
import { deepStrictEqual, strictEqual } from "@fp-ts/data/test/util"

interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol
}

type NonEmptyString = string & NonEmptyStringBrand

const NonEmptyString: Refinement.Refinement<string, NonEmptyString> = (s): s is NonEmptyString =>
  s.length > 0

describe("Refinement", () => {
  it("not", () => {
    const r1: Refinement.Refinement<string | number, string> = String.isString
    const r2 = Refinement.not(r1)
    deepStrictEqual(r2("a"), false)
    deepStrictEqual(r2(1), true)
  })

  it("or", () => {
    const r = pipe(
      String.isString,
      Refinement.or(Number.isNumber),
      Refinement.or(Boolean.isBoolean)
    )
    deepStrictEqual(r({}), false)
    deepStrictEqual(r("a"), true)
    deepStrictEqual(r(1), true)
    deepStrictEqual(r(true), true)
  })

  it("and", () => {
    const ra = (r: Readonly<Record<string, unknown>>): r is { readonly a: string } =>
      String.isString(r["a"])
    const rb = (r: Readonly<Record<string, unknown>>): r is { readonly b: number } =>
      Number.isNumber(r["b"])
    const r = pipe(ra, Refinement.and(rb))
    deepStrictEqual(r({ a: "a" }), false)
    deepStrictEqual(r({ b: 1 }), false)
    deepStrictEqual(r({}), false)
    deepStrictEqual(r({ a: "a", b: "b" }), false)
    deepStrictEqual(r({ a: 1, b: 2 }), false)
    deepStrictEqual(r({ a: "a", b: 1 }), true)
  })

  it("liftOption", () => {
    const f = (
      s: string | number
    ): Option.Option<string> => (typeof s === "string" ? Option.some(s) : Option.none)
    const isString = Refinement.liftOption(f)
    deepStrictEqual(isString("s"), true)
    deepStrictEqual(isString(1), false)
    type A = { readonly type: "A" }
    type B = { readonly type: "B" }
    type C = A | B
    const isA = Refinement.liftOption<C, A>((c) => (c.type === "A" ? Option.some(c) : Option.none))
    deepStrictEqual(isA({ type: "A" }), true)
    deepStrictEqual(isA({ type: "B" }), false)
  })

  it("emptyKind", () => {
    const refinement = Refinement.empty()
    strictEqual(refinement("a"), false)
  })

  it("id", () => {
    const refinement = Refinement.id<string>()
    strictEqual(refinement("a"), true)
  })

  it("compose", () => {
    const refinement = pipe(String.isString, Refinement.compose(NonEmptyString))
    strictEqual(refinement("a"), true)
    strictEqual(refinement(null), false)
    strictEqual(refinement(""), false)
  })

  it("liftResult", () => {
    const f = (s: string | number): Result.Result<string, string> =>
      typeof s === "string" ? Result.succeed(s) : Result.fail("not a string")
    const isString = Refinement.liftResult(f)
    deepStrictEqual(isString("s"), true)
    deepStrictEqual(isString(1), false)
    type A = { readonly type: "A" }
    type B = { readonly type: "B" }
    type C = A | B
    const isA = Refinement.liftResult<C, A>((
      c
    ) => (c.type === "A" ? Result.succeed(c) : Result.fail("not as A")))
    deepStrictEqual(isA({ type: "A" }), true)
    deepStrictEqual(isA({ type: "B" }), false)
  })
})
