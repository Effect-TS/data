---
title: Identity.ts
nav_order: 16
parent: Modules
---

## Identity overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [of](#of)
- [conversions](#conversions)
  - [toReadonlyArray](#toreadonlyarray)
  - [toReadonlyArrayWith](#toreadonlyarraywith)
- [do notation](#do-notation)
  - [Do](#do)
  - [andThenBind](#andthenbind)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [let](#let)
- [folding](#folding)
  - [foldMap](#foldmap)
  - [foldMapKind](#foldmapkind)
  - [reduce](#reduce)
  - [reduceKind](#reducekind)
  - [reduceRight](#reduceright)
  - [reduceRightKind](#reducerightkind)
- [generators](#generators)
  - [gen](#gen)
- [instances](#instances)
  - [Applicative](#applicative)
  - [Chainable](#chainable)
  - [Covariant](#covariant)
  - [FlatMap](#flatmap)
  - [Foldable](#foldable)
  - [Invariant](#invariant)
  - [Monad](#monad)
  - [Of](#of)
  - [Pointed](#pointed)
  - [Product](#product)
  - [SemiApplicative](#semiapplicative)
  - [SemiProduct](#semiproduct)
  - [Traversable](#traversable)
  - [getSemiAlternative](#getsemialternative)
  - [getSemiCoproduct](#getsemicoproduct)
  - [liftSemigroup](#liftsemigroup)
- [lifting](#lifting)
  - [lift2](#lift2)
  - [lift3](#lift3)
- [mapping](#mapping)
  - [as](#as)
  - [asUnit](#asunit)
  - [flap](#flap)
- [models](#models)
  - [Identity (type alias)](#identity-type-alias)
- [sequencing](#sequencing)
  - [andThenDiscard](#andthendiscard)
  - [flatMap](#flatmap)
- [traversing](#traversing)
  - [sequence](#sequence)
  - [traverse](#traverse)
  - [traverseTap](#traversetap)
- [type lambdas](#type-lambdas)
  - [IdentityTypeLambda (interface)](#identitytypelambda-interface)
  - [IdentityTypeLambdaFix (interface)](#identitytypelambdafix-interface)
- [utils](#utils)
  - [andThen](#andthen)
  - [ap](#ap)
  - [composeKleisliArrow](#composekleisliarrow)
  - [flatten](#flatten)
  - [imap](#imap)
  - [liftMonoid](#liftmonoid)
  - [map](#map)
  - [product](#product)
  - [productAll](#productall)
  - [productFlatten](#productflatten)
  - [productMany](#productmany)
  - [struct](#struct)
  - [tap](#tap)
  - [tuple](#tuple)
  - [tupled](#tupled)
  - [unit](#unit)

---

# constructors

## of

**Signature**

```ts
export declare const of: <A>(a: A) => A
```

Added in v1.0.0

# conversions

## toReadonlyArray

**Signature**

```ts
export declare const toReadonlyArray: <A>(self: A) => readonly A[]
```

Added in v1.0.0

## toReadonlyArrayWith

**Signature**

```ts
export declare const toReadonlyArrayWith: <A, B>(f: (a: A) => B) => (self: A) => readonly B[]
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: {}
```

Added in v1.0.0

## andThenBind

A variant of `bind` that sequentially ignores the scope.

**Signature**

```ts
export declare const andThenBind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: B
) => (self: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (self: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N extends string>(name: N) => <A>(self: A) => { readonly [K in N]: A }
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (self: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
```

Added in v1.0.0

# folding

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (self: A) => M
```

Added in v1.0.0

## foldMapKind

**Signature**

```ts
export declare const foldMapKind: <G extends TypeLambda>(
  G: coproduct_.Coproduct<G>
) => <A, R, O, E, B>(f: (a: A) => Kind<G, R, O, E, B>) => (self: A) => Kind<G, R, O, E, B>
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <B, A>(b: B, f: (b: B, a: A) => B) => (self: A) => B
```

Added in v1.0.0

## reduceKind

**Signature**

```ts
export declare const reduceKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(b: B, f: (b: B, a: A) => Kind<G, R, O, E, B>) => (self: A) => Kind<G, R, O, E, B>
```

Added in v1.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <B, A>(b: B, f: (b: B, a: A) => B) => (self: A) => B
```

Added in v1.0.0

## reduceRightKind

**Signature**

```ts
export declare const reduceRightKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(b: B, f: (b: B, a: A) => Kind<G, R, O, E, B>) => (self: A) => Kind<G, R, O, E, B>
```

Added in v1.0.0

# generators

## gen

**Signature**

```ts
export declare const gen: Gen.Gen<IdentityTypeLambda, Gen.Adapter<IdentityTypeLambda>>
```

Added in v1.0.0

# instances

## Applicative

**Signature**

```ts
export declare const Applicative: applicative.Applicative<IdentityTypeLambda>
```

Added in v1.0.0

## Chainable

**Signature**

```ts
export declare const Chainable: chainable.Chainable<IdentityTypeLambda>
```

Added in v1.0.0

## Covariant

**Signature**

```ts
export declare const Covariant: covariant.Covariant<IdentityTypeLambda>
```

Added in v1.0.0

## FlatMap

**Signature**

```ts
export declare const FlatMap: flatMap_.FlatMap<IdentityTypeLambda>
```

Added in v1.0.0

## Foldable

**Signature**

```ts
export declare const Foldable: foldable.Foldable<IdentityTypeLambda>
```

Added in v1.0.0

## Invariant

**Signature**

```ts
export declare const Invariant: invariant.Invariant<IdentityTypeLambda>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: monad.Monad<IdentityTypeLambda>
```

Added in v1.0.0

## Of

**Signature**

```ts
export declare const Of: of_.Of<IdentityTypeLambda>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: pointed.Pointed<IdentityTypeLambda>
```

Added in v1.0.0

## Product

**Signature**

```ts
export declare const Product: product_.Product<IdentityTypeLambda>
```

Added in v1.0.0

## SemiApplicative

**Signature**

```ts
export declare const SemiApplicative: semiApplicative.SemiApplicative<IdentityTypeLambda>
```

Added in v1.0.0

## SemiProduct

**Signature**

```ts
export declare const SemiProduct: semiProduct.SemiProduct<IdentityTypeLambda>
```

Added in v1.0.0

## Traversable

**Signature**

```ts
export declare const Traversable: traversable.Traversable<IdentityTypeLambda>
```

Added in v1.0.0

## getSemiAlternative

**Signature**

```ts
export declare const getSemiAlternative: <A>(
  S: Semigroup<A>
) => semiAlternative.SemiAlternative<IdentityTypeLambdaFix<A>>
```

Added in v1.0.0

## getSemiCoproduct

**Signature**

```ts
export declare const getSemiCoproduct: <A>(S: Semigroup<A>) => semiCoproduct.SemiCoproduct<IdentityTypeLambdaFix<A>>
```

Added in v1.0.0

## liftSemigroup

**Signature**

```ts
export declare const liftSemigroup: <A>(S: Semigroup<A>) => Semigroup<A>
```

Added in v1.0.0

# lifting

## lift2

Lifts a binary function into `Identity`.

**Signature**

```ts
export declare const lift2: <A, B, C>(f: (a: A, b: B) => C) => (fa: A, fb: B) => C
```

Added in v1.0.0

## lift3

Lifts a ternary function into `Identity`.

**Signature**

```ts
export declare const lift3: <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: A, fb: B, fc: C) => D
```

Added in v1.0.0

# mapping

## as

Maps the success value of this effect to the specified constant value.

**Signature**

```ts
export declare const as: <B>(b: B) => <_>(self: _) => B
```

Added in v1.0.0

## asUnit

Returns the effect resulting from mapping the success of this effect to unit.

**Signature**

```ts
export declare const asUnit: <_>(self: _) => Identity<void>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(fab: (a: A) => B) => B
```

Added in v1.0.0

# models

## Identity (type alias)

**Signature**

```ts
export type Identity<A> = A
```

Added in v1.0.0

# sequencing

## andThenDiscard

Sequences the specified effect after this effect, but ignores the value
produced by the effect.

**Signature**

```ts
export declare const andThenDiscard: <_>(that: _) => <A>(self: A) => A
```

Added in v1.0.0

## flatMap

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => B) => (self: A) => B
```

Added in v1.0.0

# traversing

## sequence

**Signature**

```ts
export declare const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(fas: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
```

Added in v1.0.0

## traverse

**Signature**

```ts
export declare const traverse: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: A) => Kind<F, R, O, E, B>
```

Added in v1.0.0

## traverseTap

**Signature**

```ts
export declare const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: A) => Kind<F, R, O, E, A>
```

Added in v1.0.0

# type lambdas

## IdentityTypeLambda (interface)

**Signature**

```ts
export interface IdentityTypeLambda extends TypeLambda {
  readonly type: Identity<this['Target']>
}
```

Added in v1.0.0

## IdentityTypeLambdaFix (interface)

**Signature**

```ts
export interface IdentityTypeLambdaFix<A> extends TypeLambda {
  readonly type: Identity<A>
}
```

Added in v1.0.0

# utils

## andThen

**Signature**

```ts
export declare const andThen: <B>(that: B) => <_>(self: _) => B
```

Added in v1.0.0

## ap

**Signature**

```ts
export declare const ap: <A>(fa: A) => <B>(self: (a: A) => B) => B
```

Added in v1.0.0

## composeKleisliArrow

**Signature**

```ts
export declare const composeKleisliArrow: <B, C>(bfc: (b: B) => C) => <A>(afb: (a: A) => B) => (a: A) => C
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(self: A) => A
```

Added in v1.0.0

## imap

**Signature**

```ts
export declare const imap: <A, B>(to: (a: A) => B, from: (b: B) => A) => (self: A) => B
```

Added in v1.0.0

## liftMonoid

**Signature**

```ts
export declare const liftMonoid: <A>(M: Monoid<A>) => Monoid<A>
```

Added in v1.0.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: A) => B
```

Added in v1.0.0

## product

**Signature**

```ts
export declare const product: <B>(that: B) => <A>(self: A) => readonly [A, B]
```

Added in v1.0.0

## productAll

**Signature**

```ts
export declare const productAll: <A>(collection: Iterable<A>) => readonly A[]
```

Added in v1.0.0

## productFlatten

**Signature**

```ts
export declare const productFlatten: <B>(fb: B) => <A extends readonly unknown[]>(self: A) => readonly [...A, B]
```

Added in v1.0.0

## productMany

**Signature**

```ts
export declare const productMany: <A>(collection: Iterable<A>) => (self: A) => readonly [A, ...A[]]
```

Added in v1.0.0

## struct

**Signature**

```ts
export declare const struct: <R extends Record<string, any>>(r: R) => { readonly [K in keyof R]: R[K] }
```

Added in v1.0.0

## tap

Returns an effect that effectfully "peeks" at the success of this effect.

**Signature**

```ts
export declare const tap: <A, _>(f: (a: A) => _) => (self: A) => A
```

Added in v1.0.0

## tuple

**Signature**

```ts
export declare const tuple: <T extends readonly any[]>(...tuple: T) => Readonly<{ [I in keyof T]: T[I] }>
```

Added in v1.0.0

## tupled

**Signature**

```ts
export declare const tupled: <A>(self: A) => readonly [A]
```

Added in v1.0.0

## unit

**Signature**

```ts
export declare const unit: void
```

Added in v1.0.0
