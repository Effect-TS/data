---
title: These Cheatsheet
nav_order: 4
parent: Cheatsheets
---

# These

- `NEC<A> = NonEmptyChunk<A>`

## Constructors

| Name                | Given            | To                 |
| ------------------- | ---------------- | ------------------ |
| left                | `E`              | `These<E, never>`  |
| right               | `A`              | `These<never, A>`  |
| both                | `E`, `A`         | `These<E, A>`      |
| of (alias of right) | `A`              | `Either<never, A>` |
| leftOrBoth          | `Option<A>`, `E` | `These<E, A>`      |
| rightOrBoth         | `Option<E>`, `A` | `These<E, A>`      |

## Guards

| Name          | Given         | To                           |
| ------------- | ------------- | ---------------------------- |
| isThese       | `unknown`     | `is These<unknown, unknown>` |
| isLeft        | `These<E, A>` | `is Left<E>`                 |
| isLeftOrBoth  | `These<E, A>` | `is Left<E> \| Both<E, A>`   |
| isRight       | `These<E, A>` | `is Right<A>`                |
| isRightOrBoth | `These<E, A>` | `is Right<A> \| Both<E, A>`  |
| isBoth        | `These<E, A>` | `is Both<E, A>`              |

## Conversions

| Name         | Given              | To                         |
| ------------ | ------------------ | -------------------------- |
| fromIterable | `Iterable<A>`, `E` | `These<E, A>`              |
| fromNullable | `A`, `E`           | `These<E, NonNullable<A>>` |
| fromOption   | `Option<A>`, `E`   | `These<E, A>`              |
| fromTuple    | `[E, A]`           | `These<E, A>`              |

## Interop

| Name          | Given                          | To                      |
| ------------- | ------------------------------ | ----------------------- |
| fromThrowable | `() => A`, `unknown => E`      | `These<E, A>`           |
| liftThrowable | `(...A) => B`, `unknown => E`  | `(...A) => These<E, B>` |
| getOrThrow    | `Either<E, A>`, `E => unknown` | `A`                     |

## Lifting

| Name          | Given                                   | To                                                                                           |
| ------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| lift2         | `(A, B) => C`                           | `(These<NEC<E1>, A>, These<NEC<E2>, B>) => These<NEC<E1 \| E2>, C>`                          |
| lift3         | `(A, B, C) => D`                        | `(These<NEC<E1>, A>, These<NEC<E2>, B>, These<NEC<E3>, C>) => These<NEC<E1 \| E2 \| E3>, D>` |
| liftPredicate | `A => boolean`, `E`                     | `A => These<E, A>`                                                                           |
| liftNullable  | `(...A) => B \| null \| undefined`, `E` | `(...A) => These<E, NonNullable<B>>`                                                         |
| liftOption    | `(...A) => Option<B>`, `E`              | `(...A) => These<E, B>`                                                                      |

## Error handling

| Name           | Given                                  | To                              |
| -------------- | -------------------------------------- | ------------------------------- |
| firstSuccessOf | `These<E, A>`, `Iterable<These<E, A>>` | `These<E, A>`                   |
| catchAll       | `These<E1, A>`, `E1 => These<E2, B>`   | `These<E1 \| E2, A \| B>`       |
| orElse         | `These<E1, A>`, `These<E2, B>`         | `These<E1 \| E2, A \| B>`       |
| orElseEither   | `These<E1, A>`, `These<E2, B>`         | `These<E1 \| E2, Either<A, B>>` |
| orElseFail     | `These<E1, A>`, `E2`                   | `These<E1 \| E2, A>`            |
| orElseSucceed  | `These<E, A>`, `B`                     | `These<E, A \| B>`              |

## Debugging

| Name         | Given                           | To            |
| ------------ | ------------------------------- | ------------- |
| inspectRight | `These<E, A>`, `A => void`      | `These<E, A>` |
| inspectLeft  | `These<E, A>`, `E => void`      | `These<E, A>` |
| inspectBoth  | `These<E, A>`, `(E, A) => void` | `These<E, A>` |

## Getters

| Name                | Given                         | To               |
| ------------------- | ----------------------------- | ---------------- |
| getOrElse           | `These<E, A>`, `B`            | `A \| B`         |
| getOrNull           | `These<E, A>`                 | `A \| null`      |
| getOrUndefined      | `These<E, A>`                 | `A \| undefined` |
| getLeft             | `These<E, A>`                 | `Option<E>`      |
| getLeftOnly         | `These<E, A>`                 | `Option<E>`      |
| getRight            | `These<E, A>`                 | `Option<A>`      |
| getRightOnly        | `These<E, A>`                 | `Option<A>`      |
| getBoth             | `These<E, A>`                 | `Option<[E, A]>` |
| getBothOrElse       | `These<E, A>`, `E`, `A`       | `[E, A]`         |
| getOrThrow          | `These<E, A>`, `E => unknown` | `A`              |
| getRightOnlyOrThrow | `These<E, A>`, `E => unknown` | `A`              |

## Pattern matching

| Name  | Given                                            | To            |
| ----- | ------------------------------------------------ | ------------- |
| match | `These<E, A>`, `E => B`, `A => C`, `(E, A) => D` | `B \| C \| D` |

## Mapping

