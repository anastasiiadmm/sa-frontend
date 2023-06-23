import { BrowserRouter } from "react-router-dom";
import {cleanup } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import renderer from "react-test-renderer";
import ProfileTechnique from "../../../src/containers/Technique/ProfileTechnique/ProfileTechnique";

afterEach(cleanup);

const data = {
    userVehicles: [
        {
            "id": 88,
            "readable_id": {
                "type": {},
                "key": null,
                "ref": null,
                "props": {
                    "title": "FieldThree",
                    "color": "#BBBBBB",
                    "overlayInnerStyle": {
                        "padding": "5px 15px",
                        "borderRadius": 15
                    },
                    "placement": "topRight",
                    "children": {
                        "type": "p",
                        "key": null,
                        "ref": null,
                        "props": {
                            "className": "text_hidden",
                            "children": "FieldThree"
                        },
                        "_owner": null,
                        "_store": {}
                    }
                },
                "_owner": null,
                "_store": {}
            },
            "tool": "None",
            "tool_width": "0",
            "tool_overlap": "0",
            "tool_width_total": "0",
            "left_right": "0.0",
            "area": "527.006"
        },
    ],
    userVehicleInfo: {
        results: [
            {
                "id": 88,
                "readable_id": "FieldThree",
                "tool": "None",
                "tool_width": "0",
                "tool_overlap": "0",
                "tool_width_total": "0",
                "left_right": "0.0",
                "area": "527.006"
            },
            {
                "id": 86,
                "readable_id": "send by almaz",
                "tool": "Борона 24 метра",
                "tool_width": "12",
                "tool_overlap": "-0.3",
                "tool_width_total": "11.7",
                "left_right": "0.0",
                "area": "927.006"
            }
        ],
        vehicle: {
            image: 'test/photos'
        }
    }
};


describe("<ProfileTechnique />", () => {
    test("Users table component should be in the document", async () => {
        mockedUseSelectors.mockReturnValue(data);
        const dispatch = jest.fn();
        mockedDispatch.mockReturnValue(dispatch);

        const tree = renderer
            .create(
                <BrowserRouter>
                    <ProfileTechnique />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
