---
title: Differ/HashSetPatch.ts
nav_order: 11
parent: Modules
---

## HashSetPatch overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [diff](#diff)
  - [empty](#empty)
- [destructors](#destructors)
  - [patch](#patch)
- [models](#models)
  - [HashSetPatch (interface)](#hashsetpatch-interface)
- [mutations](#mutations)
  - [combine](#combine)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# constructors

## diff

Constructs a set patch from a new set of values.

**Signature**

```ts
export declare const diff: <Value>(oldValue: HashSet<Value>, newValue: HashSet<Value>) => HashSetPatch<Value>
```

Added in v1.0.0

## empty

Constructs an empty set patch.

**Signature**

```ts
export declare const empty: <Value>(_: void) => HashSetPatch<Value>
```

Added in v1.0.0

# destructors

## patch

Applies a set patch to a set of values to produce a new set of values
which represents the original set of values updated with the changes
described by this patch.

**Signature**

```ts
export declare const patch: {
  <Value>(oldValue: HashSet<Value>): (self: HashSetPatch<Value>) => HashSet<Value>
  <Value>(self: HashSetPatch<Value>, oldValue: HashSet<Value>): HashSet<Value>
}
```

Added in v1.0.0

# models

## HashSetPatch (interface)

A patch which describes updates to a set of values.

**Signature**

```ts
export interface HashSetPatch<Value> extends Equal {
  readonly _id: TypeId
  readonly _Value: (_: Value) => Value
}
```

Added in v1.0.0

# mutations

## combine

Combines two set patches to produce a new set patch that describes
applying their changes sequentially.

**Signature**

```ts
export declare const combine: {
  <Value>(that: HashSetPatch<Value>): (self: HashSetPatch<Value>) => HashSetPatch<Value>
  <Value>(self: HashSetPatch<Value>, that: HashSetPatch<Value>): HashSetPatch<Value>
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
