/**
 * The basic properties of a Tiled object.
 */
interface BasicProperties {
    name: string;
    id: number;
    class: string | null;
    x: number;
    y: number;
}

export default BasicProperties;
