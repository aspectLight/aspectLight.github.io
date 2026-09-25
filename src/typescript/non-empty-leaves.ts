export type NonEmptyLeaves<T> = T extends string
  ? T extends ''
    ? never
    : T
  : T extends readonly (infer Item)[]
    ? readonly NonEmptyLeaves<Item>[]
    : T extends object
      ? { readonly [Key in keyof T]: NonEmptyLeaves<T[Key]> }
      : T;
