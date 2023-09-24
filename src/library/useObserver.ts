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
  TKeys extends keyof TFlattened
>(
  observable: TObservable,
  ...props: TKeys[]
) => {
  // We keep two states, one that trackes the changes in the observable
  // and one that tracks the state with the observed value
  const [_, inc] = useState(0);
  const [state, setState] = useState(() => {
    const flat = flatten(observable) as TFlattened;
    return extract(flat, ...props) as Pick<typeof flat, TKeys>;
  });

  useEffect(() => {
    const unsubscribers = props.map((prop) => {
      return observable.subscribe(prop as FlattenedKeysOf<TValue>, () => {
        inc((p) => p + 1);
        setState((p) => ({
          ...p,
          [prop]: resolve(
            observable as TObservable,
            prop as FlattenedKeysOf<TObservable>
          ),
        }));
      });
    });
    return () => unsubscribers.forEach((un) => un());
  }, [observable, props]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return state as Pick<typeof state, TKeys>;
};
