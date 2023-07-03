import fs from 'fs';
import { TiledProjectParser } from '../src/tiled_property_flattener';
import EnumValues from '../src/enum_values';

test(`
Given a parsed Tiled project file,
when fetching the custom types,
then returns the expected custom types.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/inherited_classes/inherited_classes.tiled-project';
    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));
    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);
    
    // Retrieve the custom classes.
    const customClasses = tiledProjectParsedResult.getCustomTypesMap();

    // ASSERT
    // Check that the parsed result contains the expected classes.
    expect(customClasses.has('Animal')).toBe(true);
    expect(customClasses.has('Mammal')).toBe(true);
    expect(customClasses.has('Cow')).toBe(true);
    expect(customClasses.has('Bat')).toBe(true);

    // Check that the parsed result contains the expected properties.
    expect(customClasses.get('Animal')).toEqual({
        hasFur: false,
        laysEggs: false,
        numberOfLegs: 0
    });

    expect(customClasses.get('Mammal')).toEqual({
        hasFur: true,
        laysEggs: false,
        numberOfLegs: 4,
        usesEcholocation: false
    });

    expect(customClasses.get('Cow')).toEqual({
        hasFur: true,
        laysEggs: false,
        numberOfLegs: 4,
        usesEcholocation: false
    });

    expect(customClasses.get('Bat')).toEqual({
        hasFur: true,
        laysEggs: false,
        numberOfLegs: 4,
        usesEcholocation: true
    });
});

test(`
Given a parsed Tiled project file,
when fetching the custom enums,
then returns the expected custom enums.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/enums_with_flags/enums_with_flags.tiled-project';
    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));
    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);
    
    // Retrieve the custom classes.
    const customEnums = tiledProjectParsedResult.getEnumsMap();

    // ASSERT
    // Check that the parsed result contains the expected classes.
    expect(customEnums.has('Gender')).toBe(true);
    expect(customEnums.has('Module')).toBe(true);

    // Check that the parsed result contains the expected properties.
    expect(customEnums.get('Gender')).toEqual(new EnumValues(['Male', 'Female']));

    // Check that the parsed result contains the expected properties.
    expect(customEnums.get('Module')).toEqual(new EnumValues(
        [
            'CS1010X',
            'CS2030S',
            'CS2040S',
            'CS2103T',
            'CS2101',
            'CS2102',
            'MA1521',
            'MA2001'
        ], true)
    );
});

test(`
Given a parsed Tiled project file,
when converting the parsed result to a JSON string,
then returns the expected JSON string.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/enums_with_flags/enums_with_flags.tiled-project';
    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));

    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);
    // Convert the parsed result to a JSON string.
    const tiledProjectParsedResultJsonString = tiledProjectParsedResult.toJSON();

    // ASSERT
    // Get the expected JSON string.
    const expectedJsonString = fs.readFileSync('test/expected_output_data/enums_with_flags/enums_with_flags.json', 'utf8');
    // Check that the output JSON string is as expected.
    expect(tiledProjectParsedResultJsonString).toEqual(expectedJsonString);
});