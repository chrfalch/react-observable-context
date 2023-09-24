import { useEffect, useState } from 'react';
import { TObservableObject, FlattenedKeysOf, FlattenedObjectOf } from './types';
import { extract, flatten, resolve } from './utils';

/**
 * Creates a selector that subscribes to parts of the observable and returns the value of observed properties.
 * @param observable Observable to subscribe to
 * @param props Props to subscribe to (can be nested like a.b.c)
 * @returns An array of the values that will be updated if any of the properties change.
 */
export const useObserver = <
  TValue extends Record<string, unknown>,
  TObservable extends TObservableObject<TValue>,
  TFlattened extends FlattenedObjectOf<TObservable>,
  TKeys extends keyof Omit<TFlattened, 'subscribe'>
>(
  observable: TObservable,
  ...props: TKeys[]
) => {
  // We keep two states, one that trackes the changes in the observable
  // and one that tracks the state with the observed value
  const [_, inc] = useState(0);
  const [state, setState] = useState(() =>
    flattenAndExtract(
      observable,
      props as FlattenedKeysOf<TObservable, false>[]
    )
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const unsubscribers = props.map((prop) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return observable.subscribe(prop, () => {
        inc((p) => p + 1);
        setState((p) => ({
          ...p,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [prop]: resolve(observable, prop),
        }));
      });
    });
    return () => unsubscribers.forEach((un) => un());
  }, [observable, props]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return state as Pick<typeof state, TKeys>;
};

function flattenAndExtract<
  TValue extends Record<string, unknown>,
  TFlattened extends FlattenedObjectOf<TValue>,
  TKeys extends keyof TFlattened
>(value: TValue, props: TKeys[]): Pick<TFlattened, TKeys> {
  const flattenedObject = flatten(value);
  return extract(
    flattenedObject,
    ...(props as (keyof typeof flattenedObject)[])
  ) as Pick<TFlattened, TKeys>;
}
