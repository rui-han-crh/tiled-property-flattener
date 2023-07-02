import fs from 'fs';
import * as TiledProjectParser from '../src/parsers/tiled_project_parser';
import * as TiledMapParser from '../src/parsers/tiled_map_parser';
import BasicTileProperties from '../src/properties/basic_tile_properties';
import { BasicProperties } from '../src/tiled_property_flattener';

test(`
Given a map file that references custom classes,
when calling the parse method,
then parses all the objects in the map and flattens its properties.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/vehicles/vehicles.tiled-project';
    const mapFilePath = 'test/test_data/vehicles/objects_with_properties.json';

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

    // ASSERT
    // Check that the parsed map contains the expected objects.

    expect(
        new Set<string>(
            Array.from(objectIdToPropertiesMap.values())
                .map((properties: BasicProperties) => properties.name)
        )
    )
    .toEqual(new Set<string>(
        [
            'boeing737',
            'audiA4',
            'mazda',
            'defaultPlane',
            'motorVehicle',
            'monsterTruck'
        ]
    ));

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

test(`
Given a map file that has tiles with custom properties,
when calling the parse method,
then parses all the tiles in the map and flattens its properties.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/vehicles/vehicles.tiled-project';
    const mapFilePath = 'test/test_data/vehicles/tiles_with_properties.json';

    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));
    // Read in the .json map file.
    const jsonMapFileData = JSON.parse(fs.readFileSync(mapFilePath, 'utf8'));

    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);
    // Parse the .json map file.
    const tiledMapParsedResult = TiledMapParser.parse(jsonMapFileData, tiledProjectParsedResult);

    // Retrieve the tile id to properties map.
    const tilesetIdToPropertiesMap = tiledMapParsedResult.getTilesetIdToPropertiesMap();

    // ASSERT
    // Check that the parsed map contains the expected tiles.
    expect(tilesetIdToPropertiesMap.size).toBe(2);

    expect(tilesetIdToPropertiesMap.get(1)).toEqual({
        columns: 4,
        firstgid: 1,
        image: "template-tileset.png",
        imageheight: 128,
        imagewidth: 128,
        margin: 0,
        name: "template-tileset",
        spacing: 0,
        tilecount: 16,
        tileheight: 32,
        tilewidth: 32,
        tiles: new Map<number, any extends BasicTileProperties ? any : never>([
            [0, {
                id: 0,
                class: 'MotorVehicle',
                engine: {
                    numberOfCylinders: 8,
                    weight: 150
                },
                amountOfFuelLeft: 0,
                colour: new Set<string>(['Yellow']),
                weight: 3501.7,
                numberOfWheels: 4,
                vehicleUsage: new Set<string>(['OffRoad'])
            }]
        ]
        )
    });
});
