import { BrowserRouter } from "react-router-dom";
import renderer, { act } from "react-test-renderer";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import '../../../__mocks__/matchMedia.mock';
import '@testing-library/jest-dom';
import '../../../__mocks__/utils';
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import * as actions from '../../../src/redux/auth/authSlice';
import SignIn from "../../../src/containers/SignIn/SignIn";
import ModalComponent from "../../../src/components/ModalComponent/ModalComponent";
import ModalPasswordReset
  from "../../../src/components/ModalComponent/ModalChildrenComponents/ModalPasswordReset/ModalPasswordReset";
import RequestRegisterModal
  from "../../../src/components/ModalComponent/ModalChildrenComponents/RequestRegisterModal/RequestRegisterModal";

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    error: jest.fn(),
  },
}));

describe('<SignIn />', () => {
  test('Render component toMatchSnapshot()', () => {
    mockedUseSelectors.mockReturnValue([]);

    const tree = renderer
      .create(
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("Opening a modal and closing it", () => {
    const handleClose = jest.fn();
    const yesDeleteHandler = jest.fn();

    act(() => {
      render(
        <ModalComponent open title='Восстановление пароля' handleOk={yesDeleteHandler} handleCancel={handleClose}>
          <ModalPasswordReset />
        </ModalComponent>
      );
    });
  });

  it("Opening register modal and closing", () => {
    const handleClose = jest.fn();
    const yesDeleteHandler = jest.fn();

    act(() => {
      render(
        <ModalComponent open title='Отправить запрос на регистрацию' handleOk={yesDeleteHandler} handleCancel={handleClose}>
          <RequestRegisterModal onClose={handleClose} />
        </ModalComponent>
      );
    });
  });

  test('Login form should be in the document', async () => {
    mockedUseSelectors.mockReturnValue([]);

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const email = screen.getByPlaceholderText('Логин') as HTMLInputElement;
    await waitFor(() => {
      expect(email).toBeInTheDocument();
    });
  });

  test('Should success on login', async () => {
    mockedUseSelectors.mockReturnValue([]);

    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const mockedLoginUserComplete = jest.spyOn(actions, 'loginUser');

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('sign-in')).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText('Логин');
    const passwordInput = screen.getByPlaceholderText('Пароль');
    const button = await screen.findByRole('button', { name: 'Войти' });
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'manager' } });
      fireEvent.change(passwordInput, { target: { value: 'P33f2kmu!' } });
      fireEvent.click(button);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(mockedLoginUserComplete).toHaveBeenCalledWith({
      username: 'manager',
      password: 'P33f2kmu!',
    });
  });

  test('Register form should change success', async () => {
    const handleClose = jest.fn();
    const yesDeleteHandler = jest.fn();

    render(
      <ModalComponent open title='Отправить запрос на регистрацию' handleOk={yesDeleteHandler} handleCancel={handleClose}>
        <RequestRegisterModal onClose={handleClose}/>
      </ModalComponent>
    );

    await act(async () => {
      const lastNameInput = screen.getByLabelText('Фамилия');
      const firstNameInput = screen.getByLabelText('Имя');
      const middleNameInput = screen.getByLabelText('Отчество');
      const emailInput = screen.getByLabelText('Email');
      const phoneInput = screen.getByLabelText('Номер телефона');
      const nameInput = screen.getByLabelText('Название колхоза/фермы/компании');
      const locationInput = screen.getByLabelText("Регион расположения");
      const button = await screen.findByRole('button', { name: 'Отправить запрос' });

      await act(async () => {
        fireEvent.change(lastNameInput, { target: { value: 'Test last name' } });
        expect(lastNameInput).toHaveDisplayValue('Test last name');
        fireEvent.change(firstNameInput, { target: { value: 'Test first name' } });
        expect(firstNameInput).toHaveDisplayValue('Test first name');
        fireEvent.change(middleNameInput, { target: { value: 'Test middle name' } });
        expect(middleNameInput).toHaveDisplayValue('Test middle name');
        fireEvent.change(emailInput, { target: { value: 'email@gmail.com' } });
        expect(emailInput).toHaveDisplayValue('email@gmail.com');
        fireEvent.change(phoneInput, { target: { value: '+7 (999) 999-99-99' } });
        expect(phoneInput).toHaveDisplayValue('+7 (999) 999-99-99');
        fireEvent.change(locationInput, { target: { value: 'Test location' } });
        expect(locationInput).toHaveDisplayValue('Test location');
        fireEvent.change(nameInput, { target: { value: 'Test name' } });
        expect(nameInput).toHaveDisplayValue('Test name');

        fireEvent.click(button);
      })
    });
  });

  test('Should show success message for successful login', async () => {
    mockedUseSelectors.mockReturnValue([]);

    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('sign-in')).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText('Логин');
    const passwordInput = screen.getByPlaceholderText('Пароль');
    const button = await screen.findByRole('button', { name: 'Войти' });
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'manager' } });
      fireEvent.change(passwordInput, { target: { value: 'reto4321' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });


});
