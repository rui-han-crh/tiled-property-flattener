/**
 * The prefix of a composite class as declared in Tiled to prevent it from being flattened.
 *
 * Instead, the composite class becomes composed under its parent class.
 */
export const COMPOSITE_PREFIX = '@composite:';

/**
 * The prefix of an inherited class as declared in Tiled. This is used when
 * `defaultComposite` is set to true in the parser options.
 */
export const INHERIT_PREFIX = '@inherit:';
