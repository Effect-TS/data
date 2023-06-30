/**
 * @since 1.0.0
 */

/**
 * @since 1.0.0
 * @category models
 */
export interface Withable<A> {
  with<B>(ab: (_: A) => B): B
  with<B, C>(ab: (_: A) => B, bc: (_: B) => C): C
  with<B, C, D>(ab: (_: A) => B, bc: (_: B) => C, cd: (_: C) => D): D
  with<B, C, D, E>(ab: (_: A) => B, bc: (_: B) => C, cd: (_: C) => D, de: (_: D) => E): E
  with<B, C, D, E, F>(ab: (_: A) => B, bc: (_: B) => C, cd: (_: C) => D, de: (_: D) => E, ef: (_: E) => F): F
  with<B, C, D, E, F, G>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G
  ): G
  with<B, C, D, E, F, G, H>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H
  ): H
  with<B, C, D, E, F, G, H, I>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I
  ): I
  with<B, C, D, E, F, G, H, I, J>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J
  ): J
  with<B, C, D, E, F, G, H, I, J, K>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K
  ): K
  with<B, C, D, E, F, G, H, I, J, K, L>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L
  ): L
  with<B, C, D, E, F, G, H, I, J, K, L, M>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M
  ): M
  with<B, C, D, E, F, G, H, I, J, K, L, M, N>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N
  ): N
  with<B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N,
    no: (_: N) => O
  ): O
  with<B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N,
    no: (_: N) => O,
    op: (_: O) => P
  ): P
  with<B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N,
    no: (_: N) => O,
    op: (_: O) => P,
    pq: (_: P) => Q
  ): Q
  with<B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N,
    no: (_: N) => O,
    op: (_: O) => P,
    pq: (_: P) => Q,
    qr: (_: Q) => R
  ): R
  with<B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N,
    no: (_: N) => O,
    op: (_: O) => P,
    pq: (_: P) => Q,
    qr: (_: Q) => R,
    rs: (_: R) => S
  ): S
  with<B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N,
    no: (_: N) => O,
    op: (_: O) => P,
    pq: (_: P) => Q,
    qr: (_: Q) => R,
    rs: (_: R) => S,
    st: (_: S) => T
  ): T
  with<B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N,
    no: (_: N) => O,
    op: (_: O) => P,
    pq: (_: P) => Q,
    qr: (_: Q) => R,
    rs: (_: R) => S,
    st: (_: S) => T,
    tu: (_: T) => U
  ): U
  with<B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    fg: (_: F) => G,
    gh: (_: G) => H,
    hi: (_: H) => I,
    ij: (_: I) => J,
    jk: (_: J) => K,
    kl: (_: K) => L,
    lm: (_: L) => M,
    mn: (_: M) => N,
    no: (_: N) => O,
    op: (_: O) => P,
    pq: (_: P) => Q,
    qr: (_: Q) => R,
    rs: (_: R) => S,
    st: (_: S) => T,
    tu: (_: T) => U
  ): U
}

/**
 * @since 1.0.0
 */
export const pipeArguments = <A>(self: A, args: IArguments): unknown => {
  switch (args.length) {
    case 1:
      return args[0](self)
    case 2:
      return args[1](args[0](self))
    case 3:
      return args[2](args[1](args[0](self)))
    case 4:
      return args[3](args[2](args[1](args[0](self))))
    case 5:
      return args[4](args[3](args[2](args[1](args[0](self)))))
    case 6:
      return args[5](args[4](args[3](args[2](args[1](args[0](self))))))
    case 7:
      return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))
    case 8:
      return args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))))
    case 9:
      return args[8](args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))))
    default: {
      let ret = self
      for (let i = 0, len = args.length; i < len; i++) {
        ret = args[i](ret)
      }
      return ret
    }
  }
}
