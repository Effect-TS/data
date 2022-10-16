---
title: String.ts
nav_order: 33
parent: Modules
---

## String overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instances](#instances)
  - [Eq](#eq)
  - [Monoid](#monoid)
  - [Ord](#ord)
  - [Semigroup](#semigroup)
  - [Show](#show)
- [refinements](#refinements)
  - [isString](#isstring)
- [utils](#utils)
  - [concat](#concat)
  - [concatAll](#concatall)
  - [empty](#empty)
  - [endsWith](#endswith)
  - [includes](#includes)
  - [isEmpty](#isempty)
  - [replace](#replace)
  - [size](#size)
  - [slice](#slice)
  - [split](#split)
  - [startsWith](#startswith)
  - [toLowerCase](#tolowercase)
  - [toUpperCase](#touppercase)
  - [trim](#trim)
  - [trimLeft](#trimleft)
  - [trimRight](#trimright)

---

# instances

## Eq

**Signature**

```ts
export declare const Eq: eq.Eq<string>
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

## Ord

**Signature**

```ts
export declare const Ord: ord.Ord<string>
```

Added in v1.0.0

## Semigroup

`string` semigroup under concatenation.

**Signature**

```ts
export declare const Semigroup: semigroup.Semigroup<string>
```

Added in v1.0.0

## Show

**Signature**

```ts
export declare const Show: show_.Show<string>
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
