/** @internal */
export function encode(bytes: Uint8Array) {
  const length = bytes.length * 2
  const result = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    const v = bytes[i]
    result[i * 2] = hexTable[v >> 4]
    result[i * 2 + 1] = hexTable[v & 0x0f]
  }

  return new TextDecoder().decode(result)
}

/** @internal */
export function decode(str: string) {
  const bytes = new TextEncoder().encode(str)
  if (bytes.length % 2 !== 0) {
    throw new TypeError("Invalid hex string")
  }

  const length = bytes.length / 2
  const result = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    const a = fromHexChar(bytes[i * 2])
    const b = fromHexChar(bytes[i * 2 + 1])
    result[i] = (a << 4) | b
  }

  return result
}

/** @internal */
const hexTable = Uint8Array.from([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102])

/** @internal */
const fromHexChar = (byte: number) => {
  // '0' <= byte && byte <= '9'
  if (48 <= byte && byte <= 57) {
    return byte - 48
  }

  // 'a' <= byte && byte <= 'f'
  if (97 <= byte && byte <= 102) {
    return byte - 97 + 10
  }

  // 'A' <= byte && byte <= 'F'
  if (65 <= byte && byte <= 70) {
    return byte - 65 + 10
  }

  throw new TypeError(`Invalid byte '${String.fromCharCode(byte)}'`)
}
