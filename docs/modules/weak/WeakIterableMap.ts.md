---
title: weak/WeakIterableMap.ts
nav_order: 44
parent: Modules
---

## WeakIterableMap overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [elements](#elements)
  - [entries](#entries)
  - [get](#get)
  - [has](#has)
  - [keys](#keys)
  - [remove](#remove)
  - [values](#values)
- [models](#models)
  - [WeakIterableMap (interface)](#weakiterablemap-interface)
- [mutations](#mutations)
  - [set](#set)
- [unsafe](#unsafe)
  - [unsafeGet](#unsafeget)

---

# constructors

## make

**Signature**

```ts
export declare const make: <K extends object, V>(iterable: Iterable<readonly [K, V]>) => WeakIterableMap<K, V>
```

Added in v1.0.0

# elements

## entries

**Signature**

```ts
export declare const entries: <K extends object, V>(self: WeakIterableMap<K, V>) => IterableIterator<readonly [K, V]>
```

Added in v1.0.0

## get

**Signature**

```ts
export declare const get: <K extends object>(key: K) => <V>(self: WeakIterableMap<K, V>) => O.Option<V>
```

Added in v1.0.0

## has

**Signature**

```ts
export declare const has: <K extends object>(key: K) => <V>(self: WeakIterableMap<K, V>) => boolean
```

Added in v1.0.0

## keys

**Signature**

```ts
export declare const keys: <K extends object, V>(self: WeakIterableMap<K, V>) => IterableIterator<K>
```

Added in v1.0.0

## remove

**Signature**

```ts
export declare const remove: <K extends object>(key: K) => <V>(self: WeakIterableMap<K, V>) => boolean
```

Added in v1.0.0

## values

**Signature**

```ts
export declare const values: <K extends object, V>(self: WeakIterableMap<K, V>) => IterableIterator<V>
```

Added in v1.0.0

# models

## WeakIterableMap (interface)

An implementation of a weak map that supports the Iterable protocol.

NOTE: the keys are compared via reference equality

NOTE: this is truly weak only in the case FinalizationRegistry is available,
otherwise it is backed by a classical map and will not be weak (i.e. in
engines that don't natively support ES2021).

**Signature**

```ts
export interface WeakIterableMap<K extends object, V> extends Iterable<readonly [K, V]>, Equal.Equal {
  readonly _K: (_: K) => K
  readonly _V: (_: V) => V
  [Symbol.iterator](this: this): IterableIterator<readonly [K, V]>
  /** @internal */
  set(this: this, key: K, value: V): this
  /** @internal */
  get(this: this, key: K): V | undefined
  /** @internal */
  has(this: this, key: K): boolean
  /** @internal */
  delete(this: this, key: K): boolean
  /** @internal */
  entries(this: this): IterableIterator<readonly [K, V]>
  /** @internal */
  keys(this: this): IterableIterator<K>
  /** @internal */
  values(this: this): IterableIterator<V>
}
```

Added in v1.0.0

# mutations

## set

**Signature**

```ts
export declare const set: <K extends object, V>(
  key: K,
  value: V
) => (self: WeakIterableMap<K, V>) => WeakIterableMap<K, V>
```

Added in v1.0.0

# unsafe

## unsafeGet

**Signature**

```ts
export declare const unsafeGet: <K extends object>(key: K) => <V>(self: WeakIterableMap<K, V>) => V
```

Added in v1.0.0
