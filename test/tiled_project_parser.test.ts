import fs from 'fs';
import * as TiledProjectParser from '../src/parsers/tiled_project_parser';

test(`
Given a .tiled-project file containing a single class,
when calling the parse method, 
then parses all the classes of the file and flatten object properties.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/single_class/single_class.tiled-project';

    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));

    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);
    // Retrieve the custom classes.
    const customClasses = tiledProjectParsedResult.getCustomTypesMap();

    // ASSERT
    // Check that the parsed result contains the expected class.
    expect(customClasses.has('Animal')).toBe(true);
    expect(customClasses.get('Animal')).toEqual({
        hasFur: false,
        laysEggs: false,
        numberOfLegs: 0
    });
});

test(`
Given a .tiled-project file containing inherited classes,
when calling the parse method,
then parses all the classes of the file and flatten object properties.
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
Given a .tiled-project file containing multiple inheritance,
when calling the parse method,
then parses all the classes of the file and flatten object properties.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/multiple_inheritance/multiple_inheritance.tiled-project';

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
    expect(customClasses.has('WingedAnimal')).toBe(true);
    expect(customClasses.has('Bat')).toBe(true);

    // Check that the parsed result contains the expected properties.
    expect(customClasses.get('WingedAnimal')).toEqual({
        numberOfWings: 0
    });

    expect(customClasses.get('Bat')).toEqual({
        hasFur: true,
        laysEggs: false,
        numberOfLegs: 4,
        numberOfWings: 2,
        usesEcholocation: true
    });
});

test(`
Given a .tiled-project file containing enums, without flags,
when calling the parse method,
then parses all the enums of the file.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/enums_no_flags/enums_no_flags.tiled-project';

    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));

    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);

    // Retrieve the enums.
    const enums = tiledProjectParsedResult.getEnums();

    // Retrieve the custom classes.
    const customTypes = tiledProjectParsedResult.getCustomTypesMap();

    // ASSERT
    // Check that the parsed result contains the expected classes and enums.
    expect(enums.has('Gender')).toBe(true);
    expect(enums.has('Module')).toBe(true);

    expect(customTypes.has('Person')).toBe(true);
    expect(customTypes.has('Student')).toBe(true);
    expect(customTypes.has('Professor')).toBe(true);
    expect(customTypes.has('TeachingAssistant')).toBe(true);
    expect(customTypes.has('LabTeachingAssistant')).toBe(true);
    expect(customTypes.has('TutorialTeachingAssistant')).toBe(true);

    expect(customTypes.has('Jonathan')).toBe(true);
    expect(customTypes.has('Thomas')).toBe(true);
    expect(customTypes.has('Hailey')).toBe(true);
    expect(customTypes.has('Rachel')).toBe(true);

    // Check that the enums contain the expected values.
    expect(enums.get('Gender')).toEqual(new Set<string>(
        ['Male', 'Female']
    ));

    expect(enums.get('Module')).toEqual(new Set<string>(
        ['CS1010X', 'CS2030S', 'CS2040S', 'CS2103T', 'CS2101', 'CS2102', 'MA1521', 'MA2001']
    ));

    // Check that the classes contain the expected properties.
    expect(customTypes.get('Hailey')).toEqual({
        currentTeachingModule: new Set<string>(['CS2040S']),
        officeAddress: '15 Computing Dr, Singapore 117418, #15-02',
        gender: new Set<string>(['Female'])
    });

    expect(customTypes.get('Rachel')).toEqual({
        gender: new Set<string>(['Female']),
        currentTeachingModule: new Set<string>(['CS2030S'])
    });

    expect(customTypes.get('Jonathan')).toEqual({
        gender: new Set<string>(['Male']),
        currentTeachingModule: new Set<string>(['CS2040S'])
    });

    expect(customTypes.get('Thomas')).toEqual({
        gender: new Set<string>(['Male']),
        currentTeachingModule: new Set<string>(['CS2103T'])
    });
});

test(`
Given a .tiled-project file containing enums, with flags,
when calling the parse method,
then parses all the enums of the file.
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
    const customTypes = tiledProjectParsedResult.getCustomTypesMap();

    // ASSERT
    // Check that every person can now teach multiple modules.
    expect(customTypes.get('Hailey')).toEqual({
        gender: new Set<string>(['Female']),
        currentTeachingModule: new Set<string>(['CS2030S', 'CS2101', 'CS2102']),
        officeAddress: '15 Computing Dr, Singapore 117418, #15-02'
    });

    expect(customTypes.get('Rachel')).toEqual({
        gender: new Set<string>(['Female']),
        currentTeachingModule: new Set<string>(['CS1010X', 'CS2103T'])
    });

    expect(customTypes.get('Jonathan')).toEqual({
        gender: new Set<string>(['Male']),
        currentTeachingModule: new Set<string>(['CS2030S'])
    });

    expect(customTypes.get('Thomas')).toEqual({
        gender: new Set<string>(['Male']),
        currentTeachingModule: new Set<string>(['CS1010X', 'CS2102', 'MA1521', 'CS2030S'])
    });
});
