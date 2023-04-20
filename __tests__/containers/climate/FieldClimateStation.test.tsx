import { BrowserRouter } from "react-router-dom";
import { cleanup, render, screen } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import ResizeObserver from "resize-observer-polyfill";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import FieldClimateStation from "../../../src/containers/FieldClimate/FieldClimateStation/FieldClimateStation";
import ChartComponent from "../../../src/components/ChartComponent/ChartComponent";
import GridTableComponent from "../../../src/components/GridTableComponent/GridTableComponent";

declare const global;
(global).ResizeObserver = ResizeObserver;

afterEach(cleanup);

const data = [
  {
    name: "Air and Dew Point",
    series: [
      { name: "HC Температура воздуха [°C]", data: [123234234, 3] },
      { name: "Точка росы [°C]", data: [123234234, 4] }
    ]
  },
  {
    name: "Precipitation",
    series: [{ name: "Осадки [mm]", data: [123234234, 7] }]
  },
  {
    name: "Gust",
    series: [{ name: "Порыв ветра [m/s]", data: [123234234, 10] }]
  }
];

const gridData = {
  data: [{
    datetime: "2023-04-18 10:00:00",
    disease_evapotranspiration_ETo: null,
    sensor_0004A3EF6ED6_x_4033_33798_l: 3692,
    sensor_0004A3EF6ED6_x_4036_34625_a: 34.5,
    sensor_0004A3EF6ED6_x_4037_34626_a: 11,
    sensor_0004A3EF6ED6_x_4037_34626_mn: 11
  }, {
    datetime: "2023-04-18 10:00:00",
    disease_evapotranspiration_ETo: null,
    sensor_0004A3EF6ED6_x_4033_33798_l: 3692,
    sensor_0004A3EF6ED6_x_4036_34625_a: 34.5,
    sensor_0004A3EF6ED6_x_4037_34626_a: 11,
    sensor_0004A3EF6ED6_x_4037_34626_mn: 11
  }],
  headers: [{
    field: "datetime",
    headerName: "Дата / время",
    sort: "desc"
  }, {
    children: [
      { headerName: "ср.знач", field: "sensor_x_x_18_506_a", headerTooltip: "Channel: 18 Chain: 1 Code: 506" },
      { headerName: "максимум", field: "sensor_x_x_18_506_mx", headerTooltip: "Channel: 18 Chain: 1 Code: 506" },
      { headerName: "минимум", field: "sensor_x_x_18_506_mn", headerTooltip: "Channel: 18 Chain: 1 Code: 506" }
    ],
    groupId: "sensor_x_x_18_506",
    headerName: "HC Температура воздуха [°C]"
  }]
};

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
      sensorsError: null
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

  test("renders GridTableComponent component without errors", async () => {
    render(
      <BrowserRouter>
        <GridTableComponent data={gridData} />
      </BrowserRouter>
    );

    const chartComponent = await screen.getByTestId("chart-table-id");
    expect(chartComponent).toBeInTheDocument();
  });
});
