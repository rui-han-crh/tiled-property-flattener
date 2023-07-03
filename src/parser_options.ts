/**
 * The options for the parser.
 * 
 * All options are turned off by default.
 */
interface ParserOptions {
    /**
     * Should we treat nested classes as a composite by default?
     * If true, then all nested classes will be treated as a composite, unless
     * `@inherit:` is prepended to the name of the class.
     * 
     * This is default to false, i.e. nested classes are inherited by default.
     */
    defaultComposite?: boolean;
}

export default ParserOptions;