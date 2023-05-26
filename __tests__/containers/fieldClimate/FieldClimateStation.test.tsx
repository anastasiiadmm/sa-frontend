import { BrowserRouter } from "react-router-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { act } from "react-test-renderer";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import ResizeObserver from "resize-observer-polyfill";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import FieldClimateStation from "../../../src/containers/FieldClimate/FieldClimateStation/FieldClimateStation";
import ChartComponent from "../../../src/components/ChartComponent/ChartComponent";
import GridTableComponent from "../../../src/components/GridTableComponent/GridTableComponent";
import SensorsAndNodes from "../../../src/containers/FieldClimate/SensorsAndNodes/SensorsAndNodes";

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

const gridSensorData = [{
  aggr: ["avg"],
  calibration_id: "",
  ch: 0,
  code: 600,
  color: "#ffff99",
  decimals: 0,
  desc: "",
  divider: 1,
  group: 4,
  isActive: true,
  is_user_set: {
    name: false,
    unit: false,
    color: false
  },
  mac: "X",
  multiplier: 1,
  name: "Solar radiation",
  name_custom: "",
  registered: "2023-05-01 03:00:11",
  serial: "X",
  size: "16b",
  unit: "W/m2",
  unit_default: "W/m2",
  units: ["W/m2", "J/m2", "kJ/m2", "MJ/m2"],
  vals: {
    min: 0,
    max: 32767,
  },
  max: 32767,
  min: 0
}];

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

    await act(async () => {
      render(
        <BrowserRouter>
          <FieldClimateStation />
        </BrowserRouter>
      );
    });

    const stationComponent = await screen.getByTestId("station-id");

    expect(stationComponent).toBeInTheDocument();

  });

  test("renders FieldClimateStation component without errors", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ChartComponent data={data} />
        </BrowserRouter>
      );
    });

    const chartComponent = await screen.getByTestId("chart-id");
    expect(chartComponent).toBeInTheDocument();
  });

  test("renders GridTableComponent component without errors", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <GridTableComponent data={gridData} />
        </BrowserRouter>
      );
    });

    const chartComponent = await screen.getByTestId("chart-table-id");
    expect(chartComponent).toBeInTheDocument();
  });

  test("renders SensorsAndNodes component without errors", async () => {
    mockedUseSelectors.mockReturnValue(gridSensorData);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    await act(async () => {
      render(
        <BrowserRouter>
          <SensorsAndNodes />
        </BrowserRouter>
      );
    });

    const SensorsAndNodesComponent = await screen.getByTestId("sensors-table-id");
    expect(SensorsAndNodesComponent).toBeInTheDocument();
  });
});
