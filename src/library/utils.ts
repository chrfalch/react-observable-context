import { NestedKeyOf, NestedObjectOf } from './types';

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
 * Flattens a nested object to a flat object with dot notation
 * @param obj Object to flatten
 * @returns A flattened object.
 */
export const flatten = <T extends Record<string, unknown>>(
  obj: T,
  parentKey?: string
): NestedObjectOf<T> => {
  let result = {};

  Object.entries(obj).forEach(([key, value]) => {
    const flattenedKey = parentKey ? parentKey + '.' + key : key;
    if (typeof value === 'object') {
      result = {
        ...result,
        [flattenedKey]: value,
        ...flatten(value as Record<string, unknown>, flattenedKey),
      };
    } else {
      (result as Record<string, unknown>)[flattenedKey] = value;
    }
  });

  return result as NestedObjectOf<T>;
};

/**
 * Extracts a subset of an object based on the provided keys
 * @param obj Object to extract from
 * @param keys Keys to extract
 */
export function extract<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  return keys.reduce((newObj, curr) => {
    newObj[curr] = obj[curr];
    return newObj;
  }, {} as Pick<T, K>);
}
