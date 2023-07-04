/**
 * A readonly interface that represents a set of enum values.
 *
 * Casting EnumValues to ReadonlyEnumValues effectively makes the mutators inaccesible.
 */
export interface ReadonlyEnumValues extends ReadonlySet<number | string> {
    /**
     * Whether the enum values are treated as flags, i.e. whether multiple values can be selected.
     */
    readonly valuesAsFlags: boolean;
}

/**
 * A class that represents a set of enum values.
 *
 * The class also has a property `valuesAsFlags` that indicates whether the
 * enum values are treated as flags,
 */
export default class EnumValues extends Set implements ReadonlyEnumValues {
    constructor (
        values: ReadonlyArray<number | string>,
        public readonly valuesAsFlags: boolean = false
    ) {
        super(values);
    }
}
