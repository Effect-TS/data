import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import * as Context from "@fp-ts/data/Context"
import { deepEqual } from "@fp-ts/data/DeepEqual"

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
  it("adds and retrieve services", () => {
    const Services = pipe(
      Context.empty(),
      Context.add(A)({ a: 0 }),
      Context.add(B)({ b: 1 })
    )

    assert.isTrue(pipe(
      Services,
      Context.get(A),
      deepEqual({ a: 0 })
    ))

    assert.isTrue(pipe(
      Services,
      Context.getOption(B),
      deepEqual(O.some({ b: 1 }))
    ))

    assert.isTrue(pipe(
      Services,
      Context.getOption(C),
      deepEqual(O.none)
    ))

    assert.throw(() => {
      pipe(
        Services,
        Context.getUnsafe(C)
      )
    })
  })

  it("prunes services in env and merges", () => {
    const env = pipe(
      Context.empty(),
      Context.add(A)({ a: 0 }),
      Context.merge(pipe(
        Context.empty(),
        Context.add(B)({ b: 1 }),
        Context.add(C)({ c: 2 })
      ))
    )

    const pruned = pipe(
      env,
      Context.prune(A, B)
    )

    assert.isTrue(pipe(
      pruned,
      Context.get(A),
      deepEqual({ a: 0 })
    ))

    assert.isTrue(pipe(
      pruned,
      Context.getOption(B),
      deepEqual(O.some({ b: 1 }))
    ))

    assert.isTrue(pipe(
      pruned,
      Context.getOption(C),
      deepEqual(O.none)
    ))

    assert.isTrue(pipe(
      env,
      Context.getOption(C),
      deepEqual(O.some({ c: 2 }))
    ))
  })
})
