export { default as TiledMapParsedResult } from "./parsers/tiled_map_parsed_result";
export { default as TiledProjectParsedResult } from "./parsers/tiled_project_parsed_result";
export { default as BasicProperties } from "./properties/basic_properties";
export { default as ParserOptions } from "./parser_options";

import { parse as mapParse }  from "./parsers/tiled_map_parser";
import { parse as projectParse } from "./parsers/tiled_project_parser";

export const TiledMapParser = {
    parse: mapParse
};

export const TiledProjectParser = {
    parse: projectParse
};
