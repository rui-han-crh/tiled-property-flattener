var _a, _b, _c, _d, _e;
import minimist from 'minimist';
import * as TiledProjectParser from './parsers/tiled_project_parser.js';
import * as TiledMapParser from './parsers/tiled_map_parser.js';
import * as fs from 'fs';
function parseProjectFile(projectFilePath) {
    const projectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));
    return TiledProjectParser.parse(projectFileData);
}
function parseMapFile(mapFilePath, parsedProject) {
    const mapFileData = JSON.parse(fs.readFileSync(mapFilePath, 'utf8'));
    return TiledMapParser.parse(mapFileData, parsedProject);
}
// Read in the arguments.
const args = minimist(process.argv.slice(2));
// Check if batch mode is enabled and take the folder path.
const tiledFolderPath = (_a = args.batch) !== null && _a !== void 0 ? _a : args.b;
if (tiledFolderPath !== undefined) {
    // Get the project file, which is the first file in the folder that ends with `.tiled-project`.
    const projectFile = fs.readdirSync(tiledFolderPath).find((file) => file.endsWith('.tiled-project'));
    if (projectFile === undefined) {
        // If no project file was found, exit.
        console.log('No project file found in the given folder.');
        process.exit(1);
    }
    // Get the output folder path.
    const outputFolderPath = (_b = args.output) !== null && _b !== void 0 ? _b : args.o;
    if (outputFolderPath === undefined) {
        console.log('No output folder specified. Please specify an output folder with the `-o` flag.');
        console.log('Usage: node parse -b <TILED_FOLDER_PATH> -o <OUTPUT_FOLDER_PATH>');
        process.exit(1);
    }
    // Parse the project file.
    const parsedProject = parseProjectFile(`${tiledFolderPath}/${projectFile}`);
    // For every map file in the folder, which is every file that ends with `.json`...
    fs.readdirSync(tiledFolderPath).filter((file) => file.endsWith('.json')).forEach((mapFile) => {
        // Parse it against the project file.
        const parsedMap = parseMapFile(`${tiledFolderPath}/${mapFile}`, parsedProject);
        // Create the output folder if it doesn't exist.
        if (fs.existsSync(outputFolderPath) === false) {
            fs.mkdirSync(outputFolderPath);
        }
        // Write the parsed result to a file with the same name (without path) as the map file.
        fs.writeFileSync(`${outputFolderPath}/${mapFile}`, parsedMap.toJson());
    });
}
else {
    // Get the project file.
    const projectFilePath = (_c = args.projectFile) !== null && _c !== void 0 ? _c : args.p;
    const USAGE_PROMPT = 'Usage: node parse -p <PROJECT_FILE_PATH> -m <MAP_FILE_PATH> -o <OUTPUT_FILE>';
    if (projectFilePath === undefined) {
        console.log('No project file specified.');
        console.log(USAGE_PROMPT);
        process.exit(1);
    }
    // Get the map file.
    const mapFilePath = (_d = args.mapFile) !== null && _d !== void 0 ? _d : args.m;
    if (mapFilePath === undefined) {
        console.log('No map file specified.');
        console.log(USAGE_PROMPT);
        process.exit(1);
    }
    // Get the output file.
    const outputFile = (_e = args.output) !== null && _e !== void 0 ? _e : args.o;
    if (outputFile === undefined) {
        console.log('No output file specified.');
        console.log(USAGE_PROMPT);
        process.exit(1);
    }
    // Parse the project file, so we can reference the classes and enums defined in it.
    const projectParsedResult = parseProjectFile(projectFilePath);
    // Then, parse the map file, referencing the project parsed result.
    const mapParsedResult = parseMapFile(mapFilePath, projectParsedResult);
    // Write the parsed result to the output file.
    fs.writeFileSync(outputFile, mapParsedResult.toJson());
    console.log('Done!');
}
