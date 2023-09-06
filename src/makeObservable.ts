import { TObservableObject } from './types';

/**
 * Creates a new object that allows for subscribing to changes
 * @param initialValue Initial value of the object.
 * @returns The object that can be used as a object where we can read/write values.
 */
export const makeObservable = <TInitialValue extends Record<string, unknown>>(
  initialValue: TInitialValue
): TObservableObject<TInitialValue> => {
  const listeners = new Map<keyof TInitialValue, [() => void]>();

  // Set up subscription method
  const subscribe = <TProp extends keyof TInitialValue>(
    prop: TProp,
    listener: () => void
  ) => {
    if (!listeners.has(prop)) {
      listeners.set(prop, [listener]);
    } else {
      listeners.get(prop)?.push(listener);
    }
    return () => {
      const index = listeners.get(prop)?.indexOf(listener);
      if (index !== undefined && index > -1) {
        listeners.get(prop)?.splice(index, 1);
      }
    };
  };

  // Notify on change
  const notify = (key: keyof TInitialValue) => {
    const cb = listeners.get(key);
    cb?.forEach((c) => c());

    // notify parents
    const parentKey = key
      .toString()
      .split('.')
      .slice(0, -1)
      .join('.') as keyof TInitialValue;

    if (parentKey) {
      notify(parentKey);
    }
  };

  // creates the proxy for the object
  const internalWrap = <TValue extends object>(
    object: TValue,
    parentKey: string = ''
  ): TValue => {
    return new Proxy(object, {
      get: (target, prop, receiver) => {
        // Handle the special case - which is returning the subscribe method
        // for the root object
        if (parentKey === '' && prop === 'subscribe') {
          return subscribe;
        } else if (typeof prop === 'symbol') {
          // Ignore symbols - they should be returned directly using the Reflect module
          // This is a pure typescript thing - otherwise we'd get errors when using the
          // property.
          return Reflect.get(target, prop, receiver);
        } else {
          const value = Reflect.get(target, prop, receiver);
          // Check for arrays, objects and functions and return a proxy for them
          if (value && (typeof value === 'object' || Array.isArray(value))) {
            // Check if we already have a proxy for this object
            return internalWrap(
              value,
              parentKey + (parentKey ? '.' : '') + prop
            );
          } else {
            // If it's a primitive, just return the value
            return Reflect.get(target, prop, receiver);
          }
        }
      },
      set: (target, prop, value, receiver) => {
        const retVal = Reflect.set(target, prop, value, receiver);
        if (retVal && typeof prop !== 'symbol') {
          const key = parentKey + (parentKey ? '.' : '') + prop;
          notify(key);
        }
        return retVal;
      },
    });
  };
  return internalWrap(initialValue) as TObservableObject<TInitialValue>;
};
