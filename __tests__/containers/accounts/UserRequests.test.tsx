import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import UserRequests from "../../../src/containers/Manager/UserRequests/UserRequests";

afterEach(cleanup);

const data = {
  id: 1,
  created_at: "10-03-2023 16:16",
  confirmation_type: 1,
  inquiry_id: 33,
  enterprise: 2,
  confirmation_type_text: "Регистрация нового профиля",
  enterprise_name: "ОсОО Huawei Technologies Bishkek Co.Ltd",
};

describe("<UserRequests />", () => {
  test("Requests table component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <UserRequests />
      </BrowserRouter>
    );

    const requestsComponent = screen.getByTestId("requests-id");

    await waitFor(() => {
      expect(requestsComponent).toBeInTheDocument();
      expect(screen.getByText('Дата запроса')).toBeInTheDocument();
      expect(screen.getByText('Тип запроса')).toBeInTheDocument();
      expect(screen.getByText('Название компании')).toBeInTheDocument();
    });
  });
});
