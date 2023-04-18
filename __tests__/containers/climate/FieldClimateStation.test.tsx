import { BrowserRouter } from "react-router-dom";
import { cleanup, render, screen } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import ResizeObserver from 'resize-observer-polyfill';
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import FieldClimateStation from "../../../src/containers/FieldClimate/FieldClimateStation/FieldClimateStation";
import ChartComponent from "../../../src/components/ChartComponent/ChartComponent";
declare const global;
(global).ResizeObserver = ResizeObserver;

afterEach(cleanup);

const data = [
  {
    name: 'Air and Dew Point',
    series: [
      { name: 'HC Температура воздуха [°C]', data: [123234234, 3] },
      { name: 'Точка росы [°C]', data: [123234234, 4] },
    ],
  },
  {
    name: 'Precipitation',
    series: [{ name: 'Осадки [mm]', data: [123234234, 7] }],
  },
  {
    name: 'Gust',
    series: [{ name: 'Порыв ветра [m/s]', data: [123234234, 10] }],
  },
];

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

  test("renders FieldClimateStation component without errors", async () => {
    render(
      <BrowserRouter>
        <ChartComponent data={data} />
      </BrowserRouter>
    );

    const chartComponent = await screen.getByTestId("chart-id");
    expect(chartComponent).toBeInTheDocument();
  });
});
