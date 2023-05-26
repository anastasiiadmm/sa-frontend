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
import EditUserProfileModal
  from "../../../src/components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal";

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

const userData = {
  data: {
    user: {
      last_name: 'Пупкин',
      first_name: 'Василий',
      middle_name: 'Петрович',
      email: 'vasilii@gmail.com',
      phone: '+7 (854) 600-00-00',
      username: 'vasilii',
    },
    enterprise: {
      name: 'V&CO',
      location: 'Bishkek',
      autopilots_amount: '1',
    },
  },
}

const accountData = {
  id: 123,
  username: 'anastasiia',
  password: 'reto1234',
  first_name: 'Anastasiia',
  middle_name: 'Testovna',
  is_manager: false,
  last_name: 'Testovna',
  email: 'anastasi@gmail.com',
  phone: '+7 (854) 600-00-00',
  image: '/media/files/inquiries/205/5.jpg',
  coords_timeout: 1,
  company: {
    autopilots_amount: 2,
    id: 432,
    vehicles_number: 1,
    location: 'Москва',
    meteo_requested: true,
    name: 'ОсОО «Фрезениус Медикал Кеа КГЗ»',
    weather_service: true,
  }
};

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
    window.URL.createObjectURL = jest.fn();

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
    const fileInput = screen.getByTestId('image-input');

    const file = new File(['test'], 'test.png', { type: 'image/png' });

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
    fireEvent.change(fileInput, { target: { files: [file] } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button_change'));
    });
  });

  test('Profile user component should be in the document', async () => {
    mockedUseSelectors.mockReturnValue(userData);
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

  test('Modal request to change user form component should open success', async () => {
    const handleClose = jest.fn();
    const yesHandler = jest.fn();
    const imageFile = new File(['test'], 'test.png', { type: 'image/png' });

    const props = {
      onClickSendDataHandler: jest.fn(),
      account: accountData,
      inputChangeHandler: jest.fn(),
      loading: false,
      image: imageFile,
      onFileChange: jest.fn(),
      onValuesChange: jest.fn(),
      formValid: true,
    };

    render(
      <ModalComponent open title='Пароль' handleOk={yesHandler} handleCancel={handleClose}>
        <EditUserProfileModal
          {...props}
        />
      </ModalComponent>
    );

  });

  test('Profile modal request to change user form component should change success', async () => {
    const handleClose = jest.fn();
    const yesHandler = jest.fn();
    const imageFile = new File(['test'], 'test.png', { type: 'image/png' });

    const props = {
      onClickSendDataHandler: jest.fn(),
      account: accountData,
      inputChangeHandler: jest.fn(),
      loading: false,
      image: imageFile,
      onFileChange: jest.fn(),
      onValuesChange: jest.fn(),
      formValid: true,
    };

    render(
      <ModalComponent open title='Запрос на изменение личной информации' handleOk={yesHandler} handleCancel={handleClose}>
        <EditUserProfileModal
          {...props}
        />
      </ModalComponent>
    );

    const username = screen.getByLabelText('Username');
    const last_name = screen.getByLabelText('Фамилия');
    const first_name = screen.getByLabelText('Имя');
    const middle_name = screen.getByLabelText('Отчество');
    const email = screen.getByLabelText('Email');
    const phone = screen.getByLabelText('Номер телефона');
    const name = screen.getByLabelText('Название колхоза/фермы/компании');
    const region = screen.getByLabelText('Регион расположения');

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
    fireEvent.change(name, { target: { value: 'ОсОО «Фрезениус Медикал Кеа КГЗ»' } });
    expect(name).toHaveDisplayValue('ОсОО «Фрезениус Медикал Кеа КГЗ»');
    fireEvent.change(region, { target: { value: 'Moscow' } });
    expect(region).toHaveDisplayValue('Moscow');

    await act(async () => {
      fireEvent.click(screen.getByTestId('save_button_id'));
    });
  });

  it("Opening and closing generate password modal", async () => {
    const handleClose = jest.fn();
    const yesHandler = jest.fn();

    render(
      <ModalComponent open title='Пароль' handleOk={yesHandler} handleCancel={handleClose}>
        <GeneratedPasswordModal subtitle='test' onClose={handleClose} generatedPassword='test' />
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
