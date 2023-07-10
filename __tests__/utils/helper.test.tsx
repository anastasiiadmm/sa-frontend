import '@testing-library/jest-dom';

import {
    appendDataFields,
    calculateDateRange,
    checkTooltipVisibility, deleteEmptyQueryStrings,
    getErrorMessage, getPageNumber, getPageNumberPrevious, getPageParam, isEmptyObject,
    isObjectChangeValidate,
    mergeAndRemoveDuplicateValues,
    removeEmptyValuesFromObject, updateDataNames
} from "../../src/utils/helper";
import moment from "moment";
import {SensorDataEntry} from "../../src/interfaces";

describe('helper.ts', () => {
    it('removeEmptyValuesFromObject', () => {
        const testObject: IndexableObject = {
            name: "John Doe",
            age: 30,
            address: {
                street: "",
                city: "New York",
                country: null,
            },
            hobbies: ["reading", "", "swimming"],
            isActive: true,
        };

        const cleanedObject = removeEmptyValuesFromObject(testObject);
        type IndexableObject = {
            [key: string]: unknown;
        };

        const expectedObject: IndexableObject = {
            name: "John Doe",
            age: 30,
            address: {
                city: "New York",
                country: {},
            },
            hobbies: {
                "0": "reading", "2": "swimming"
            },

            isActive: true,
        };

        expect(cleanedObject).toEqual(expectedObject);
    });

    it('isObjectChangeValidate', () => {
        const origin = {
            username: 'john_doe',
            password: 'password123',
            first_name: 'John',
            middle_name: 'D',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
        };

        const update = {
            username: 'john_doe',
            password: 'password123',
            first_name: 'John',
            middle_name: 'D',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
        };

        const result = isObjectChangeValidate(origin, update);

        expect(result).toBe(true);
    });

    it('isObjectChangeValidate', () => {
        const origin = {
            username: 'john_doe',
            password: 'password123',
            first_name: 'John',
            middle_name: 'D',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
        };

        const update = {
            username: 'john_doe',
            password: 'newpassword',
            first_name: 'John',
            middle_name: 'D',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
        };

        const result = isObjectChangeValidate(origin, update);

        expect(result).toBe(false);
    });
});

describe('getErrorMessage', () => {
    it('', () => {
        const errors = {
            username: 'Username is required',
            password: ['Password is too short', 'Password must contain at least one uppercase letter'],
            email: {
                required: 'Email is required',
                format: 'Invalid email format',
            },
        };

        const key = 'password';
        const errorMessage = getErrorMessage(errors, key);

        expect(errorMessage).toBe('Password is too short');
    });

    it('', () => {

        const key = 'phone';
        const errorMessage = getErrorMessage({}, key);

        expect(errorMessage).toBe('');
    });
});


describe('mergeAndRemoveDuplicateValues', () => {
    it('', () => {
        const obj1 = {
            name: 'John Doe',
            age: 30,
            address: {
                city: 'New York',
                country: 'USA',
            },
            hobbies: ['reading', 'swimming'],
        };

        const obj2 = {
            age: 35,
            address: {
                city: 'Chicago',
            },
            hobbies: ['swimming', 'jogging'],
            isActive: true,
        };

        const mergedObject = mergeAndRemoveDuplicateValues(obj1, obj2);

        const expectedObject =  {
            age: 35,
            address: { city: 'Chicago' },
            hobbies: { '0': 'swimming', '1': 'jogging' },
            isActive: true
        }

        expect(mergedObject).toEqual(expectedObject);
    });
});

describe('checkTooltipVisibility', () => {
    it('', () => {
        const selectedOption = 'airTemp';
        const marker = {
            meta: {
                airTemp: 25,
                humidity: 50,
                battery: 80,
            },
        };

        const isVisible = checkTooltipVisibility(selectedOption, marker);

        expect(isVisible).toBe(true);
    });

    it('', () => {
        const selectedOption = 'rain24h';
        const marker = {
            meta: {
                airTemp: 25,
                humidity: 50,
                battery: 80,
            },
        };

        const isVisible = checkTooltipVisibility(selectedOption, marker);

        expect(isVisible).toBe(false);
    });

    it('', () => {
        const selectedOption = 'soilTemp';
        const marker = {
            meta: null,
        };

        const isVisible = checkTooltipVisibility(selectedOption, marker);

        expect(isVisible).toBe(false);
    });

    it('', () => {
        const selectedOption = 'unknownOption';
        const marker = {
            meta: {
                airTemp: 25,
                humidity: 50,
                battery: 80,
            },
        };

        const isVisible = checkTooltipVisibility(selectedOption, marker);

        expect(isVisible).toBe(false);
    });
});

