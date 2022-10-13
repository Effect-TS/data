---
title: Differ/ChunkPatch.ts
nav_order: 4
parent: Modules
---

## ChunkPatch overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [diff](#diff)
  - [empty](#empty)
- [destructors](#destructors)
  - [patch](#patch)
- [model](#model)
  - [ChunkPatch (interface)](#chunkpatch-interface)
- [mutations](#mutations)
  - [combine](#combine)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# constructors

## diff

Constructs a chunk patch from a new and old chunk of values and a differ
for the values.

**Signature**

```ts
export declare const diff: <Value, Patch>(
  oldValue: Chunk<Value>,
  newValue: Chunk<Value>,
  differ: Differ<Value, Patch>
) => any
```

Added in v1.0.0

## empty

Constructs an empty chunk patch.

**Signature**

```ts
export declare const empty: <Value, Patch>() => any
```

Added in v1.0.0

# destructors

## patch

Applies a chunk patch to a chunk of values to produce a new chunk of
values which represents the original chunk of values updated with the
changes described by this patch.

**Signature**

```ts
export declare const patch: <Value, Patch>(
  oldValue: Chunk<Value>,
  differ: Differ<Value, Patch>
) => (self: any) => Chunk<Value>
```

Added in v1.0.0

# model

## ChunkPatch (interface)

A patch which describes updates to a chunk of values.

**Signature**

```ts
export interface ChunkPatch<
```

Added in v1.0.0

# mutations

## combine

Combines two chunk patches to produce a new chunk patch that describes
applying their changes sequentially.

**Signature**

```ts
export declare const combine: <Value, Patch>(that: any) => (self: any) => any
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0
