export default class TiledMapParsedResult {
    constructor(layerIdToPropertiesMap, objectIdToPropertiesMap) {
        this.layerIdToPropertiesMap = layerIdToPropertiesMap;
        this.objectIdToPropertiesMap = objectIdToPropertiesMap;
    }
    /**
     * Gets a copy of the objectIdToObjectMap.
     */
    getObjectIdToPropertiesMap() {
        // Copy a new map of the properties, deep copying the properties.
        const clonedIdToPropertiesMap = new Map(Array.from(this.objectIdToPropertiesMap.entries())
            .map(([id, object]) => [id, object]));
        return clonedIdToPropertiesMap;
    }
    /**
     * Gets a copy of the layerIdToPropertiesMap.
     */
    getLayerIdToPropertiesMap() {
        // Copy a new map of the properties, deep copying the properties.
        const clonedIdToPropertiesMap = new Map(Array.from(this.layerIdToPropertiesMap.entries())
            .map(([id, object]) => [id, object]));
        return clonedIdToPropertiesMap;
    }
    /**
     * Gets a JSON of the idToObjectMap.
     */
    toJson() {
        // Recursively build the JSON object, converting sets to arrays and maps to objects.
        const convertToJson = (object) => {
            if (object instanceof Set) {
                return Array.from(object.values()).map(convertToJson);
            }
            else if (object instanceof Map) {
                return Object.fromEntries(Array.from(object.entries()).map(([key, value]) => [key, convertToJson(value)]));
            }
            else if (typeof object === 'object') {
                const newObject = {};
                Object.entries(object).forEach(([key, value]) => {
                    newObject[key] = convertToJson(value);
                });
                return newObject;
            }
            else {
                return object;
            }
        };
        return JSON.stringify({
            layers: convertToJson(this.getLayerIdToPropertiesMap()),
            objects: convertToJson(this.getObjectIdToPropertiesMap())
        }, null, 4);
    }
}
