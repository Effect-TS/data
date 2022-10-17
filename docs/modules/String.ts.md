---
title: String.ts
nav_order: 36
parent: Modules
---

## String overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instances](#instances)
  - [Monoid](#monoid)
  - [Ord](#ord)
  - [Semigroup](#semigroup)
- [refinements](#refinements)
  - [isString](#isstring)
- [utils](#utils)
  - [concat](#concat)
  - [concatAll](#concatall)
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

Added in v1.0.0

## Ord

**Signature**

```ts
export declare const Ord: sortable.Sortable<string>
```

Added in v1.0.0

## Semigroup

`string` semigroup under concatenation.

**Signature**

```ts
export declare const Semigroup: semigroup.Semigroup<string>
```

Added in v1.0.0

# refinements

## isString

**Signature**

```ts
export declare const isString: Refinement<unknown, string>
```

Added in v1.0.0

# utils

## concat

**Signature**

```ts
export declare const concat: (that: string) => (self: string) => string
```

Added in v1.0.0

## concatAll

**Signature**

```ts
export declare const concatAll: (collection: Iterable<string>) => string
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

Added in v1.0.0

## includes

**Signature**

```ts
export declare const includes: (searchString: string, position?: number | undefined) => (s: string) => boolean
```

Added in v1.0.0

## isEmpty

Test whether a `string` is empty.

**Signature**

```ts
export declare const isEmpty: (s: string) => boolean
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

Added in v1.0.0

## size

Calculate the number of characters in a `string`.

**Signature**

```ts
export declare const size: (s: string) => number
```

Added in v1.0.0

## slice

**Signature**

```ts
export declare const slice: (start: number, end: number) => (s: string) => string
```

Added in v1.0.0

## split

**Signature**

```ts
export declare const split: (separator: string | RegExp) => (s: string) => readonly [string, ...string[]]
```

Added in v1.0.0

## startsWith

**Signature**

```ts
export declare const startsWith: (searchString: string, position?: number | undefined) => (s: string) => boolean
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

Added in v1.0.0

## toUpperCase

**Signature**

```ts
export declare const toUpperCase: (s: string) => string
```

Added in v1.0.0

## trim

**Signature**

```ts
export declare const trim: (s: string) => string
```

Added in v1.0.0

## trimLeft

**Signature**

```ts
export declare const trimLeft: (s: string) => string
```

Added in v1.0.0

## trimRight

**Signature**

```ts
export declare const trimRight: (s: string) => string
```

Added in v1.0.0
