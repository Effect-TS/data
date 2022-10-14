import type { HashMap } from "@fp-ts/data/HashMap"
import type { HashSet } from "@fp-ts/data/HashSet"
import { HashSetImpl } from "@fp-ts/data/internal/HashSet"

/** @internal */
export function keySet<K, V>(self: HashMap<K, V>): HashSet<K> {
  return new HashSetImpl(self)
}
