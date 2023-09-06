export type NestedKeyOf<T extends object> = {
  [Key in keyof T & (string | number)]: T[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
    : `${Key}`;
}[keyof T & (string | number)];

export type TObservableObject<TValue extends Record<string, unknown>> =
  TValue & {
    subscribe: <TProp extends NestedKeyOf<TValue>>(
      prop: TProp,
      listener: () => void,
    ) => () => void;
  };

export type Flatten<T extends object> = object extends T
  ? object
  : {
      [K in keyof T]-?: (
        x: NonNullable<T[K]> extends infer V
          ? V extends object
            ? V extends readonly any[]
              ? Pick<T, K>
              : Flatten<V> extends infer FV
              ? {
                  [P in keyof FV as `${Extract<K, string | number>}.${Extract<
                    P,
                    string | number
                  >}`]: FV[P];
                }
              : never
            : Pick<T, K>
          : never,
      ) => void;
    } extends Record<keyof T, (y: infer O) => void>
  ? O extends infer U
    ? {[K in keyof O]: O[K]}
    : never
  : never;

export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};
export type ExtractPropsArray<
  T,
  KS extends Array<keyof T>,
  V = any,
> = PickByValue<Pick<T, KS[number]>, V>;
