---
title: Duration.ts
nav_order: 11
parent: Modules
---

## Duration overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [comparisons](#comparisons)
  - [equals](#equals)
  - [greaterThan](#greaterthan)
  - [greaterThanOrEqualTo](#greaterthanorequalto)
  - [lessThan](#lessthan)
  - [lessThanOrEqualTo](#lessthanorequalto)
- [constructors](#constructors)
  - [days](#days)
  - [hours](#hours)
  - [infinity](#infinity)
  - [millis](#millis)
  - [minutes](#minutes)
  - [seconds](#seconds)
  - [weeks](#weeks)
  - [zero](#zero)
- [guards](#guards)
  - [isDuration](#isduration)
- [models](#models)
  - [Duration (interface)](#duration-interface)
- [mutations](#mutations)
  - [add](#add)
  - [subtract](#subtract)
  - [times](#times)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# comparisons

## equals

**Signature**

```ts
export declare const equals: {
  (that: Duration): (self: Duration) => boolean
  (self: Duration, that: Duration): boolean
}
```

Added in v1.0.0

## greaterThan

**Signature**

```ts
export declare const greaterThan: {
  (that: Duration): (self: Duration) => boolean
  (self: Duration, that: Duration): boolean
}
```

Added in v1.0.0

## greaterThanOrEqualTo

**Signature**

```ts
export declare const greaterThanOrEqualTo: {
  (self: Duration, that: Duration): boolean
  (that: Duration): (self: Duration) => boolean
}
```

Added in v1.0.0

## lessThan

**Signature**

```ts
export declare const lessThan: {
  (that: Duration): (self: Duration) => boolean
  (self: Duration, that: Duration): boolean
}
```

Added in v1.0.0

## lessThanOrEqualTo

**Signature**

```ts
export declare const lessThanOrEqualTo: {
  (self: Duration, that: Duration): boolean
  (that: Duration): (self: Duration) => boolean
}
```

Added in v1.0.0

# constructors

## days

**Signature**

```ts
export declare const days: (days: number) => Duration
```

Added in v1.0.0

## hours

**Signature**

```ts
export declare const hours: (hours: number) => Duration
```

Added in v1.0.0

## infinity

**Signature**

```ts
export declare const infinity: Duration
```

Added in v1.0.0

## millis

**Signature**

```ts
export declare const millis: (millis: number) => Duration
```

Added in v1.0.0

## minutes

**Signature**

```ts
export declare const minutes: (minutes: number) => Duration
```

Added in v1.0.0

## seconds

**Signature**

```ts
export declare const seconds: (seconds: number) => Duration
```

Added in v1.0.0

## weeks

**Signature**

```ts
export declare const weeks: (weeks: number) => Duration
```

Added in v1.0.0

## zero

**Signature**

```ts
export declare const zero: Duration
```

Added in v1.0.0

# guards

## isDuration

**Signature**

```ts
export declare const isDuration: (u: unknown) => u is Duration
```

Added in v1.0.0

# models

## Duration (interface)

**Signature**

```ts
export interface Duration {
  readonly _id: TypeId
  readonly millis: number
}
```

Added in v1.0.0

# mutations

## add

**Signature**

```ts
export declare const add: { (that: Duration): (self: Duration) => Duration; (self: Duration, that: Duration): Duration }
```

Added in v1.0.0

## subtract

**Signature**

```ts
export declare const subtract: {
  (that: Duration): (self: Duration) => Duration
  (self: Duration, that: Duration): Duration
}
```

Added in v1.0.0

## times

**Signature**

```ts
export declare const times: { (times: number): (self: Duration) => Duration; (self: Duration, times: number): Duration }
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0
