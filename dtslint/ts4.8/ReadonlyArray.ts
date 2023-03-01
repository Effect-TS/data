import { pipe } from '@effect/data/Function'
import * as RA from '@effect/data/ReadonlyArray'
import * as O from '@effect/data/Option'
import * as Brand from '@effect/data/Brand'

declare const neras: RA.NonEmptyReadonlyArray<number>
declare const neas: RA.NonEmptyArray<number>
declare const ras: ReadonlyArray<number>
declare const as: Array<number>

// -------------------------------------------------------------------------------------
// isEmptyReadonlyArray
// -------------------------------------------------------------------------------------

if (RA.isEmptyReadonlyArray(ras)) {
  // $ExpectType readonly []
  ras
}

// $ExpectType <A>(c: readonly A[]) => Option<readonly []>
O.liftPredicate(RA.isEmptyReadonlyArray())

// -------------------------------------------------------------------------------------
// isEmptyArray
// -------------------------------------------------------------------------------------

if (RA.isEmptyArray(as)) {
  // $ExpectType []
  as
}

// $ExpectType <A>(c: A[]) => Option<[]>
O.liftPredicate(RA.isEmptyArray())

// -------------------------------------------------------------------------------------
// isNonEmptyReadonlyArray
// -------------------------------------------------------------------------------------

if (RA.isNonEmptyReadonlyArray(ras)) {
  // $ExpectType readonly [number, ...number[]]
  ras
}

// $ExpectType <A>(c: readonly A[]) => Option<readonly [A, ...A[]]>
O.liftPredicate(RA.isNonEmptyReadonlyArray())

// -------------------------------------------------------------------------------------
// isNonEmptyArray
// -------------------------------------------------------------------------------------

if (RA.isNonEmptyArray(as)) {
  // $ExpectType [number, ...number[]]
  as
}

// $ExpectType <A>(c: A[]) => Option<[A, ...A[]]>
O.liftPredicate(RA.isNonEmptyArray())

// -------------------------------------------------------------------------------------
// map
// -------------------------------------------------------------------------------------

// $ExpectType number[]
RA.map(ras, n => n + 1)

// $ExpectType number[]
pipe(ras, RA.map(n => n + 1))

// $ExpectType number[]
RA.map(as, n => n + 1)

// $ExpectType number[]
pipe(as, RA.map(n => n + 1))

// -------------------------------------------------------------------------------------
// mapNonEmpty
// -------------------------------------------------------------------------------------

// $ExpectType [number, ...number[]]
RA.mapNonEmpty(neras, n => n + 1)

// $ExpectType [number, ...number[]]
pipe(neras, RA.mapNonEmpty(n => n + 1))

// $ExpectType [number, ...number[]]
RA.mapNonEmpty(neas, n => n + 1)

// $ExpectType [number, ...number[]]
pipe(neas, RA.mapNonEmpty(n => n + 1))

// -------------------------------------------------------------------------------------
// groupBy
// -------------------------------------------------------------------------------------

// baseline
// $ExpectType Record<string, [number, ...number[]]>
RA.groupBy([1, 2, 3], String)

// should not return a struct (Record<'positive' | 'negative', ...>) when using string type literals
// $ExpectType Record<string, [number, ...number[]]>
RA.groupBy([1, 2, 3], n => n > 0 ? 'positive' as const : 'negative' as const)
