import { cloneDeep } from 'lodash';
import type BasicProperties from '../properties/basic_properties';
import BasicTileProperties from '../properties/basic_tile_properties';
import { type Flattener } from './flattener';
import { ReadonlyEnumValues } from '../enum_values';
import { buildJSON } from '../build_json';

export default class TiledProjectParsedResult {
    constructor (
        private readonly flattener: Flattener
    ) {}

    /**
     * Flattens the properties of a Tiled object/layer.
     *
     * This will overwrite the properties of the parent class with the properties of the object.
     * 
     * The parser options `defaultComposite` specified in the TiledProjectParser will 
     * determine whether the tile properties are flattened into the root of the class, 
     * or whether they are composed under the root class (defaulted to `false`, where classes
     * are always flattened unless otherwise specified).
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
     * This will overwrite the properties of the parent class with the properties of the tile.
     * 
     * The parser options `defaultComposite` specified in the TiledProjectParser will 
     * determine whether the tile properties are flattened into the root of the class, 
     * or whether they are composed under the root class (defaulted to `false`, where classes
     * are always flattened unless otherwise specified).
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
     * and its mapped value is an object, including properties:
     * 
     * values: The Set of the enum values.
     * 
     * valuesAsFlags: Whether the enum values are treated as flags, 
     * i.e. whether multiple values can be selected.
     * This is declared in the Tiled custom types as checkbox called `Allow multiple values`.
     */
    public getEnumsMap (): ReadonlyMap<string, ReadonlyEnumValues> {
        return new Map(
            [...this.flattener.enumNameToValuesMap.entries()].map(([enumName, enumValues]) => (
                [enumName, cloneDeep(enumValues)]
            ))
        );
    }

    /**
     * Gets a JSON of the parsed result.
     * 
     * The JSON contains two distinct sections:
     * - `customTypes`: A map of the custom types, where the keys are the type names
     * and each mapped value is a copy of the original properties.
     * - `enums`: A map of the enums and their values, where the keys are the enum names
     */
    public toJSON (): any {
        return JSON.stringify({
            customTypes: buildJSON(this.getCustomTypesMap()),
            enums: buildJSON(this.getEnumsMap())
        }, null, 4);
    }
}
