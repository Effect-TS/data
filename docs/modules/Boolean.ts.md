---
title: Boolean.ts
nav_order: 1
parent: Modules
---

## Boolean overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instances](#instances)
  - [MonoidAll](#monoidall)
  - [MonoidAny](#monoidany)
  - [Order](#order)
  - [SemigroupAll](#semigroupall)
  - [SemigroupAny](#semigroupany)
- [pattern matching](#pattern-matching)
  - [match](#match)
- [refinements](#refinements)
  - [isBoolean](#isboolean)
- [utils](#utils)
  - [and](#and)
  - [or](#or)

---

# instances

## MonoidAll

`boolean` monoid under conjunction.

The `empty` value is `true`.

**Signature**

```ts
export declare const MonoidAll: monoid.Monoid<boolean>
```

Added in v1.0.0

## MonoidAny

`boolean` monoid under disjunction.

The `empty` value is `false`.

**Signature**

```ts
export declare const MonoidAny: monoid.Monoid<boolean>
```

Added in v1.0.0

## Order

**Signature**

```ts
export declare const Order: order.Order<boolean>
```

Added in v1.0.0

## SemigroupAll

`boolean` semigroup under conjunction.

**Signature**

```ts
export declare const SemigroupAll: semigroup.Semigroup<boolean>
```

**Example**

```ts
import { SemigroupAll } from '@fp-ts/data/Boolean'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(true, SemigroupAll.combine(true)), true)
assert.deepStrictEqual(pipe(true, SemigroupAll.combine(false)), false)
```

Added in v1.0.0

## SemigroupAny

`boolean` semigroup under disjunction.

**Signature**

```ts
export declare const SemigroupAny: semigroup.Semigroup<boolean>
```

**Example**

```ts
import { SemigroupAny } from '@fp-ts/data/Boolean'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(true, SemigroupAny.combine(true)), true)
assert.deepStrictEqual(pipe(true, SemigroupAny.combine(false)), true)
assert.deepStrictEqual(pipe(false, SemigroupAny.combine(false)), false)
```

Added in v1.0.0

# pattern matching

## match

Defines the match over a boolean value.
Takes two thunks `onTrue`, `onFalse` and a `boolean` value.
If `value` is `false`, `onFalse()` is returned, otherwise `onTrue()`.

**Signature**

```ts
export declare const match: <A, B = A>(onFalse: LazyArg<A>, onTrue: LazyArg<B>) => (value: boolean) => A | B
```

**Example**

```ts
import { some, map } from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'
import { match } from '@fp-ts/data/Boolean'

assert.deepStrictEqual(
  pipe(
    some(true),
    map(
      match(
        () => 'false',
        () => 'true'
      )
    )
  ),
  some('true')
)
```

Added in v1.0.0

# refinements

## isBoolean

**Signature**

```ts
export declare const isBoolean: Refinement<unknown, boolean>
```

Added in v1.0.0

# utils

## and

**Signature**

```ts
export declare const and: (that: boolean) => (self: boolean) => boolean
```

Added in v1.0.0

## or

**Signature**

```ts
export declare const or: (that: boolean) => (self: boolean) => boolean
```

Added in v1.0.0
