import * as Equivalence from "@fp-ts/data/Equivalence"
import { pipe } from "@fp-ts/data/Function"

describe("Equivalence", () => {
  it("string", () => {
    assert.isTrue(Equivalence.string("ok")("ok"))
    assert.isFalse(Equivalence.string("ok")("no"))
  })
  it("number", () => {
    assert.isTrue(Equivalence.number(10)(10))
    assert.isFalse(Equivalence.number(10)(20))
  })
  it("bigint", () => {
    assert.isTrue(Equivalence.bigint(10n)(10n))
    assert.isFalse(Equivalence.bigint(10n)(20n))
  })
  it("bigint", () => {
    assert.isTrue(Equivalence.symbol(Symbol.for("hello"))(Symbol.for("hello")))
    assert.isFalse(Equivalence.symbol(Symbol.for("hello"))(Symbol.for("hello/no")))
  })
  it("contramap", () => {
    interface User {
      id: string
      name: string
    }
    const eq = pipe(Equivalence.string, Equivalence.contramap((_: User) => _.id))
    assert.isTrue(eq({ id: "ok", name: "a" })({ name: "b", id: "ok" }))
    assert.isFalse(eq({ id: "ok", name: "a" })({ name: "b", id: "no" }))
  })
  it("struct", () => {
    const eq = Equivalence.struct({
      name: Equivalence.string,
      id: Equivalence.string
    })
    assert.isTrue(eq({ id: "ok", name: "a" })({ name: "a", id: "ok" }))
    assert.isTrue(eq({ id: "ok", name: "a" })({ id: "ok", name: "a" }))
    assert.isFalse(eq({ id: "ok", name: "a" })({ name: "b", id: "no" }))
  })
  it("tuple", () => {
    const eq = Equivalence.tuple(Equivalence.string, Equivalence.string)
    assert.isTrue(eq(["a", "b"])(["a", "b"]))
    assert.isFalse(eq(["a", "b"])(["a", "c"]))
  })
})
