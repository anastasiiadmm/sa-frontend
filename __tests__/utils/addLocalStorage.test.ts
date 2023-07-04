import '@testing-library/jest-dom';
import {
    addLocalStorage,
    logoutLocalStorage,
    nameLocalStorage,
    userLocalStorage
} from "../../src/utils/addLocalStorage/addLocalStorage";
import {deleteCookie, nameRefreshCookies} from "../../src/utils/addCookies/addCookies";

jest.mock('utils/addCookies/addCookies', () => ({
    deleteCookie: jest.fn(),
}));

describe('Local Storage Functions', () => {
    let mockStorage: { [key: string]: string };

    beforeEach(() => {
        mockStorage = {};
        localStorage = {
            setItem: (key:string, value:string) => {
                mockStorage[key] = value;
            },
            getItem: (key: string) => mockStorage[key],
            removeItem: (key:string) => {
                delete mockStorage[key];
            },
            clear: () => {
                mockStorage = {};
            },
        } as any;
    });

    it('should add item to local storage', () => {
        const login = { access: 'erferre', is_manager: false}
        addLocalStorage(login);
        expect(localStorage.getItem(nameLocalStorage)).toEqual(JSON.stringify(login));
    });

    it('should get item from local storage', () => {
        const token = { user: 'test', token: 'token', refresh: '' };
        localStorage.setItem(nameLocalStorage, JSON.stringify(token));
        const result = userLocalStorage();
        expect(result).toEqual(token);
    });

    it('should clear item in local storage and delete cookie on logout', () => {
        logoutLocalStorage();
        expect(localStorage.getItem(nameLocalStorage)).toEqual(JSON.stringify({ user: null, token: null }));
        expect(deleteCookie).toHaveBeenCalledWith(nameRefreshCookies);
    });

    it('should handle errors and perform logout when getting local storage fails', () => {
        localStorage.setItem(nameLocalStorage, 'invalid');
        const result = userLocalStorage();
        expect(result).toBeNull();
        expect(deleteCookie).toHaveBeenCalledWith(nameRefreshCookies);
        expect(localStorage.getItem(nameLocalStorage)).toEqual(JSON.stringify({ user: null, token: null }));
    });
});
