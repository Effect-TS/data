/**
 * @since 1.0.0
 */
import type { These } from "@fp-ts/data/These"

/** @internal */
export const isThese = (u: unknown): u is These<unknown, unknown> =>
  typeof u === "object" &&
  u != null && "_tag" in u &&
  (u["_tag"] === "Left" || u["_tag"] === "Right" || u["_tag"] === "Both")
