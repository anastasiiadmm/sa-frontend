import { BrowserRouter } from 'react-router-dom';
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import '../../../__mocks__/matchMedia.mock';
import '@testing-library/jest-dom';
import '../../../__mocks__/utils';
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import Profile from "../../../src/containers/Manager/Profile/Profile";

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
    const confirm_password = screen.getByLabelText('Повторите пароль');
    const last_name = screen.getByLabelText('Фамилия');
    const first_name = screen.getByLabelText('Имя');
    const middle_name = screen.getByLabelText('Отчество');
    const email = screen.getByLabelText('Email');
    const phone = screen.getByLabelText('Номер телефона');

    await waitFor(() => {
      expect(promotionTitle).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(password).toBeInTheDocument();
      expect(confirm_password).toBeInTheDocument();
      expect(last_name).toBeInTheDocument();
      expect(first_name).toBeInTheDocument();
      expect(middle_name).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(phone).toBeInTheDocument();
    });
  });
});
