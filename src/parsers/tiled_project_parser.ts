import ParserOptions from '../parser_options';
import { Flattener } from './flattener';
import TiledProjectParsedResult from './tiled_project_parsed_result';

/**
 * Parses a Tiled project file.
 *
 * Given a .tiled-project file in JSON format, it will parse all the classes of the file.
 * 
 * By default, the parser will flatten nested properties into the root of the class, 
 * mimicking inheritance in Tiled.
 *
 * If `@composite:` is prepended to the name of a property, then that property will not have its
 * properties flattened into the root.
 * 
 * However, that property will remain composed under the root class and will flatten 
 * its own nested properties into itself. This mimics composition in Tiled.
 * 
 * The parser options can be used to change the behaviour of the parser, such as inverting the
 * default behaviour of flattening properties 
 * (i.e. making all properties composite by default, unless `@inherit` is specified).
 * 
 * @param jsonProjectFileData The JSON data of the project file. A file of the `.tiled-project` 
 *  extension is already in JSON format.
 * @param parserOptions The options to customize the behaviour of the parser.
 */
export function parse (
    jsonProjectFileData: any, parserOptions?: ParserOptions
): TiledProjectParsedResult {
    // For enums, we map the enum name to its values, where its values are a Set.
    /**
     * A map of all the enums in the project file.
     */
    const enumNameToValuesMap: ReadonlyMap<string, ReadonlySet<string>> = new Map(
        jsonProjectFileData.propertyTypes.filter(
            (propertyType: any) => propertyType.type === 'enum'
        ).map(
            (enumPropertyType: any) => [enumPropertyType.name, new Set(enumPropertyType.values)]
        )
    );

    /**
     * A map the tiledClass name to their object members.
     * The `members` are the custom properties of the class as in Tiled, which may contain nested objects.
     * This is to maintain a constant access time, otherwise we would have to iterate over the array.
     */
    const tiledClassToMembersMap: ReadonlyMap<string, any> = new Map<string, any>(
        jsonProjectFileData.propertyTypes.filter(
            (propertyType: any) => propertyType.type === 'class'
        ).map(
            (tiledClass: any) => [tiledClass.name, tiledClass.members]
        )
    );

    const flattener = new Flattener(tiledClassToMembersMap, enumNameToValuesMap, parserOptions);

    tiledClassToMembersMap.forEach((members: any[], className: string) => {
        flattener.flattenMembers(className, members);
    });

    return new TiledProjectParsedResult(flattener);
}
