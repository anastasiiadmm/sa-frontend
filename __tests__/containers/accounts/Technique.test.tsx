import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor, cleanup, act, fireEvent } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import Technique from "../../../src/containers/User/Technique/Technique";
import UploadImageComponent from "../../../src/components/UploadImageComponent/UploadImageComponent";
import userEvent from "@testing-library/user-event";
import ModalComponent from "../../../src/components/ModalComponent/ModalComponent";
import AddUpdateTechnique
  from "../../../src/components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique";

afterEach(cleanup);

const data = {
  autopilots_amount: 2,
  id: 1,
  location: "Бишкек",
  name: "ОсОО ОДА \"Дордой-Секьюрити\"",
  user:
    {
      email: "borsh130894@gmail.com",
      first_name: "Александр",
      id: 3,
      last_name: "Борщевский",
      middle_name: "Сергеевич",
      password: "pbkdf2_sha",
      phone: "+996555130894",
      username: "aleksandr"
    }
};

describe("<Technique />", () => {
  test("Technique table component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <Technique />
      </BrowserRouter>
    );

    const techniqueComponent = screen.getByTestId("technique-id");

    await waitFor(() => {
      expect(techniqueComponent).toBeInTheDocument();
    });
  });

  test('UploadImageComponent should render and upload image', async() => {
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);
    const setFileList = jest.fn();

    const file = new File(['test'], 'test.jpeg', { type: 'image/jpeg' });

    render(
      <UploadImageComponent fileList={[]} setFileList={setFileList}/>
    );

    const imageUpload = await waitFor(() => screen.getByTestId('image-upload'));

    await act(() => {
      userEvent.upload(imageUpload, file);
    });
  });

  test('Create new technique for user should create success', async() => {
    const handleClose = jest.fn();
    const yesHandler = jest.fn();

    const props = {
      userId: null,
      isRequest: true,
      handleEditOkCancel: jest.fn(),
    };

    render(
      <ModalComponent open title='Добавить технику' handleOk={yesHandler} handleCancel={handleClose}>
        <AddUpdateTechnique
          {...props}
        />
      </ModalComponent>
    );

    const name_technique = screen.getByLabelText('Название техники');
    const state_number = screen.getByLabelText('Гос номер');
    const vin_code = screen.getByLabelText('VIN код');
    const last_name = screen.getByLabelText('Фамилия');
    const first_name = screen.getByLabelText('Имя');
    const middle_name = screen.getByLabelText('Отчество');

    fireEvent.change(name_technique, { target: { value: 'Трактор' } });
    expect(name_technique).toHaveDisplayValue('Трактор');
    fireEvent.change(state_number, { target: { value: '01AD22BH' } });
    expect(state_number).toHaveDisplayValue('01AD22BH');
    fireEvent.change(vin_code, { target: { value: '01AD22BH' } });
    expect(vin_code).toHaveDisplayValue('01AD22BH');
    fireEvent.change(last_name, { target: { value: 'Тестовый' } });
    expect(last_name).toHaveDisplayValue('Тестовый');
    fireEvent.change(first_name, { target: { value: 'Тест' } });
    expect(first_name).toHaveDisplayValue('Тест');
    fireEvent.change(middle_name, { target: { value: 'Тест' } });
    expect(middle_name).toHaveDisplayValue('Тест');

    await act(async () => {
      fireEvent.click(screen.getByTestId('button_id'));
    });
  });
});
