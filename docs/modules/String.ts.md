---
title: String.ts
nav_order: 42
parent: Modules
---

## String overview

This module provides utility functions and type class instances for working with the `string` type in TypeScript.
It includes functions for basic string manipulation, as well as type class instances for
`Equivalence`, `Order`, `Semigroup`, and `Monoid`.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [guards](#guards)
  - [isString](#isstring)
- [instances](#instances)
  - [Equivalence](#equivalence)
  - [Monoid](#monoid)
  - [Order](#order)
  - [Semigroup](#semigroup)
- [utils](#utils)
  - [at](#at)
  - [charAt](#charat)
  - [charCodeAt](#charcodeat)
  - [codePointAt](#codepointat)
  - [concat](#concat)
  - [empty](#empty)
  - [endsWith](#endswith)
  - [endsWithPosition](#endswithposition)
  - [includes](#includes)
  - [includesWithPosition](#includeswithposition)
  - [indexOf](#indexof)
  - [isEmpty](#isempty)
  - [isNonEmpty](#isnonempty)
  - [lastIndexOf](#lastindexof)
  - [length](#length)
  - [linesWithSeparators](#lineswithseparators)
  - [localeCompare](#localecompare)
  - [match](#match)
  - [matchAll](#matchall)
  - [normalize](#normalize)
  - [padEnd](#padend)
  - [padStart](#padstart)
  - [repeat](#repeat)
  - [replace](#replace)
  - [replaceAll](#replaceall)
  - [search](#search)
  - [slice](#slice)
  - [split](#split)
  - [startsWith](#startswith)
  - [startsWithPosition](#startswithposition)
  - [stripMargin](#stripmargin)
  - [stripMarginWith](#stripmarginwith)
  - [substring](#substring)
  - [takeLeft](#takeleft)
  - [takeRight](#takeright)
  - [toLocaleLowerCase](#tolocalelowercase)
  - [toLocaleUpperCase](#tolocaleuppercase)
  - [toLowerCase](#tolowercase)
  - [toUpperCase](#touppercase)
  - [trim](#trim)
  - [trimEnd](#trimend)
  - [trimStart](#trimstart)

---

# guards

## isString

Tests if a value is a `string`.

**Signature**

```ts
export declare const isString: Refinement<unknown, string>
```

**Example**

```ts
import { isString } from '@effect/data/String'

assert.deepStrictEqual(isString('a'), true)
assert.deepStrictEqual(isString(1), false)
```

Added in v1.0.0

# instances

## Equivalence

**Signature**

```ts
export declare const Equivalence: equivalence.Equivalence<string>
```

Added in v1.0.0

## Monoid

`string` monoid under concatenation.

The `empty` value is `''`.

**Signature**

```ts
export declare const Monoid: monoid.Monoid<string>
```

Added in v1.0.0

## Order

**Signature**

```ts
export declare const Order: order.Order<string>
```

Added in v1.0.0

## Semigroup

`string` semigroup under concatenation.

**Signature**

```ts
export declare const Semigroup: semigroup.Semigroup<string>
```

Added in v1.0.0

# utils

## at

**Signature**

```ts
export declare const at: {
  (index: number): (self: string) => string | undefined
  (self: string, index: number): string | undefined
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.at('abc', 1), 'b')
```

Added in v1.0.0

## charAt

**Signature**

```ts
export declare const charAt: { (index: number): (self: string) => string; (self: string, index: number): string }
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.charAt('abc', 1), 'b')
```

Added in v1.0.0

## charCodeAt

**Signature**

```ts
export declare const charCodeAt: { (index: number): (self: string) => number; (self: string, index: number): number }
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.charCodeAt('abc', 1), 98)
```

Added in v1.0.0

## codePointAt

**Signature**

```ts
export declare const codePointAt: {
  (index: number): (self: string) => number | undefined
  (self: string, index: number): number | undefined
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.codePointAt('abc', 1), 98)
```

Added in v1.0.0

## concat

**Signature**

```ts
export declare const concat: { (that: string): (self: string) => string; (self: string, that: string): string }
```

Added in v1.0.0

## empty

The empty string `""`.

**Signature**

```ts
export declare const empty: ''
```

Added in v1.0.0

## endsWith

**Signature**

```ts
export declare const endsWith: {
  (searchString: string): (self: string) => boolean
  (self: string, searchString: string): boolean
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.endsWith('abc', 'c'), true)
assert.deepStrictEqual(S.endsWith('ab', 'c'), false)
```

Added in v1.0.0

## endsWithPosition

**Signature**

```ts
export declare const endsWithPosition: {
  (searchString: string, position: number): (self: string) => boolean
  (self: string, searchString: string, position: number): boolean
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.endsWithPosition('abc', 'b', 2), true)
assert.deepStrictEqual(S.endsWithPosition('abc', 'c', 2), false)
```

Added in v1.0.0

## includes

Returns `true` if `searchString` appears as a substring of `self`, at one or more positions that are
greater than or equal to `0`; otherwise, returns `false`.

**Signature**

```ts
export declare const includes: {
  (searchString: string): (self: string) => boolean
  (self: string, searchString: string): boolean
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.includes('abc', 'b'), true)
assert.deepStrictEqual(S.includes('abc', 'd'), false)
```

Added in v1.0.0

## includesWithPosition

Returns `true` if `searchString` appears as a substring of `self`, at one or more positions that are
greater than or equal to `position`; otherwise, returns `false`.

**Signature**

```ts
export declare const includesWithPosition: {
  (searchString: string, position: number): (self: string) => boolean
  (self: string, searchString: string, position: number): boolean
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.includesWithPosition('abc', 'b', 1), true)
assert.deepStrictEqual(S.includesWithPosition('abc', 'a', 1), false)
```

Added in v1.0.0

## indexOf

**Signature**

```ts
export declare const indexOf: {
  (searchString: string): (self: string) => number
  (self: string, searchString: string): number
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.indexOf('abbbc', 'b'), 1)
```

Added in v1.0.0

## isEmpty

Test whether a `string` is empty.

**Signature**

```ts
export declare const isEmpty: (self: string) => self is ''
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.isEmpty(''), true)
assert.deepStrictEqual(S.isEmpty('a'), false)
```

Added in v1.0.0

## isNonEmpty

Test whether a `string` is non empty.

**Signature**

```ts
export declare const isNonEmpty: (self: string) => boolean
```

Added in v1.0.0

## lastIndexOf

**Signature**

```ts
export declare const lastIndexOf: {
  (searchString: string): (self: string) => number
  (self: string, searchString: string): number
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.lastIndexOf('abbbc', 'b'), 3)
```

Added in v1.0.0

## length

Calculate the number of characters in a `string`.

**Signature**

```ts
export declare const length: (self: string) => number
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.length('abc'), 3)
```

Added in v1.0.0

## linesWithSeparators

Returns an `IterableIterator` which yields each line contained within the
string as well as the trailing newline character.

**Signature**

```ts
export declare const linesWithSeparators: (s: string) => LinesIterator
```

Added in v1.0.0

## localeCompare

**Signature**

```ts
export declare const localeCompare: {
  (compareString: string): (self: string) => number
  (self: string, compareString: string): number
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.localeCompare('a', 'b'), -1)
assert.deepStrictEqual(S.localeCompare('b', 'a'), 1)
assert.deepStrictEqual(S.localeCompare('a', 'a'), 0)
```

Added in v1.0.0

## match

**Signature**

```ts
export declare const match: {
  (regexp: RegExp | string): (self: string) => RegExpMatchArray | null
  (self: string, regexp: RegExp | string): RegExpMatchArray | null
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.ok(S.match('a', /a/)?.[0] === 'a')
```

Added in v1.0.0

## matchAll

**Signature**

```ts
export declare const matchAll: {
  (regexp: RegExp): (self: string) => IterableIterator<RegExpMatchArray>
  (self: string, regexp: RegExp): IterableIterator<RegExpMatchArray>
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.ok([...S.matchAll('ababb', /a/g)].length === 2)
```

Added in v1.0.0

## normalize

**Signature**

```ts
export declare const normalize: {
  (form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD'): (self: string) => string
  (self: string, form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD'): string
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.normalize('a', 'NFC'), 'a')
```

Added in v1.0.0

## padEnd

**Signature**

```ts
export declare const padEnd: {
  (maxLength: number, fillString?: string): (self: string) => string
  (self: string, maxLength: number, fillString?: string): string
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.padEnd('a', 5), 'a    ')
```

Added in v1.0.0

## padStart

**Signature**

```ts
export declare const padStart: {
  (maxLength: number, fillString?: string): (self: string) => string
  (self: string, maxLength: number, fillString?: string): string
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.padStart('a', 5), '    a')
```

Added in v1.0.0

## repeat

**Signature**

```ts
export declare const repeat: { (count: number): (self: string) => string; (self: string, count: number): string }
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.repeat('a', 3), 'aaa')
```

Added in v1.0.0

## replace

**Signature**

```ts
export declare const replace: {
  (searchValue: string | RegExp, replaceValue: string): (self: string) => string
  (self: string, searchValue: string | RegExp, replaceValue: string): string
}
```

**Example**

```ts
import * as S from '@effect/data/String'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(pipe('abc', S.replace('b', 'd')), 'adc')
```

Added in v1.0.0

## replaceAll

**Signature**

```ts
export declare const replaceAll: {
  (searchValue: string | RegExp, replaceValue: string): (self: string) => string
  (self: string, searchValue: string | RegExp, replaceValue: string): string
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.replaceAll('ababb', 'b', 'c'), 'acacc')
```

Added in v1.0.0

## search

**Signature**

```ts
export declare const search: {
  (regexp: RegExp | string): (self: string) => number
  (self: string, regexp: RegExp | string): number
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.search('ababb', 'b'), 1)
```

Added in v1.0.0

## slice

**Signature**

```ts
export declare const slice: {
  (start: number, end: number): (self: string) => string
  (self: string, start: number, end: number): string
}
```

**Example**

```ts
import * as S from '@effect/data/String'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(pipe('abcd', S.slice(1, 3)), 'bc')
```

Added in v1.0.0

## split

**Signature**

```ts
export declare const split: {
  (separator: string | RegExp): (self: string) => [string, ...string[]]
  (self: string, separator: string | RegExp): [string, ...string[]]
}
```

**Example**

```ts
import * as S from '@effect/data/String'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(pipe('abc', S.split('')), ['a', 'b', 'c'])
assert.deepStrictEqual(pipe('', S.split('')), [''])
```

Added in v1.0.0

## startsWith

Returns `true` if the sequence of elements of `searchString` is the
same as the corresponding elements of `s` starting at
position. Otherwise returns false.

**Signature**

```ts
export declare const startsWith: {
  (searchString: string): (self: string) => boolean
  (self: string, searchString: string): boolean
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.startsWith('abc', 'a'), true)
assert.deepStrictEqual(S.startsWith('bc', 'a'), false)
```

Added in v1.0.0

## startsWithPosition

**Signature**

```ts
export declare const startsWithPosition: {
  (searchString: string, position: number): (self: string) => boolean
  (self: string, searchString: string, position: number): boolean
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.startsWithPosition('abc', 'b', 1), true)
assert.deepStrictEqual(S.startsWithPosition('bc', 'a', 1), false)
```

Added in v1.0.0

## stripMargin

For every line in this string, strip a leading prefix consisting of blanks
or control characters followed by the `"|"` character from the line.

**Signature**

```ts
export declare const stripMargin: (self: string) => string
```

Added in v1.0.0

## stripMarginWith

For every line in this string, strip a leading prefix consisting of blanks
or control characters followed by the character specified by `marginChar`
from the line.

**Signature**

```ts
export declare const stripMarginWith: ((marginChar: string) => (self: string) => string) &
  ((self: string, marginChar: string) => string)
```

Added in v1.0.0

## substring

**Signature**

```ts
export declare const substring: { (start: number): (self: string) => string; (self: string, start: number): string }
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.substring('abcd', 1), 'bcd')
```

Added in v1.0.0

## takeLeft

Keep the specified number of characters from the start of a string.

If `n` is larger than the available number of characters, the string will
be returned whole.

If `n` is not a positive number, an empty string will be returned.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const takeLeft: { (n: number): (self: string) => string; (self: string, n: number): string }
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.takeLeft('Hello World', 5), 'Hello')
```

Added in v1.0.0

## takeRight

Keep the specified number of characters from the end of a string.

If `n` is larger than the available number of characters, the string will
be returned whole.

If `n` is not a positive number, an empty string will be returned.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const takeRight: { (n: number): (self: string) => string; (self: string, n: number): string }
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.takeRight('Hello World', 5), 'World')
```

Added in v1.0.0

## toLocaleLowerCase

**Signature**

```ts
export declare const toLocaleLowerCase: {
  (locale?: string | Array<string>): (self: string) => string
  (self: string, locale?: string | Array<string>): string
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.toLocaleLowerCase('\u0130', 'tr'), 'i')
```

Added in v1.0.0

## toLocaleUpperCase

**Signature**

```ts
export declare const toLocaleUpperCase: {
  (locale?: string | Array<string>): (self: string) => string
  (self: string, locale?: string | Array<string>): string
}
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.toLocaleUpperCase('i\u0307', 'lt-LT'), 'I')
```

Added in v1.0.0

## toLowerCase

**Signature**

```ts
export declare const toLowerCase: (self: string) => string
```

**Example**

```ts
import * as S from '@effect/data/String'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(pipe('A', S.toLowerCase), 'a')
```

Added in v1.0.0

## toUpperCase

**Signature**

```ts
export declare const toUpperCase: (self: string) => string
```

**Example**

```ts
import * as S from '@effect/data/String'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(pipe('a', S.toUpperCase), 'A')
```

Added in v1.0.0

## trim

**Signature**

```ts
export declare const trim: (self: string) => string
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.trim(' a '), 'a')
```

Added in v1.0.0

## trimEnd

**Signature**

```ts
export declare const trimEnd: (self: string) => string
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.trimEnd(' a '), ' a')
```

Added in v1.0.0

## trimStart

**Signature**

```ts
export declare const trimStart: (self: string) => string
```

**Example**

```ts
import * as S from '@effect/data/String'

assert.deepStrictEqual(S.trimStart(' a '), 'a ')
```

Added in v1.0.0
