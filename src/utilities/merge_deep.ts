import { cloneDeep } from 'lodash';

/**
 * Merges two objects together, copying the properties from the second object into the first.
 *
 * If a property has a different value in the second object, the second object's value overwrites
 * the first.
 *
 * If a property is an object, the objects are merged recursively, so nested properties can
 * be merged or overwritten as well. This operates like the spread syntax, but is built for
 * nested objects.
 *
 * @param objectToMergeInto The object to merge the second object into. This will not be mutated.
 * @param objectToMergeWith The object to merge into the first object.
 * @returns A new object with the properties of both objects merged together.
 */
export function mergeDeep (objectToMergeInto: any, objectToMergeWith: any): any {
    if (typeof objectToMergeInto !== 'object') {
        throw new Error(`Cannot merge into non-object objectToMergeWith. Received: ${JSON.stringify(objectToMergeInto)}`);
    }

    if (typeof objectToMergeWith !== 'object') {
        throw new Error(`Cannot merge using non-object objectToMergeWith. Received: ${JSON.stringify(objectToMergeWith)}`);
    }

    // Deep copy the objectToMergeInto, so we don't mutate it.
    const clonedObjectToMergeInto = cloneDeep(objectToMergeInto);

    for (const [key, value] of Object.entries(objectToMergeWith)) {
        if (typeof value !== 'object' ||
            value instanceof Set ||
            clonedObjectToMergeInto[key] === undefined
        ) {
            // If the value is a primitive or a Set, or the key doesn't exist in the objectToMergeInto,
            // overwrite the value in the cloned object.
            clonedObjectToMergeInto[key] = value;
        } else {
            // If the value is an object, merge the objects together.
            clonedObjectToMergeInto[key] = mergeDeep(clonedObjectToMergeInto[key], value);
        }
    }

    return clonedObjectToMergeInto;
}
