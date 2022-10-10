import type { Ord } from "@fp-ts/core/typeclasses/Ord"
import { ListBuilder } from "@fp-ts/data/internal/List/builder"
import * as L from "@fp-ts/data/internal/List/definition"

export function sortWith<A>(ord: Ord<A>) {
  return (self: L.List<A>): L.List<A> => {
    const len = L.length(self)
    const b = new ListBuilder<A>()
    if (len === 1) {
      b.append(L.unsafeHead(self)!)
    } else if (len > 1) {
      const arr = new Array<[number, A]>(len)
      copyToArrayWithIndex(self, arr)
      arr.sort(([i, x], [j, y]) => {
        const c = ord.compare(y)(x)
        return c !== 0 ? c : i < j ? -1 : 1
      })
      for (let i = 0; i < len; i++) {
        b.append(arr[i]![1])
      }
    }
    return b.build()
  }
}

function copyToArrayWithIndex<A>(list: L.List<A>, arr: Array<[number, A]>): void {
  let these = list
  let i = 0
  while (!L.isNil(these)) {
    arr[i] = [i, these.head]
    these = these.tail
    i++
  }
}
