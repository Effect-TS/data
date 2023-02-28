import { zeroArgsDual } from "@effect/data/Function"
import type { HashMap } from "@effect/data/HashMap"
import type { HashSet } from "@effect/data/HashSet"
import { HashSetImpl } from "@effect/data/internal/HashSet"

/** @internal */
export const keySet = zeroArgsDual(<K, V>(self: HashMap<K, V>): HashSet<K> => new HashSetImpl(self))
