import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import "../../../__mocks__/matchMedia.mock";
import "@testing-library/jest-dom";
import { mockedDispatch, mockedUseSelectors } from "../../../__mocks__/utils";

import Users from "../../../src/containers/Manager/Users/Users";
import NewUser from "../../../src/containers/Manager/Users/NewUser/NewUser";
import UserProfile from "../../../src/containers/Manager/Users/UserProfile/UserProfile";
import UserTechnique from "../../../src/containers/Manager/Users/UserTechnique/UserTechnique";

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
  vin_code: "FDG445"
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
  vin_code: "FDG445we"
};

describe("<Users />", () => {
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

});
