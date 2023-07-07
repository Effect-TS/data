import * as HashSet from '@effect/data/HashSet'
import * as Predicate from '@effect/data/Predicate'

declare const nss: HashSet.HashSet<number | string>

// -------------------------------------------------------------------------------------
// every
// -------------------------------------------------------------------------------------

if (HashSet.every(nss, Predicate.isString)) {
  nss // $ExpectType HashSet<string>
}

if (HashSet.every(Predicate.isString)(nss)) {
  nss // $ExpectType HashSet<string>
}
