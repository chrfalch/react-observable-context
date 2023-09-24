import { FlattenedKeysOf, FlattenedObjectOf } from './types';

// Resolves a nested key of an object to the value in the object
export const resolve = <T extends object, K extends FlattenedKeysOf<T>>(
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
): FlattenedObjectOf<T> => {
  let result = {};

  Object.entries(obj).forEach(([key, value]) => {
    const flattenedKey = parentKey ? parentKey + '.' + key : key;
    if (value instanceof Array) {
      result = {
        ...result,
        [flattenedKey]: value,
        [`${flattenedKey}.length`]: value.length,
        ...flatten(
          value as unknown as Record<typeof flattenedKey, unknown>,
          flattenedKey
        ),
      };
    } else if (typeof value === 'object') {
      result = {
        ...result,
        ...flatten(value as Record<typeof flattenedKey, unknown>, flattenedKey),
      };
    } else {
      (result as Record<string, unknown>)[flattenedKey] = value;
    }
  });

  return result as FlattenedObjectOf<T>;
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
