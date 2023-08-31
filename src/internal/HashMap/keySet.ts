import type { HashMap } from "@effect/data/HashMap"
import type { HashSet } from "@effect/data/HashSet"
import { makeImpl } from "@effect/data/internal/HashSet"

/** @internal */
export function keySet<K, V>(self: HashMap<K, V>): HashSet<K> {
  return makeImpl(self)
}
