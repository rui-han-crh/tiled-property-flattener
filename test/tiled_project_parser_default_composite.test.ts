import fs from 'fs';
import { TiledProjectParser } from '../src/tiled_property_flattener';

test(`
Given a .tiled-project file containing a classes without \`@composite:\`,
when calling the parse method with parserOptions.defaultComposite = true,
then parses all the classes of the tiled project as composed classes.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/default_composite/default_composite.tiled-project';
    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));

    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData, {
        defaultComposite: true
    });
    
    // ASSERT
    // Get the custom classes.
    const customClasses = tiledProjectParsedResult.getCustomTypesMap();

    // Check that the parsed result contains the expected classes.
    expect(customClasses.has('CakeRecipe')).toBe(true);

    // Check that the parsed result contains the expected properties.
    expect(customClasses.get('CakeRecipe')).toEqual({
        requiresOven: true,
        bakingPowder: {
            amountInGrams: 420
        },
        eggs: {
            amountInGrams: 105
        },
        flour: {
            amountInGrams: 360
        },
        milk: {
            amountInGrams: 120
        },
        unsaltedButter: {
            amountInGrams: 120
        },
        vanillaExtract: {
            amountInGrams: 8.4
        },
        whiteSugar: {
            amountInGrams: 240
        }
    });
});
