---
title: Data.ts
nav_order: 6
parent: Modules
---

## Data overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [Class](#class)
  - [TaggedClass](#taggedclass)
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
  - [IsEqualTo (type alias)](#isequalto-type-alias)

---

# constructors

## Class

Provides a constructor for a Case Class.

**Signature**

```ts
export declare const Class: new <A extends Record<string, any>>(
  args: IsEqualTo<Omit<A, keyof Equal.Equal>, {}> extends true ? void : Omit<A, keyof Equal.Equal>
) => Data<A>
```

Added in v1.0.0

## TaggedClass

Provides a Tagged constructor for a Case Class.

**Signature**

```ts
export declare const TaggedClass: <Key extends string>(
  tag: Key
) => new <A extends Record<string, any>>(
  args: IsEqualTo<Omit<A, keyof Equal.Equal>, {}> extends true ? void : Omit<A, keyof Equal.Equal>
) => Data<A & { _tag: Key }>
```

Added in v1.0.0

## array

**Signature**

```ts
export declare const array: <As extends readonly any[]>(as: As) => Data<As>
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
export declare const struct: <As extends Readonly<Record<string, any>>>(as: As) => Data<As>
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
export declare const tuple: <As extends readonly any[]>(...as: As) => Data<As>
```

Added in v1.0.0

## unsafeArray

**Signature**

```ts
export declare const unsafeArray: <As extends readonly any[]>(as: As) => Data<As>
```

Added in v1.0.0

## unsafeStruct

**Signature**

```ts
export declare const unsafeStruct: <As extends Readonly<Record<string, any>>>(as: As) => Data<As>
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

## IsEqualTo (type alias)

**Signature**

```ts
export type IsEqualTo<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
```

Added in v1.0.0
