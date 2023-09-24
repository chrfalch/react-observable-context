export type FlattenedKeysOf<T extends object> = {
  [Key in keyof T & (string | number)]: T[Key] extends object
    ? T[Key] extends Array<unknown>
      ? `${Key}` | `${Key}.${FlattenedKeysOf<T[Key]>}`
      : `${Key}.${FlattenedKeysOf<T[Key]>}`
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
