/**
 * @since 1.0.0
 */

/**
 * @since 1.0.0
 * @category symbols
 */
export const NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom")

/**
 * @since 1.0.0
 * @category symbols
 */
export type NodeInspectSymbol = typeof NodeInspectSymbol

/**
 * @since 1.0.0
 * @category models
 */
export interface Inspectable {
  readonly toString: () => string
  readonly toJSON: () => unknown
  readonly [NodeInspectSymbol]: () => unknown
}

/**
 * @since 1.0.0
 */
export const toJSON = (x: unknown): unknown => {
  if (
    typeof x === "object" && x !== null && "toJSON" in x && typeof x["toJSON"] === "function" &&
    x["toJSON"].length === 0
  ) {
    return x.toJSON()
  } else if (Array.isArray(x)) {
    return x.map(toJSON)
  }
  return x
}

const _toString = (x: any, indentation: string): string => {
  if (Array.isArray(x)) {
    if (x.length > 0) {
      return (indentation ? "\n" : "") + x.map((a) => indentation + "-" + _toString(a, indentation + "  "))
        .join("\n")
    }
    return (indentation ? " []" : "[]")
  } else if (typeof x === "object" && x !== null) {
    const keys = Object.keys(x)
    if (keys.length > 0) {
      return (indentation ? "\n" : "") +
        keys.map((k) => indentation + k + ":" + _toString(x[k], indentation + "  ")).join("\n")
    }
    return (indentation ? " {}" : "{}")
  }
  return (indentation ? " " : "") + String(x)
}

/**
 * @since 1.0.0
 */
export const toString = (x: unknown): string => _toString(x, "")
