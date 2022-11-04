/**
 * @since 1.0.0
 */

import * as boolean from "@fp-ts/data/Boolean"
import * as chunk from "@fp-ts/data/Chunk"
import * as const_ from "@fp-ts/data/Const"
import * as context from "@fp-ts/data/Context"
import * as differ from "@fp-ts/data/Differ"
import * as chunkPatch from "@fp-ts/data/Differ/ChunkPatch"
import * as contextPatch from "@fp-ts/data/Differ/ContextPatch"
import * as hashMapPatch from "@fp-ts/data/Differ/HashMapPatch"
import * as hashSetPatch from "@fp-ts/data/Differ/HashSetPatch"
import * as orPatch from "@fp-ts/data/Differ/OrPatch"
import * as duration from "@fp-ts/data/Duration"
import * as either from "@fp-ts/data/Either"
import * as endomorphism from "@fp-ts/data/Endomorphism"
import * as equal from "@fp-ts/data/Equal"
import * as _function from "@fp-ts/data/Function"
import * as hashMap from "@fp-ts/data/HashMap"
import * as hashSet from "@fp-ts/data/HashSet"
import * as identity from "@fp-ts/data/Identity"
import * as list from "@fp-ts/data/List"
import * as mutableHashMap from "@fp-ts/data/mutable/MutableHashMap"
import * as mutableHashSet from "@fp-ts/data/mutable/MutableHashSet"
import * as mutableList from "@fp-ts/data/mutable/MutableList"
import * as mutableListBuilder from "@fp-ts/data/mutable/MutableListBuilder"
import * as mutableQueue from "@fp-ts/data/mutable/MutableQueue"
import * as mutableRef from "@fp-ts/data/mutable/MutableRef"
import * as nonEmpty from "@fp-ts/data/NonEmpty"
import * as number from "@fp-ts/data/Number"
import * as option from "@fp-ts/data/Option"
import * as ordering from "@fp-ts/data/Ordering"
import * as predicate from "@fp-ts/data/Predicate"
import * as queue from "@fp-ts/data/Queue"
import * as random from "@fp-ts/data/Random"
import * as readonlyArray from "@fp-ts/data/ReadonlyArray"
import * as redBlackTree from "@fp-ts/data/RedBlackTree"
import * as refinement from "@fp-ts/data/Refinement"
import * as safeEval from "@fp-ts/data/SafeEval"
import * as sortedMap from "@fp-ts/data/SortedMap"
import * as sortedSet from "@fp-ts/data/SortedSet"
import * as string from "@fp-ts/data/String"
import * as these from "@fp-ts/data/These"
import * as covariantWithIndex from "@fp-ts/data/typeclass/CovariantWithIndex"
import * as filterableWithIndex from "@fp-ts/data/typeclass/FilterableWithIndex"
import * as fromOption from "@fp-ts/data/typeclass/FromOption"
import * as seq from "@fp-ts/data/typeclass/Seq"
import * as weakIterableMap from "@fp-ts/data/weak/WeakIterableMap"

export {
  /**
   * @since 1.0.0
   */
  _function as function,
  /**
   * @since 1.0.0
   */
  boolean,
  /**
   * @since 1.0.0
   */
  chunk,
  /**
   * @since 1.0.0
   */
  chunkPatch,
  /**
   * @since 1.0.0
   */
  const_,
  /**
   * @since 1.0.0
   */
  context,
  /**
   * @since 1.0.0
   */
  contextPatch,
  /**
   * @since 1.0.0
   */
  covariantWithIndex,
  /**
   * @since 1.0.0
   */
  differ,
  /**
   * @since 1.0.0
   */
  duration,
  /**
   * @since 1.0.0
   */
  either,
  /**
   * @since 1.0.0
   */
  endomorphism,
  /**
   * @since 1.0.0
   */
  equal,
  /**
   * @since 1.0.0
   */
  filterableWithIndex,
  /**
   * @since 1.0.0
   */
  fromOption,
  /**
   * @since 1.0.0
   */
  hashMap,
  /**
   * @since 1.0.0
   */
  hashMapPatch,
  /**
   * @since 1.0.0
   */
  hashSet,
  /**
   * @since 1.0.0
   */
  hashSetPatch,
  /**
   * @since 1.0.0
   */
  identity,
  /**
   * @since 1.0.0
   */
  list,
  /**
   * @since 1.0.0
   */
  mutableHashMap,
  /**
   * @since 1.0.0
   */
  mutableHashSet,
  /**
   * @since 1.0.0
   */
  mutableList,
  /**
   * @since 1.0.0
   */
  mutableListBuilder,
  /**
   * @since 1.0.0
   */
  mutableQueue,
  /**
   * @since 1.0.0
   */
  mutableRef,
  /**
   * @since 1.0.0
   */
  nonEmpty,
  /**
   * @since 1.0.0
   */
  number,
  /**
   * @since 1.0.0
   */
  option,
  /**
   * @since 1.0.0
   */
  ordering,
  /**
   * @since 1.0.0
   */
  orPatch,
  /**
   * @since 1.0.0
   */
  predicate,
  /**
   * @since 1.0.0
   */
  queue,
  /**
   * @since 1.0.0
   */
  random,
  /**
   * @since 1.0.0
   */
  readonlyArray,
  /**
   * @since 1.0.0
   */
  redBlackTree,
  /**
   * @since 1.0.0
   */
  refinement,
  /**
   * @since 1.0.0
   */
  safeEval,
  /**
   * @since 1.0.0
   */
  seq,
  /**
   * @since 1.0.0
   */
  sortedMap,
  /**
   * @since 1.0.0
   */
  sortedSet,
  /**
   * @since 1.0.0
   */
  string,
  /**
   * @since 1.0.0
   */
  these,
  /**
   * @since 1.0.0
   */
  weakIterableMap
}
