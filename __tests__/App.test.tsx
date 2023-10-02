import {cleanup, render, screen} from '@testing-library/react';
import "@testing-library/jest-dom";
import '../__mocks__/matchMedia.mock'
import { mockedDispatch, mockedUseSelectors } from "../__mocks__/utils";

import {BrowserRouter} from 'react-router-dom';
import App from '../src/App';
import {act} from "react-test-renderer";

afterEach(cleanup);

jest.mock('react-leaflet', () => ({
    CircleMarker: () => null,
    MapContainer: () => null,
    Marker: () => null,
    Polyline: () => null,
    Popup: () => null,
    TileLayer: () => null,
}));

describe('App',  () => {

    test('App', async () => {
        mockedUseSelectors.mockReturnValue({
            tokenConfigs: true
        });
        const dispatch = jest.fn();
        mockedDispatch.mockReturnValue(dispatch);

        const { asFragment } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(asFragment).toMatchSnapshot();

        await act(async () => {});
    });


    test('renders App component', async () => {
        render(
            <BrowserRouter basename='/'>
                <App />
            </BrowserRouter>
        );
        expect(screen.getByTestId('sign-in')).toBeInTheDocument();
        await act(async () => {});
    });

})
