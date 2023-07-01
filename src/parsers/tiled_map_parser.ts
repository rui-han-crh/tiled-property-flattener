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
    const objectIdToPropertiesMap = new Map<number, any>();
    const layerIdToPropertiesMap = new Map<number, any>();

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

    return new TiledMapParsedResult(layerIdToPropertiesMap, objectIdToPropertiesMap);
}
