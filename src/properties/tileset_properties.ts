import BasicTileProperties from "./basic_tile_properties";

/**
 * The basic properties of a Tiled tileset.
 */
interface TilesetProperties {
    columns: number;
    firstgid: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: number;
    name: string;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tilewidth: number;
    tiles: Map<number, BasicTileProperties>;
}

export default TilesetProperties;
