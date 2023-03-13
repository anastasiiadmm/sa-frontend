import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import Technique from "../../../src/containers/User/Technique/Technique";

afterEach(cleanup);

const data = {
  autopilots_amount: 2,
  id: 1,
  location: "Бишкек",
  name: "ОсОО ОДА \"Дордой-Секьюрити\"",
  user:
    {
      email: "borsh130894@gmail.com",
      first_name: "Александр",
      id: 3,
      last_name: "Борщевский",
      middle_name: "Сергеевич",
      password: "pbkdf2_sha",
      phone: "+996555130894",
      username: "aleksandr"
    }
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
