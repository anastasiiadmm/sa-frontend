import { BrowserRouter } from 'react-router-dom';
import { screen, render, waitFor, cleanup, fireEvent, act } from "@testing-library/react";
import '../../../__mocks__/matchMedia.mock';
import '@testing-library/jest-dom';
import '../../../__mocks__/utils';
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import Profile from "../../../src/containers/Manager/Profile/Profile";
import UserProfile from "../../../src/containers/User/Profile/Profile";
import ModalComponent from "../../../src/components/ModalComponent/ModalComponent";
import GeneratedPasswordModal
  from "../../../src/components/ModalComponent/ModalChildrenComponents/GeneratedPasswordModal/GeneratedPasswordModal";

afterEach(cleanup);

const data = {
  username: 'manager',
  password: '1234567',
  first_name: 'Вася',
  last_name: 'Пупкин',
  middle_name: 'Менеджерович',
  email: 'project.smartagriculture@gmail.com',
  phone: '+7 (854) 600-00-00',
}

describe('<Profile />',  () => {
  test('Profile manager component should be in the document', async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    const profileTitle = screen.getByTestId('accounts-id');
    const username = screen.getByLabelText('Username');
    const last_name = screen.getByLabelText('Фамилия');
    const first_name = screen.getByLabelText('Имя');
    const middle_name = screen.getByLabelText('Отчество');
    const email = screen.getByLabelText('Email');
    const phone = screen.getByLabelText('Номер телефона');

    await waitFor(() => {
      expect(profileTitle).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(last_name).toBeInTheDocument();
      expect(first_name).toBeInTheDocument();
      expect(middle_name).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(phone).toBeInTheDocument();
    });
  });

  test('Profile manager form component should change success', async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    const username = screen.getByLabelText('Username');
    const last_name = screen.getByLabelText('Фамилия');
    const first_name = screen.getByLabelText('Имя');
    const middle_name = screen.getByLabelText('Отчество');
    const email = screen.getByLabelText('Email');
    const phone = screen.getByLabelText('Номер телефона');

    fireEvent.change(username, { target: { value: 'Test username' } });
    expect(username).toHaveDisplayValue('Test username');
    fireEvent.change(last_name, { target: { value: 'Test last name' } });
    expect(last_name).toHaveDisplayValue('Test last name');
    fireEvent.change(first_name, { target: { value: 'Test first name' } });
    expect(first_name).toHaveDisplayValue('Test first name');
    fireEvent.change(middle_name, { target: { value: 'Test middle name' } });
    expect(middle_name).toHaveDisplayValue('Test middle name');
    fireEvent.change(email, { target: { value: 'email@gmail.com' } });
    expect(email).toHaveDisplayValue('email@gmail.com');
    fireEvent.change(phone, { target: { value: '+7 (999) 999-99-99' } });
    expect(phone).toHaveDisplayValue('+7 (999) 999-99-99');

    await act(async () => {
      fireEvent.click(screen.getByTestId('button_change'));
    });
  });

  test('Profile user component should be in the document', async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>,
    );

    const profileTitle = screen.getByTestId('user-profile-id');
    const username = screen.getByLabelText('Username');
    const last_name = screen.getByLabelText('Фамилия');
    const first_name = screen.getByLabelText('Имя');
    const middle_name = screen.getByLabelText('Отчество');
    const email = screen.getByLabelText('Email');
    const phone = screen.getByLabelText('Номер телефона');
    const name = screen.getByLabelText('Название колхоза/фермы/компании');
    const location = screen.getByLabelText('Регион расположения');
    const autopilots_amount = screen.getByLabelText('Количество оплаченных блоков автопилота');

    await waitFor(() => {
      expect(profileTitle).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(last_name).toBeInTheDocument();
      expect(first_name).toBeInTheDocument();
      expect(middle_name).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(phone).toBeInTheDocument();
      expect(name).toBeInTheDocument();
      expect(location).toBeInTheDocument();
      expect(autopilots_amount).toBeInTheDocument();
    });
  });

  it("Opening and closing generate password modal", async () => {
    const handleClose = jest.fn();
    const yesHandler = jest.fn();

    render(
      <ModalComponent open title='Пароль' handleOk={yesHandler} handleCancel={handleClose}>
        <GeneratedPasswordModal onClose={handleClose} generatedPassword='test' />
      </ModalComponent>
    );

    const generatedPassword = screen.getByTestId('generated-password');
    const button = screen.getByTestId('ok-button');

    await waitFor(() => {
      expect(generatedPassword).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(button);
    });
  });
});
