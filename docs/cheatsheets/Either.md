---
title: Either Cheatsheet
nav_order: 1
parent: Cheatsheets
---

# Either

## Constructors

| Name                | Given | To                 |
| ------------------- | ----- | ------------------ |
| left                | `E`   | `Either<E, never>` |
| right               | `A`   | `Either<never, A>` |
| of (alias of right) | `A`   | `Either<never, A>` |

## Guards

| Name     | Given          | To                            |
| -------- | -------------- | ----------------------------- |
| isEither | `unknown`      | `is Either<unknown, unknown>` |
| isLeft   | `Either<E, A>` | `is Left<E>`                  |
| isRight  | `Either<E, A>` | `is Right<A>`                 |

## Conversions

| Name               | Given              | To                          |
| ------------------ | ------------------ | --------------------------- |
| fromIterableOrElse | `Iterable<A>`, `E` | `Either<E, A>`              |
| fromOptionOrElse   | `Option<A>`, `E`   | `Either<E, A>`              |
| fromNullableOrElse | `A`, `E`           | `Either<E, NonNullable<A>>` |
| getLeft            | `Either<E, A>`     | `Option<E>`                 |
| getRight           | `Either<E, A>`     | `Option<A>`                 |

## Interop

| Name                | Given                          | To                       |
| ------------------- | ------------------------------ | ------------------------ |
| fromThrowableOrElse | `() => A`, `unknown => E`      | `Either<E, A>`           |
| liftThrowableOrElse | `(...A) => B`, `unknown => E`  | `(...A) => Either<E, B>` |
| getOrThrow          | `Either<E, A>`, `E => unknown` | `A`                      |

## Lifting

| Name                | Given                                   | To                                                                           |
| ------------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| lift2               | `(A, B) => C`                           | `(Either<E1, A>, Either<E2, B>) => Either<E1 \| E2, C>`                      |
| lift3               | `(A, B, C) => D`                        | `(Either<E1, A>, Either<E2, B>, Either<E3, C>) => Either<E1 \| E2 \| E3, D>` |
| liftPredicateOrElse | `A => boolean`, `E`                     | `A => Either<E, A>`                                                          |
| liftNullableOrElse  | `(...A) => B \| null \| undefined`, `E` | `(...A) => Either<E, NonNullable<B>>`                                        |
| liftOptionOrElse    | `(...A) => Option<B>`, `E`              | `(...A) => Either<E, B>`                                                     |

## Error handling

| Name           | Given                                    | To                         |
| -------------- | ---------------------------------------- | -------------------------- |
| firstSuccessOf | `Either<E, A>`, `Iterable<Either<E, A>>` | `Either<E, A>`             |
| catchAll       | `Either<E1, A>`, `E1 => Either<E2, B>`   | `Either<E2, A \| B>`       |
| orElse         | `Either<E1, A>`, `Either<E2, B>`         | `Either<E2, A \| B>`       |
| orElseEither   | `Either<E1, A>`, `Either<E2, B>`         | `Either<E2, Either<A, B>>` |
| orElseFail     | `Either<E1, A>`, `E2`                    | `Either<E2, A>`            |
| orElseSucceed  | `Either<E, A>`, `B`                      | `Either<E, A \| B>`        |

## Debugging

| Name           | Given                       | To             |
| -------------- | --------------------------- | -------------- |
| unsafeTap      | `Either<E, A>`, `A => void` | `Either<E, A>` |
| unsafeTapError | `Either<E, A>`, `E => void` | `Either<E, A>` |

## Getters

| Name           | Given               | To               |
| -------------- | ------------------- | ---------------- |
| getOrElse      | `Either<E, A>`, `B` | `A \| B`         |
| getOrNull      | `Either<E, A>`      | `A \| null`      |
| getOrUndefined | `Either<E, A>`      | `A \| undefined` |
| getLeft        | `Either<E, A>`      | `Option<E>`      |
| getRight       | `Either<E, A>`      | `Option<A>`      |
| merge          | `Either<E, A>`      | `E \| A`         |

## Pattern matching

| Name  | Given                              | To       |
| ----- | ---------------------------------- | -------- |
| match | `Either<E, A>`, `E => B`, `A => C` | `B \| C` |

## Mapping

| Name    | Given                              | To                |
| ------- | ---------------------------------- | ----------------- |
| imap    | `Either<E, A>`, `A => B`, `B => A` | `Either<E, B>`    |
| tupled  | `Either<E, A>`                     | `Either<E, [A]>`  |
| map     | `Either<E, A>`, `A => B`           | `Either<E, B>`    |
| flap    | `Either<E, A => B>`, `A`           | `Either<E, B>`    |
| as      | `Either<E, _>`, `B`                | `Either<E, B>`    |
| asUnit  | `Either<E, _>`                     | `Either<E, void>` |
| bimap   | `Either<E, A>`, `E => G`, `A => B` | `Either<G, B>`    |
| mapLeft | `Either<E, A>`, `E => G`           | `Either<G, A>`    |

## Sequencing

