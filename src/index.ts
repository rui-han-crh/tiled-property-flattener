import minimist from 'minimist';

// Read in the arguments.
const args = minimist(process.argv.slice(2));

// Get the project file.
const projectFile = args.projectFile ?? args.p;

const USAGE_PROMPT = 'Usage: node parse -p <PROJECT_FILE_PATH> -m <MAP_FILE_PATH> -o <OUTPUT_FILE>';

if (projectFile === undefined) {
    console.log('No project file specified.');
    console.log(USAGE_PROMPT);
    process.exit(1);
}

// Get the map file.
const mapFile = args.mapFile ?? args.m;

if (mapFile === undefined) {
    console.log('No map file specified.');
    console.log(USAGE_PROMPT);
    process.exit(1);
}

// Get the output file.

const outputFile = args.output ?? args.o;

if (outputFile === undefined) {
    console.log('No output file specified.');
    console.log(USAGE_PROMPT);
    process.exit(1);
}
