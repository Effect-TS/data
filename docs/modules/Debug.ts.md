---
title: Debug.ts
nav_order: 7
parent: Modules
---

## Debug overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [debug](#debug)
  - [runtimeDebug](#runtimedebug)
- [models](#models)
  - [Debug (interface)](#debug-interface)
  - [Frame (interface)](#frame-interface)
  - [Restore (type alias)](#restore-type-alias)
  - [SourceLocation (interface)](#sourcelocation-interface)
  - [Trace (type alias)](#trace-type-alias)
  - [Traced (interface)](#traced-interface)
- [restore](#restore)
  - [restoreOff](#restoreoff)
  - [restoreOn](#restoreon)
- [tracing](#tracing)
  - [bodyWithTrace](#bodywithtrace)
  - [dualWithTrace](#dualwithtrace)
  - [makeTraced](#maketraced)
  - [methodWithTrace](#methodwithtrace)
  - [pipeableWithTrace](#pipeablewithtrace)
  - [sourceLocation](#sourcelocation)
  - [traced](#traced)
  - [untraced](#untraced)
  - [untracedDual](#untraceddual)
  - [untracedMethod](#untracedmethod)

---

# debug

## runtimeDebug

**Signature**

```ts
export declare const runtimeDebug: Debug
```

Added in v1.0.0

# models

## Debug (interface)

**Signature**

```ts
export interface Debug {
  /**
   * Overrides the default log level filter for loggers such as console.
   */
  minumumLogLevel: 'All' | 'Fatal' | 'Error' | 'Warning' | 'Info' | 'Debug' | 'Trace' | 'None'
  /**
   * Sets a limit on how many stack traces should be rendered.
   */
  traceStackLimit: number
  /**
   * Enables tracing of execution and stack.
   */
  tracingEnabled: boolean
  /**
   * Used to extract a source location from an Error when rendering a stack
   */
  parseStack: (error: Error) => ReadonlyArray<Frame | undefined>
  /**
   * Used to filter a source location when rendering a stack
   */
  filterStackFrame: (frame: Frame) => boolean
}
```

Added in v1.0.0

## Frame (interface)

**Signature**

```ts
export interface Frame {
  name?: string
  fileName: string
  line: number
  column: number
}
```

Added in v1.0.0

## Restore (type alias)

**Signature**

```ts
export type Restore = <F extends (...args: Array<any>) => any>(f: F) => F
```

Added in v1.0.0

## SourceLocation (interface)

**Signature**

```ts
export interface SourceLocation extends Error {
  depth: number
  parsed?: Frame | undefined

  toFrame(): Frame | undefined
}
```

Added in v1.0.0

## Trace (type alias)

**Signature**

```ts
export type Trace = SourceLocation | undefined
```

Added in v1.0.0

## Traced (interface)

**Signature**

```ts
export interface Traced<T> extends Pipeable<T> {
  readonly _tag: 'Traced'
  readonly i0: T
  readonly trace: SourceLocation
  traced(this: this, trace: Trace): Traced<this> | this
}
```

Added in v1.0.0

# restore

## restoreOff

**Signature**

```ts
export declare const restoreOff: Restore
```

Added in v1.0.0

## restoreOn

**Signature**

```ts
export declare const restoreOn: Restore
```

Added in v1.0.0

# tracing

## bodyWithTrace

**Signature**

```ts
export declare const bodyWithTrace: <A>(body: (trace: Trace, restore: Restore) => A) => A
```

Added in v1.0.0

## dualWithTrace

**Signature**

```ts
export declare const dualWithTrace: {
  <DataLast extends (...args: Array<any>) => any, DataFirst extends (...args: Array<any>) => any>(
    dfLen: Parameters<DataFirst>['length'],
    body: (trace: Trace, restore: Restore) => DataFirst
  ): DataLast & DataFirst
  <DataLast extends (...args: Array<any>) => any, DataFirst extends (...args: Array<any>) => any>(
    isDataFirst: (args: IArguments) => boolean,
    body: (trace: Trace, restore: Restore) => DataFirst
  ): DataLast & DataFirst
}
```

Added in v1.0.0

## makeTraced

**Signature**

```ts
export declare const makeTraced: <T>(self: T, source: SourceLocation) => Traced<T>
```

Added in v1.0.0

## methodWithTrace

**Signature**

```ts
export declare const methodWithTrace: <A extends (...args: Array<any>) => any>(
  body: (trace: Trace, restore: Restore) => A
) => A
```

Added in v1.0.0

## pipeableWithTrace

**Signature**

```ts
export declare const pipeableWithTrace: <A extends (...args: Array<any>) => any>(
  body: (trace: Trace, restore: Restore) => A
) => A
```

Added in v1.0.0

## sourceLocation

**Signature**

```ts
export declare const sourceLocation: (error: Error) => SourceLocation
```

Added in v1.0.0

## traced

**Signature**

```ts
export declare const traced: <A>(body: (restore: Restore) => A) => A
```

Added in v1.0.0

## untraced

**Signature**

```ts
export declare const untraced: <A>(body: (restore: Restore) => A) => A
```

Added in v1.0.0

## untracedDual

**Signature**

```ts
export declare const untracedDual: <
  DataLast extends (...args: Array<any>) => any,
  DataFirst extends (...args: Array<any>) => any
>(
  dfLen: Parameters<DataFirst>['length'],
  body: (restore: Restore) => DataFirst
) => DataLast & DataFirst
```

Added in v1.0.0

## untracedMethod

**Signature**

```ts
export declare const untracedMethod: <A extends (...args: Array<any>) => any>(body: (restore: Restore) => A) => A
```

Added in v1.0.0
