export type NestedKeyOf<T extends object> = {
  [Key in keyof T & (string | number)]: T[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
    : `${Key}`;
}[keyof T & (string | number)];

export type NestedObjectOf<
  T extends object,
  K extends NestedKeyOf<T> = NestedKeyOf<T>
> = {
  [Key in K]: Key extends keyof T
    ? T[Key]
    : Key extends `${infer First}${'.'}${infer Rest}`
    ? First extends keyof T
      ? T[First] extends object
        ? NestedObjectOf<T[First]> extends object
          ? Rest extends keyof NestedObjectOf<T[First]>
            ? NestedObjectOf<T[First]>[Rest]
            : never
          : never
        : never
      : never
    : never;
};

export type TObservableObject<TValue extends Record<string, unknown>> =
  TValue & {
    subscribe: <TProp extends NestedKeyOf<TValue>>(
      prop: TProp,
      listener: () => void
    ) => () => void;
  };
