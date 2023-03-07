import { BrowserRouter } from 'react-router-dom';
import { screen, render, waitFor, cleanup, fireEvent, act } from "@testing-library/react";
import '../../../__mocks__/matchMedia.mock';
import '@testing-library/jest-dom';
import '../../../__mocks__/utils';
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import Profile from "../../../src/containers/Manager/Profile/Profile";
import userEvent from "@testing-library/user-event";

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
  test('Profile component should be in the document', async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    const promotionTitle = screen.getByTestId('accounts-id');
    const username = screen.getByLabelText('Username');
    const password = screen.getByLabelText('Пароль');
    const last_name = screen.getByLabelText('Фамилия');
    const first_name = screen.getByLabelText('Имя');
    const middle_name = screen.getByLabelText('Отчество');
    const email = screen.getByLabelText('Email');
    const phone = screen.getByLabelText('Номер телефона');

    await waitFor(() => {
      expect(promotionTitle).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(password).toBeInTheDocument();
      expect(last_name).toBeInTheDocument();
      expect(first_name).toBeInTheDocument();
      expect(middle_name).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(phone).toBeInTheDocument();
    });
  });

  test('Profile form component should change success', async () => {
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
});