| Name                  | Given                                                | To                                 |
| --------------------- | ---------------------------------------------------- | ---------------------------------- |
| flatMap               | `Either<E1, A>`, `A => Either<E2, B>`                | `Either<E1 \| E2, B>`              |
| flatten               | `Either<E1, Either<E2, A>>`                          | `Either<E1 \| E2, A>`              |
| andThen               | `Either<E1, _>`, `Either<E2, B>`                     | `Either<E1 \| E2, B>`              |
| andThenDiscard        | `Either<E1, A>`, `Either<E2, _>`                     | `Either<E1 \| E2, A>`              |
| tap                   | `Either<E1, A>`, `A => Either<E2, _>`                | `Either<E1 \| E2, A>`              |
| tapError              | `Either<E1, A>`, `E1 => Either<E2, _>`               | `Either<E1 \| E2, A>`              |
| composeKleisliArrow   | `A => Either<E1, B>`, `B => Either<E2, C>`           | `A => Either<E1 \| E2, C>`         |
| flatMapNullableOrElse | `Either<E1, A>`, `A => B \| null \| undefined`, `E2` | `Either<E1 \| E2, NonNullable<B>>` |
| flatMapOptionOrElse   | `Either<E1, A>`, `A => Option<B>`, `E2`              | `Either<E1 \| E2, NonNullable<B>>` |

## Combining

| Name                     | Given                          | To                        |
| ------------------------ | ------------------------------ | ------------------------- |
| getSemigroup             | `Semigroup<E>`, `Semigroup<A>` | `Semigroup<Either<E, A>>` |
| getFirstErrorSemigroup   | `Semigroup<A>`                 | `Semigroup<Either<E, A>>` |
| getFirstErrorMonoid      | `Monoid<A>`                    | `Monoid<Either<E, A>>`    |
| getFirstSuccessSemigroup |                                | `Semigroup<Either<E, A>>` |

## Filtering

| Name            | Given                                   | To                             |
| --------------- | --------------------------------------- | ------------------------------ |
| compactOrElse   | `Either<E, Option<A>>`, `E`             | `Either<E, A>`                 |
| separateOrElse  | `Either<E, Either<A, B>>`, `E`          | `[Either<E, A>, Either<E, B>]` |
| filterOrElse    | `Either<E1, A>`, `A => boolean`, `E2`   | `Either<E1 \| E2, A>`          |
| filterMapOrElse | `Either<E1, A>`, `A => Option<B>`, `E2` | `Either<E1 \| E2, B>`          |

## Traversing

| Name        | Given                       | To                |
| ----------- | --------------------------- | ----------------- |
| traverse    | `Either<E, A>`, `A => F<B>` | `F<Either<E, B>>` |
| sequence    | `Either<E, F<A>>`           | `F<Either<E, A>>` |
| traverseTap | `Either<E, A>`, `A => F<B>` | `F<Either<E, A>>` |

## Do notation

| Name       | Given                                                 | To                                    |
| ---------- | ----------------------------------------------------- | ------------------------------------- |
| Do         |                                                       | `Either<never, {}>`                   |
| bindTo     | `Either<E, A>`, `name: string`                        | `Either<E, { [name]: A }>`            |
| let        | `Either<E, A>`, `name: string`, `A => B`              | `Either<E, A & { [name]: B }>`        |
| bind       | `Either<E1, A>`, `name: string`, `A => Either<E2, B>` | `Either<E1 \| E2, A & { [name]: B }>` |
| bindEither | `Either<E1, A>`, `name: string`, `Either<E2, B>`      | `Either<E1 \| E2, A & { [name]: B }>` |

## Predicates

| Name   | Given                          | To        |
| ------ | ------------------------------ | --------- |
| elem   | `Either<E, A>`, `B`            | `boolean` |
| exists | `Either<E, A>`, `A => boolean` | `boolean` |

## Utils

| Name           | Given                                        | To                                            |
| -------------- | -------------------------------------------- | --------------------------------------------- |
| unit           |                                              | `Either<never, void>`                         |
| product        | `Either<E1, A>`, `Either<E2, B>`             | `Either<E1 \| E2, [A, B]>`                    |
| productMany    | `Either<E, A>`, `Iterable<Either<E, A>>`     | `Either<E, [A, ...Array<A>]>`                 |
| productAll     | `Iterable<Either<E, A>>`                     | `Either<E, ReadonlyArray<A>>`                 |
| productFlatten | `Either<E1, A>`, `Either<E2, B>`             | `Either<E1 \| E2, [...A, B]>`                 |
| tuple          | `[Either<E1, A>, Either<E2, B>, ...]`        | `Either<E1 \| E2 \| ..., [A, B, ...]>`        |
| struct         | `{ a: Either<E1, A>, b: Either<E2, B>, ...}` | `Either<E1 \| E2 \| ..., { a: A, b: B, ...}>` |
| ap             | `Either<E1, A => B>`, `Either<E2, A>`        | `Either<E1 \| E2, B>`                         |
| reverse        | `Either<E, A>`                               | `Either<A, E>`                                |
