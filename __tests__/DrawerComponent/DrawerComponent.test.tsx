import { BrowserRouter } from "react-router-dom";
import { screen, render, cleanup, waitFor } from "@testing-library/react";
import "../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch } from "../../__mocks__/utils";
import DrawerComponent from "../../src/components/DrawerComponent/DrawerComponent";

afterEach(cleanup);

describe("<DrawerComponent />", () => {
  test('DrawerComponent should open success', async () => {
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const props = {
      onClose: jest.fn(),
      open: true,
    };

    render(
      <BrowserRouter>
        <DrawerComponent {...props} />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Название техники');
    const stateNumberInput = screen.getByLabelText('Гос номер');
    const vinCodeInput = screen.getByLabelText('VIN код');
    const lastNameInput = screen.getByLabelText('Фамилия');
    const firstNameInput = screen.getByLabelText('Имя');
    const middleNameInput = screen.getByLabelText('Отчество');
    const button = screen.getByRole('button', { name: /Посмотреть полностью/i });

    await waitFor(() => {
      expect(nameInput).toBeInTheDocument();
      expect(stateNumberInput).toBeInTheDocument();
      expect(vinCodeInput).toBeInTheDocument();
      expect(lastNameInput).toBeInTheDocument();
      expect(firstNameInput).toBeInTheDocument();
      expect(middleNameInput).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });
});
