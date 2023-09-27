import { BrowserRouter } from "react-router-dom";
import {cleanup, render} from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import Technique from "../../../src/containers/User/Technique/Technique";

afterEach(cleanup);

const data = {
    userVehicles: [
        {
            "id": 94,
            "code": "P4L7SG518",
            "description": "adasdasd213123",
            "jobs_number": 0,
            "area": "0",
            "image": "/media/files/inquiries/219/.jpeg"
        },
    ]
};


describe("<Technique />", () => {
    test("Users table component should be in the document",  () => {
        mockedUseSelectors.mockReturnValue(data);
        const dispatch = jest.fn();
        mockedDispatch.mockReturnValue(dispatch);

        const { asFragment } = render(
                <BrowserRouter>
                    <Technique />
                </BrowserRouter>
            );

        expect(asFragment).toMatchSnapshot();
    });
});
