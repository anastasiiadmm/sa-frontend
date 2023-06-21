import '@testing-library/jest-dom';
import toQueryParams from "../../src/utils/toQueryParams";

describe('toQueryParams', () => {
    test('toQueryParams page', () => {
        const obj = {
            page: 2,
            limit: 10,
            sort: 'asc',
        };

        const result = toQueryParams(obj);

        expect(result).toBe('?page=2&limit=10&sort=asc');
    });

    test('toQueryParams null Object', () => {
        const obj = {};

        const result = toQueryParams(obj);

        expect(result).toBe('?');
    });

});