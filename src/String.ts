/**
 * @since 1.0.0
 */
import type { NonEmptyReadonlyArray } from "@fp-ts/core/NonEmptyReadonlyArray"
import * as RA from "@fp-ts/core/ReadonlyArray"
import type * as eq from "@fp-ts/core/typeclasses/Eq"
import * as monoid from "@fp-ts/core/typeclasses/Monoid"
import type * as ord from "@fp-ts/core/typeclasses/Ord"
import type * as semigroup from "@fp-ts/core/typeclasses/Semigroup"
import type * as show_ from "@fp-ts/core/typeclasses/Show"
import type { Refinement } from "@fp-ts/data/Refinement"

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('a', S.Eq.equals('a')), true)
 * assert.deepStrictEqual(pipe('a', S.Eq.equals('b')), false)
 *
 * @category instances
 * @since 1.0.0
 */
export const Eq: eq.Eq<string> = {
  equals: (that) => (self) => self === that
}

/**
 * @since 1.0.0
 */
export const concat = (that: string) => (self: string): string => self + that

/**
 * `string` semigroup under concatenation.
 *
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('a', S.Semigroup.combine('b')), 'ab')
 *
 * @category instances
 * @since 1.0.0
 */
export const Semigroup: semigroup.Semigroup<string> = {
  combine: concat
}

/**
 * An empty `string`.
 *
 * @since 1.0.0
 */
export const empty = ""

/**
 * `string` monoid under concatenation.
 *
 * The `empty` value is `''`.
 *
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('a', S.Monoid.combine('b')), 'ab')
 * assert.deepStrictEqual(pipe('a', S.Monoid.combine(S.Monoid.empty)), 'a')
 *
 * @category instances
 * @since 1.0.0
 */
export const Monoid: monoid.Monoid<string> = {
  combine: Semigroup.combine,
  empty
}

/**
 * @since 1.0.0
 */
export const concatAll: (collection: Iterable<string>) => string = monoid.combineAll(Monoid)

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('a', S.Ord.compare('a')), 0)
 * assert.deepStrictEqual(pipe('a', S.Ord.compare('b')), -1)
 * assert.deepStrictEqual(pipe('b', S.Ord.compare('a')), 1)
 *
 * @category instances
 * @since 1.0.0
 */
export const Ord: ord.Ord<string> = {
  compare: (that) => (self) => self < that ? -1 : self > that ? 1 : 0
}

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 *
 * assert.deepStrictEqual(S.Show.show('a'), '"a"')
 *
 * @category instances
 * @since 1.0.0
 */
export const Show: show_.Show<string> = {
  show: (s) => JSON.stringify(s)
}

// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 *
 * assert.deepStrictEqual(S.isString('a'), true)
 * assert.deepStrictEqual(S.isString(1), false)
 *
 * @category refinements
 * @since 1.0.0
 */
export const isString: Refinement<unknown, string> = (u: unknown): u is string =>
  typeof u === "string"

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('a', S.toUpperCase), 'A')
 *
 * @since 1.0.0
 */
export const toUpperCase = (s: string): string => s.toUpperCase()

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('A', S.toLowerCase), 'a')
 *
 * @since 1.0.0
 */
export const toLowerCase = (s: string): string => s.toLowerCase()

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.replace('b', 'd')), 'adc')
 *
 * @since 1.0.0
 */
export const replace = (searchValue: string | RegExp, replaceValue: string) =>
  (s: string): string => s.replace(searchValue, replaceValue)

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trim), 'a')
 *
 * @since 1.0.0
 */
export const trim = (s: string): string => s.trim()

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trimLeft), 'a ')
 *
 * @since 1.0.0
 */
export const trimLeft = (s: string): string => s.trimLeft()

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trimRight), ' a')
 *
 * @since 1.0.0
 */
export const trimRight = (s: string): string => s.trimRight()

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('abcd', S.slice(1, 3)), 'bc')
 *
 * @since 1.0.0
 */
export const slice = (start: number, end: number) => (s: string): string => s.slice(start, end)

/**
 * Test whether a `string` is empty.
 *
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('', S.isEmpty), true)
 * assert.deepStrictEqual(pipe('a', S.isEmpty), false)
 *
 * @since 1.0.0
 */
export const isEmpty = (s: string): boolean => s.length === 0

/**
 * Calculate the number of characters in a `string`.
 *
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.size), 3)
 *
 * @since 1.0.0
 */
export const size = (s: string): number => s.length

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.split('')), ['a', 'b', 'c'])
 * assert.deepStrictEqual(pipe('', S.split('')), [''])
 *
 * @since 1.0.0
 */
export const split = (separator: string | RegExp) =>
  (s: string): NonEmptyReadonlyArray<string> => {
    const out = s.split(separator)
    return RA.isNonEmpty(out) ? out : [s]
  }

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.includes('b')), true)
 * assert.deepStrictEqual(pipe('abc', S.includes('d')), false)
 *
 * @since 1.0.0
 */
export const includes = (searchString: string, position?: number) =>
  (s: string): boolean => s.includes(searchString, position)

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.startsWith('a')), true)
 * assert.deepStrictEqual(pipe('bc', S.startsWith('a')), false)
 *
 * @since 1.0.0
 */
export const startsWith = (searchString: string, position?: number) =>
  (s: string): boolean => s.startsWith(searchString, position)

/**
 * @exampleTodo
 * import * as S from '@fp-ts/core/data/string'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.endsWith('c')), true)
 * assert.deepStrictEqual(pipe('ab', S.endsWith('c')), false)
 *
 * @since 1.0.0
 */
export const endsWith = (searchString: string, position?: number) =>
  (s: string): boolean => s.endsWith(searchString, position)
