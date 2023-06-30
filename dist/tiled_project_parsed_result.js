export default class TiledProjectParsedResult {
    constructor(flattener) {
        this.flattener = flattener;
    }
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
}
