import {render, screen, waitFor} from '@testing-library/react';
import "@testing-library/jest-dom";
import '../../__mocks__/matchMedia.mock';
import {MemoryRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import store  from '../../src/redux/store';
import AppRouter from '../../src/AppRouter/AppRouter';
import {act} from "react-test-renderer";
import { Suspense } from 'react';
import {cleanup } from "@testing-library/react";

afterEach(cleanup);
jest.mock('react-leaflet', () => ({
    CircleMarker: () => null,
    MapContainer: () => null,
    Marker: () => null,
    Polyline: () => null,
    Popup: () => null,
    TileLayer: () => null,
}));

describe('AppRouter',  () => {
    test('main render',   async () => {
       await act(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/']}>
                        <AppRouter />
                    </MemoryRouter>
                </Provider>
            );
        })

        await waitFor(() => {
            expect(screen.getByTestId('technique-id')).toBeInTheDocument();
        })
    });

    test('/menu-mobile', async () => {
        let container;
        await act(async () => {
            container = render(
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/menu-mobile']}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <AppRouter />
                        </Suspense>
                    </MemoryRouter>
                </Provider>
            ).container;
        });
       expect(screen.getByTestId('mobile')).toBeInTheDocument();
    });

    test('/profile-technique/33', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/profile-technique/11']}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AppRouter />
                    </Suspense>
                </MemoryRouter>
            </Provider>
        );

        const data = screen.getByTestId('profile-technique-id');
        expect(data).toBeInTheDocument();
        await act(async () => {});
    });

    test('/converter', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/converter']}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AppRouter />
                    </Suspense>
                </MemoryRouter>
            </Provider>
        );

        const data = screen.getByTestId('converter-test-id');
        expect(data).toBeInTheDocument();
        await act(async () => {});
    });

    test('/files', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/files']}>
                        <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        const data = screen.getByTestId('files-add');
        expect(data).toBeInTheDocument();
        await act(async () => {});
    });

    test('/converter-list', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/converter-list']}>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        const data = screen.getByTestId('converter-list');
        expect(data).toBeInTheDocument();
        await act(async () => {});
    });

    test('app-router', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/app-router']}>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        const data = screen.getByTestId('app-router');
        expect(data).toBeInTheDocument();
        await act(async () => {});
    });

    test('/user-profile-view', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/user-profile-view']}>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        const data = screen.getByTestId('user-profile-id');
        expect(data).toBeInTheDocument();
        await act(async () => {});
    });

    test('/not-found', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/not-found']}>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        const data = screen.queryByText('Страница не найдена');
        expect(data).toBeInTheDocument();
        await act(async () => {});
    });
})
