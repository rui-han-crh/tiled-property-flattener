import TiledMapParsedResult from './tiled_map_parsed_result';
import type TiledProjectParsedResult from './tiled_project_parsed_result';

/**
 * Parses the given json data into a TiledMapParsedResult, referencing the project defined
 * classes and enums.
 * @param jsonData
 * @param classNameToPropertiesMap
 * @returns
 */
export function parse (
    jsonData: any, parsedProject: TiledProjectParsedResult
): TiledMapParsedResult {
    const imagesToLoad = new Map<string, string>();
    const spriteSheetsToLoad = new Map<string, SpriteSheetConfig>();
    const idToObjectMap = new Map<number, TiledGameObject>();
    const idToLayerMap = new Map<number, TiledLayer>();

    // Load all the tilesets.
    jsonData.tilesets.forEach((tileset: any) => {
        // Retrieve the relative file path from the json file.
        const filePathFromJson: string = tileset.image;

        // Record the image to load
        imagesToLoad.set(tileset.name, filePathFromJson);
    });

    jsonData.layers.filter((layer: any) => layer.type === 'tilelayer').forEach((layer: any) => {
        const layerProperties = parsedProject.flattenPropertiesOnObject(layer);

        if (layer.class === undefined) {
            // The layer has no class assigned, so it has no behaviour, so skip it.
            return;
        }

        idToLayerMap.set(layer.id, new classMap[layer.class](layerProperties) as TiledLayer);
    });

    console.log('TiledLayers with behaviours', idToLayerMap);

    // Load all the sprites.
    jsonData.layers.filter((layer: any) => layer.type === 'objectgroup').forEach((layer: any) => {
        // For every object in each layer...
        layer.objects.forEach((object: any) => {
            // Skip if the object has no type.
            if (object.type === undefined || object.type === '') {
                return;
            }

            // Combine the inherited properties with the object's own properties.
            // Nested properties must be recursively flattened.
            const objectProperties = parsedProject.flattenPropertiesOnObject(object);

            console.log(object.name, objectProperties);

            // Construct the object, extending TiledGameObject.
            const tiledObject = new classMap[object.type](objectProperties) as TiledGameObject;

            // Save the object to the mapping with the object name as the key.
            idToObjectMap.set(tiledObject.properties.id, tiledObject);

            // Check if the constructed object is a RenderableGameObject.
            if (!(tiledObject instanceof RenderableGameObject)) {
                // No need to load images for non-renderable objects.
                return;
            }

            // Retrieve the relative file path of the sprite from the json file.
            const filePathFromJson: string = tiledObject.properties.sprite;

            // Skip if the object has no sprite.
            if (filePathFromJson === undefined || filePathFromJson === '') {
                console.warn(`No sprite for object ${tiledObject.properties.id.toString()}, named ${tiledObject.properties.name}`, tiledObject);
                return;
            }

            if (tiledObject instanceof AnimatableGameObject) {
                // Record the spritesheet to load
                spriteSheetsToLoad.set(tiledObject.spriteName,
                    {
                        frameWidth: tiledObject.properties.frameDimensions.frameWidth,
                        frameHeight: tiledObject.properties.frameDimensions.frameHeight,
                        filePath: filePathFromJson
                    }
                );
            } else {
                // Record the image to load
                imagesToLoad.set(tiledObject.spriteName, filePathFromJson);
            }
        });
    });

    // Allow each object to access the mapping of character IDs to gameObjects.
    // This gives the objects the ability to reference other objects by their character IDs.
    idToObjectMap.forEach((tiledGameObject: TiledGameObject) => {
        tiledGameObject.setIdToObjectMapping(idToObjectMap);
    });

    console.log('TiledObjects with behaviours', idToObjectMap);

    return new TiledMapParsedResult(
        imagesToLoad,
        spriteSheetsToLoad,
        idToObjectMap,
        idToLayerMap
    );
}
