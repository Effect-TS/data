# ReadonlyArray

## Constructors

| Name      | Given                   | To                         |
| --------- | ----------------------- | -------------------------- |
| make      | `...A`                  | `NonEmptyReadonlyArray<A>` |
| makeBy    | `number => A`, `number` | `NonEmptyReadonlyArray<A>` |
| range     | `number`, `number`      | `NonEmptyReadonlyArray<A>` |
| replicate | `A`, `number`           | `NonEmptyReadonlyArray<A>` |

## Conversions

| Name         | Given                | To                 |
| ------------ | -------------------- | ------------------ |
| fromIterable | `Iterable<A>`        | `ReadonlyArray<A>` |
| fromOption   | `Option<A>`          | `ReadonlyArray<A>` |
| fromEither   | `Either<unknown, A>` | `ReadonlyArray<A>` |

## Predicates

| Name       | Given              | To                            |
| ---------- | ------------------ | ----------------------------- |
| isEmpty    | `ReadonlyArray<A>` | `is readonly []`              |
| isNonEmpty | `ReadonlyArray<A>` | `is NonEmptyReadonlyArray<A>` |

## Getters

| Name       | Given              | To                            |
| ---------- | ------------------ | ----------------------------- |
| isEmpty    | `ReadonlyArray<A>` | `is readonly []`              |
| isNonEmpty | `ReadonlyArray<A>` | `is NonEmptyReadonlyArray<A>` |

## Pattern matching

| Name       | Given                                                 | To       |
| ---------- | ----------------------------------------------------- | -------- |
| match      | `ReadonlyArray<A>`, `B`, `(A, ReadonlyArray<A>) => C` | `B \| C` |
| matchRight | `ReadonlyArray<A>`, `B`, `(ReadonlyArray<A>, A) => C` | `B \| C` |

## Mutations

| Name       | Given                                                 | To       |
| ---------- | ----------------------------------------------------- | -------- |
| match      | `ReadonlyArray<A>`, `B`, `(A, ReadonlyArray<A>) => C` | `B \| C` |
| matchRight | `ReadonlyArray<A>`, `B`, `(ReadonlyArray<A>, A) => C` | `B \| C` |

## Folding

| Name      | Given                                  | To                         |
| --------- | -------------------------------------- | -------------------------- |
| scan      | `ReadonlyArray<A>`, `B`, `(B, A) => B` | `NonEmptyReadonlyArray<B>` |
| scanRight | `ReadonlyArray<A>`, `B`, `(B, A) => B` | `NonEmptyReadonlyArray<B>` |

## Filtering
