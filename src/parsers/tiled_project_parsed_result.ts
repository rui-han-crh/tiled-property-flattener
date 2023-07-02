import { cloneDeep } from 'lodash';
import type BasicProperties from '../properties/basic_properties';
import BasicTileProperties from '../properties/basic_tile_properties';
import { type Flattener } from './flattener';

export default class TiledProjectParsedResult {
    constructor (
        private readonly flattener: Flattener
    ) {}

    /**
     * Flattens the properties of a Tiled object/layer.
     *
     * This will overwrite the properties of the parent class with the properties of the object.
     *
     * @param object The object to flatten the properties of.
     * @returns An object literal of the flattened properties,
     *  mapping the property key to the property value.
     */
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
            class: object.class ?? object.type ?? null,
            x: object.x,
            y: object.y
        };
    }

    /**
     * Flatten the properties of a Tiled tile.
     *
     * @param tile The tileset tile to flatten the properties of.
     * @returns An object literal of the flattened properties,
     *  mapping the property key to the property value.
     */
    public flattenPropertiesOnTile (tile: any): BasicTileProperties {
        return {
            ...this.flattener.memoisedFlattenedProperties.get(tile.class ?? tile.type),
            ...tile.properties?.reduce((acc: any, property: any) => (
                { ...acc, ...this.flattener.flattenMemberProperty(property) }
            ), {}),
            id: tile.id,
            class: tile.class ?? tile.type ?? null
        }
    }


    /**
     * Gets a copy of the flattened properties of the given class, where the keys are type names
     * and each mapped value is a copy of the original properties.
     */
    public getCustomTypesMap (): ReadonlyMap<string, any> {
        return new Map(
            [...this.flattener.memoisedFlattenedProperties.entries()].map(([className, properties]) => (
                [className, cloneDeep(properties)]
            ))
        );
    }

    /**
     * Gets a copy of the enums and their values, where the keys are the enum names
     * and its mapped value is a Set of the enum values.
     */
    public getEnums (): ReadonlyMap<string, ReadonlySet<string | number>> {
        return new Map(
            [...this.flattener.enumNameToValuesMap.entries()].map(([enumName, enumValues]) => (
                [enumName, new Set(enumValues)]
            ))
        );
    }
}
