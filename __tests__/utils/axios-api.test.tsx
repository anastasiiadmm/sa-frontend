import '@testing-library/jest-dom';

import axiosApi from "../../src/utils/axios-api";
import MockAdapter from 'axios-mock-adapter';

import store from "../../src/redux/store";
import {addLocalStorage} from "../../src/utils/addLocalStorage/addLocalStorage";
import {checkForTokens} from "../../src/redux/auth/authSlice";
jest.mock('../../src/redux/store');
jest.mock('../../src/redux/auth/authSlice');
jest.mock('../../src/utils/addCookies/addCookies', () => ({
    deleteCookie: jest.fn(),
}));
jest.mock('../../src/utils/addLocalStorage/addLocalStorage', () => ({
    addLocalStorage: jest.fn(),
    logoutLocalStorage: jest.fn(),
}));

describe('Axios Interceptors', () => {
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = new MockAdapter(axiosApi);
        (store.getState as jest.Mock).mockReturnValue({
            auth: {
                tokens: {
                    access: 'access token',
                    is_manager: false,
                },
                user: {},
            },
        });
        window.dispatchEvent = jest.fn();
    });

    afterEach(() => {
        mockAxios.restore();
    });

    test('', async () => {
        const requestPayload:any = { test: 'test' };
        mockAxios.onGet('/test').reply((config:any) => {
            expect(config.headers.Authorization).toBe('Bearer access token');
            return [200, { message: 'success' }] as [number, any];
        });
        await axiosApi.get('/test', requestPayload);
    });

    test('', async () => {
        mockAxios.onGet('/test').reply(401, { messages: ['Token expired'] });
        mockAxios.onPost('/accounts/refresh/').reply(200, { access: 'new access token' });

        await axiosApi.get('/test').catch((error: any) => {
            expect(error.response.status).toBe(401);
        });

        expect(store.dispatch).toHaveBeenCalledWith(checkForTokens({ access: 'new access token' }));
        expect(addLocalStorage).toHaveBeenCalledWith({ access: 'new access token', is_manager: false });
        expect(window.dispatchEvent).toHaveBeenCalledWith(new Event('storage'));
    });
});

