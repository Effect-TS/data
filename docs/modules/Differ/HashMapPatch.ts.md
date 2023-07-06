---
title: Differ/HashMapPatch.ts
nav_order: 10
parent: Modules
---

## HashMapPatch overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [diff](#diff)
  - [empty](#empty)
- [destructors](#destructors)
  - [patch](#patch)
- [models](#models)
  - [HashMapPatch (interface)](#hashmappatch-interface)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [utils](#utils)
  - [combine](#combine)

---

# constructors

## diff

Constructs a map patch from a new and old map of keys and values and a
differ for the values.

**Signature**

```ts
export declare const diff: <Key, Value, Patch>(options: {
  readonly oldValue: HashMap<Key, Value>
  readonly newValue: HashMap<Key, Value>
  readonly differ: Differ<Value, Patch>
}) => HashMapPatch<Key, Value, Patch>
```

Added in v1.0.0

## empty

Constructs an empty map patch.

**Signature**

```ts
export declare const empty: <Key, Value, Patch>() => HashMapPatch<Key, Value, Patch>
```

Added in v1.0.0

# destructors

## patch

Applies a map patch to a map of keys and values to produce a new map of
keys and values values which represents the original map of keys and
values updated with the changes described by this patch.

**Signature**

```ts
export declare const patch: {
  <Key, Value, Patch>(oldValue: HashMap<Key, Value>, differ: Differ<Value, Patch>): (
    self: HashMapPatch<Key, Value, Patch>
  ) => HashMap<Key, Value>
  <Key, Value, Patch>(
    self: HashMapPatch<Key, Value, Patch>,
    oldValue: HashMap<Key, Value>,
    differ: Differ<Value, Patch>
  ): HashMap<Key, Value>
}
```

Added in v1.0.0

# models

## HashMapPatch (interface)

A patch which describes updates to a map of keys and values.

**Signature**

```ts
export interface HashMapPatch<Key, Value, Patch> extends Equal {
  readonly _id: TypeId
  readonly _Key: (_: Key) => Key
  readonly _Value: (_: Value) => Value
  readonly _Patch: (_: Patch) => Patch
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

# utils

## combine

Combines two map patches to produce a new map patch that describes
applying their changes sequentially.

**Signature**

```ts
export declare const combine: {
  <Key, Value, Patch>(that: HashMapPatch<Key, Value, Patch>): (
    self: HashMapPatch<Key, Value, Patch>
  ) => HashMapPatch<Key, Value, Patch>
  <Key, Value, Patch>(self: HashMapPatch<Key, Value, Patch>, that: HashMapPatch<Key, Value, Patch>): HashMapPatch<
    Key,
    Value,
    Patch
  >
}
```

Added in v1.0.0
