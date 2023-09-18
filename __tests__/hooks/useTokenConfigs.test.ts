import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import "@testing-library/jest-dom";
import {useTokenConfigs} from "../../src/hooks/useTokensConfigs";
jest.mock('../../src/redux/store');
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe('useTokenConfigs', () => {
    it('', () => {
        // @ts-ignore
        useSelector.mockImplementation(() => ({
            tokens: {
                access: 'access_token',
                refresh: 'refresh_token',
            },
        }));

        const { result } = renderHook(() => useTokenConfigs());

        expect(result.current).toBe("refresh_token");
    });

    it('', () => {
        // @ts-ignore
        useSelector.mockImplementation(() => ({
            tokens: {
                access: null,
                refresh: 'refresh_token',
            },
        }));

        const { result } = renderHook(() => useTokenConfigs());

        expect(result.current).toBe(null);
    });
});
