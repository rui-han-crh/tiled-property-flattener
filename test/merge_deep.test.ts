import { mergeDeep } from '../src/merge_deep';

test(`
Given two single layered objects,
when calling the mergeDeep method,
then returns the expected merged object.
`, () => {
    // ARRANGE
    const object1 = {
        'name': 'object1',
        'property1': 'value1',
        'property2': 'value2'
    };
    const object2 = {
        'name': 'object1',
        'property1': 'value3',
        'property2': 'value2'
    };

    // ACT
    // Call the mergeDeep method.
    const mergedObject = mergeDeep(object1, object2);

    // ASSERT
    expect(mergedObject).toEqual({
        'name': 'object1',
        'property1': 'value3',
        'property2': 'value2'
    });
});

test(`
Given two nested objects with multiple layers,
when calling the mergeDeep method,
then returns the expected merged object.
`, () => {
    // ARRANGE
    const object1 = {
        'name': 'object1',
        'property1': 'value1',
        'property2': {
            'property3': 'value3',
            'property4': 'value4',
            'property5': {
                'property6': 'value6',
                'property7': 'value7'
            }
        }
    }

    const object2 = {
        'name': 'object1',
        'property2': {
            'property3': 'value8',
            'property5': {
                'property7': 'value9'
            }
        }
    }

    // ACT
    // Call the mergeDeep method.
    const mergedObject = mergeDeep(object1, object2);

    // ASSERT
    expect(mergedObject).toEqual({
        'name': 'object1',
        'property1': 'value1',
        'property2': {
            'property3': 'value8',
            'property4': 'value4',
            'property5': {
                'property6': 'value6',
                'property7': 'value9'
            }
        }
    });
});

test(`
Given two nested objects, one with a key that is not in the other,
when calling the mergeDeep method,
then returns the expected merged object.
`, () => {
    // ARRANGE
    const object1 = {
        'name': 'object1',
        'property1': 'value1',
        'property2': {
            'property3': 'value3',
            'property5': {
                'property6': 'value6',
                'property7': 'value7'
            }
        }
    }

    const object2 = {
        'name': 'object1',
        'property2': {
            'property4': 'value4',
        },
        'property8': 'value8'
    }

    // ACT
    // Call the mergeDeep method.
    const mergedObject = mergeDeep(object1, object2);

    // ASSERT
    expect(mergedObject).toEqual({
        'name': 'object1',
        'property1': 'value1',
        'property2': {
            'property3': 'value3',
            'property4': 'value4',
            'property5': {
                'property6': 'value6',
                'property7': 'value7'
            }
        },
        'property8': 'value8'
    });
});

test(`
Given two single layered objects, with one not having a key that is in the other,
when calling the mergeDeep method,
then returns causes the second object to put the key in the first object.
`, () => {
    // ARRANGE
    const object1 = {
        'name': 'object1'
    }

    const object2 = {
        'name': 'object1',
        'property1': 'value1'
    }

    // ACT
    // Call the mergeDeep method.
    const mergedObject = mergeDeep(object1, object2);

    // ASSERT
    expect(mergedObject).toEqual({
        'name': 'object1',
        'property1': 'value1',
    });
});

test(`
Given two nested objects, with Sets as values in different keys,
when calling the mergeDeep method,
then returns the expected merged object.
`, () => {
    // ARRANGE
    const object1 = {
        'name': 'object1',
        'property1': 'value1',
        'property2': {
            'property3': new Set<string>(['value3', 'value4']),
            'property5': {
                'property6': 'value6',
                'property7': 'value7'
            }
        }
    }

    const object2 = {
        'name': 'object1',
        'property2': {
            'property4': new Set<string>(['value4', 'value5']),
        },
        'property8': 'value8'
    }

    // ACT
    // Call the mergeDeep method.
    const mergedObject = mergeDeep(object1, object2);

    // ASSERT
    expect(mergedObject).toEqual({
        'name': 'object1',
        'property1': 'value1',
        'property2': {
            'property3': new Set<string>(['value3', 'value4']),
            'property4': new Set<string>(['value4', 'value5']),
            'property5': {
                'property6': 'value6',
                'property7': 'value7'
            }
        },
        'property8': 'value8'
    });
});

test(`
Given two nested objects, with Sets as values in the same key,
when calling the mergeDeep method,
then returns the expected merged object.
`, () => {
    // ARRANGE
    const object1 = {
        'name': 'object1',
        'property1': 'value1',
        'property2': {
            'property3': new Set<string>(['value3', 'value4']),
            'property5': {
                'property6': 'value6',
                'property7': 'value7'
            }
        }
    }

    const object2 = {
        'name': 'object1',
        'property2': {
            'property3': new Set<string>(['value4', 'value5']),
        },
        'property8': 'value8'
    }

    // ACT
    // Call the mergeDeep method.
    const mergedObject = mergeDeep(object1, object2);

    // ASSERT
    expect(mergedObject).toEqual({
        'name': 'object1',
        'property1': 'value1',
        'property2': {
            'property3': new Set<string>(['value4', 'value5']),
            'property5': {
                'property6': 'value6',
                'property7': 'value7'
            }
        },
        'property8': 'value8'
    });
});