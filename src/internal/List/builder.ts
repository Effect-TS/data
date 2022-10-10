import * as L from "@fp-ts/data/internal/List/definition"
import type * as L_ from "@fp-ts/data/List"

export class ListBuilder<A> implements L_.ListBuilder<A> {
  private first: L.List<A> = L.nil()
  private last0: L.Cons<A> | undefined = undefined
  private len = 0;

  [Symbol.iterator](): Iterator<A> {
    return this.first[Symbol.iterator]()
  }

  get length(): number {
    return this.len
  }

  isEmpty = (): boolean => {
    return this.len === 0
  }

  unsafeHead = (): A => {
    if (this.isEmpty()) {
      throw new Error("Expected ListBuilder to be not empty")
    }
    return (this.first as L.Cons<A>).head
  }

  unsafeTail = (): L.List<A> => {
    if (this.isEmpty()) {
      throw new Error("Expected ListBuilder to be not empty")
    }
    return (this.first as L.Cons<A>).tail
  }

  append = (elem: A): ListBuilder<A> => {
    const last1 = L.cons(elem, L.nil())
    if (this.len === 0) {
      this.first = last1
    } else {
      this.last0!.tail = last1
    }
    this.last0 = last1
    this.len += 1
    return this
  }

  prepend = (elem: A): ListBuilder<A> => {
    this.insert(0, elem)
    return this
  }

  unprepend = (): A => {
    if (this.isEmpty()) {
      throw new Error("no such element")
    }
    const h = (this.first as L.Cons<A>).head
    this.first = (this.first as L.Cons<A>).tail
    this.len -= 1
    return h
  }

  build = (): L.List<A> => {
    return this.first
  }

  insert = (idx: number, elem: A): ListBuilder<A> => {
    if (idx < 0 || idx > this.len) {
      throw new Error(`Index ${idx} out of bounds ${0} ${this.len - 1}`)
    }
    if (idx === this.len) {
      this.append(elem)
    } else {
      const p = this.locate(idx)
      const nx = L.cons(elem, this.getNext(p))
      if (p === undefined) {
        this.first = nx
      } else {
        ;(p as L.Cons<A>).tail = nx
      }
      this.len += 1
    }
    return this
  }

  reduce = <B>(b: B, f: (b: B, a: A) => B): B => {
    return L.reduce(b, f)(this.first)
  }

  private getNext(p: L.List<A> | undefined): L.List<A> {
    if (p === undefined) {
      return this.first
    } else {
      return L.unsafeTail(p)!
    }
  }

  private locate(i: number): L.List<A> | undefined {
    if (i === 0) {
      return undefined
    } else if (i === this.len) {
      return this.last0
    } else {
      let p = this.first
      for (let j = i - 1; j > 0; j--) {
        p = L.unsafeTail(p)!
      }
      return p
    }
  }
}

export function builder<A>(): ListBuilder<A> {
  return new ListBuilder()
}
