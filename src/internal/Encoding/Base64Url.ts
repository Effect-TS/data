import * as Either from "@effect/data/Either"
import * as Base64 from "@effect/data/internal/Encoding/Base64"

/** @internal */
export const encode = (data: Uint8Array) =>
  Base64.encode(data).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")

/** @internal */
export class Base64UrlDecodeError {
  readonly _tag = "Base64UrlDecodeError"
}

/** @internal */
export const decode = (str: string): Either.Either<Base64UrlDecodeError, Uint8Array> => {
  const length = str.length
  if (length % 4 === 1) {
    return Either.left(new Base64UrlDecodeError())
  }

  if (!/^[-_A-Z0-9]*?={0,2}$/i.test(str)) {
    return Either.left(new Base64UrlDecodeError())
  }

  // Some variants allow or require omitting the padding '=' signs
  let sanitized = length % 4 === 2 ? `${str}==` : length % 4 === 3 ? `${str}=` : str
  sanitized = sanitized.replace(/-/g, "+").replace(/_/g, "/")

  return Base64.decode(sanitized).pipe(Either.mapLeft(() => new Base64UrlDecodeError()))
}
