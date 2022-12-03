/**
 * @since 1.0.0
 */
import * as Equal from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"

const recordProto: Equal.Equal = {
  [Equal.symbolHash](this: {}) {
    let hash = Equal.hash("struct")
    for (const key of Object.keys(this).sort()) {
      hash = pipe(Equal.hash(key), Equal.hashCombine(Equal.hash(this[key])))
    }
    return hash
  },
  [Equal.symbolEqual](this: {}, that: unknown) {
    if (typeof that === "object" && that != null && Object.getPrototypeOf(that) === recordProto) {
      const keysThis = Object.keys(this).sort()
      const keysThat = Object.keys(that).sort()
      if (keysThis.length !== keysThat.length) {
        return false
      }
      if (!keysThis.every((key, index) => Equal.equals(key, keysThat[index]))) {
        return false
      }
      for (const key of keysThis) {
        if (!Equal.equals(this[key], that[key])) {
          return false
        }
      }
      return true
    }
    return false
  }
}

/**
 * @since 1.0.0
 */
export const record = <A extends { readonly [k: string]: unknown }>(self: A): A =>
  Object.assign(Object.setPrototypeOf({}, recordProto), self)

/**
 * @since 1.0.0
 */
export const spread = <B extends { readonly [k: string]: unknown }>(that: B) =>
  <A extends { readonly [k: string]: unknown }>(self: A): A & B =>
    Object.setPrototypeOf({ ...self, ...that }, recordProto)

/**
 * @since 1.0.0
 */
export const pick = <A extends { readonly [k: string]: unknown }, K extends Array<keyof A>>(
  ...keys: K
) =>
  (self: A): Pick<A, K[number]> => {
    const o: any = {}
    for (const key of keys) {
      o[key] = self[key]
    }
    return Object.setPrototypeOf(o, recordProto)
  }

/**
 * @since 1.0.0
 */
export const omit = <A extends { readonly [k: string]: unknown }, K extends Array<keyof A>>(
  ...keys: K
) =>
  (self: A): Omit<A, K[number]> => {
    const o: any = {}
    const ks = new Set(keys)
    for (const key of Object.keys(self)) {
      if (!ks.has(key)) {
        o[key] = self[key]
      }
    }
    return Object.setPrototypeOf(o, recordProto)
  }
