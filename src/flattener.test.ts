import EnumValues, { type ReadonlyEnumValues } from './enum_values';
import { Flattener } from './parsers/flattener';
import fs from 'fs';

test(`
Given a single property of a member,
when calling the flattenMemberProperty method,
then returns the expected flattened member property.
`, () => {
    // ARRANGE
    // ARRANGE
    // Get the project file path.
    const projectFilePath = 'test/test_data/enums_with_flags/enums_with_flags.tiled-project';

    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));

    // Create the flattener.
    const flattener = new Flattener(
        createClassToMembersMap(jsonProjectFileData),
        createEnumNameToValuesMap(jsonProjectFileData)
    );

    // Create the test member property.
    const memberProperty = {
        name: 'teachingAssistant',
        propertyType: 'TeachingAssistant',
        type: 'class',
        value: {
            currentTeachingModule: ''
        }
    };

    // ACT
    const flattenedMemberProperty = flattener.flattenMemberProperty(memberProperty);

    // ASSERT
    expect(flattenedMemberProperty).toEqual({
        currentTeachingModule: new Set()
    });
});

test(`
Given list of mock members with single layered values,
when calling the flattenMembers method,
then returns the expected flattened member.
`, () => {
    // ARRANGE
    const flattener = new Flattener(new Map(), new Map());
    const testMembers = [
        {
            name: 'Member1',
            type: 'string',
            value: 'value1'
        },
        {
            name: 'Member2',
            type: 'string',
            value: 'value2'
        }
    ];

    // ACT
    const flattenedMembers = flattener.flattenMembers('testClassName', testMembers);

    // ASSERT
    expect(flattenedMembers).toEqual(
        {
            testClassName: {
                Member1: 'value1',
                Member2: 'value2'
            }
        });
});

test(`
Given list of mock members with nested values,
when calling the flattenMembers method,
then returns the expected flattened member.
`, () => {
    // ARRANGE
    // Get the project file path.
    const projectFilePath = 'test/test_data/enums_with_flags/enums_with_flags.tiled-project';

    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));

    // Create the flattener.
    const flattener = new Flattener(
        createClassToMembersMap(jsonProjectFileData),
        createEnumNameToValuesMap(jsonProjectFileData)
    );

    // Create the test members.
    const members = [
        {
            name: 'person',
            propertyType: 'Person',
            type: 'class',
            value: {
                gender: 'Female'
            }
        },
        {
            name: 'teachingAssistant',
            propertyType: 'TeachingAssistant',
            type: 'class',
            value: {
                currentTeachingModule: ''
            }
        }
    ];

    // ACT
    const flattenedMembers = flattener.flattenMembers('Tammy', members);

    // ASSERT
    expect(flattenedMembers).toEqual(
        {
            Tammy: {
                gender: 'Female',
                currentTeachingModule: new Set()
            }
        });
});

// Helper functions to create the mappings.
function createEnumNameToValuesMap (projectJson: any): ReadonlyMap<string, ReadonlyEnumValues> {
    return new Map(projectJson.propertyTypes.filter(
        (propertyType: any) => propertyType.type === 'enum'
    ).map(
        (enumPropertyType: any) =>
            [
                enumPropertyType.name,
                new EnumValues(enumPropertyType.values, enumPropertyType.valuesAsFlags)
            ]
    ));
}

function createClassToMembersMap (projectJson: any): ReadonlyMap<string, ReadonlyEnumValues> {
    return new Map(projectJson.propertyTypes.filter(
        (propertyType: any) => propertyType.type === 'class'
    ).map(
        (tiledClass: any) => [tiledClass.name, tiledClass.members]
    ));
}
