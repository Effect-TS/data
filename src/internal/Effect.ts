/** @internal */
export const EffectTypeId = Symbol.for("@effect/io/Effect")

/** @internal */
export const effectVariance = {
  _R: (_: never) => _,
  _E: (_: never) => _,
  _A: (_: never) => _
}
