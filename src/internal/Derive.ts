import { Kind,  TypeLambda } from "@effect/data/HKT"

export const DOIT: any = 1

const Named = Symbol()
const TNamed = Symbol()

export interface HasName<TagName extends string, S extends string> {
  [TNamed]?: TagName
  [Named]?: S
}

const SignatureError = Symbol()
type SignatureError<Msg, Type> = Msg & Type 

type CheckString<T , N> = T extends string ? "string" : N
type CheckNumber<T , N> = T extends number ? "number" : N
type CheckBoolean<T, N> = T extends boolean ? "boolean" : N
type CheckArray<T , N> = T extends Array<infer A> ? `Array<${Repr<A>}>` : N
type CheckHasName<T , N> = T extends HasName<infer T, infer A> ? A : N

export type Repr<T> = 
  CheckString<T, CheckNumber<T, CheckBoolean<T, CheckArray<T, CheckHasName<T, SignatureError<`Type has no name (HasName):`, T> >>>>>

export const SignatureType = Symbol()
type AnySignature = Signature<any, any>
export interface Signature<T, S extends string> {
  [SignatureType]: T
  signature: S
}

export const typeSignature = <T>() => <S extends Repr<T>>(signature: S): Signature<T, S> => ({ signature }) as Signature<T, S>

type TypeOfSignature<S extends AnySignature> = S[typeof SignatureType]
type ReprOfSignature<S extends AnySignature> = S['signature']

const Def = Symbol()

type Match<S extends string, Def extends string> = SplitSignature<S> extends Def ? unknown : { error: `Missing type classe instance ${Exclude<SplitSignature<S>, Def>}` }
type MatchSignature<S extends AnySignature, Def extends string> = Match<ReprOfSignature<S>, Def>

export interface Registry<F extends TypeLambda, Def extends string = never> {
  [Def]: () => Def
  instance: <T>() => <S extends Repr<T>>(repr: S & Match<S, Def>) => Kind<F, never, never,never, T> 
  instanceOf: <S extends AnySignature>(signature: S & MatchSignature<S, Def>) => TypeOfSignature<S>
}

export const register1 = <F extends TypeLambda,>() => <S extends string, I, O, Def extends string>(ctor: (x: Kind<F, never, never,never, I>) => Kind<F, never, never,never, O>, repr: S ) => (reg: Registry<F, Def>) : Registry<F, S | Def > => {
  return reg
}
export const register2 = <F extends TypeLambda,>() =><S extends string, I, I2, O, Def extends string>(ctor: (a: Kind<F, never, never, never, I>, b: Kind<F, never, never, never, I2>) => Kind<F, never, never, never, O>, repr: S) => (reg: Registry<F, Def>) : Registry<F, S | Def> => {
  return reg
}
export const register = <F extends TypeLambda>() =>  <S extends string, T, Def extends string>(o: Kind<F, never, never,never, T>, repr: S ) => (reg: Registry<F, Def>) : Registry<F,S | Def> => {
  return reg
}
export interface RegistryBuilder<F extends TypeLambda> {
  register: <S extends string, T, Def extends string>(o: Kind<F, never, never, never, T>, repr: S) => (reg: Registry<F, Def>) => Registry<F, S | Def>;
  register1: <S extends string, I, O, Def extends string>(ctor: (x: Kind<F, never, never, never, I>) => Kind<F, never, never, never, O>, repr: S) => (reg: Registry<F, Def>) => Registry<F, S | Def>;
  register2: <S extends string, I, I2, O, Def extends string>(ctor: (a: Kind<F, never, never, never, I>, b: Kind<F, never, never, never, I2>) => Kind<F, never, never, never, O>, repr: S) => (reg: Registry<F, Def>) => Registry<F, S | Def>;
  empty: () => Registry<F, never>;
}
export const makeRegistryBuilder  = <F extends TypeLambda>(): RegistryBuilder<F> => ({
  register : register<F>(),
  register1 : register1<F>(),
  register2: register2<F>(),
  empty: () : Registry<F, never> => DOIT
})

// extract types from signature

type SplitAt<X extends string, S extends string> = S extends `${infer A}${X}${infer B}` ? SplitAt<X, A | B> : S extends '' ? never : S
type SplitSignature<S extends string> = SplitAt<',', SplitAt<'<', SplitAt<'>', S>>>
