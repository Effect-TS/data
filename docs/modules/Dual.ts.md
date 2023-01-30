---
title: Dual.ts
nav_order: 11
parent: Modules
---

## Dual overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [dual](#dual)

---

# utils

## dual

**Signature**

```ts
export declare const dual: <DF extends (...args: Array<any>) => any, P extends (...args: Array<any>) => any>(
  dfLen: Parameters<DF>['length'],
  body: DF
) => DF & P
```

Added in v1.0.0
