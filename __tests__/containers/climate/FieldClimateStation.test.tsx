import { BrowserRouter } from "react-router-dom";
import { cleanup, render, screen } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import ResizeObserver from 'resize-observer-polyfill';
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import FieldClimateStation from "../../../src/containers/FieldClimate/FieldClimateStation/FieldClimateStation";
declare const global: any;
(global as any).ResizeObserver = ResizeObserver;

afterEach(cleanup);

describe("<FieldClimateStation />", () => {
  test("renders FieldClimateStation component without errors", async () => {
    mockedUseSelectors.mockReturnValue({
      user: [],
      isLoading: false,
      error: null,

      weather: null,
      isWeatherLoading: false,
      isWeatherError: null,

      stations: [],
      stationsLoading: false,
      stationsError: null,

      stationInfo: null,
      stationInfoLoading: false,
      stationInfoError: null,

      sensors: [],
      sensorsLoading: false,
      sensorsError: null,
    });
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <FieldClimateStation />
      </BrowserRouter>
    );

    const stationComponent = await screen.getByTestId("station-id");

    expect(stationComponent).toBeInTheDocument();

  });
});
