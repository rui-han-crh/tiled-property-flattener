import fs from 'fs';
import * as TiledProjectParser from '../src/parsers/tiled_project_parser';
import * as TiledMapParser from '../src/parsers/tiled_map_parser';

test(`
Given a map file that references custom classes,
when calling the parse method,
then parses all the objects in the map and flattens its properties.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/vehicles/vehicles.tiled-project';
    const mapFilePath = 'test/test_data/vehicles/map1.json';

    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));
    // Read in the .json map file.
    const jsonMapFileData = JSON.parse(fs.readFileSync(mapFilePath, 'utf8'));

    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);
    // Parse the .json map file.
    const tiledMapParsedResult = TiledMapParser.parse(jsonMapFileData, tiledProjectParsedResult);

    // Retrieve the object id to properties map.
    const objectIdToPropertiesMap = tiledMapParsedResult.getObjectIdToPropertiesMap();

    // Retrieve the layer id to properties map.
    const layerIdToPropertiesMap = tiledMapParsedResult.getLayerIdToPropertiesMap();

    // ASSERT
    // Check that the parsed map contains the expected objects.
    expect(objectIdToPropertiesMap.size).toBe(6);
    expect(objectIdToPropertiesMap.get(1)).toEqual({
        name: 'boeing737',
        id: 1,
        class: 'Boeing737',
        x: 144.50,
        y: 19.00,
        engineA: {
            weight: 150.0,
            numberOfCylinders: 64
        },
        engineB: {
            weight: 150.0,
            numberOfCylinders: 64
        },
        isFlying: false,
        amountOfFuelLeft: 10_000.0,
        colour: new Set<string>(['White']),
        weight: 41_140.0,
        numberOfWheels: 6,
        vehicleUsage: new Set<string>(['Transport'])
    });
});
