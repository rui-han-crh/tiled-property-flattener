import BasicProperties from '../properties/basic_properties';
import BasicTileProperties from '../properties/basic_tile_properties';
import TilesetProperties from '../properties/tileset_properties';
import TiledMapParsedResult from './tiled_map_parsed_result';
import type TiledProjectParsedResult from './tiled_project_parsed_result';

/**
 * Parses the given json data into a TiledMapParsedResult, referencing the project defined
 * classes and enums.
 * @param jsonData
 * @param classNameToPropertiesMap
 * @returns
 */
export function parse (jsonData: any, parsedProject: TiledProjectParsedResult): TiledMapParsedResult {
    const objectIdToPropertiesMap = new Map<number, BasicProperties>();
    const layerIdToPropertiesMap = new Map<number, BasicProperties>();
    const tilesetIdToPropertiesMap = new Map<number, TilesetProperties>();

    // Gather the properties of all the layers, including inherited properties.
    jsonData.layers.forEach((layer: any) => {
        const layerProperties = parsedProject.flattenPropertiesOnObject(layer);

        layerIdToPropertiesMap.set(layerProperties.id, layerProperties);
    });

    // Gather the properties of all the objects, including inherited properties.
    jsonData.layers.filter((layer: any) => layer.type === 'objectgroup').forEach((layer: any) => {
        // For every object in each layer...
        layer.objects.forEach((object: any) => {
            // Combine the inherited properties with the object's own properties.
            // Nested properties must be recursively flattened.
            const objectProperties = parsedProject.flattenPropertiesOnObject(object);

            // Save the object to the mapping with the object name as the key.
            objectIdToPropertiesMap.set(objectProperties.id, objectProperties);
        });
    });

    // Gather the properties of all the tilesets, including inherited properties.
    jsonData.tilesets.forEach((tileset: any) => {
        const tilesetProperties = parseTileset(tileset, parsedProject);

        tilesetIdToPropertiesMap.set(tilesetProperties.firstgid, tilesetProperties);
    });

    return new TiledMapParsedResult(
        layerIdToPropertiesMap,
        objectIdToPropertiesMap,
        tilesetIdToPropertiesMap
    );
}

function parseTileset (tileset: any, parsedProject: TiledProjectParsedResult): TilesetProperties {
    return {
        columns: tileset.columns,
        firstgid: tileset.firstgid,
        image: tileset.image,
        imageheight: tileset.imageheight,
        imagewidth: tileset.imagewidth,
        margin: tileset.margin,
        name: tileset.name,
        spacing: tileset.spacing,
        tilecount: tileset.tilecount,
        tileheight: tileset.tileheight,
        tilewidth: tileset.tilewidth,
        tiles: new Map<number, BasicTileProperties>(tileset.tiles?.map((tile: any) => {
            const tileProperties = parsedProject.flattenPropertiesOnTile(tile);

            return [tileProperties.id, tileProperties];
        }))
    }
};