import { BrowserRouter } from 'react-router-dom';
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

    render(
      <ModalComponent open title='Восстановление пароля' handleOk={yesDeleteHandler} handleCancel={handleClose}>
        <ModalPasswordReset />
      </ModalComponent>
    );
  });

  test('Login form should be in the document', async () => {
    mockedUseSelectors.mockReturnValue([]);

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const email = screen.getByLabelText('Логин') as HTMLInputElement;
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
    const emailInput = screen.getByLabelText('Логин');
    const passwordInput = screen.getByLabelText('Пароль');
    const button = await screen.findByRole('button', { name: 'Продолжить' });
    fireEvent.change(emailInput, { target: { value: 'manager' } });
    fireEvent.change(passwordInput, { target: { value: 'P33f2kmu!' } });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(button);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(mockedLoginUserComplete).toHaveBeenCalledWith({
      username: 'manager',
      password: 'P33f2kmu!',
    });
  });
});
