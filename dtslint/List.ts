import * as List from '@effect/data/List'
import * as Predicate from '@effect/data/Predicate'

declare const nss: List.List<number | string>

// -------------------------------------------------------------------------------------
// every
// -------------------------------------------------------------------------------------

if (List.every(nss, Predicate.isString)) {
  nss // $ExpectType List<string>
}

if (List.every(Predicate.isString)(nss)) {
  nss // $ExpectType List<string>
}
