---
title: Inspectable.ts
nav_order: 19
parent: Modules
---

## Inspectable overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [models](#models)
  - [Inspectable (interface)](#inspectable-interface)
- [symbols](#symbols)
  - [NodeInspectSymbol](#nodeinspectsymbol)
  - [NodeInspectSymbol (type alias)](#nodeinspectsymbol-type-alias)

---

# models

## Inspectable (interface)

**Signature**

```ts
export interface Inspectable {
  readonly toString: () => string
  readonly toJSON: () => unknown
  readonly [NodeInspectSymbol]: () => unknown
}
```

Added in v1.0.0

# symbols

## NodeInspectSymbol

**Signature**

```ts
export declare const NodeInspectSymbol: typeof NodeInspectSymbol
```

Added in v1.0.0

## NodeInspectSymbol (type alias)

**Signature**

```ts
export type NodeInspectSymbol = typeof NodeInspectSymbol
```

Added in v1.0.0
