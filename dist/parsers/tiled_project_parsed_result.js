export default class TiledProjectParsedResult {
    constructor(flattener) {
        this.flattener = flattener;
    }
    /**
     * Flattens the properties of a Tiled object/layer.
     *
     * This will overwrite the properties of the parent class with the properties of the object.
     *
     * @param object The object to flatten the properties of.
     * @returns An object literal of the flattened properties,
     *  mapping the property key to the property value.
     */
    flattenPropertiesOnObject(object) {
        var _a, _b;
        return {
            // The parent class is called `class` in layers, but `type` in objects.
            // Layers also have a `type` property, but it is irrelevant to us.
            // Objects do not have a `class` property, so it falls through to `type`.
            ...this.flattener.memoisedFlattenedProperties.get((_a = object.class) !== null && _a !== void 0 ? _a : object.type),
            ...(_b = object.properties) === null || _b === void 0 ? void 0 : _b.reduce((acc, property) => ({ ...acc, ...this.flattener.flattenMemberProperty(property) }), {}),
            name: object.name,
            id: object.id,
            x: object.x,
            y: object.y
        };
    }
    /**
     * Gets a copy of the flattened properties of the given class, where the keys are the property names
     * and each mapped object value is a copy of the original.
     */
    getCustomTypesMap() {
        return new Map([...this.flattener.memoisedFlattenedProperties.entries()].map(([className, properties]) => ([className, { ...properties }])));
    }
}
