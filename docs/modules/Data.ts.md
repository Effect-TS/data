---
title: Data.ts
nav_order: 4
parent: Modules
---

## Data overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [array](#array)
  - [case](#case)
  - [struct](#struct)
  - [tagged](#tagged)
  - [tuple](#tuple)
  - [unsafeArray](#unsafearray)
  - [unsafeStruct](#unsafestruct)
- [models](#models)
  - [Case (interface)](#case-interface)
  - [Data (type alias)](#data-type-alias)

---

# constructors

## array

**Signature**

```ts
export declare const array: <As extends readonly any[]>(as: As) => any
```

Added in v1.0.0

## case

Provides a constructor for the specified `Case`.

**Signature**

```ts
export declare const case: <A extends Case>() => Case.Constructor<A, never>
```

Added in v1.0.0

## struct

**Signature**

```ts
export declare const struct: <As extends Readonly<Record<string, any>>>(as: As) => any
```

Added in v1.0.0

## tagged

Provides a tagged constructor for the specified `Case`.

**Signature**

```ts
export declare const tagged: <A extends Case & { _tag: string }>(tag: A['_tag']) => Case.Constructor<A, '_tag'>
```

Added in v1.0.0

## tuple

**Signature**

```ts
export declare const tuple: <As extends readonly any[]>(...as: As) => any
```

Added in v1.0.0

## unsafeArray

**Signature**

```ts
export declare const unsafeArray: <As extends readonly any[]>(as: As) => any
```

Added in v1.0.0

## unsafeStruct

**Signature**

```ts
export declare const unsafeStruct: <As extends Readonly<Record<string, any>>>(as: As) => any
```

Added in v1.0.0

# models

## Case (interface)

`Case` represents a datatype similar to a case class in Scala. Namely, a
datatype created using `Case` will, by default, provide an implementation
for a constructor, `Hash`, and `Equal`.

**Signature**

```ts
export interface Case extends Equal.Equal {}
```

Added in v1.0.0

## Data (type alias)

**Signature**

```ts
export type Data<A extends Readonly<Record<string, any>> | ReadonlyArray<any>> = Readonly<A> & Equal.Equal
```

Added in v1.0.0
