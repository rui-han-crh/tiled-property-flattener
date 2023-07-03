import EnumValues from "./enum_values";

/**
 * Builds the JSON object, converting the Map to an object literal,
 * objects to object literals, and converting the Set or EnumValues to an array.
 */
export function buildJSON (value: any): any {
    if (value instanceof Map) {
        return Object.fromEntries([...value.entries()].map(([key, value]) => (
            [key, buildJSON(value)]
        )));
    } else if (value instanceof Set) {
        return Array.from(value.values()).map(buildJSON);
    } else if (value instanceof EnumValues) {
        return {
            values: [...value.values()] ?? [],
            valuesAsFlags: value.valuesAsFlags
        }; 
    } else if (typeof value === 'object') {
        const newObject: any = {};

        Object.entries(value).forEach(([subKey, subValue]) => {
            newObject[subKey] = buildJSON(subValue);
        });

        return newObject;
    } else {
        return value;
    }
}