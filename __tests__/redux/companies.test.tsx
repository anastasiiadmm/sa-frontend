import '@testing-library/jest-dom';

import companiesSlice, {
  setChangeUserProfile,
  setNullReducerVehicleCreate,
  clearUserInfo,
  clearCompaniesPagination,
} from '../../src/redux/companies/companiesSlice';

jest.mock('../../src/redux/store');

describe('reducer auth testings', () => {
  const state = {
    companies: null,
    fetchCompaniesLoading: false,
    fetchCompaniesError: null,
    companiesListPagination: null,

    userCreate: null,
    userCreateLoading: false,
    userCreateError: null,

    userInfo: null,
    userInfoLoading: false,
    userInfoError: null,

    updateUserInfoLoading: false,
    updateUserInfoError: null,

    updateUserData: {
      username: '',
      password: '',
      first_name: '',
      middle_name: '',
      image: '',
      is_manager: false,
      last_name: '',
      email: '',
      phone: '',
      coords_timeout: 0,
      company: {
        autopilots_amount: 0,
        vehicles_number: 0,
        location: '',
        meteo_requested: false,
        name: '',
        weather_service: false,
      }
    },
    updateUserDataLoading: false,
    updateUserDataError: null,

    deleteUserInfoLoading: false,
    deleteUserInfoError: null,

    vehicleList: [],
    fetchVehicleListLoading: false,
    fetchVehicleListError: null,
    vehicleListPagination: null,

    userVehicleInfo: null,
    userVehicleInfoLoading: false,
    userVehicleInfoError: null,

    vehicleCreateLoading: false,
    vehicleCreateSuccess: false,
    vehicleCreateError: null,

    patchUserVehicleInfoLoading: false,
    patchUserVehicleInfoError: null,

    deleteUserVehicleLoading: false,
    deleteUserVehicleError: null,
    techniqueVehicleInfo: {
      results: null,
      loading: false,
      errors: null,
    },
    techniqueVehicleUpdate: {
      results: null,
      loading: false,
      errors: null,
    },
    saveTechniqueVehicle: {
      results: null,
      loading: false,
      errors: null,
    },

    userInfoByManager: null,
    userInfoByManagerLoading: false,
    userInfoByManagerError: null,
  };

  it('setChangeUserProfileReducer', () => {
    const action = { type: setChangeUserProfile.type, payload: {
      username: 'username',
      first_name: 'test',
      middle_name: 'test',
      image: '',
      is_manager: false,
      last_name: 'test',
      email: 'test@gmail.com',
      phone: '',
      coords_timeout: 0,
      company: {
        autopilots_amount: 0,
        location: 'Moscow',
        meteo_requested: false,
        name: 'Test',
        vehicles_number: 0,
        weather_service: false,
      },
      }
    };
    const stateResults = companiesSlice(state, action);
    expect(stateResults.updateUserData?.username).toEqual('username');
    expect(stateResults.updateUserData?.first_name).toEqual('test');
    expect(stateResults.updateUserData?.middle_name).toEqual('test');
    expect(stateResults.updateUserData?.is_manager).toBe(false);
    expect(stateResults.updateUserData?.last_name).toEqual('test');
    expect(stateResults.updateUserData?.email).toEqual('test@gmail.com');
    expect(stateResults.updateUserData?.coords_timeout).toEqual(0);
    expect(stateResults.updateUserData?.company?.autopilots_amount).toEqual(0);
    expect(stateResults.updateUserData?.company?.location).toEqual('Moscow');
    expect(stateResults.updateUserData?.company?.meteo_requested).toBe(false);
    expect(stateResults.updateUserData?.company?.name).toEqual('Test');
    expect(stateResults.updateUserData?.company?.vehicles_number).toEqual(0);
    expect(stateResults.updateUserData?.company?.weather_service).toBe(false);
  });

  it('setNullReducerVehicleCreateReducer', () => {
    const action = { type: setNullReducerVehicleCreate.type, payload: { vehicleCreateSuccess: false } };
    const stateResults = companiesSlice(state, action);
    expect(stateResults.vehicleCreateSuccess).toBe(false);
  });

  it('clearUserInfoReducer', () => {
    const action = { type: clearUserInfo.type, payload: { userInfo: null } };
    const stateResults = companiesSlice(state, action);
    expect(stateResults.userInfo).toBe(null);
  });

  it('clearCompaniesPaginationReducer', () => {
    const action = { type: clearCompaniesPagination.type, payload: { companiesListPagination: null, vehicleListPagination: null } };
    const stateResults = companiesSlice(state, action);
    expect(stateResults.companiesListPagination).toEqual(null);
    expect(stateResults.vehicleListPagination).toEqual(null);
  });

});
