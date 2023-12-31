import minimist from 'minimist';
import * as fs from 'fs';
import { TiledProjectParser, TiledMapParser } from './dist/tiled_property_flattener.min.js';

function parseProjectFile (projectFilePath, options) {
    const projectFileData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));

    return TiledProjectParser.parse(projectFileData, options);
}

function parseMapFile (mapFilePath, parsedProject) {
    const mapFileData = JSON.parse(fs.readFileSync(mapFilePath, 'utf8'));

    return TiledMapParser.parse(mapFileData, parsedProject);
}

// Read in the arguments.
const args = minimist(process.argv.slice(2));

// Check if batch mode is enabled and take the folder path.
const tiledFolderPath = args.batch ?? args.b;

if (tiledFolderPath !== undefined) {
    // Get the project file, which is the first file in the folder that ends with `.tiled-project`.
    const projectFile = fs.readdirSync(tiledFolderPath).find((file) => file.endsWith('.tiled-project'));

    if (projectFile === undefined) {
        // If no project file was found, exit.
        console.log('No project file found in the given folder.');
        process.exit(1);
    }

    // Get the output folder path.
    const outputFolderPath = args.output ?? args.o;

    if (outputFolderPath === undefined) {
        logUsageBatch();
        process.exit(1);
    }

    // If the output folder does not exist, create it.
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
    }

    // Parse the project file.
    const parsedProject = parseProjectFile(`${tiledFolderPath}/${projectFile}`, {
        defaultComposite: args.defaultComposite ?? args.c ?? false
    });

    console.log(args.defaultComposite ?? args.c ?? false);

    // For every file in the folder,
    // if it is a map file (ends with `.json`), parse it against the project file,
    // if it is a subdirectory, recursively call this function on it.
    const parseTiledFolder = (tiledFolderPath) => {
        fs.readdirSync(tiledFolderPath).forEach((file) => {
            if (file.endsWith('.json')) {
                const parsedMap = parseMapFile(`${tiledFolderPath}/${file}`, parsedProject);

                // Write the parsed result to the output file.
                fs.writeFileSync(`${outputFolderPath}/${file}`, parsedMap.toJSON());
            } else if (fs.lstatSync(`${tiledFolderPath}/${file}`).isDirectory()) {
                // Recursively call this function on the subdirectory.
                parseTiledFolder(`${tiledFolderPath}/${file}`, outputFolderPath);
            }
        });
    };

    parseTiledFolder(tiledFolderPath);

    // Output the project file, write it to the specified file.
    fs.writeFileSync(`${outputFolderPath}/${projectFile}.json`, parsedProject.toJSON());
} else {
    // Get the project file.
    const projectFilePath = args.projectFile ?? args.p;

    if (projectFilePath === undefined) {
        console.log('No project file specified.');
        logUsageSingleMap();
        process.exit(1);
    }

    // Get the map file.
    const mapFilePath = args.mapFile ?? args.m;

    if (mapFilePath === undefined && (args.o ?? args.output) !== undefined) {
        console.log('No map file specified, but output file specified.');
        logUsageSingleMap();
        process.exit(1);
    }

    // Get the output file.

    const outputFile = args.output ?? args.o;

    if (outputFile === undefined && (args.m ?? args.mapFile) !== undefined) {
        console.log('No output file specified, but map file specified.');
        logUsageSingleMap();
        process.exit(1);
    }

    // Parse the project file, so we can reference the classes and enums defined in it.
    const projectParsedResult = parseProjectFile(projectFilePath, {
        defaultComposite: args.defaultComposite ?? args.c ?? false
    });

    if (mapFilePath && outputFile) {
        // Then, parse the map file, referencing the project parsed result.
        const mapParsedResult = parseMapFile(mapFilePath, projectParsedResult);

        // Write the parsed result to the output file.
        fs.writeFileSync(outputFile, mapParsedResult.toJSON());
    }

    // If the user wants to output the project file, write it to the specified file.
    if (args.outputProject ?? args.t) {
        fs.writeFileSync(args.outputProject ?? args.t, projectParsedResult.toJSON());
    }
}

function logUsageSingleMap () {
    console.log('Usage: npm start -p <PROJECT_FILE_PATH> [-t <PROJECT_OUTPUT_PATH>] [-m <MAP_FILE_PATH> -o <OUTPUT_FILE>] [-c]');
    console.log('  -p, --project-file: The path to the project file.');
    console.log('  -m, --map-file: The path to the map file.');
    console.log('  -o, --output: The path to the output file.');
    console.log('  -t, -output-project: The path to the output project file, if outputting the project file JSON is desired.');
    console.log('  -c, --default-composite: Instead flattening subproperties, retain subproperties structure such that they are composite in the root.');
}

function logUsageBatch () {
    console.log('Usage: npm start -b <TILED_FOLDER_PATH> -o <OUTPUT_FOLDER_PATH> [-c]');
    console.log('  -b, --batch: The path to the folder containing the Tiled project file and map files.');
    console.log('  -o, --output: The path to the output folder.');
    console.log('  -c, --default-composite: Instead flattening subproperties, retain subproperties structure such that they are composite in the root.');
}
