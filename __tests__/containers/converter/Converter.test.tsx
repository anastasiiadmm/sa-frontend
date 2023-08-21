import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor, cleanup, fireEvent } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import Users from "../../../src/containers/Manager/Users/Users";
import Converter from "../../../src/containers/Converter/Converter";

afterEach(cleanup);

const data = [
  {
    id: 91,
    created_at: '21/08/2023 16:11:30+0600',
    task_UID: 'taskUID_1692612690.2575638',
    file: '/media/files/converter/taskUID_1692612690.2575638.txt'
  },
  {
    id: 92,
    created_at: '26/08/2023 19:11:30+0600',
    task_UID: 'taskUID_1692612690.2575635',
    file: '/media/files/converter/taskUID_1692612690.2575635.txt'
  }
];

describe("<Converter />", () => {
  test("Converter list component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <Converter />
      </BrowserRouter>
    );

    const converterListComponent = screen.getByTestId("converter-test-id");

    await waitFor(() => {
      expect(converterListComponent).toBeInTheDocument();
    });
  });

  test("render component toMatchSnapshot()", async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const utils = render(
      <BrowserRouter>
        <Converter />
      </BrowserRouter>
    );

    expect(utils).toMatchSnapshot();
  });
});
