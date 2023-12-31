import { BrowserRouter } from "react-router-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import "../../../__mocks__/utils";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";
import UserRequests from "../../../src/containers/Manager/UserRequests/UserRequests";
import RequestAddTechnique
  from "../../../src/components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestAddTechnique/RequestAddTechnique";
import ModalComponent from "../../../src/components/ModalComponent/ModalComponent";
import RequestRegisterUser
  from "../../../src/components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestRegisterUser/RequestRegisterUser";
import EditUserProfileModal
  from "../../../src/components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal";

const data = [
  {
    category: 3,
    created_at: "19/05/2023 18:00:11+0600",
    id: 211,
    object_id: 30,
    requestor: "ОсОО «Фрезениус Медикал Кеа КГЗ»"
  }
];

const addTechniqueData = {
  category: 3,
  created_at: "19/05/2023 18:00:11+0600",
  id: 211,
  object_id: 30,
  data: {
    operator: { first_name: "asdasdas", last_name: "dasd", middle_name: "asdasd" },
    vehicle: {
      description: "asdsa",
      license_plate: "dasd",
      vin: "asdasdasasdasdqw1312e"
    }
  },
  requestor: { name: "ОсОО «Фрезениус Медикал Кеа КГЗ»" },
  uploaded_files: []
};

const userInfo = {
  id: 123,
  object_id: '123',
  category: 2,
  created_at: "19/05/2023 18:00:11+0600",
  inquiry_id: '123',
  requestor: {
    email: "gmail@gmail.com",
    name: "test",
    phone: ""
  },
  uploaded_files: [{ id: '123', file: "" }] as [{ id: string; file: string; }] | null,
  data: {
    user: {
      id: 123,
      last_name: "Test",
      first_name: "Test",
      middle_name: "Test",
      email: "gmail@gmail.com",
      phone: "",
      username: "",
      password: "",
      image: ""
    },
    enterprise: {
      location: "Moscow",
      name: "Test"
    }
  }
};

