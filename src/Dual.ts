/**
 * @since 1.0.0
 */
export const dual = <
  DF extends (...args: Array<any>) => any,
  P extends (...args: Array<any>) => any
>(
  dfLen: Parameters<DF>["length"],
  body: DF
): DF & P => {
  // @ts-expect-error
  return function() {
    if (arguments.length === dfLen) {
      // @ts-expect-error
      return body.apply(this, arguments)
    }
    return ((self: any) => body(self, ...arguments)) as any
  }
}