describe('calculateDateRange', () => {
    const sensorData:any = {
        dates: {
            max_date: '2023-07-05T12:00:00Z',
        },
    };

    it('', () => {
        const value = '24_hours';
        const expectedFromDate = moment('2023-07-04T12:00:00Z').valueOf();
        const expectedToDate = moment('2023-07-05T12:00:00Z').valueOf();

        const { fromDate, toDate } = calculateDateRange(value, sensorData);

        expect(fromDate).toBe(expectedFromDate);
        expect(toDate).toBe(expectedToDate);
    });

    it('', () => {
        const value = '7_days';
        const expectedFromDate = moment('2023-06-28T12:00:00Z').valueOf();
        const expectedToDate = moment('2023-07-05T12:00:00Z').valueOf();

        const { fromDate, toDate } = calculateDateRange(value, sensorData);

        expect(fromDate).toBe(expectedFromDate);
        expect(toDate).toBe(expectedToDate);
    });

    it('', () => {
        const value = 'unknown_value';

        const { fromDate, toDate } = calculateDateRange(value, sensorData);

        expect(fromDate).toBeNull();
        expect(toDate).toBeNull();
    });

    it('', () => {
        const value:any = null;
        const nullSensorData = null;

        const { fromDate, toDate } = calculateDateRange(value, nullSensorData);

        expect(fromDate).toBeNull();
        expect(toDate).toBeNull();
    });
});

describe('getPageNumber', () => {
    it('', () => {
        expect(getPageNumber('https://example.com/?page=5')).toBe(4);
    });

    it('', () => {
        expect(getPageNumber('https://example.com/')).toBe(0);
    });

    it('', () => {
        expect(getPageNumber(undefined)).toBe(1);
    });

    it('', () => {
        expect(getPageNumber(null)).toBe(1);
    });
});

describe('getPageNumberPrevious', () => {
    it('', () => {
        expect(getPageNumberPrevious('https://example.com/?page=5')).toBe(6);
    });

    it('', () => {
        expect(getPageNumberPrevious('https://example.com/')).toBe(2);
    });

    it('', () => {
        expect(getPageNumberPrevious(undefined)).toBe(1);
    });

    it('', () => {
        expect(getPageNumberPrevious(null)).toBe(1);
    });
});


describe('updateDataNames', () => {
    const data:any = [{ name: 'sensor1' }, { name: 'sensor2' }];
    const jsonData = { sensor1: 'Sensor 1', sensor2: 'Sensor 2' };

    it('', () => {
        const updatedData = updateDataNames(data, jsonData);
        expect(updatedData).toEqual([{ name: 'Sensor 1' }, { name: 'Sensor 2' }]);
    });

    it('', () => {
        let updatedData: ({ code: number; color: string; ch: number; vals: { max: number; min: number }; multiplier: string; registered: string; units: string[]; isActive: boolean; type: string; mac: string; is_user_set: { color: boolean; name: boolean; unit: boolean }; unit: string; size: string; divider: number; serial: string; decimals: number; name: string; aggr: string[]; name_custom: string; unit_default: string; desc: string; group: number } | SensorDataEntry)[];
        updatedData = updateDataNames(data, {});
        expect(updatedData).toEqual(data);
    });
});

describe('getPageParam', () => {
    it('', () => {
        expect(getPageParam('https://example.com/?page=5')).toBe('5');
    });

    it('undefined', () => {
        expect(getPageParam(undefined)).toBe('');
    });

    it('if url is null', () => {
        expect(getPageParam(null)).toBe('');
    });
});

describe('isEmptyObject', () => {
    it('', () => {
        expect(isEmptyObject({})).toBe(true);
    });

    it('', () => {
        expect(isEmptyObject({ test: 'test' })).toBe(false);
    });
});

describe('appendDataFields', () => {
    it('', () => {
        const formData = new FormData();
        const data:any = { key1: 'value1', key2: 'value2' };
        appendDataFields(formData, data);
        for (const key in data) {
            expect(formData.get(key)).toEqual(data[key]);
        }
    });

    it('', () => {
        const formData = new FormData();
        const data = { key1: 'value1', key2: { key3: 'value3' } };
        appendDataFields(formData, data);
        expect(formData.get('key1')).toEqual('value1');
        expect(formData.get('key2.key3')).toEqual('value3');
    });
});

describe('deleteEmptyQueryStrings', () => {
    it('', () => {
        const params:any = {
            key1: 'value1',
            key2: '',
            key3: null,
            key4: undefined,
            key5: 'value5',
        };

        const result = deleteEmptyQueryStrings(params);

        expect(result).toEqual({
            key1: 'value1',
            key5: 'value5',
        });
    });
});