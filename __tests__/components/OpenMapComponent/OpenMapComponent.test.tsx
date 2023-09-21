import "@testing-library/jest-dom";
import {mockedDispatch, mockedUseSelectors} from "../../../__mocks__/utils";
import {screen, render, cleanup} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import * as TestRenderer from 'react-test-renderer';
import "../../../__mocks__/matchMedia.mock";
import OpenMapComponent from "../../../src/components/OpenMapComponent/OpenMapComponent";
import TechniqueMap from "../../../src/containers/TechniqueMap/TechniqueMap";

afterEach(cleanup);

jest.mock('react-leaflet', () => ({
  CircleMarker: jest.fn(),
  MapContainer: jest.fn(),
  Marker: jest.fn(),
  Polyline: jest.fn(),
  Popup: jest.fn(),
  TileLayer: jest.fn()
}));

const WebSocketMock: jest.Mock = jest.fn(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
}));

globalThis.WebSocket = WebSocketMock as any;

const mapErrors = {
  vehicle: {
    results: {
      processing_data: []
    }
  },
  field: {
    results: [],
    errors: {
      detail: 'Ошибка на сервере'
    }
  }
}

const mapLoading = {
  vehicle: {
    results: {
      processing_data: []
    },
    loading: true
  },
  field: {
    results: [],
    errors: null
  }
}

const mapRender = {
  vehicle: {
    results: {
      "id": 60,
      "image": "/media/vehicles/default.jpg",
      "processing_data": [
        {
          "field_name": "Unistrong_ST6E21300000413_20210101080037_Sn21414347",
          "work_area": 1213.006,
          "id": 1,
          "attachments": {
            "Mode": "AB",
            "toolsWidth": "12",
            "toolsName": "Борона 24 метра",
            "skipOverlap": "-0.3",
            "toolsWidthResult": "11.7",
            "frontBack": "-2.5",
            "leftRight": "0.0"
          }
        }
      ],
      "vin_code": "tech-58",
      "code": "wdRg83n4",
      "state_number": "tech-58",
      "description": "tech-5123123",
      "first_name": "tech-58",
      "middle_name": "tech-58",
      "last_name": "tech-58",
      "last_latitude": "42.857614",
      "last_longitude": "74.599974",
      "enterprise": 1
    },
    loading: false
  },
  field: {
    results: [
      {
        "PointA": "42.858595,74.599831",
        "PointB": "42.857191,74.599775"
      },
      {
        "PointA": "42.857191,74.599775",
        "PointB": "42.857250,74.598730"
      },
      {
        "PointA": "42.857250,74.598730",
        "PointB": "42.857673,74.598749"
      }
    ],
    errors: null
  }
}

describe('OpenMapComponents', () => {
  test('errors',  () => {
    mockedUseSelectors.mockReturnValue(mapErrors);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <OpenMapComponent />
      </BrowserRouter>
    );
    const errorsText = screen.queryByText('Ошибка на сервере');
    expect(errorsText).toBeInTheDocument();
  })

  test('loading',  () => {
    mockedUseSelectors.mockReturnValue(mapLoading);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <OpenMapComponent />
      </BrowserRouter>
    );
    const loading = screen.queryByTestId('loading');
    expect(loading).toBeInTheDocument()
  })

  test('render', async () => {
    mockedUseSelectors.mockReturnValue(mapRender);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const tree = TestRenderer
      .create(
        <BrowserRouter>
          <OpenMapComponent />
        </BrowserRouter>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  })

  test('render technique map success', async () => {
    mockedUseSelectors.mockReturnValue(mapRender);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const tree = TestRenderer
      .create(
        <BrowserRouter>
          <TechniqueMap />
        </BrowserRouter>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  })
})
