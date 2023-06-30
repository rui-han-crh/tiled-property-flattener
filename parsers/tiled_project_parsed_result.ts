import { type BasicProperties } from '../data/tiled_class_behaviours/tiled_properties_interface';
import { type Flattener } from './flattener';

export default class TiledProjectParsedResult {
    constructor (
        private readonly flattener: Flattener
    ) {}

    public flattenPropertiesOnObject (object: any): BasicProperties {
        return {
            // The parent class is called `class` in layers, but `type` in objects.
            // Layers also have a `type` property, but it is irrelevant to us.
            // Objects do not have a `class` property, so it falls through to `type`.
            ...this.flattener.memoisedFlattenedProperties.get(object.class ?? object.type),
            ...object.properties?.reduce((acc: any, property: any) => (
                { ...acc, ...this.flattener.flattenMemberProperty(property) }
            ), {}),
            name: object.name,
            id: object.id,
            x: object.x,
            y: object.y
        };
    }
}
