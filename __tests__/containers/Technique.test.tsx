import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import "../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../__mocks__/utils";

import Technique from "../../src/containers/User/Technique/Technique";

afterEach(cleanup);

const data = {
  code: "wdRg83n4",
  description: "Трактор поливалка",
  enterprise: 2,
  first_name: "Василий",
  id: 1,
  image: "/media/vehicles/wdRg83n4/2022-04-10_22-00-18__18_.jpeg",
  last_latitude: "0.000000",
  last_longitude: "0.000000",
  last_name: "Соколов",
  middle_name: "Петрович",
  state_number: "01KG123RRR",
  vehicle_fields_data: { field_count: 1, processed_area: 3708.024 },
  vin_code: "FDG445"
};

describe("<Technique />", () => {
  test("Technique table component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <Technique />
      </BrowserRouter>
    );

    const techniqueComponent = screen.getByTestId("technique-id");

    await waitFor(() => {
      expect(techniqueComponent).toBeInTheDocument();
    });
  });

});
