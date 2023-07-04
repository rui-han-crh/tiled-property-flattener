import { buildJSON } from '../utilities/build_json';
import type BasicProperties from '../properties/basic_properties';
import type TilesetProperties from '../properties/tileset_properties';
import { cloneDeep } from 'lodash';

export default class TiledMapParsedResult {
    constructor (
        private readonly layerIdToPropertiesMap: ReadonlyMap<number, BasicProperties>,
        private readonly objectIdToPropertiesMap: ReadonlyMap<number, BasicProperties>,
        private readonly tilesetIdToPropertiesMap: ReadonlyMap<number, TilesetProperties>
    ) {
    }

    /**
     * Gets a copy of the objectIdToObjectMap.
     */
    public getObjectIdToPropertiesMap (): ReadonlyMap<number, BasicProperties> {
        // Copy a new map of the properties, deep copying the properties.
        const clonedIdToPropertiesMap: ReadonlyMap<number, BasicProperties> = new Map(
            Array.from(this.objectIdToPropertiesMap.entries())
                .map(([id, object]) => [id, cloneDeep(object)])
        );

        return clonedIdToPropertiesMap;
    }

    /**
     * Gets a copy of the layerIdToPropertiesMap.
     */
    public getLayerIdToPropertiesMap (): ReadonlyMap<number, BasicProperties> {
        // Copy a new map of the properties, deep copying the properties.
        const clonedIdToPropertiesMap: ReadonlyMap<number, BasicProperties> = new Map(
            Array.from(this.layerIdToPropertiesMap.entries())
                .map(([id, object]) => [id, cloneDeep(object)])
        );

        return clonedIdToPropertiesMap;
    }

    /**
     * Gets a copy of the tilesetIdToPropertiesMap.
     */
    public getTilesetIdToPropertiesMap (): ReadonlyMap<number, TilesetProperties> {
        // Copy a new map of the properties, deep copying the properties.
        const clonedIdToPropertiesMap: ReadonlyMap<number, TilesetProperties> = new Map(
            Array.from(this.tilesetIdToPropertiesMap.entries())
                .map(([id, object]) => [id, cloneDeep(object)])
        );

        return clonedIdToPropertiesMap;
    }

    /**
     * Gets a JSON of the parsed result.
     *
     * The JSON contains three distinct sections:
     * - layers: A map of layer id to properties.
     * - objects: A map of object id to properties.
     * - tilesets: A map of tileset firstgid to properties.
     */
    public toJSON (): any {
        return JSON.stringify({
            layers: buildJSON(this.getLayerIdToPropertiesMap()),
            objects: buildJSON(this.getObjectIdToPropertiesMap()),
            tilesets: buildJSON(this.getTilesetIdToPropertiesMap())
        }, null, 4);
    }
}
