# @effect/data

## 0.7.1

### Patch Changes

- [#286](https://github.com/Effect-TS/data/pull/286) [`e573887`](https://github.com/Effect-TS/data/commit/e573887d73f1ef30c421c4a7d35da686b4aa9673) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Fix Context types

## 0.7.0

### Minor Changes

- [#284](https://github.com/Effect-TS/data/pull/284) [`0da437b`](https://github.com/Effect-TS/data/commit/0da437b330b2e4f99ef3f4b292058bc26a247379) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Separate Identifier and Type in Tag and prepare for Effect integration as primitive

## 0.6.0

### Minor Changes

- [#282](https://github.com/Effect-TS/data/pull/282) [`df8271a`](https://github.com/Effect-TS/data/commit/df8271a5508001343e4eb61ed110666e4fbb54c9) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Allow symbols in Brand

## 0.5.1

### Patch Changes

- [#278](https://github.com/Effect-TS/data/pull/278) [`15644cf`](https://github.com/Effect-TS/data/commit/15644cf80c8d183c8a4bcfb8f7820f9209c1b26b) Thanks [@jessekelly881](https://github.com/jessekelly881)! - Array: added getEquivalence

- [#280](https://github.com/Effect-TS/data/pull/280) [`1a2021f`](https://github.com/Effect-TS/data/commit/1a2021f9cae92223f31eef0a4e768991f636a879) Thanks [@patroza](https://github.com/patroza)! - fix(Context): add Tag<Tag<T>> issue

## 0.5.0

### Minor Changes

- [#274](https://github.com/Effect-TS/data/pull/274) [`40bc12f`](https://github.com/Effect-TS/data/commit/40bc12fd69496ad4cb57077653728362a1e71292) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Improve Data.Class and Data.TaggedClass

## 0.4.1

### Patch Changes

- [#272](https://github.com/Effect-TS/data/pull/272) [`2674187`](https://github.com/Effect-TS/data/commit/26741875374b1b39de41ee2a3cbfc5122d44929a) Thanks [@patroza](https://github.com/patroza)! - Fix Data TaggedClass and Class constructors

## 0.4.0

### Minor Changes

- [#267](https://github.com/Effect-TS/data/pull/267) [`242542d`](https://github.com/Effect-TS/data/commit/242542dc06b30b9811915f635a05672aa08e25b8) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Remove methods from Chunk

- [#267](https://github.com/Effect-TS/data/pull/267) [`242542d`](https://github.com/Effect-TS/data/commit/242542dc06b30b9811915f635a05672aa08e25b8) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Remove methods from MutableRef

### Patch Changes

- [#268](https://github.com/Effect-TS/data/pull/268) [`132ecf9`](https://github.com/Effect-TS/data/commit/132ecf977427522983534b77ed1ee1e139813651) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Fix order of tag set in Data.tagged

- [#266](https://github.com/Effect-TS/data/pull/266) [`49e8499`](https://github.com/Effect-TS/data/commit/49e8499624c302a86e024f5febdb0f1a03eeb895) Thanks [@IMax153](https://github.com/IMax153)! - ensure \_tag is present when Data.tagged is invoked with no args

- [#264](https://github.com/Effect-TS/data/pull/264) [`438be19`](https://github.com/Effect-TS/data/commit/438be195d5ab4b12028521dc6decfe7a9ffc0418) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Swap implementation of MutableHashMap using a mutabe ref to a HashMap

## 0.3.3

### Patch Changes

- [#260](https://github.com/Effect-TS/data/pull/260) [`08892ac`](https://github.com/Effect-TS/data/commit/08892acf39aeb3e663e694aa7e9ccfd9a9aaaca5) Thanks [@jessekelly881](https://github.com/jessekelly881)! - Bounded: added between

- [#263](https://github.com/Effect-TS/data/pull/263) [`7121c64`](https://github.com/Effect-TS/data/commit/7121c64daa2e91f81393b18f758bd29aba1255fb) Thanks [@IMax153](https://github.com/IMax153)! - fix un-exported HashMap.UpdateFn type

- [#262](https://github.com/Effect-TS/data/pull/262) [`dd3b814`](https://github.com/Effect-TS/data/commit/dd3b814c8fe7b41f8b501ef334b278722460e12d) Thanks [@IMax153](https://github.com/IMax153)! - allow dual to support optional args

## 0.3.2

### Patch Changes

- [#256](https://github.com/Effect-TS/data/pull/256) [`1958bd1`](https://github.com/Effect-TS/data/commit/1958bd12ee313a8a91fbf08719b31916f10b79bf) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Preserve global state across module reloads

## 0.3.1

### Patch Changes

- [#248](https://github.com/Effect-TS/data/pull/248) [`d5a00df`](https://github.com/Effect-TS/data/commit/d5a00df278226520f54c70f002b9ea5672ee638d) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Compact chunk based on depth

- [#250](https://github.com/Effect-TS/data/pull/250) [`d077142`](https://github.com/Effect-TS/data/commit/d07714244df3ac716e0ef0e3ef74041ddc2201c2) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Fix balancing of Chunk

## 0.3.0

### Minor Changes

- [#240](https://github.com/Effect-TS/data/pull/240) [`6bdb7a2`](https://github.com/Effect-TS/data/commit/6bdb7a2cda08fd5790e68103aedf175dbae743a2) Thanks [@gcanti](https://github.com/gcanti)! - Context: rename prune to pick

- [#246](https://github.com/Effect-TS/data/pull/246) [`9b5edee`](https://github.com/Effect-TS/data/commit/9b5edee7d7d0084ad22da76b1edc573c139ee0e8) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Remove index

### Patch Changes

- [#243](https://github.com/Effect-TS/data/pull/243) [`9fe4327`](https://github.com/Effect-TS/data/commit/9fe4327a27186117db979cb0a8375803637fa38c) Thanks [@jessekelly881](https://github.com/jessekelly881)! - Duration - added typeclass implementations

- [#246](https://github.com/Effect-TS/data/pull/246) [`9b5edee`](https://github.com/Effect-TS/data/commit/9b5edee7d7d0084ad22da76b1edc573c139ee0e8) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Use global for tags, rollback tag equality

- [#237](https://github.com/Effect-TS/data/pull/237) [`350f467`](https://github.com/Effect-TS/data/commit/350f46718a29e22cfcb377f2ff690ae144987c80) Thanks [@gcanti](https://github.com/gcanti)! - ReadonlyArray: dualize forgotten APIs

- [#235](https://github.com/Effect-TS/data/pull/235) [`0c8368d`](https://github.com/Effect-TS/data/commit/0c8368d2a6f92f1f250c26ea8c55f193e5347ce5) Thanks [@gcanti](https://github.com/gcanti)! - ReadonlyRecord: add toEntries

- [#246](https://github.com/Effect-TS/data/pull/246) [`9b5edee`](https://github.com/Effect-TS/data/commit/9b5edee7d7d0084ad22da76b1edc573c139ee0e8) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Introduce Global

- [#241](https://github.com/Effect-TS/data/pull/241) [`e1785dc`](https://github.com/Effect-TS/data/commit/e1785dc223df6e60ab7d67c02205080daccff9ae) Thanks [@gcanti](https://github.com/gcanti)! - add ReadonlyRecord.fromEntries and ReadonlyArray.fromRecord

- [#238](https://github.com/Effect-TS/data/pull/238) [`0a1ef59`](https://github.com/Effect-TS/data/commit/0a1ef59a0a2a2d249565cb5c81cf1bfc824ada72) Thanks [@jessekelly881](https://github.com/jessekelly881)! - Predicate - added xor, eqv, implies, nor, and nand

- [#236](https://github.com/Effect-TS/data/pull/236) [`48cf0f1`](https://github.com/Effect-TS/data/commit/48cf0f1d104df43892977bdce7bb67b7005a07a2) Thanks [@gcanti](https://github.com/gcanti)! - ReadonlyRecord: add isEmptyRecord, isEmptyReadonlyRecord and deprecate isEmpty

- [#245](https://github.com/Effect-TS/data/pull/245) [`3df062c`](https://github.com/Effect-TS/data/commit/3df062c7ad55611e6dd93845ee017f74c7d14aa9) Thanks [@TylorS](https://github.com/TylorS)! - Fix Chunk out-of-memory issues

## 0.2.0

### Minor Changes

- [#232](https://github.com/Effect-TS/data/pull/232) [`791f368`](https://github.com/Effect-TS/data/commit/791f368d58949731742a647f15237e67a95d4b6d) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Support key in Tag, implement Equals

## 0.1.3

### Patch Changes

- [#222](https://github.com/Effect-TS/data/pull/222) [`b493aa4`](https://github.com/Effect-TS/data/commit/b493aa4cfc3a779be63cb66f0ac93b7f8e70d19b) Thanks [@gcanti](https://github.com/gcanti)! - merge /core files

- [#224](https://github.com/Effect-TS/data/pull/224) [`8acac1b`](https://github.com/Effect-TS/data/commit/8acac1bcac7bca58d32a6a98d698235ee1774fc9) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Use Data for Option & Either

- [#220](https://github.com/Effect-TS/data/pull/220) [`83082b9`](https://github.com/Effect-TS/data/commit/83082b900bf54948d2db43f2e1313dbc24a9b19c) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Unify nominal and refined brands

- [#218](https://github.com/Effect-TS/data/pull/218) [`5f71c99`](https://github.com/Effect-TS/data/commit/5f71c99c08725c7cb16b3bfc541ed49f2d3fbd98) Thanks [@IMax153](https://github.com/IMax153)! - allow empty case objects

## 0.1.2

### Patch Changes

- [#215](https://github.com/Effect-TS/data/pull/215) [`47ed7ea`](https://github.com/Effect-TS/data/commit/47ed7eac310ef190d22a456aaeb57311ba206ef9) Thanks [@patroza](https://github.com/patroza)! - add Class and TaggedClass case class constructors

## 0.1.1

### Patch Changes

- [#213](https://github.com/Effect-TS/data/pull/213) [`dbe4421`](https://github.com/Effect-TS/data/commit/dbe442131511f09a15e51d835dc033a60759c7a5) Thanks [@IMax153](https://github.com/IMax153)! - add MutableList.prepend

## 0.1.0

### Minor Changes

- [#210](https://github.com/Effect-TS/data/pull/210) [`ecaedab`](https://github.com/Effect-TS/data/commit/ecaedab8785bc9a0e12254a71764a214c95714db) Thanks [@mikearnaldi](https://github.com/mikearnaldi)! - Update to fp-ts/core@0.2.0

## 0.0.1

### Patch Changes

- [#206](https://github.com/Effect-TS/data/pull/206) [`e013658`](https://github.com/Effect-TS/data/commit/e0136580a72a6c64f085ab671d658e12a00bd1c8) Thanks [@IMax153](https://github.com/IMax153)! - migrate @fp-ts/data to @effect/data
