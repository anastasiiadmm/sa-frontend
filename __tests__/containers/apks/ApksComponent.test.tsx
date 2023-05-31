import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import ApksList from "../../../src/containers/Manager/ApksList/ApksList";

afterEach(cleanup);

describe("<Technique />", () => {
  test("Technique table component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue({});
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <ApksList />
      </BrowserRouter>
    );

    const ApksListComponent = screen.getByTestId("apks-id");

    await waitFor(() => {
      expect(ApksListComponent).toBeInTheDocument();
    });
  });
});
