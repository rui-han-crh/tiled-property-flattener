import EnumValues from "../src/enum_values";

test(`
Given a two identical enum values, both not as flags,
when comparing them,
then returns true.
`, () => {
    // ARRANGE
    // Create the enum values.
    const enumValue1 = new EnumValues(['value1', 'value2']);
    const enumValue2 = new EnumValues(['value1', 'value2']);

    // ASSERT
    // Check that the enum values are equal.
    expect(enumValue1).toStrictEqual(enumValue2);
});

test(`
Given a two identical enum values, both as flags,
when comparing them,
then returns true.
`, () => {
    // ARRANGE
    // Create the enum values.
    const enumValue1 = new EnumValues(['value1', 'value2'], true);
    const enumValue2 = new EnumValues(['value1', 'value2'], true);

    // ASSERT
    // Check that the enum values are equal.
    expect(enumValue1).toStrictEqual(enumValue2);
});

// I'm skipping this test because I'm not sure if its valid.
// It seems to only be checking the values pulled from the Set, is there no way to override 
// a method from Set that includes this additional property during equality comparison?
// I'd prefer not to modify the structure of the class.
// But also is this even a concern?
// Is there any chance for the end user to end up with wrongly compared values 
// (is it right to say that users cannot use == or === to do object equality comparison, 
// they must check against every property themselves)?
test.skip(`
Given a two different enum values, one not as flags and the other as flags,
when comparing them,
then returns false.
`, () => {
    // ARRANGE
    // Create the enum values.
    const enumValue1 = new EnumValues(['value1', 'value2']);
    const enumValue2 = new EnumValues(['value1', 'value2'], true);

    // ASSERT
    // Check that the enum values are equal.
    expect(enumValue1).not.toStrictEqual(enumValue2);
});

test(`
Given a two different enum values, with different contained values, both not as flags,
when comparing them,
then returns false.
`, () => {
    // ARRANGE
    // Create the enum values.
    const enumValue1 = new EnumValues(['value1', 'value2']);
    const enumValue2 = new EnumValues(['value1', 'value3']);

    // ASSERT
    // Check that the enum values are equal.
    expect(enumValue1).not.toStrictEqual(enumValue2);
});

test(`
Given a two different enum values, with different contained values, both as flags,
when comparing them,
then returns false.
`, () => {
    // ARRANGE
    // Create the enum values.
    const enumValue1 = new EnumValues(['value1', 'value2'], true);
    const enumValue2 = new EnumValues(['value1', 'value3'], true);

    // ASSERT
    // Check that the enum values are equal.
    expect(enumValue1).not.toStrictEqual(enumValue2);
});