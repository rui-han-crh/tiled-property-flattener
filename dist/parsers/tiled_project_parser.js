import { Flattener } from './flattener.js';
import TiledProjectParsedResult from './tiled_project_parsed_result.js';
/**
 * Parses a Tiled project file.
 *
 * Given a .tiled-project file in JSON format, it will parse all the classes of the file
 * and flatten object properties. This mimics inheritance in Tiled.
 *
 * If `@composite:` is prepended to the name of a class, then the class will not be flattened.
 * However, that class will be composed under its parent class and may flatten its own properties.
 * This mimics composition in Tiled.
 */
export function parse(jsonProjectFileData) {
    // For enums, we map the enum name to its values, where its values are a Set.
    /**
     * A map of all the enums in the project file.
     */
    const enumNameToValuesMap = new Map(jsonProjectFileData.propertyTypes.filter((propertyType) => propertyType.type === 'enum').map((enumPropertyType) => [enumPropertyType.name, new Set(enumPropertyType.values)]));
    /**
     * A map the tiledClass name to their object members.
     * The `members` are the custom properties of the class as in Tiled, which may contain nested objects.
     * This is to maintain a constant access time, otherwise we would have to iterate over the array.
     */
    const tiledClassToMembersMap = new Map(jsonProjectFileData.propertyTypes.filter((propertyType) => propertyType.type === 'class').map((tiledClass) => [tiledClass.name, tiledClass.members]));
    const flattener = new Flattener(tiledClassToMembersMap, enumNameToValuesMap);
    tiledClassToMembersMap.forEach((members, className) => {
        flattener.flattenMembers(className, members);
    });
    console.log('Memoised: ', flattener.memoisedFlattenedProperties);
    return new TiledProjectParsedResult(flattener);
}
