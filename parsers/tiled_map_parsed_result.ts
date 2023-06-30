import type TiledGameObject from '../data/tiled_class_behaviours/tiled_gameobject';
import type TiledLayer from '../data/tiled_class_behaviours/tiled_layer';

export interface SpriteSheetConfig {
    frameWidth: number;
    frameHeight: number;
    filePath: string;
}

type Constructor<T> = new (...args: any[]) => T;

export default class TiledMapParsedResult {
    constructor (
        public readonly imagesToLoad: ReadonlyMap<string, string>,
        public readonly spriteSheetsToLoad: ReadonlyMap<string, SpriteSheetConfig>,
        private readonly idToObjectMap: ReadonlyMap<number, TiledGameObject>,
        public readonly idToLayerMap: ReadonlyMap<number, TiledLayer>
    ) {
    }

    /**
     * Finds all objects of the given type.
     * @param typeConstructor The type of object to find.
     * @returns An array of objects of the given type.
     */
    public getObjects<T extends TiledGameObject>(typeConstructor: Constructor<T>): T[] {
        return Array.from(this.idToObjectMap.values())
            .filter(
                (gameObject: TiledGameObject) => gameObject instanceof typeConstructor
            ) as T[];
    }

    /**
     * Gets a copy of the idToObjectMap, with all objects reset.
     *
     * Within each object, the charIdToObjectMap is updated to point to the new objects.
     */
    public getIdToObjectMap (): ReadonlyMap<number, TiledGameObject> {
        console.log('Copying all objects.');

        // Copy a new map of the objects, deep copying the objects.
        const idToObjectMap: ReadonlyMap<number, TiledGameObject> = new Map<number, TiledGameObject>(
            Array.from(this.idToObjectMap.entries())
                .map(([id, object]) => [id, object.clone()])
        );

        // Update the charIdToObjectMap in all the objects.
        idToObjectMap.forEach((object: TiledGameObject) => {
            object.setIdToObjectMapping(idToObjectMap);
        });

        return idToObjectMap;
    }
}
