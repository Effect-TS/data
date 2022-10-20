---
title: Const.ts
nav_order: 3
parent: Modules
---

## Const overview

The `Const` type constructor, which wraps its first type argument and ignores its second.
That is, `Const<S, A>` is isomorphic to `S` for any `A`.

`Const` has some useful instances. For example, the `Monoidal` instance allows us to collect results using a `Monoid`
while ignoring return values.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [instances](#instances)
  - [Bifunctor](#bifunctor)
  - [Contravariant](#contravariant)
  - [Functor](#functor)
  - [getMonoidal](#getmonoidal)
  - [getPointed](#getpointed)
  - [getSemigroupal](#getsemigroupal)
  - [liftBounded](#liftbounded)
  - [liftMonoid](#liftmonoid)
  - [liftSemigroup](#liftsemigroup)
  - [liftSortable](#liftsortable)
- [mapping](#mapping)
  - [contramap](#contramap)
  - [flap](#flap)
  - [map](#map)
  - [mapBoth](#mapboth)
  - [mapLeft](#mapleft)
- [model](#model)
  - [Const (interface)](#const-interface)
- [type lambdas](#type-lambdas)
  - [ConstTypeLambda (interface)](#consttypelambda-interface)
  - [ConstTypeLambdaBifunctor (interface)](#consttypelambdabifunctor-interface)
  - [ConstTypeLambdaContravariant (interface)](#consttypelambdacontravariant-interface)
  - [ConstTypeLambdaFix (interface)](#consttypelambdafix-interface)
- [utils](#utils)
  - [execute](#execute)

---

# constructors

## make

**Signature**

```ts
export declare const make: <S>(s: S) => Const<S, never>
```

Added in v1.0.0

# instances

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: bifunctor.Bifunctor<ConstTypeLambdaBifunctor>
```

Added in v1.0.0

## Contravariant

**Signature**

```ts
export declare const Contravariant: contravariant.Contravariant<ConstTypeLambdaContravariant>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: functor.Functor<ConstTypeLambda>
```

Added in v1.0.0

## getMonoidal

**Signature**

```ts
export declare const getMonoidal: <S>(Monoid: Monoid<S>) => Monoidal<ConstTypeLambdaFix<S>>
```

Added in v1.0.0

## getPointed

**Signature**

```ts
export declare const getPointed: <S>(Monoid: Monoid<S>) => Pointed<ConstTypeLambdaFix<S>>
```

Added in v1.0.0

## getSemigroupal

**Signature**

```ts
export declare const getSemigroupal: <S>(Semigroup: Semigroup<S>) => Semigroupal<ConstTypeLambdaFix<S>>
```

Added in v1.0.0

## liftBounded

**Signature**

```ts
export declare const liftBounded: <S>(Bounded: Bounded<S>) => Bounded<Const<S, never>>
```

Added in v1.0.0

## liftMonoid

**Signature**

```ts
export declare const liftMonoid: <S>(Monoid: Monoid<S>) => Monoid<Const<S, never>>
```

Added in v1.0.0

## liftSemigroup

**Signature**

```ts
export declare const liftSemigroup: <S>(Semigroup: Semigroup<S>) => Semigroup<Const<S, never>>
```

Added in v1.0.0

## liftSortable

**Signature**

```ts
export declare const liftSortable: <S>(Sortable: Sortable<S>) => Sortable<Const<S, never>>
```

Added in v1.0.0

# mapping

## contramap

**Signature**

```ts
export declare const contramap: <B, A>(f: (b: B) => A) => <S>(fa: Const<S, A>) => Const<S, B>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <S, B>(self: Const<S, (a: A) => B>) => Const<S, B>
```

Added in v1.0.0

## map

Returns an effect whose success is mapped by the specified `f` function.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <S>(self: Const<S, A>) => Const<S, B>
```

Added in v1.0.0

## mapBoth

Returns an effect whose failure and success channels have been mapped by
the specified pair of functions, `f` and `g`.

**Signature**

```ts
export declare const mapBoth: <S, T, A, B>(f: (s: S) => T, g: (a: A) => B) => (self: Const<S, A>) => Const<T, B>
```

Added in v1.0.0

## mapLeft

**Signature**

```ts
export declare const mapLeft: <S, G>(f: (s: S) => G) => <A>(self: Const<S, A>) => Const<G, A>
```

Added in v1.0.0

# model

## Const (interface)

**Signature**

```ts
export interface Const</** in out */ S, /** out */ A> {
  readonly [phantom]: A
  readonly value: S
}
```

Added in v1.0.0

# type lambdas

## ConstTypeLambda (interface)

**Signature**

```ts
export interface ConstTypeLambda extends TypeLambda {
  readonly type: Const<this['InOut1'], this['Out1']>
}
```

Added in v1.0.0

## ConstTypeLambdaBifunctor (interface)

**Signature**

```ts
export interface ConstTypeLambdaBifunctor extends TypeLambda {
  readonly type: Const<this['Out2'], this['Out1']>
}
```

Added in v1.0.0

## ConstTypeLambdaContravariant (interface)

**Signature**

```ts
export interface ConstTypeLambdaContravariant extends TypeLambda {
  readonly type: Const<this['InOut1'], this['In1']>
}
```

Added in v1.0.0

## ConstTypeLambdaFix (interface)

**Signature**

```ts
export interface ConstTypeLambdaFix<S> extends TypeLambda {
  readonly type: Const<S, this['Out1']>
}
```

Added in v1.0.0

# utils

## execute

**Signature**

```ts
export declare const execute: <S, A>(self: Const<S, A>) => S
```

Added in v1.0.0
