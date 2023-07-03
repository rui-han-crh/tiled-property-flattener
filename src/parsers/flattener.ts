import EnumValues, { ReadonlyEnumValues } from '../enum_values';
import ParserOptions from '../parser_options';
import { COMPOSITE_PREFIX, INHERIT_PREFIX } from './tiled_constants';

/**
 * Offers a way to flatten a nested JSON structure.
 * This is used to mimic inheritance and composition in Tiled.
 */
export class Flattener {
    /**
     * Tracks the flattened properties of each class, so that we don't have to recompute them
     * when we encounter the same class again.
     */
    private readonly memoiser = new Map<string, any>();

    constructor (
        private readonly tiledClassToMembersMap: ReadonlyMap<string, any>,
        public readonly enumNameToValuesMap: ReadonlyMap<string, ReadonlyEnumValues>,
        private readonly parserOptions?: ParserOptions
    ) {}

    /**
     * Flattens a list of members by combining them into one object, containing one key mapped to another
     * object of key-value pairs.
     *
     * The flattened properties will be memoised, so that if the same class is encountered again, the
     * flattened properties will be returned instead of being recomputed.
     *
     * The structure of the returned object is as follows:
     *
     * ```json
     * {
     *     <CLASS_NAME>: {
     *         <PROPERTY_NAME>: <PROPERTY_VALUE>,
     *         ...
     *     }
     * }
     * ```
     * It is guaranteed that there will only be one key in the object.
     *
     *
     * @param members The members to be flattened.
     * @param className The name of the class that the members belong to.
     * @param members The members of the class.
     */
    public flattenMembers (className: string, members: any[]): any {
        // If the class is already memoised, we can just return the value.
        if (this.memoiser.has(className)) {
            // Get the key-value pair of the class name and the flattened properties and we're done.
            return { [className]: this.memoiser.get(className) };
        }

        // Put all the members properties into one flattened object and memoise it.
        this.memoiser.set(className, members.reduce((acc: any, member: any) => (
            { ...acc, ...this.flattenMemberProperty(member) }
        ), {}));

        // Return the just memoised value.
        return { [className]: this.memoiser.get(className) };
    }

    /**
    * Flattens a *single* member of a propertyType.
    * A member consists of name, type and value, and optionally a propertyType.
    * The value can be a primitive or an object.
    *
    * This is used when the structure looks like this:
    * ```json
    * {
    *    name: <NAME>,
    *    type: <TYPE>,
    *    value: <OBJECT or PRIMITIVE>
    * }
    * ```
    *
    * The function will take out the `value` key and flatten it if it is an object.
    *
    * ```json
    * {
    *   flattened(<OBJECT>)
    * }
    * ```
    *
    * However, if the object's name has the `@composite:` prefix, then the object will not be flattened.
    * Instead, it will be a nested object under the `value` key, with its own values flattened. The key
    * will be the name of the object with the `@composite:` prefix removed.
    *
    * ```json
    * {
    *     <NAME>: flattened(<OBJECT>)
    * }
    * ```
    *
    * If the `value` is a primitive, the name of the member will be the key and the value will be its value.
    *
    * ```json
    * {
    *     <NAME>: <PRIMITIVE>
    * }
    *
    * @param member Any literal member under the `members` key of a propertyType to be flattened.
    * @param memoiser Mapping of the name of the class to its flattened properties.
    */
    public flattenMemberProperty (member: any): any {
        // Bjorn has confirmed that the following was intentional:
        // The property type key is sometimes called `propertyType` (in project file) and sometimes
        // `propertytype` (in map file).
        // This is because propertytype historically always was in lowercase following the tmx format,
        // a decision he changed his mind about later on when he wrote the project file format.
        // See: https://discord.com/channels/524610627545595904/524610627545595906/1123535538264215583
        const propertyType = member.propertyType ?? member.propertytype;

        // Check if the member is a class.
        if (member.type === 'class') {
            if (!this.memoiser.has(propertyType)) {
                // If the class that the member belongs to has not been flattened,
                // recursively flatten the class's members.
                const compositeClassFlattenedProperties = this.tiledClassToMembersMap.get(propertyType)
                    .reduce((acc: any, nestedMember: any) => (
                        { ...this.flattenMemberProperty(nestedMember), ...acc }
                    ), {});

                // Save the class's flattened properties to the memoised map, so we don't have to
                // recompute it again.
                this.memoiser.set(propertyType, compositeClassFlattenedProperties);
            }

            // Get the flattened properties of the class.
            const compositeClassFlattenedProperties = this.memoiser.get(propertyType);

            // Create the resulting object from recursively flattening the class's members.
            const resultantObject = {
                ...compositeClassFlattenedProperties,
                ...recursiveFlattenValue(member.value, compositeClassFlattenedProperties)
            };

            // Check if we should nest the class's properties.
            // We should nest if either the class is declared with the `@composite:` prefix,
            // or the parser is set to default to composite classes and the class is not declared
            // with the `@inherit:` prefix.
            const shouldNest = (member.name as string).startsWith(COMPOSITE_PREFIX) ||
                (this.parserOptions?.defaultComposite &&
                    !(member.name as string).startsWith(INHERIT_PREFIX));

            return shouldNest 
                ? {[member.name.replace(COMPOSITE_PREFIX, '')]: resultantObject}
                : resultantObject;
        } else if (this.enumNameToValuesMap.has(propertyType)) {
            if (this.enumNameToValuesMap.get(propertyType)!.valuesAsFlags) {
                // If the member type is an enum with flags, return a set of the flags.
                return { [member.name]: new Set(member.value ? member.value.split(',') : []) };
            } else {
                // If the member type is an enum without flags, just return the value.
                return { [member.name]: member.value };
            }
        } else {
            return { [member.name]: member.value };
        }
    };

