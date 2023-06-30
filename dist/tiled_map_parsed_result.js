export default class TiledMapParsedResult {
    constructor(imagesToLoad, spriteSheetsToLoad, idToObjectMap, idToLayerMap) {
        this.imagesToLoad = imagesToLoad;
        this.spriteSheetsToLoad = spriteSheetsToLoad;
        this.idToObjectMap = idToObjectMap;
        this.idToLayerMap = idToLayerMap;
    }
    /**
     * Finds all objects of the given type.
     * @param typeConstructor The type of object to find.
     * @returns An array of objects of the given type.
     */
    getObjects(typeConstructor) {
        return Array.from(this.idToObjectMap.values())
            .filter((gameObject) => gameObject instanceof typeConstructor);
    }
    /**
     * Gets a copy of the idToObjectMap, with all objects reset.
     *
     * Within each object, the charIdToObjectMap is updated to point to the new objects.
     */
    getIdToObjectMap() {
        console.log('Copying all objects.');
        // Copy a new map of the objects, deep copying the objects.
        const idToObjectMap = new Map(Array.from(this.idToObjectMap.entries())
            .map(([id, object]) => [id, object.clone()]));
        // Update the charIdToObjectMap in all the objects.
        idToObjectMap.forEach((object) => {
            object.setIdToObjectMapping(idToObjectMap);
        });
        return idToObjectMap;
    }
}
