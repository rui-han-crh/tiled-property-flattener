import { TiledMapParser, TiledProjectParser } from "../src/tiled_property_flattener";
import fs from 'fs';

test(`
Given the layer map,
when calling the getLayerIdToPropertiesMap method and mutating the values of the returned map,
then the original layer map is not mutated.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/vehicles/vehicles.tiled-project';
    const mapFilePath = 'test/test_data/vehicles/layers_with_properties.json';

    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));
    // Read in the .json map file.
    const jsonMapFileData = JSON.parse(fs.readFileSync(mapFilePath, 'utf8'));

    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);
    // Parse the .json map file.
    const tiledMapParsedResult = TiledMapParser.parse(jsonMapFileData, tiledProjectParsedResult);

    // Retrieve the object id to properties map and save it.
    const layerIdToPropertiesMap = tiledMapParsedResult.getLayerIdToPropertiesMap();

    const id: number = 1;

    // Check that layer id 1 exists.
    expect(layerIdToPropertiesMap.has(id)).toBe(true);

    // Save the original name property of the layer.
    const originalName = layerIdToPropertiesMap.get(id)!.name;

    // Save the original numberOfCylinders property of the layer.
    const originalNumberOfCylinders: number = (layerIdToPropertiesMap.get(id)! as any).engine.numberOfCylinders;

    // Mutate the name property of the layer.
    layerIdToPropertiesMap.get(id)!.name = 'Mutated Name';

    // Mutate the numberOfCylinders property of the layer.
    (layerIdToPropertiesMap.get(id)! as any).engine.numberOfCylinders = 100;

    // ASSERT
    // Check that property mutations are reflected in the layer map.
    expect(layerIdToPropertiesMap.get(id)!.name)
        .toBe('Mutated Name');

    expect((layerIdToPropertiesMap.get(id)! as any).engine.numberOfCylinders)
        .toBe(100);

    // Check that the original layer map is not mutated.
    expect(tiledMapParsedResult.getLayerIdToPropertiesMap().get(id)!.name)
        .toBe(originalName);
    expect((tiledMapParsedResult.getLayerIdToPropertiesMap().get(id)! as any).engine.numberOfCylinders)
        .toBe(originalNumberOfCylinders);
});

test(`
Given the object map,
when calling the getObjectIdToPropertiesMap method and mutating the values of the returned map,
then the original object map is not mutated.
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

    // Retrieve the object id to properties map and save it.
    const objectIdToPropertiesMap = tiledMapParsedResult.getObjectIdToPropertiesMap();

    const id: number = 7;

    // Check that layer id 1 exists.
    expect(objectIdToPropertiesMap.has(id)).toBe(true);

    // Save the original name property of the layer.
    const originalName = objectIdToPropertiesMap.get(id)!.name;

    // Save the original numberOfCylinders property of the layer.
    const originalNumberOfCylinders: number = (objectIdToPropertiesMap.get(id)! as any).engine.numberOfCylinders;

    // Mutate the name property of the layer.
    objectIdToPropertiesMap.get(id)!.name = 'Mutated Name';

    // Mutate the numberOfCylinders property of the layer.
    (objectIdToPropertiesMap.get(id)! as any).engine.numberOfCylinders = 100;

    // ASSERT
    // Check that property mutations are reflected in the layer map.
    expect(objectIdToPropertiesMap.get(id)!.name)
        .toBe('Mutated Name');

    expect((objectIdToPropertiesMap.get(id)! as any).engine.numberOfCylinders)
        .toBe(100);

    // Check that the original layer map is not mutated.
    expect(tiledMapParsedResult.getObjectIdToPropertiesMap().get(id)!.name)
        .toBe(originalName);
    expect((tiledMapParsedResult.getObjectIdToPropertiesMap().get(id)! as any).engine.numberOfCylinders)
        .toBe(originalNumberOfCylinders);
});

test(`
Given the tileset map,
when calling the getTilesetIdToPropertiesMap method and mutating the values of the returned map,
then the original tileset map is not mutated.
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

    // Retrieve the object id to properties map and save it.
    const tilesetIdToPropertiesMap = tiledMapParsedResult.getTilesetIdToPropertiesMap();

    const firstgid: number = 1;

    // Check that tileset firstgid 1 exists.
    expect(tilesetIdToPropertiesMap.has(firstgid)).toBe(true);

    // Save the original name property of the tileset.
    const originalName = tilesetIdToPropertiesMap.get(firstgid)!.name;

    // Save the original numberOfCylinders property of the layer.
    const originalNumberOfCylinders: number = (tilesetIdToPropertiesMap.get(firstgid)! as any).tiles.get(0).engine.numberOfCylinders;

    // Mutate the name property of the layer.
    tilesetIdToPropertiesMap.get(firstgid)!.name = 'Mutated Name';

    // Mutate the numberOfCylinders property of the layer.
    (tilesetIdToPropertiesMap.get(firstgid)! as any).tiles.get(0).engine.numberOfCylinders = 100;

    // ASSERT
    // Check that property mutations are reflected in the layer map.
    expect(tilesetIdToPropertiesMap.get(firstgid)!.name)
        .toBe('Mutated Name');

    expect((tilesetIdToPropertiesMap.get(firstgid)! as any).tiles.get(0).engine.numberOfCylinders)
        .toBe(100);

    // Check that the original layer map is not mutated.
    expect(tiledMapParsedResult.getTilesetIdToPropertiesMap().get(firstgid)!.name)
        .toBe(originalName);
    expect((tiledMapParsedResult.getTilesetIdToPropertiesMap().get(firstgid)! as any).tiles.get(0).engine.numberOfCylinders)
        .toBe(originalNumberOfCylinders);
});

test(`
Given the parsed map,
when converting to JSON format,
then correctly formats a JSON string.
`, () => {
    // ARRANGE
    // Fetch the test data file path.
    const projectFilePath = 'test/test_data/vehicles/vehicles.tiled-project';
    const mapFilePath = 'test/test_data/vehicles/objects_with_properties.json';

    // Read in the .tiled-project file.
    const jsonProjectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));
    // Read in the .tiled-map file.
    const jsonMapFileData = JSON.parse(fs.readFileSync(mapFilePath, 'utf8'));

    // ACT
    // Parse the .tiled-project file.
    const tiledProjectParsedResult = TiledProjectParser.parse(jsonProjectFileData);
    // Parse the .tiled-map file.
    const tiledMapParsedResult = TiledMapParser.parse(jsonMapFileData, tiledProjectParsedResult);

    // Convert the parsed map to JSON format.
    const jsonMap = tiledMapParsedResult.toJSON();

    // ASSERT
    // Get the expected JSON map.
    const expectedJsonPath = 'test/test_data/vehicles/objects_with_properties.expected_parsed.json';
    const expectedJsonMap = fs.readFileSync(expectedJsonPath, 'utf8');
    // Check that the JSON map is correctly formatted.
    expect(jsonMap).toEqual(expectedJsonMap);
});