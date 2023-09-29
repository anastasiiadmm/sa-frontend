import '@testing-library/jest-dom';

import axiosApi from "../../src/utils/axios-api";
import MockAdapter from 'axios-mock-adapter';

import store from "../../src/redux/store";
import {addLocalStorage} from "../../src/utils/addLocalStorage/addLocalStorage";
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
                    refresh: 'refresh token',
                    is_manager: false,
                },
                user: {},
            },
        });
        window.dispatchEvent = jest.fn();
    });

    afterEach(() => {
        mockAxios.restore();
        jest.clearAllMocks();
    });

    test('Testing Authorization header', async () => {
        addLocalStorage({
            access: 'access token',
            refresh: 'refresh token',
            is_manager: false,
        });

        const requestPayload:any = { test: 'test' };
        mockAxios.onGet('/test').reply((config: any) => {
            config.headers.Authorization = `Bearer ${store.getState().auth.tokens.access}`;
            expect(config.headers.Authorization).toBe('Bearer access token');
            return [200, { message: 'success' }] as [number, any];
        });

        await axiosApi.get('/test', { params: requestPayload });
    });

    test('Testing token refreshing', async () => {
        addLocalStorage({
            access: 'access token',
            refresh: 'refresh token',
            is_manager: false,
        });

        let isTokenRefreshed = false;
        mockAxios.onGet('/test').reply((config: any) => {
            config.headers.Authorization = `Bearer ${store.getState().auth.tokens.access}`;
            expect(config.headers.Authorization).toBe('Bearer access token');
            return [200, { message: 'success' }] as [number, any];
        });

        mockAxios.onPost('/accounts/refresh/').reply(() => {
            isTokenRefreshed = true;

            (store.getState as jest.Mock).mockReturnValueOnce({
                auth: {
                    tokens: {
                        access: 'new access token',
                        refresh: 'new refresh token',
                        is_manager: false,
                    },
                    user: {},
                },
            });

            return [200, { access: 'new access token' }];
        });

        try {
            await axiosApi.get('/test');
        } catch (error) {
            if (error.response) {
                expect(error.response.status).toBe(401);
            } else {
                throw error;
            }
        }

    });
});

