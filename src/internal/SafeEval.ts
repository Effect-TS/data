import * as Equal from "@fp-ts/data/Equal"
import type { LazyArg } from "@fp-ts/data/Function"
import { constant, constVoid, identity } from "@fp-ts/data/Function"
import { Stack } from "@fp-ts/data/internal/Stack"
import type * as SE from "@fp-ts/data/SafeEval"

export const SafeEvalTypeId: SE.TypeId = Symbol.for("@fp-ts/data/SafeEval") as SE.TypeId

type SafeEvalInternal<A> = Succeed<A> | FlatMap<any, A> | Suspend<A>

function variance<A, B>(_: A): B {
  return _ as unknown as B
}

class Succeed<A> implements SE.SafeEval<A>, Equal.Equal {
  readonly _tag = "Succeed"
  readonly _A: (_: never) => A = variance
  readonly _id: SE.TypeId = SafeEvalTypeId
  constructor(readonly a: LazyArg<A>) {}
  [Equal.symbolEqual](that: unknown) {
    return this === that
  }
  [Equal.symbolHash]() {
    return Equal.hashRandom(this)
  }
}

class Suspend<A> implements SE.SafeEval<A>, Equal.Equal {
  readonly _tag = "Suspend"
  readonly _A: (_: never) => A = variance
  readonly _id: SE.TypeId = SafeEvalTypeId
  constructor(readonly f: LazyArg<SafeEvalInternal<A>>) {}
  [Equal.symbolEqual](that: unknown) {
    return this === that
  }
  [Equal.symbolHash]() {
    return Equal.hashRandom(this)
  }
}

class FlatMap<A, B> implements SE.SafeEval<B>, Equal.Equal {
  readonly _tag = "FlatMap"
  readonly _A: (_: never) => B = variance
  readonly _id: SE.TypeId = SafeEvalTypeId
  constructor(
    readonly value: SafeEvalInternal<A>,
    readonly cont: (a: A) => SafeEvalInternal<B>
  ) {}
  [Equal.symbolEqual](that: unknown) {
    return this === that
  }
  [Equal.symbolHash]() {
    return Equal.hashRandom(this)
  }
}

/** @internal */
export class GenSafeEval<A> {
  readonly _A: (_: never) => A = variance
  constructor(readonly computation: SE.SafeEval<A>) {}
  *[Symbol.iterator](): Generator<GenSafeEval<A>, A, any> {
    return yield this
  }
}

/** @internal */
export const unit: SE.SafeEval<void> = new Succeed(constVoid)

/** @internal */
export function succeed<A>(a: A): SE.SafeEval<A> {
  return new Succeed(constant(a))
}

/** @internal */
export function sync<A>(a: LazyArg<A>): SE.SafeEval<A> {
  return new Succeed(a)
}

/** @internal */
export function suspend<A>(f: LazyArg<SE.SafeEval<A>>): SE.SafeEval<A> {
  return new Suspend(f as LazyArg<SafeEvalInternal<A>>)
}

/** @internal */
export function struct<NER extends Record<string, SE.SafeEval<any>>>(
  r: (keyof NER extends never ? never : NER) & Record<string, SE.SafeEval<any>>
): SE.SafeEval<
  {
    [K in keyof NER]: [NER[K]] extends [SE.SafeEval<infer A>] ? A : never
  }
> {
  const entries = Object.entries(r)
  if (entries.length === 1) {
    const [key, value] = entries[0]!
    // @ts-expect-error
    return value.map((a) => ({ [key]: a }))
  }
  // @ts-expect-error
  return suspend(() => {
    const [k1, e1] = entries[0]!
    const init = map((a) => ({ [k1]: a }))(e1)
    const rest = entries.slice(1)
    return rest.reduce(
      (acc: SE.SafeEval<{ [k: string]: any }>, [k2, e2]) => {
        return zipWith(
          map((b) => ({ [k2]: b }))(e2),
          (a: Record<string, any>, b) => ({ ...a, ...b })
        )(acc)
      },
      init
    )
  })
}

/** @internal */
export function tuple<EN extends ReadonlyArray<SE.SafeEval<any>>>(
  ...[e1, e2, ...es]: EN & {
    readonly 0: SE.SafeEval<any>
    readonly 1: SE.SafeEval<any>
  }
): SE.SafeEval<
  Readonly<
    {
      [K in keyof EN]: [EN[K]] extends [SE.SafeEval<infer A>] ? A : never
    }
  >
