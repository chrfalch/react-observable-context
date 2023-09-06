import {useMemo} from 'react';
import {makeObservable} from './makeObservable';

/**
 * Creates a new observable from the given value. The observable can be
 * used to subscribe to changes. The initial value is used as the initial
 * value of the observable, and subsequent changes to the initial value will
 * not result in the observable being updated.
 * @param initialValue Initial value to create the observable from
 * @returns A new observable
 */
export const useObservable = <T extends Record<string, unknown>>(
  initialValue: T,
) => {
  return useMemo(() => {
    return makeObservable(initialValue);
    // We only want to create the observable once, so we can ignore the
    // dependency on the value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
