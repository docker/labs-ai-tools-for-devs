import { DeepObject } from './types/utils';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item: unknown): item is DeepObject {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}

export function deepFlattenObject(
  obj: DeepObject,
  prefix: string = '',
): Record<string, any> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (isObject(value)) {
        Object.assign(acc, deepFlattenObject(value, `${prefix}${key}.`));
      } else {
        acc[`${prefix}${key}`] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
}

export function buildObjectFromFlattenedObject(
  flattenedObject: Record<string, any>,
): DeepObject {
  return Object.entries(flattenedObject).reduce((acc, [key, value]) => {
    const keys = key.split('.');
    let lastKey = keys.pop();
    if (!lastKey) return acc;

    let current = acc;
    for (const k of keys) {
      if (!current[k]) current[k] = {};
      current = current[k];
    }

    current[lastKey] = value;
    return acc;
  }, {} as DeepObject);
}
