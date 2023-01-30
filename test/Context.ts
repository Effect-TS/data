import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import * as Context from "@fp-ts/data/Context"
import * as Differ from "@fp-ts/data/Differ"

interface A {
  a: number
}
const A = Context.Tag<A>()

interface B {
  b: number
}
const B = Context.Tag<B>()

interface C {
  c: number
}
const C = Context.Tag<C>()

describe.concurrent("Context", () => {
  it("global tag", () => {
    const a = Context.Tag<number>("@fp-ts/data/test/Context/Tag")
    const b = Context.Tag<number>("@fp-ts/data/test/Context/Tag")
    expect(a).toBe(b)
  })

  it("adds and retrieve services", () => {
    const Services = pipe(
      Context.make(A, { a: 0 }),
      Context.add(B, { b: 1 })
    )

    expect(Context.get(Services, A)).toEqual({ a: 0 })

    expect(pipe(
      Services,
      Context.getOption(B)
    )).toEqual(O.some({ b: 1 }))

    expect(pipe(
      Services,
      Context.getOption(C)
    )).toEqual(O.none())

    assert.throw(() => {
      pipe(
        Services,
        Context.unsafeGet(C)
      )
    })
  })

  it("prunes services in env and merges", () => {
    const env = pipe(
      Context.empty(),
      Context.add(A, { a: 0 }),
      Context.merge(pipe(
        Context.empty(),
        Context.add(B, { b: 1 }),
        Context.add(C, { c: 2 })
      ))
    )

    const pruned = pipe(
      env,
      Context.prune(A, B)
    )

    expect(pipe(
      pruned,
      Context.get(A)
    )).toEqual({ a: 0 })

    expect(pipe(
      pruned,
      Context.getOption(B)
    )).toEqual(O.some({ b: 1 }))

    expect(pipe(
      pruned,
      Context.getOption(C)
    )).toEqual(O.none())

    expect(pipe(
      env,
      Context.getOption(C)
    )).toEqual(O.some({ c: 2 }))
  })

  it("applies a patch to the environment", () => {
    const a: A = { a: 0 }
    const b: B = { b: 1 }
    const c: C = { c: 2 }
    const oldEnv = pipe(
      Context.empty(),
      Context.add(A, a),
      Context.add(B, b),
      Context.add(C, c)
    ) as Context.Context<A | B | C>
    const newEnv = pipe(
      Context.empty(),
      Context.add(A, a),
      Context.add(B, { b: 3 })
    ) as Context.Context<A | B | C>
    const differ = Differ.environment<A | B | C>()
    const patch = differ.diff(oldEnv, newEnv)
    const result = differ.patch(patch, oldEnv)

    assert.isTrue(O.isSome(Context.getOption(A)(result)))
    assert.isTrue(O.isSome(Context.getOption(B)(result)))
    assert.isTrue(O.isNone(Context.getOption(C)(result)))
    assert.strictEqual(pipe(result, Context.get(B)).b, 3)
  })

  it("creates a proper diff", () => {
    const a: A = { a: 0 }
    const b: B = { b: 1 }
    const c: C = { c: 2 }
    const oldEnv = pipe(
      Context.empty(),
      Context.add(A, a),
      Context.add(B, b),
      Context.add(C, c)
    ) as Context.Context<A | B | C>
    const newEnv = pipe(
      Context.empty(),
      Context.add(A, a),
      Context.add(B, { b: 3 })
    ) as Context.Context<A | B | C>
    const differ = Differ.environment<A | B | C>()
    const result = differ.diff(oldEnv, newEnv)

    assert.deepNestedPropertyVal(result, "first._tag", "AndThen")
    assert.deepNestedPropertyVal(result, "first.first._tag", "Empty")
    assert.deepNestedPropertyVal(result, "first.second._tag", "UpdateService")
    assert.deepNestedPropertyVal(result, "first.second.tag", B)
    assert.deepNestedPropertyVal(result, "second._tag", "RemoveService")
    assert.deepNestedPropertyVal(result, "second.tag", C)
  })
})
