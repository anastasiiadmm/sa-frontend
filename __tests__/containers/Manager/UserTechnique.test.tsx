import { BrowserRouter } from "react-router-dom";
import { cleanup } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import UserTechnique from "../../../src/containers/Manager/Users/UserTechnique/UserTechnique";

afterEach(cleanup);

const data = {
    vehicleList: [
        {
            "id": 91,
            "code": "D8BN8TR61",
            "description": "fbd",
            "jobs_number": 1,
            "area": "927.006",
            "image": "/api/static/default_vehicle_image.jpg"
        }
    ]
};


describe("<UserTechnique />", () => {
    test("Users table component should be in the document", async () => {
        mockedUseSelectors.mockReturnValue(data);
        const dispatch = jest.fn();
        mockedDispatch.mockReturnValue(dispatch);

        const { asFragment } = render(
          <BrowserRouter>
              <UserTechnique />
          </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
