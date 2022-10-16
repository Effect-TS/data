---
title: Differ/OrPatch.ts
nav_order: 9
parent: Modules
---

## OrPatch overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [diff](#diff)
  - [empty](#empty)
- [destructors](#destructors)
  - [patch](#patch)
- [models](#models)
  - [OrPatch (interface)](#orpatch-interface)
- [mutations](#mutations)
  - [combine](#combine)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# constructors

## diff

Constructs an `OrPatch` from a new and old value and a differ for the
values.

**Signature**

```ts
export declare const diff: <Value, Value2, Patch, Patch2>(
  oldValue: Result<Value, Value2>,
  newValue: Result<Value, Value2>,
  left: Differ<Value, Patch>,
  right: Differ<Value2, Patch2>
) => OrPatch<Value, Value2, Patch, Patch2>
```

Added in v1.0.0

## empty

Constructs an empty `OrPatch`.

**Signature**

```ts
export declare const empty: <Value, Value2, Patch, Patch2>() => OrPatch<Value, Value2, Patch, Patch2>
```

Added in v1.0.0

# destructors

## patch

Applies an `OrPatch` to a value to produce a new value which represents
the original value updated with the changes described by this patch.

**Signature**

```ts
export declare const patch: <Value, Value2, Patch, Patch2>(
  oldValue: Result<Value, Value2>,
  left: Differ<Value, Patch>,
  right: Differ<Value2, Patch2>
) => (self: OrPatch<Value, Value2, Patch, Patch2>) => Result<Value, Value2>
```

Added in v1.0.0

# models

## OrPatch (interface)

A patch which describes updates to either one value or another.

**Signature**

```ts
export interface OrPatch<Value, Value2, Patch, Patch2> {
  readonly _id: TypeId
  readonly _Value: (_: Value) => Value
  readonly _Value2: (_: Value2) => Value2
  readonly _Patch: (_: Patch) => Patch
  readonly _Patch2: (_: Patch2) => Patch2
}
```

Added in v1.0.0

# mutations

## combine

Combines two or patches to produce a new or patch that describes applying
their changes sequentially.

**Signature**

```ts
export declare const combine: <Value, Value2, Patch, Patch2>(
  that: OrPatch<Value, Value2, Patch, Patch2>
) => (self: OrPatch<Value, Value2, Patch, Patch2>) => OrPatch<Value, Value2, Patch, Patch2>
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0
