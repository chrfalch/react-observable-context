import { Flatten, NestedKeyOf } from './types';

// Resolves a nested key of an object to the value in the object
export const resolve = <T extends object, K extends NestedKeyOf<T>>(
  obj: T,
  path: K
) =>
  path.split('.').reduce((p, c) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return p?.[c];
  }, obj);

/**
 * Utility for getting typed keys from an object
 * @param obj Object to get keys from
 * @returns Keys of the object
 */
export const typedKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

/**
 * Flattens a nested object to a flat object with dot notation
 * @param obj Object to flatten
 * @returns A flattened object.
 */
export const flatten = <T extends Record<string, unknown>>(
  obj: T,
  parentKey?: string
) => {
  let result = {};

  Object.entries(obj).forEach(([key, value]) => {
    const flattenedKey = parentKey ? parentKey + '.' + key : key;
    if (typeof value === 'object') {
      result = {
        ...result,
        ...flatten(value as Record<string, unknown>, flattenedKey),
      };
    } else {
      (result as Record<string, unknown>)[flattenedKey] = value;
    }
  });

  return result as Flatten<T>;
};
