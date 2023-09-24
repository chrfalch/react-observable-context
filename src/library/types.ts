type IsFunction<T> = T extends () => unknown
  ? true
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => unknown
  ? true
  : false;

export type FlattenedKeysOf<
  T extends object,
  TArrayLike extends boolean = false
> = {
  [Key in keyof T & (string | number)]: IsFunction<T[Key]> extends true
    ? // Functions inside array should not be flattened.
      TArrayLike extends false
      ? `${Key}`
      : never
    : T[Key] extends object
    ? T[Key] extends Array<unknown>
      ? // Arrays should have both array and objects by indicies and length properties
        `${Key}` | `${Key}.${FlattenedKeysOf<T[Key], true>}`
      : `${Key}.${FlattenedKeysOf<T[Key], TArrayLike>}`
    : `${Key}`;
}[keyof T & (string | number)];

export type FlattenedObjectOf<
  T extends object,
  K extends FlattenedKeysOf<T> = FlattenedKeysOf<T>
> = {
  [Key in K]: Key extends keyof T
    ? T[Key]
    : Key extends `${infer First}${'.'}${infer Rest}`
    ? First extends keyof T
      ? T[First] extends object
        ? FlattenedObjectOf<T[First]> extends object
          ? Rest extends keyof FlattenedObjectOf<T[First]>
            ? FlattenedObjectOf<T[First]>[Rest]
            : never
          : never
        : never
      : T extends Array<infer AT>
      ? Rest extends keyof AT
        ? AT[Rest]
        : never
      : never
    : T extends Array<infer AT>
    ? AT
    : never;
};

export type TObservableObject<TValue extends Record<string, unknown>> =
  TValue & {
    subscribe: <TProp extends FlattenedKeysOf<TValue>>(
      prop: TProp,
      listener: () => void
    ) => () => void;
  };