| Name       | Given                             | To               |
| ---------- | --------------------------------- | ---------------- |
| imap       | `These<E, A>`, `A => B`, `B => A` | `These<E, B>`    |
| tupled     | `These<E, A>`                     | `These<E, [A]>`  |
| tupledLeft | `These<E, A>`                     | `These<[E], A>`  |
| map        | `These<E, A>`, `A => B`           | `These<E, B>`    |
| flap       | `These<E, A => B>`, `A`           | `These<E, B>`    |
| as         | `These<E, _>`, `B`                | `These<E, B>`    |
| asUnit     | `These<E, _>`                     | `These<E, void>` |
| bimap      | `These<E, A>`, `E => G`, `A => B` | `These<G, B>`    |
| mapLeft    | `These<E, A>`, `E => G`           | `These<G, A>`    |

## Sequencing

| Name                | Given                                                    | To                                     |
| ------------------- | -------------------------------------------------------- | -------------------------------------- |
| flatMap             | `These<NEC<E1>, A>`, `A => These<NEC<E2>, B>`            | `These<NEC<E1 \| E2>, B>`              |
| flatten             | `These<NEC<E1>, These<NEC<E2>, A>>`                      | `These<NEC<E1 \| E2>, A>`              |
| andThen             | `These<NEC<E1>, _>`, `Either<NEC<E2>, B>`                | `These<NEC<E1 \| E2>, B>`              |
| andThenDiscard      | `These<NEC<E1>, A>`, `Either<NEC<E2>, _>`                | `These<NEC<E1 \| E2>, A>`              |
| tap                 | `These<NEC<E1>, A>`, `A => These<NEC<E2>, _>`            | `These<NEC<E1 \| E2>, A>`              |
| composeKleisliArrow | `A => These<NEC<E1>, B>`, `B => These<NEC<E2>, C>`       | `A => These<NEC<E1 \| E2>, C>`         |
| flatMapNullable     | `These<NEC<E1>, A>`, `A => B \| null \| undefined`, `E2` | `These<NEC<E1 \| E2>, NonNullable<B>>` |
| flatMapOption       | `These<NEC<E1>, A>`, `A => Option<B>`, `E2`              | `Either<NEC<E1 \| E2>, B>`             |

## Combining

| Name                         | Given          | To                            |
| ---------------------------- | -------------- | ----------------------------- |
| getFirstLeftSemigroup        | `Semigroup<A>` | `Semigroup<These<NEC<E>, A>>` |
| getFirstLeftMonoid           | `Monoid<A>`    | `Monoid<These<NEC<E>, A>>`    |
| getFirstRightOrBothSemigroup |                | `Semigroup<These<E, A>>`      |

## Filtering

| Name      | Given                                  | To                   |
| --------- | -------------------------------------- | -------------------- |
| compact   | `These<E, Option<A>>`, `E`             | `These<E, A>`        |
| filter    | `These<E1, A>`, `A => boolean`, `E2`   | `These<E1 \| E2, A>` |
| filterMap | `These<E1, A>`, `A => Option<B>`, `E2` | `These<E1 \| E2, B>` |

## Traversing

| Name        | Given                      | To               |
| ----------- | -------------------------- | ---------------- |
| traverse    | `These<E, A>`, `A => F<B>` | `F<These<E, B>>` |
| sequence    | `These<E, F<A>>`           | `F<These<E, A>>` |
| traverseTap | `These<E, A>`, `A => F<B>` | `F<These<E, A>>` |

## Do notation

| Name      | Given                                                         | To                                        |
| --------- | ------------------------------------------------------------- | ----------------------------------------- |
| Do        |                                                               | `These<never, {}>`                        |
| bindTo    | `These<E, A>`, `name: string`                                 | `These<E, { [name]: A }>`                 |
| let       | `These<E, A>`, `name: string`, `A => B`                       | `These<E, A & { [name]: B }>`             |
| bind      | `These<NEC<E1>, A>`, `name: string`, `A => These<NEC<E2>, B>` | `These<NEC<E1 \| E2>, A & { [name]: B }>` |
| bindThese | `These<NEC<E1>, A>`, `name: string`, `These<NEC<E2>, B>`      | `These<NEC<E1 \| E2>, A & { [name]: B }>` |

## Predicates

| Name   | Given                         | To        |
| ------ | ----------------------------- | --------- |
| elem   | `These<E, A>`, `B`            | `boolean` |
| exists | `These<E, A>`, `A => boolean` | `boolean` |

## Utils

| Name           | Given                                                | To                                                |
| -------------- | ---------------------------------------------------- | ------------------------------------------------- |
| unit           |                                                      | `These<never, void>`                              |
| product        | `These<NEC<E1>, A>`, `These<NEC<E2>, B>`             | `These<NEC<E1 \| E2>, [A, B]>`                    |
| productMany    | `These<NEC<E>, A>`, `Iterable<These<NEC<E>, A>>`     | `These<NEC<E>, [A, ...Array<A>]>`                 |
| productAll     | `Iterable<These<NEC<E>, A>>`                         | `These<NEC<E>, ReadonlyArray<A>>`                 |
| productFlatten | `These<NEC<E1>, A>`, `These<NEC<E2>, B>`             | `These<NEC<E1 \| E2>, [...A, B]>`                 |
| tuple          | `[These<NEC<E1>, A>, These<NEC<E2>, B>, ...]`        | `These<NEC<E1 \| E2 \| ...>, [A, B, ...]>`        |
| struct         | `{ a: These<NEC<E1>, A>, b: These<NEC<E2>, B>, ...}` | `These<NEC<E1 \| E2 \| ...>, { a: A, b: B, ...}>` |
| ap             | `These<NEC<E1>, A => B>`, `These<NEC<E2>, A>`        | `These<NEC<E1 \| E2>, B>`                         |
| reverse        | `These<E, A>`                                        | `These<A, E>`                                     |
