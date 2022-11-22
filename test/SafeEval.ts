import { pipe } from "@fp-ts/data/Function"
import * as SafeEval from "@fp-ts/data/SafeEval"
import { deepStrictEqual } from "@fp-ts/data/test/util"

describe.concurrent("SafeEval", () => {
  it("flatMap", () => {
    const program = pipe(
      SafeEval.succeed(0),
      SafeEval.flatMap((n) => SafeEval.succeed(n + 1))
    )
    const result = SafeEval.execute(program)

    assert.strictEqual(result, 1)
  })

  it("gen", () => {
    const program = SafeEval.gen(function*() {
      const a = yield* SafeEval.succeed(0)
      const b = yield* SafeEval.succeed(1)
      const c = yield* SafeEval.succeed(2)
      return a + b + c
    })
    const result = SafeEval.execute(program)

    assert.strictEqual(result, 3)
  })

  it("map", () => {
    const program = pipe(
      SafeEval.succeed(0),
      SafeEval.map((n) => n + 1)
    )
    const result = SafeEval.execute(program)

    assert.strictEqual(result, 1)
  })

  it("reduce", () => {
    const program = SafeEval.reduce(
      [1, 2, 3, 4, 5],
      0,
      (acc, a) => SafeEval.succeed(acc + a)
    )
    const result = SafeEval.execute(program)

    assert.strictEqual(result, 15)
  })

  it("struct", () => {
    const program = SafeEval.struct({
      a: SafeEval.succeed("a"),
      b: SafeEval.succeed("b"),
      c: SafeEval.succeed("c")
    })
    const result = SafeEval.execute(program)

    deepStrictEqual(result, { a: "a", b: "b", c: "c" })
  })

  it("tap", () => {
    const program = pipe(
      SafeEval.succeed(0),
      SafeEval.tap((n) => SafeEval.succeed(n + 1))
    )
    const result = SafeEval.execute(program)

    assert.strictEqual(result, 0)
  })

  // it("tuple", () => {
  //   const program = Eval.tuple(SafeEval.succeed(0), Eval("a"), Eval(true))

  //   const result = SafeEval.execute(program)

  //   assert.isTrue(result == [0, "a", true])
  // })

  it("unit", () => {
    const result = SafeEval.execute(SafeEval.unit)

    assert.isUndefined(result)
  })

  it("zip", () => {
    const program = pipe(
      SafeEval.succeed(0),
      SafeEval.zip(SafeEval.succeed(1))
    )
    const result = SafeEval.execute(program)

    deepStrictEqual(result, [0, 1])
  })

  it("zipLeft", () => {
    const program = pipe(
      SafeEval.succeed(0),
      SafeEval.zipLeft(SafeEval.succeed(1))
    )
    const result = SafeEval.execute(program)

    assert.strictEqual(result, 0)
  })

  it("zipRight", () => {
    const program = pipe(
      SafeEval.succeed(0),
      SafeEval.zipRight(SafeEval.succeed(1))
    )
    const result = SafeEval.execute(program)

    assert.strictEqual(result, 1)
  })

  it("zipWith", () => {
    const program = pipe(
      SafeEval.succeed(0),
      SafeEval.zipWith(SafeEval.succeed(1), (a, b) => a + b)
    )
    const result = SafeEval.execute(program)

    assert.strictEqual(result, 1)
  })

  it("stack safety", () => {
    function fib(n: number): SafeEval.SafeEval<number> {
      if (n <= 1) {
        return SafeEval.succeed(n)
      }
      return pipe(
        SafeEval.suspend(() => fib(n - 1)),
        SafeEval.zipWith(SafeEval.suspend(() => fib(n - 2)), (a, b) => a + b)
      )
    }
    const result = SafeEval.execute(fib(20))

    assert.strictEqual(result, 6765)
  })
})
