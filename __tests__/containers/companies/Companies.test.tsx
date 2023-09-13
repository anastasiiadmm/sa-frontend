import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor, cleanup, fireEvent } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import Users from "../../../src/containers/Manager/Users/Users";
import NewUser from "../../../src/containers/Manager/Users/NewUser/NewUser";
import UserProfile from "../../../src/containers/Manager/Users/UserProfile/UserProfile";
import UserTechnique from "../../../src/containers/Manager/Users/UserTechnique/UserTechnique";
import ModalComponent from "../../../src/components/ModalComponent/ModalComponent";
import AddUpdateTechnique
  from "../../../src/components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique";
import DeleteRejectTechniqueModal
  from "../../../src/components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/RequestModal";

afterEach(cleanup);

const data = {
  code: "wdRg83n4",
  description: "Трактор поливалка",
  enterprise: 2,
  first_name: "Василий",
  id: 1,
  image: "/media/vehicles/wdRg83n4/2022-04-10_22-00-18__18_.jpeg",
  last_latitude: "0.000000",
  last_longitude: "0.000000",
  last_name: "Соколов",
  middle_name: "Петрович",
  state_number: "01KG123RRR",
  vehicle_fields_data: { field_count: 1, processed_area: 3708.024 },
  vin_code: "FDG445",
  vehicleList: []
};

const userDataInfo = {
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
      password: "pbkdf2_sha2",
      phone: "+996555130894",
      username: "aleksandr"
    }
};

const UserTechniqueList = {
  code: "1337",
  description: "Трактор озеленитель",
  enterprise: 2,
  first_name: "Паша",
  id: 2,
  image: "/media/vehicles/1337/2.jpg",
  last_latitude: "0.000000",
  last_longitude: "0.000000",
  last_name: "Петров",
  middle_name: "Олегович",
  state_number: "01KG123RRA",
  vehicle_fields_data: {
    field_count: 0,
    processed_area: null
  },
  vin_code: "FDG445we",
  vehicleList: []
};

describe("<Users />", () => {
  beforeAll(() => {
    jest.setTimeout(10000);
  });
  test("Users table component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );

    const companiesListComponent = screen.getByTestId("companies-id");

    await waitFor(() => {
      expect(companiesListComponent).toBeInTheDocument();
    });
  });

  test("Create new user form component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(data);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <NewUser />
      </BrowserRouter>
    );

    const newUserComponent = screen.getByTestId("new_user_test");

    await waitFor(() => {
      expect(newUserComponent).toBeInTheDocument();
    });
  });

  test("Users info component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(userDataInfo);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    const UserProfileComponent = screen.getByTestId("user-profile-id");

    await waitFor(() => {
      expect(UserProfileComponent).toBeInTheDocument();
    });
  });

  test("UserTechnique list component should be in the document", async () => {
    mockedUseSelectors.mockReturnValue(UserTechniqueList);
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <BrowserRouter>
        <UserTechnique />
      </BrowserRouter>
    );

    const UserTechniqueComponent = screen.getByTestId("user-technique-id");

    await waitFor(() => {
      expect(UserTechniqueComponent).toBeInTheDocument();
    });
  });

  test("UserTechnique modal form should open success", async () => {
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);
    const userId = '1';

    render(
      <BrowserRouter>
        <ModalComponent open>
          <AddUpdateTechnique onCancel={() => {}} userId={userId} />
        </ModalComponent>
      </BrowserRouter>,
    );

    await act(async () => {
      const nameInput = screen.getByLabelText('Название техники');
      const stateNumberInput = screen.getByLabelText('Гос номер');
      const vinCodeInput = screen.getByLabelText('VIN код');
      const lastNameInput = screen.getByLabelText('Фамилия');
      const firstNameInput = screen.getByLabelText('Имя');
      const middleNameInput = screen.getByLabelText('Отчество');
      const submitButton = screen.getByRole('button', { name: /добавить технику/i });

      userEvent.type(nameInput, 'Test name');
      userEvent.type(stateNumberInput, 'Test state number');
      userEvent.type(vinCodeInput, 'Test vin code');
      userEvent.type(lastNameInput, 'Test last name');
      userEvent.type(firstNameInput, 'Test first name');
      userEvent.type(middleNameInput, 'Test middle name');
      fireEvent.click(submitButton);
    });
  });

  test("", async () => {
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);
    const userId = '1';

    render(
      <BrowserRouter>
        <ModalComponent open>
          <AddUpdateTechnique onCancel={() => {}} userId={userId} />
        </ModalComponent>
      </BrowserRouter>,
    );

    const nameInput = screen.getByLabelText('Название техники');
    const stateNumberInput = screen.getByLabelText('Гос номер');
    const vinCodeInput = screen.getByLabelText('VIN код');
    const lastNameInput = screen.getByLabelText('Фамилия');
    const firstNameInput = screen.getByLabelText('Имя');
    const middleNameInput = screen.getByLabelText('Отчество');
    const submitButton = screen.getByRole('button', { name: /добавить технику/i });

    await act(async () => {
      userEvent.type(nameInput, 'Test name');
      userEvent.type(stateNumberInput, 'Test state number');
      userEvent.type(vinCodeInput, 'Test vin code');
      userEvent.type(lastNameInput, 'Test last name');
      userEvent.type(firstNameInput, 'Test first name');
      userEvent.type(middleNameInput, 'Test middle name');
      fireEvent.click(submitButton);
    });
  });

  test("UserTechnique delete modal form should open success", async () => {
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const props = {
      title: 'Удалить?',
      subTitle: 'Вы уверены, что хотите удалить',
      techniqueName: 'Kamaz tech-1234',
      loading: false,
      handleDeleteCancel: jest.fn(),
      deleteRejectTechniqueHandler: jest.fn(),
      requestHandler: jest.fn(),
      textCancel: 'Test',
    };

    render(
      <BrowserRouter>
        <ModalComponent open>
          <DeleteRejectTechniqueModal
            {...props}
          />
        </ModalComponent>
      </BrowserRouter>,
    );
  });

  test('UserTechnique delete modal calls handleDeleteCancel when the "Отменить" button is clicked', () => {
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const props = {
      title: 'Удалить?',
      subTitle: 'Вы уверены, что хотите удалить',
      techniqueName: 'Kamaz tech-1234',
      loading: false,
      handleDeleteCancel: jest.fn(),
      deleteRejectTechniqueHandler: jest.fn(),
      requestHandler: jest.fn(),
      textCancel: 'Test',
    };

    render(
      <BrowserRouter>
        <ModalComponent open>
          <DeleteRejectTechniqueModal
            {...props}
          />
        </ModalComponent>
      </BrowserRouter>,
    );

    const cancelButton = screen.getByText('Отменить');
    fireEvent.click(cancelButton);
    expect(props.handleDeleteCancel).toHaveBeenCalled();
  });

  test('UserTechnique delete modal displays the loading indicator when loading is true', () => {
    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    const props = {
      title: 'Удалить?',
      subTitle: 'Вы уверены, что хотите удалить',
      techniqueName: 'Kamaz tech-1234',
      loading: false,
      handleDeleteCancel: jest.fn(),
      deleteRejectTechniqueHandler: jest.fn(),
      requestHandler: jest.fn(),
      textCancel: 'Test',
    };

    const loadingProps = { ...props, loading: true };
    render(<DeleteRejectTechniqueModal {...loadingProps} />);
    const loadingIndicator = screen.getByLabelText('loading');
    expect(loadingIndicator).toBeInTheDocument();
  });

});
