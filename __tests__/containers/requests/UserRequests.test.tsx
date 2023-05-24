import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import "../../../__mocks__/utils";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import UserRequests from "../../../src/containers/Manager/UserRequests/UserRequests";

const data = [
  {
    category: 3,
    created_at: "19/05/2023 18:00:11+0600",
    id: 211,
    object_id: 30,
    requestor: "ОсОО «Фрезениус Медикал Кеа КГЗ»"
  }
];

describe("<UserRequests />", () => {
  test("UserRequests table should render data", async () => {
    mockedUseSelectors.mockReturnValue({
      requests: data,
      requestsPagination: {
        count: 2,
        next: null,
        previous: null
      }
    });
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <UserRequests />
      </BrowserRouter>
    );

  });
});
