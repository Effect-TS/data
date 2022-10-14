---
title: MutableHashSet.ts
nav_order: 14
parent: Modules
---

## MutableHashSet overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
  - [fromIterable](#fromiterable)
  - [make](#make)
- [elements](#elements)
  - [add](#add)
  - [has](#has)
  - [remove](#remove)
  - [size](#size)
- [model](#model)
  - [MutableHashSet (interface)](#mutablehashset-interface)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# constructors

## empty

**Signature**

```ts
export declare const empty: <K = never>() => MutableHashSet<K>
```

Added in v1.0.0

## fromIterable

**Signature**

```ts
export declare const fromIterable: <K = never>(keys: Iterable<K>) => MutableHashSet<K>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <Keys extends readonly unknown[]>(...keys: Keys) => MutableHashSet<Keys[number]>
```

Added in v1.0.0

# elements

## add

**Signature**

```ts
export declare const add: <K>(key: K) => (self: MutableHashSet<K>) => MutableHashSet<K>
```

Added in v1.0.0

## has

**Signature**

```ts
export declare const has: <K>(key: K) => (self: MutableHashSet<K>) => boolean
```

Added in v1.0.0

## remove

**Signature**

```ts
export declare const remove: <K>(key: K) => (self: MutableHashSet<K>) => MutableHashSet<K>
```

Added in v1.0.0

## size

**Signature**

```ts
export declare const size: <K>(self: MutableHashSet<K>) => number
```

Added in v1.0.0

# model

## MutableHashSet (interface)

**Signature**

```ts
export interface MutableHashSet<K> extends Iterable<K>, Equal.Equal {
  readonly _id: TypeId
  readonly _V: (_: K) => K

  /** @internal */
  readonly keyMap: MHashMap.MutableHashMap<K, boolean>
}
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0
