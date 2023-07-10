import { pipe } from '@effect/data/Function'
import * as RA from '@effect/data/ReadonlyArray'
import * as Option from '@effect/data/Option'
import * as Predicate from '@effect/data/Predicate'

declare const nerns: RA.NonEmptyReadonlyArray<number>
declare const nens: RA.NonEmptyArray<number>
declare const rns: ReadonlyArray<number>
declare const ns: Array<number>
declare const nss: Array<number | string>

// -------------------------------------------------------------------------------------
// isEmptyReadonlyArray
// -------------------------------------------------------------------------------------

if (RA.isEmptyReadonlyArray(rns)) {
  // $ExpectType readonly []
  rns
}

// $ExpectType <A>(c: readonly A[]) => Option<readonly []>
Option.liftPredicate(RA.isEmptyReadonlyArray)

// -------------------------------------------------------------------------------------
// isEmptyArray
// -------------------------------------------------------------------------------------

if (RA.isEmptyArray(ns)) {
  // $ExpectType []
  ns
}

// $ExpectType <A>(c: A[]) => Option<[]>
Option.liftPredicate(RA.isEmptyArray)

// -------------------------------------------------------------------------------------
// isNonEmptyReadonlyArray
// -------------------------------------------------------------------------------------

if (RA.isNonEmptyReadonlyArray(rns)) {
  // $ExpectType readonly [number, ...number[]]
  rns
}

// $ExpectType <A>(c: readonly A[]) => Option<readonly [A, ...A[]]>
Option.liftPredicate(RA.isNonEmptyReadonlyArray)

// -------------------------------------------------------------------------------------
// isNonEmptyArray
// -------------------------------------------------------------------------------------

if (RA.isNonEmptyArray(ns)) {
  // $ExpectType [number, ...number[]]
  ns
}

// $ExpectType <A>(c: A[]) => Option<[A, ...A[]]>
Option.liftPredicate(RA.isNonEmptyArray)

// -------------------------------------------------------------------------------------
// map
// -------------------------------------------------------------------------------------

// $ExpectType number[]
RA.map(rns, n => n + 1)

// $ExpectType number[]
pipe(rns, RA.map(n => n + 1))

// $ExpectType number[]
RA.map(ns, n => n + 1)

// $ExpectType number[]
pipe(ns, RA.map(n => n + 1))

// -------------------------------------------------------------------------------------
// mapNonEmpty
// -------------------------------------------------------------------------------------

// $ExpectType [number, ...number[]]
RA.mapNonEmpty(nerns, n => n + 1)

// $ExpectType [number, ...number[]]
pipe(nerns, RA.mapNonEmpty(n => n + 1))

// $ExpectType [number, ...number[]]
RA.mapNonEmpty(nens, n => n + 1)

// $ExpectType [number, ...number[]]
pipe(nens, RA.mapNonEmpty(n => n + 1))

// -------------------------------------------------------------------------------------
// groupBy
// -------------------------------------------------------------------------------------

// baseline
// $ExpectType Record<string, [number, ...number[]]>
RA.groupBy([1, 2, 3], String)

// should not return a struct (Record<'positive' | 'negative', ...>) when using string type literals
// $ExpectType Record<string, [number, ...number[]]>
RA.groupBy([1, 2, 3], n => n > 0 ? 'positive' as const : 'negative' as const)

// -------------------------------------------------------------------------------------
// some
// -------------------------------------------------------------------------------------

if (RA.some(nss, Predicate.isString)) {
  nss // $ExpectType (string | number)[] & readonly [string | number, ...(string | number)[]]
}

if (RA.some(Predicate.isString)(nss)) {
  nss // $ExpectType (string | number)[] & readonly [string | number, ...(string | number)[]]
}

// -------------------------------------------------------------------------------------
// every
// -------------------------------------------------------------------------------------

if (RA.every(nss, Predicate.isString)) {
  nss // $ExpectType (string | number)[] & readonly string[]
}

if (RA.every(Predicate.isString)(nss)) {
  nss // $ExpectType (string | number)[] & readonly string[]
}
