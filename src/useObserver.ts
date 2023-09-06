import React, { useEffect, useState, useMemo } from "react";
import { TObservableObject, NestedKeyOf, ExtractPropsArray } from "./types";
import { resolve, typedKeys } from "./utils";

/**
 * Creates a selector that subscribes to parts of the observable and returns the value of observed properties.
 * @param observable Observable to subscribe to
 * @param props Props to subscribe to (can be nested like a.b.c)
 * @returns An array of the values that will be updated if any of the properties change.
 */
export const useObserver = <
  TValue extends Record<string, unknown>,
  TObservable extends TObservableObject<TValue>,
  TKeys extends Exclude<NestedKeyOf<TObservable>, "subscribe">,
  TSelectedKeys extends Array<TKeys>
>(
  observable: TObservable,
  ...props: TSelectedKeys
) => {
  // We keep two states, one that trackes the changes in the observable
  // and one that tracks the state with the observed value
  const [_, inc] = useState(0);
  const [state, setState] = useState(() =>
    props.reduce((arr, key) => {
      // @ts-ignore
      arr[key] = resolve(
        observable as TObservable,
        key as unknown as NestedKeyOf<TObservable>
      );
      return arr;
    }, {})
  );
  useEffect(() => {
    const unsubscribers = props.map((prop) => {
      return observable.subscribe(prop as NestedKeyOf<TValue>, () => {
        inc((p) => p + 1);
        setState((p) => ({
          ...p,
          [prop]: resolve(
            observable as TObservable,
            prop as NestedKeyOf<TObservable>
          ),
        }));
      });
    });
    return () => unsubscribers.forEach((un) => un());
  }, [observable, props]);

  return useMemo(
    () =>
      typedKeys(state).map((key) => state[key]) as unknown as ExtractPropsArray<
        TValue,
        typeof props
      >,
    [state]
  );
};

/*const value = {a: 100, b: {c: 'hello'}, d: [1, 2, 3]};
const flattened = flatten(value);
type ObjType = typeof flattened; //{a: number; b: string; c: boolean};



type PBVA = ExtractPropsArray<ObjType, ['a', 'b.c']>;

//type SomeType = typeof flattened;

interface SomethingWithAValue<T> {
  value: T;
}

type ExtractValue<T extends ReadonlyArray<ObjType>> = {
  [K in keyof T]: T[K] extends SomethingWithAValue<infer V> ? V : never;
};

function collect<T extends ReadonlyArray<SomethingWithAValue<any>>>(
  array: T,
): () => ExtractValue<T> {
  return () => array.map(a => a.value) as any;
}
type Narrowable = string | number | boolean | undefined | null | void | {};
const tuple = <T extends Narrowable[]>(...t: T) => t;

const result = collect(
  tuple({value: 10}, {value: 'hey'}, {value: true}, {value: [1, 2, 3]}),
);
// const result: () => [number, string, boolean]
*/