> {
  const init = zip(e2)(e1)
  return es.reduce(
    (acc: SE.SafeEval<Array<any>>, v) => zipWith(v, (a: Array<any>, b) => [...a, b])(acc),
    init
  )
}

/** @internal */
export function reduce<A, B>(
  as: Iterable<A>,
  b: B,
  f: (b: B, a: A) => SE.SafeEval<B>
): SE.SafeEval<B> {
  return Array.from(as).reduce((b, a) => flatMap((b: B) => f(b, a))(b), succeed(b))
}

/** @internal */
export function gen<Eff extends GenSafeEval<any>, AEff>(
  f: (i: { <A>(_: SE.SafeEval<A>): GenSafeEval<A> }) => Generator<Eff, AEff, any>
): SE.SafeEval<AEff> {
  return suspend(() => {
    const iterator = f(genAdapter)
    const state = iterator.next()
    return runGen(state, iterator)
  })
}

/** @internal */
export function execute<A>(self: SE.SafeEval<A>): A {
  let stack: Stack<(e: any) => SafeEvalInternal<any>> | undefined = undefined
  let a = undefined
  let curIO = self as SafeEvalInternal<A> | undefined
  while (curIO != null) {
    switch (curIO._tag) {
      case "FlatMap": {
        switch (curIO.value._tag) {
          case "Succeed": {
            curIO = curIO.cont(curIO.value.a())
            break
          }
          default: {
            stack = new Stack(curIO.cont, stack)
            curIO = curIO.value
          }
        }

        break
      }
      case "Suspend": {
        curIO = curIO.f()
        break
      }
      case "Succeed": {
        a = curIO.a()
        if (stack) {
          curIO = stack.value(a)
          stack = stack.previous
        } else {
          curIO = undefined
        }
        break
      }
    }
  }
  // @ts-expect-error
  return a
}

/** @internal */
export function zip<B>(that: SE.SafeEval<B>) {
  return <A>(self: SE.SafeEval<A>): SE.SafeEval<readonly [A, B]> => {
    return zipWith(that, (a: A, b: B) => [a, b] as const)(self)
  }
}

/** @internal */
export function zipLeft<B>(that: SE.SafeEval<B>) {
  return <A>(self: SE.SafeEval<A>): SE.SafeEval<A> => {
    return zipWith(that, (a: A, _) => a)(self)
  }
}

/** @internal */
export function zipRight<B>(that: SE.SafeEval<B>) {
  return <A>(self: SE.SafeEval<A>): SE.SafeEval<B> => {
    return zipWith(that, (_: A, b) => b)(self)
  }
}

/** @internal */
export function zipWith<A, B, C>(that: SE.SafeEval<B>, f: (a: A, b: B) => C) {
  return (self: SE.SafeEval<A>): SE.SafeEval<C> => {
    return flatMap((a: A) => map((b: B) => f(a, b))(that))(self)
  }
}

/** @internal */
export function map<A, B>(f: (a: A) => B) {
  return (self: SE.SafeEval<A>): SE.SafeEval<B> => {
    return flatMap((a: A) => succeed(f(a)))(self)
  }
}

/** @internal */
export function flatMap<A, B>(f: (a: A) => SE.SafeEval<B>) {
  return (self: SE.SafeEval<A>): SE.SafeEval<B> => {
    return new FlatMap(self as SafeEvalInternal<A>, f as (a: A) => SafeEvalInternal<B>)
  }
}

/** @internal */
export function flatten<A>(self: SE.SafeEval<SE.SafeEval<A>>): SE.SafeEval<A> {
  return flatMap<SE.SafeEval<A>, A>(identity)(self)
}

/** @internal */
export function tap<A, X>(f: (a: A) => SE.SafeEval<X>) {
  return (self: SE.SafeEval<A>): SE.SafeEval<A> => {
    return flatMap((a: A) => map(() => a)(f(a)))(self)
  }
}

function genAdapter<A>(_: SE.SafeEval<A>): GenSafeEval<A> {
  return new GenSafeEval(_)
}

function runGen<Eff extends GenSafeEval<any>, AEff>(
  state: IteratorYieldResult<Eff> | IteratorReturnResult<AEff>,
  iterator: Generator<Eff, AEff, any>
): SE.SafeEval<AEff> {
  if (state.done) {
    return succeed(state.value)
  }
  return flatMap((val) => {
    const next = iterator.next(val)
    return runGen(next, iterator)
  })(state.value["computation"])
}
