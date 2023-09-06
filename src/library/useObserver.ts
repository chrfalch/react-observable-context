import { useEffect, useState, useMemo } from 'react';
import { TObservableObject, NestedKeyOf, ExtractPropsArray } from './types';
import { resolve, typedKeys } from './utils';

/**
 * Creates a selector that subscribes to parts of the observable and returns the value of observed properties.
 * @param observable Observable to subscribe to
 * @param props Props to subscribe to (can be nested like a.b.c)
 * @returns An array of the values that will be updated if any of the properties change.
 */
export const useObserver = <
  TValue extends Record<string, unknown>,
  TObservable extends TObservableObject<TValue>,
  TKeys extends Exclude<NestedKeyOf<TObservable>, 'subscribe'>,
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
