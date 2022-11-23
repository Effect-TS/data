/**
 * @since 1.0.0
 */
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import type { Monad } from "@fp-ts/core/typeclass/Monad"
import { pipe } from "@fp-ts/data/Function"
import { SingleShotGen } from "@fp-ts/data/internal/Context"

/**
 * @category symbols
 * @since 1.0.0
 */
export const GenKindTypeId = Symbol.for("@fp-ts/data/Gen/GenKind")

/**
 * @category symbols
 * @since 1.0.0
 */
export type GenKindTypeId = typeof GenKindTypeId

/**
 * @category models
 * @since 1.0.0
 */
export interface GenKind<F extends TypeLambda, R, O, E, A> extends Variance<F, R, O, E> {
  readonly value: Kind<F, R, O, E, A>

  [Symbol.iterator](): Generator<GenKind<F, R, O, E, A>, A>
}

// @ts-expect-error
class GenKindImpl<F extends TypeLambda, R, O, E, A> implements GenKind<F, R, O, E, A> {
  constructor(
    readonly value: Kind<F, R, O, E, A>
  ) {}

  [Symbol.iterator](): Generator<GenKind<F, R, O, E, A>, A> {
    // @ts-expect-error
    return new SingleShotGen<GenKind<F, R, O, E, A>, A>(this)
  }
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const makeGenKind = <F extends TypeLambda, R, O, E, A>(
  kind: Kind<F, R, O, E, A>
): GenKind<F, R, O, E, A> =>
  // @ts-expect-error
  new GenKindImpl(kind)

/**
 * @category models
 * @since 1.0.0
 */
export interface Variance<F extends TypeLambda, R, O, E> {
  readonly [GenKindTypeId]: GenKindTypeId
  readonly _F: F
  readonly _R: (_R: R) => unknown
  readonly _O: () => O
  readonly _E: () => E
}

/**
 * @category models
 * @since 1.0.0
 */
export interface Gen<F extends TypeLambda, Z> {
  <K extends Variance<F, any, any, any>, A>(
    body: (resume: Z) => Generator<K, A>
  ): Kind<
    F,
    [K] extends [Variance<F, infer R, any, any>] ? R : never,
    [K] extends [Variance<F, any, infer O, any>] ? O : never,
    [K] extends [Variance<F, any, any, infer E>] ? E : never,
    A
  >
}

/**
 * @category models
 * @since 1.0.0
 */
export interface Adapter<F extends TypeLambda> {
  <R, O, E, A>(
    self: Kind<F, R, O, E, A>
  ): GenKind<F, R, O, E, A>
}

/**
 * @category adapters
 * @since 1.0.0
 */
export const adapter: <F extends TypeLambda>() => Adapter<F> = () =>
  (kind) =>
    // @ts-expect-error
    new GenKindImpl(kind)

function runGen<F extends TypeLambda, K extends GenKind<F, any, any, any, any>, AEff>(
  F: Monad<F>,
  state: IteratorYieldResult<K> | IteratorReturnResult<AEff>,
  iterator: Generator<K, AEff, any>
): Kind<F, any, any, any, any> {
  if (state.done) {
    return F.of(state.value)
  }
  return F.flatMap((val) => {
    const next = iterator.next(val)
    return runGen(F, next, iterator)
  })(state.value.value)
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const singleShot: <F extends TypeLambda>(
  F: Monad<F>
) => <Z extends Adapter<F>>(adapter: Z) => Gen<F, Z> = (F) =>
  (adapter) =>
    (body) =>
      pipe(
        F.of(void 0),
        F.flatMap(() => {
          const iterator = body(adapter)
          const state = iterator.next()
          // @ts-expect-error
          return runGen(F, state, iterator)
        })
      )
