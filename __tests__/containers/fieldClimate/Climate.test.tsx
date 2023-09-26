import { BrowserRouter } from "react-router-dom";
import { cleanup } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import { act } from "react-test-renderer";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import FieldClimateDashboard from "../../../src/containers/FieldClimate/FieldClimateDashboard";

afterEach(cleanup);

jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(),
  Marker: jest.fn(),
  Tooltip: jest.fn(),
  Popup: jest.fn(),
  TileLayer: jest.fn()
}));

describe("<FieldClimateDashboard />", () => {
  test("FieldClimateDashboard map component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue({});
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    let tree;
    await act(async () => {
      tree = renderer
        .create(
          <BrowserRouter>
            <FieldClimateDashboard />
          </BrowserRouter>
        )
        .toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});
