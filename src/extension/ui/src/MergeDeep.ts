import { DeepObject } from './types/utils';

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

export function deepFlattenObject(obj: DeepObject, prefix: string = ''): Record<string, any> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (isObject(value)) {
            Object.assign(acc, deepFlattenObject(value, `${prefix}${key}.`));
        } else {
            acc[`${prefix}${key}`] = value;
        }
        return acc;
    }, {} as Record<string, any>);
}

export function buildObjectFromFlattenedObject(flattenedObject: Record<string, any>): DeepObject {
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

export function deepGet(obj: DeepObject, path: string): any {
    return path.split('.').reduce((acc, key) => {
        if (isObject(acc)) {
            return acc[key];
        }
        return undefined;
    }, obj);
}

export function deepSet(obj: DeepObject, path: string, value: any): DeepObject {
    const keys = path.split('.');
    const key = keys.pop();
    if (!key) return obj;

    const current = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, obj);

    current[key] = value;

    return obj;
}   