    /**
     * Returns the memoised flattened properties for all the classes,
     * indexed by the class name as given in Tiled.
     */
    public get memoisedFlattenedProperties (): ReadonlyMap<string, any> {
        return this.memoiser;
    }
}

/**
 * This is a recursive function that will flatten a `value` key of a member.
 *
 * This function is used if the structure looks like this:
 * ```json
 * {
 *     <PROPERTY_NAME>: <PROPERTY_VALUE>,
 *     <PROPERTY_NAME>: {
 *         <PROPERTY_NAME>: <PROPERTY_VALUE>,
 *         ...
 *     },
 *     ...
 * }
 * ```
 *
 * The function will recursively flatten the `value` key of the member.
 *
 * ```json
 * {
 *    <PROPERTY_NAME>: <PROPERTY_VALUE>,
 *    <PROPERTY_NAME>: <PROPERTY_VALUE>,
 *    ...
 * }
 * ```
 *
 * @param propertyValue The `value` key of the member. This is an object
 *  of key-value pairs, where the key is a string representing the name of the property,
 *  and the value is the value of the property, which could be a primitive, or another
 *  of the same object.
 * @param currentIteration The current iteration of the recursive function.
 */
function recursiveFlattenValue (propertyValue: any, parentProperties: any): any {
    return Object.entries(propertyValue).reduce((acc: any, [leftHandSide, rightHandSide]: [string, any]) => {
        // Perform recursive flattening based on the type of the value.
        if (typeof rightHandSide !== 'object') {
            // The value is not an object, it is a primitive.

            // However, a primitive could be an enum, like ('Racing,Transport,Offroad').
            // We need to check if the left hand side is enum-like in the parent properties.
            // An enum is described by a Set object.
            // NOTE: An enum is described only by EnumValues in the enumNameToValuesMap, not here.
            // Enums without flags will have their parent property as a string, not a Set.

            // Crawl up the parent properties to see if the left hand side is an enum.
            const parentProperty = parentProperties[leftHandSide];
            if (parentProperty instanceof Set) {
                return {
                    [leftHandSide]: new Set(rightHandSide ? rightHandSide.split(',') : []),
                    ...acc
                };
            } else {
                // The left hand side is not an enum with flags, we can just return the value.
                return {
                    [leftHandSide]: rightHandSide,
                    ...acc
                };
            }
        } else if (leftHandSide.startsWith(COMPOSITE_PREFIX)) {
            const strippedName = leftHandSide.replace(COMPOSITE_PREFIX, '');
            // Else, if it is declared to be composite, we cannot flatten it.
            // However, we continue to flatten the rest of the properties.
            const result = {
                [strippedName]: recursiveFlattenValue(rightHandSide, parentProperties),
                ...acc
            };
            return result;
        } else {
            // Finally, if it is an object, we can flatten it.
            const result = {
                ...recursiveFlattenValue(rightHandSide, parentProperties),
                ...acc
            };
            return result;
        }
    }, {});
};
