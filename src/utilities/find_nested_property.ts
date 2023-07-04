/**
 * Checks if a nested property key exists on an object.
 *
 */
export function hasNestedProperty (object: any, propertyKey: string): boolean {
    return getNestedProperty(object, propertyKey) !== undefined;
}

/**
 * Gets a nested property from an object.
 */
export function getNestedProperty <T> (object: any, propertyKey: string): T | undefined {
    if (object === undefined || typeof object !== 'object') {
        return undefined;
    }

    // Loop through all the current layer's keys.
    for (const key of Object.keys(object)) {
        if (key === propertyKey) {
            // If the key matches, return the value.
            return object[key];
        }

        // If the key doesn't match, check if the value is an object.
        const value = object[key];

        if (typeof value === 'object') {
            // If the value is an object, check if the nested property exists on the value.
            const nestedValue = getNestedProperty(value, propertyKey);

            if (nestedValue !== undefined) {
                // If the nested property exists, return it.
                return nestedValue as T;
            }
        }
    }
}