describe("<UserRequests />", () => {
  test("UserRequests table should render data", async () => {
    mockedUseSelectors.mockReturnValue({
      requests: data,
      requestsPagination: {
        count: 2,
        next: null,
        previous: null
      }
    });
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <UserRequests />
      </BrowserRouter>
    );

  });

  test('Modal render Technique', () => {
    mockedUseSelectors.mockReturnValue({});
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);
    const handleOkCancel = jest.fn();
    const showRejectModal = jest.fn();
    render(<ModalComponent open={true}>
        <RequestAddTechnique
          resultsTechnique={{
            "id": 85,
            "category": 3,
            "object_id": 81,
            "created_at": "09/05/2023 01:02:17+0600",
            "requestor": {
              "name": "test"
            },
            "data": {
              "vehicle": {
                "vin": "fref",
                "license_plate": "frefre",
                "description": "refre"
              },
              "operator": {
                "first_name": "rfef",
                "last_name": "refref",
                "middle_name": "refrefr"
              }
            },
            "uploaded_files": [
              {
                "id": 15,
                "file": "http://sa-backend/media/files/inquiries/85/2023-02-10_18.54.40.jpg"
              }
            ]
          }}
          loading={false}
          handleOkCancel={handleOkCancel}
          modalOpen={() => {}}
          showRejectModal={showRejectModal}/>
      </ModalComponent>
    )
    const fioElement = screen.queryByDisplayValue('rfef') as HTMLInputElement;
    expect(fioElement.value).toBe('rfef')
  });

  test("Requests table component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <UserRequests />
      </BrowserRouter>
    );

    const requestsComponent = screen.getByTestId("requests-id");

    await waitFor(() => {
      expect(requestsComponent).toBeInTheDocument();
      expect(screen.getByText('Дата запроса')).toBeInTheDocument();
      expect(screen.getByText('Тип запроса')).toBeInTheDocument();
      expect(screen.getByText('Источник запроса')).toBeInTheDocument();
    });
  });

  test("UserRequest add technique modal should render and change data success", async () => {
    const handleClose = jest.fn();
    const yesHandler = jest.fn();

    mockedUseSelectors.mockReturnValue({
      requests: data,
      requestsPagination: {
        count: 2,
        next: null,
        previous: null
      }
    });
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const props = {
      loading: false,
      modalOpen: jest.fn(),
      resultsTechnique: addTechniqueData,
      handleOkCancel: jest.fn(),
      showRejectModal: jest.fn()
    };

    render(
      <BrowserRouter>
        <ModalComponent open title="Запрос на добавление техники" handleOk={yesHandler} handleCancel={handleClose}>
          <RequestAddTechnique
            {...props}
          />
        </ModalComponent>
      </BrowserRouter>
    );

    const fullName = screen.getByLabelText("ФИО");
    const description = screen.getByLabelText("Название техники");
    const license_plate = screen.getByLabelText("Гос номер");
    const vin = screen.getByLabelText("VIN код");
    const last_name = screen.getByLabelText("Фамилия");
    const first_name = screen.getByLabelText("Имя");
    const middle_name = screen.getByLabelText("Отчество");

    expect(fullName).toBeInTheDocument();
    fireEvent.change(description, { target: { value: "Test description" } });
    expect(description).toHaveDisplayValue("Test description");
    fireEvent.change(license_plate, { target: { value: "1DA4FR" } });
    expect(license_plate).toHaveDisplayValue("1DA4FR");
    fireEvent.change(vin, { target: { value: "1DA4FR" } });
    expect(vin).toHaveDisplayValue("1DA4FR");
    fireEvent.change(last_name, { target: { value: "Last name" } });
    expect(last_name).toHaveDisplayValue("Last name");
    fireEvent.change(first_name, { target: { value: "First name" } });
    expect(first_name).toHaveDisplayValue("First name");
    fireEvent.change(middle_name, { target: { value: "Middle name" } });
    expect(middle_name).toHaveDisplayValue("Middle name");

    await act(async () => {
      fireEvent.click(screen.getByTestId("approve-button"));
    });

  });

  test("UserRequest new registration modal should render and change data success", async () => {
    const handleClose = jest.fn();
    const yesHandler = jest.fn();
    mockedUseSelectors.mockReturnValue({
      requests: data,
      requestsPagination: {
        count: 2,
        next: null,
        previous: null
      }
    });
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const props = {
      userInfo: userInfo,
      userId: 123,
      userInfoLoading: false,
      handleOkCancel: jest.fn(),
      showRejectModal: jest.fn(),
    };

    render(
      <BrowserRouter>
        <ModalComponent open title="Запрос на регистрацию" handleOk={yesHandler} handleCancel={handleClose}>
          <RequestRegisterUser
            {...props}
          />
        </ModalComponent>
      </BrowserRouter>
    );

    const last_name = screen.getByLabelText("Фамилия");
    const first_name = screen.getByLabelText("Имя");
    const middle_name = screen.getByLabelText("Отчество");
    const email = screen.getByLabelText("Email");
    const phone = screen.getByLabelText("Номер телефона");
    const name = screen.getByLabelText("Название колхоза/фермы/компании");
    const location = screen.getByLabelText("Регион расположения");

    fireEvent.change(last_name, { target: { value: "Last name" } });
    expect(last_name).toHaveDisplayValue("Last name");
    fireEvent.change(first_name, { target: { value: "First name" } });
    expect(first_name).toHaveDisplayValue("First name");
    fireEvent.change(middle_name, { target: { value: "Middle name" } });
    expect(middle_name).toHaveDisplayValue("Middle name");
    fireEvent.change(email, { target: { value: 'test@gmail.com' } });
    expect(email).toHaveDisplayValue("test@gmail.com");
    fireEvent.change(phone, { target: { value: '+7 (932) 939-29-39' } });
    expect(phone).toHaveDisplayValue("+7 (932) 939-29-39");
    fireEvent.change(name, { target: { value: 'CO@CO' } });
    expect(name).toHaveDisplayValue("CO@CO");
    fireEvent.change(location, { target: { value: 'Moscow' } });
    expect(location).toHaveDisplayValue("Moscow");

    await act(async () => {
      fireEvent.click(screen.getByTestId("approve-id-button"));
    });

  });

  test("UserRequest to change profile data modal should render and change data success", async () => {
    const handleClose = jest.fn();
    const yesHandler = jest.fn();
    mockedUseSelectors.mockReturnValue({
      requests: data,
      requestsPagination: {
        count: 2,
        next: null,
        previous: null
      }
    });
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const props = {
      handleOkCancel: jest.fn(),
      showRejectModal: jest.fn(),
      inputChangeHandler: jest.fn(),
      onFileChange: jest.fn(),
      onClick: jest.fn(),
      userInfo: userInfo,
      userId: 123,
      loading: false,
      userInfoLoading: false,
      changeUserInfoRequest: true,
    };

    render(
      <BrowserRouter>
        <ModalComponent dividerShow={false} open title="Запрос на изменение личной информации" handleOk={yesHandler} handleCancel={handleClose}>
          <EditUserProfileModal
            {...props}
          />
        </ModalComponent>
      </BrowserRouter>
    );

    const last_name = screen.getByLabelText("Фамилия");
    const first_name = screen.getByLabelText("Имя");
    const middle_name = screen.getByLabelText("Отчество");
    const name = screen.getByLabelText("Название колхоза/фермы/компании");
    const location = screen.getByLabelText("Регион расположения");

    await act(async () => {
      fireEvent.change(last_name, { target: { value: "Last name" } });
      expect(last_name).toHaveDisplayValue("Last name");
      fireEvent.change(first_name, { target: { value: "First name" } });
      expect(first_name).toHaveDisplayValue("First name");
      fireEvent.change(middle_name, { target: { value: "Middle name" } });
      expect(middle_name).toHaveDisplayValue("Middle name");
      fireEvent.change(name, { target: { value: 'CO@CO' } });
      expect(name).toHaveDisplayValue("CO@CO");
      fireEvent.change(location, { target: { value: 'Moscow' } });
      expect(location).toHaveDisplayValue("Moscow");

      fireEvent.click(screen.getByTestId("approve_button_id"));
    });

  });
});
