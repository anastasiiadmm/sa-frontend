import { BrowserRouter } from "react-router-dom";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import Converter from "../../../src/containers/Converter/Converter";
import DeleteModal from "../../../src/components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal";

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
  let handleDeleteCancel: jest.Mock;
  let deleteUserHandler: jest.Mock;

  beforeEach(() => {
    handleDeleteCancel = jest.fn();
    deleteUserHandler = jest.fn();
  });

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

  test("Converted file should set to modal form success", async () => {
    const { getByText } = render(
      <DeleteModal
        fullName='21/08/2023 16:11:30+0600'
        handleDeleteCancel={handleDeleteCancel}
        deleteButtonHandler={deleteUserHandler}
        loading={false}
      />
    );

    fireEvent.click(getByText('Удалить'));
    await waitFor(() => expect(deleteUserHandler).toHaveBeenCalledTimes(1));
  });
});
