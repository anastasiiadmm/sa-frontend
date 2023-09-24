import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import "@testing-library/jest-dom";
import {useTokenConfigs} from "../../src/hooks/useTokensConfigs";
import store from '../../src/redux/store';
import { Provider } from "react-redux";
import React, { ReactNode } from "react";
jest.mock('../../src/redux/store');
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

afterEach(() => {
    jest.clearAllMocks();
});

interface WrapperProps {
    children: ReactNode;
}

const wrapper: React.FC<WrapperProps> = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('useTokenConfigs', () => {
    it('', () => {
        (useSelector as jest.Mock).mockImplementation(() => ({
            tokens: {
                access: 'access_token',
                refresh: 'refresh_token',
            },
        }));

        const { result } = renderHook(() => useTokenConfigs(), { wrapper });

        expect(result.current).toBe("refresh_token");
    });

    it('', () => {
        (useSelector as jest.Mock).mockImplementation(() => ({
            tokens: {
                access: null,
                refresh: 'refresh_token',
            },
        }));

        const { result } = renderHook(() => useTokenConfigs());

        expect(result.current).toBe(null);
    });
});
