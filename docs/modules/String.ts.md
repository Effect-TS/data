---
title: String.ts
nav_order: 38
parent: Modules
---

## String overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instances](#instances)
  - [Monoid](#monoid)
  - [Order](#order)
  - [Semigroup](#semigroup)
- [refinements](#refinements)
  - [isString](#isstring)
- [utils](#utils)
  - [concat](#concat)
  - [empty](#empty)
  - [endsWith](#endswith)
  - [includes](#includes)
  - [isEmpty](#isempty)
  - [linesIterator](#linesiterator)
  - [linesWithSeparators](#lineswithseparators)
  - [replace](#replace)
  - [size](#size)
  - [slice](#slice)
  - [split](#split)
  - [startsWith](#startswith)
  - [stripMargin](#stripmargin)
  - [stripMarginWith](#stripmarginwith)
  - [takeLeft](#takeleft)
  - [takeRight](#takeright)
  - [toLowerCase](#tolowercase)
  - [toUpperCase](#touppercase)
  - [trim](#trim)
  - [trimLeft](#trimleft)
  - [trimRight](#trimright)

---

# instances

## Monoid

`string` monoid under concatenation.

The `empty` value is `''`.

**Signature**

```ts
export declare const Monoid: monoid.Monoid<string>
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('a', S.Monoid.combine('b')), 'ab')
assert.deepStrictEqual(pipe('a', S.Monoid.combine(S.Monoid.empty)), 'a')
```

Added in v1.0.0

## Order

**Signature**

```ts
export declare const Order: order.Order<string>
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('a', S.Order.compare('a')), 0)
assert.deepStrictEqual(pipe('a', S.Order.compare('b')), -1)
assert.deepStrictEqual(pipe('b', S.Order.compare('a')), 1)
```

Added in v1.0.0

## Semigroup

`string` semigroup under concatenation.

**Signature**

```ts
export declare const Semigroup: semigroup.Semigroup<string>
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('a', S.Semigroup.combine('b')), 'ab')
```

Added in v1.0.0

# refinements

## isString

**Signature**

```ts
export declare const isString: Refinement<unknown, string>
```

**Example**

```ts
import * as S from '@fp-ts/data/String'

assert.deepStrictEqual(S.isString('a'), true)
assert.deepStrictEqual(S.isString(1), false)
```

Added in v1.0.0

# utils

## concat

**Signature**

```ts
export declare const concat: (that: string) => (self: string) => string
```

Added in v1.0.0

## empty

An empty `string`.

**Signature**

```ts
export declare const empty: ''
```

Added in v1.0.0

## endsWith

**Signature**

```ts
export declare const endsWith: (searchString: string, position?: number | undefined) => (s: string) => boolean
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('abc', S.endsWith('c')), true)
assert.deepStrictEqual(pipe('ab', S.endsWith('c')), false)
```

Added in v1.0.0

## includes

**Signature**

```ts
export declare const includes: (searchString: string, position?: number | undefined) => (s: string) => boolean
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('abc', S.includes('b')), true)
assert.deepStrictEqual(pipe('abc', S.includes('d')), false)
```

Added in v1.0.0

## isEmpty

Test whether a `string` is empty.

**Signature**

```ts
export declare const isEmpty: (s: string) => boolean
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('', S.isEmpty), true)
assert.deepStrictEqual(pipe('a', S.isEmpty), false)
```

Added in v1.0.0

## linesIterator

Returns an `IterableIterator` which yields each line contained within the
string, trimming off the trailing newline character.

**Signature**

```ts
export declare const linesIterator: (self: string) => LinesIterator
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

## replace

**Signature**

```ts
export declare const replace: (searchValue: string | RegExp, replaceValue: string) => (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('abc', S.replace('b', 'd')), 'adc')
```

Added in v1.0.0

## size

Calculate the number of characters in a `string`.

**Signature**

```ts
export declare const size: (s: string) => number
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('abc', S.size), 3)
```

Added in v1.0.0

## slice

**Signature**

```ts
export declare const slice: (start: number, end: number) => (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('abcd', S.slice(1, 3)), 'bc')
```

Added in v1.0.0

## split

**Signature**

```ts
export declare const split: (separator: string | RegExp) => (s: string) => readonly [string, ...string[]]
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('abc', S.split('')), ['a', 'b', 'c'])
assert.deepStrictEqual(pipe('', S.split('')), [''])
```

Added in v1.0.0

## startsWith

**Signature**

```ts
export declare const startsWith: (searchString: string, position?: number | undefined) => (s: string) => boolean
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('abc', S.startsWith('a')), true)
assert.deepStrictEqual(pipe('bc', S.startsWith('a')), false)
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
export declare const stripMarginWith: (marginChar: string) => (self: string) => string
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
export declare const takeLeft: (n: number) => (self: string) => string
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
export declare const takeRight: (n: number) => (s: string) => string
```

Added in v1.0.0

## toLowerCase

**Signature**

```ts
export declare const toLowerCase: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('A', S.toLowerCase), 'a')
```

Added in v1.0.0

## toUpperCase

**Signature**

```ts
export declare const toUpperCase: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('a', S.toUpperCase), 'A')
```

Added in v1.0.0

## trim

**Signature**

```ts
export declare const trim: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(' a ', S.trim), 'a')
```

Added in v1.0.0

## trimLeft

**Signature**

```ts
export declare const trimLeft: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(' a ', S.trimLeft), 'a ')
```

Added in v1.0.0

## trimRight

**Signature**

```ts
export declare const trimRight: (s: string) => string
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(' a ', S.trimRight), ' a')
```

Added in v1.0.0
