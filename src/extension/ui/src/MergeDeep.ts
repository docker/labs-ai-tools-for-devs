/**
 * Type for any object with string keys
 */
export type DeepObject = { [key: string]: any };

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is DeepObject {
    return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target The target object to merge into
 * @param sources The source objects to merge from
 * @returns The merged object
 */
export function mergeDeep<T extends DeepObject>(target: T, ...sources: DeepObject[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}