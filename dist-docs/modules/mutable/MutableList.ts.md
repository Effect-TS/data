---
title: mutable/MutableList.ts
nav_order: 23
parent: Modules
---

## MutableList overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
  - [from](#from)
  - [make](#make)
- [getters](#getters)
  - [head](#head)
  - [isEmpty](#isempty)
  - [length](#length)
  - [tail](#tail)
- [model](#model)
  - [MutableList (interface)](#mutablelist-interface)
- [mutations](#mutations)
  - [append](#append)
  - [pop](#pop)
  - [reset](#reset)
  - [shift](#shift)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [traversing](#traversing)
  - [forEach](#foreach)

---

# constructors

## empty

Creates an empty `MutableList`.

**Signature**

```ts
export declare const empty: <A>() => MutableList<A>
```

Added in v1.0.0

## from

Creates a new `MutableList` from an `Iterable`.

**Signature**

```ts
export declare const from: <A>(iterable: Iterable<A>) => MutableList<A>
```

Added in v1.0.0

## make

Creates a new `MutableList` from the specified elements.

**Signature**

```ts
export declare const make: <A>(...elements: readonly A[]) => MutableList<A>
```

Added in v1.0.0

# getters

## head

Returns the first element of the list, if it exists.

**Signature**

```ts
export declare const head: <A>(self: MutableList<A>) => A | undefined
```

Added in v1.0.0

## isEmpty

Returns `true` if the list contains zero elements, `false`, otherwise.

**Signature**

```ts
export declare const isEmpty: <A>(self: MutableList<A>) => boolean
```

Added in v1.0.0

## length

Returns the length of the list.

**Signature**

```ts
export declare const length: <A>(self: MutableList<A>) => number
```

Added in v1.0.0

## tail

Returns the last element of the list, if it exists.

**Signature**

```ts
export declare const tail: <A>(self: MutableList<A>) => A | undefined
```

Added in v1.0.0

# model

## MutableList (interface)

**Signature**

```ts
export interface MutableList<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  readonly _A: (_: never) => A

  /** @internal */
  head: LinkedListNode<A> | undefined
  /** @internal */
  tail: LinkedListNode<A> | undefined
}
```

Added in v1.0.0

# mutations

## append

Appends the specified value to the end of the list.

**Signature**

```ts
export declare const append: <A>(value: A) => (self: MutableList<A>) => MutableList<A>
```

Added in v1.0.0

## pop

Removes the last value from the list and returns it, if it exists.

**Signature**

```ts
export declare const pop: <A>(self: MutableList<A>) => A | undefined
```

Added in v0.0.1

## reset

Removes all elements from the doubly-linked list.

**Signature**

```ts
export declare const reset: <A>(self: MutableList<A>) => MutableList<A>
```

Added in v1.0.0

## shift

Removes the first value from the list and returns it, if it exists.

**Signature**

```ts
export declare const shift: <A>(self: MutableList<A>) => A | undefined
```

Added in v0.0.1

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0

# traversing

## forEach

Executes the specified function `f` for each element in the list.

**Signature**

```ts
export declare const forEach: <A>(f: (element: A) => void) => (self: MutableList<A>) => void
```

Added in v1.0.0
