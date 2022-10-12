/** @internal */
export class AtomicNumber {
  constructor(private current: number) {
  }

  get get() {
    return this.current
  }

  getAndSet(value: number) {
    const old = this.current

    this.set(value)
    return old
  }

  set(value: number) {
    this.current = value
  }

  compareAndSet(old: number, value: number) {
    if (this.get === old) {
      this.set(value)
      return true
    }
    return false
  }

  incrementAndGet() {
    this.set(this.get + 1)
    return this.get
  }

  decrementAndGet() {
    this.set(this.get - 1)
    return this.get
  }

  getAndIncrement(): number {
    const ret = this.get

    this.set(this.get + 1)

    return ret
  }
}
