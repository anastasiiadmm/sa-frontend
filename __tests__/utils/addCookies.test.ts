import '@testing-library/jest-dom';
import {addCookies, deleteCookie, getCookie } from "../../src/utils/addCookies/addCookies";

describe('Cookie Functions', () => {
    afterEach(() => {
        document.cookie = '';
    });

    test('addCookies', () => {
        const name = 'testCookie';
        const value = 'testValue';

        addCookies(name, value);

        expect(document.cookie).toContain(`${name}=${value}`);
    });

    test('deleteCookie', () => {
        const name = 'testCookie';
        const value = 'testValue';

        document.cookie = `${name}=${value}`;

        deleteCookie(name);

        expect(document.cookie).not.toContain(`${name}=${value}`);
    });

    test('getCookie', () => {
        const name = 'testCookie';
        const value = 'testValue';

        document.cookie = `${name}=${value}`;

        const result = getCookie(name);

        expect(result).toBe(value);
    });

    test('getCookie', () => {
        const name = 'testName';

        const result = getCookie(name);

        expect(result).toBeUndefined();
    });
});

