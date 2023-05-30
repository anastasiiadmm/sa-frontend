import '@testing-library/jest-dom';

import accountsSlice, {
  managerChangeProfileHandler,
  setManagerProfile,
  inquiriesSuccessNull,
  clearRequestsPagination,
} from '../../src/redux/accounts/accountsSlice';

jest.mock('../../src/redux/store');

describe('reducer accounts testings', () => {
  const state = {
    configs: null,
    configsLoading: false,
    configsError: null,
    account: null,
    fetchLoadingAccount: false,
    fetchErrorAccount: null,
    updateManagerData: {
      username: '',
      password: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
    updateManagerDataLoading: false,
    updateManagerDataError: null,
    vehicleDeleteLoading: false,
    vehicleErrorsDelete: null,
    user: null,
    fetchLoadingUser: false,
    fetchLoadingUserError: null,
    userVehicles: undefined,
    params: {
      page: 1,
    },
    userVehiclesPagination: null,
    fetchUserVehiclesLoading: false,
    fetchUserVehiclesError: null,

    inquiriesLoading: false,
    inquiriesError: null,
    inquiriesSuccess: false,

    requests: undefined,
    requestsPagination: null,
    fetchRequestsLoading: false,
    fetchRequestsError: null,

    userVehicleInfo: null,
    userVehicleInfoLoading: false,
    userVehicleInfoError: null,

    generatePasswordLoading: false,
    generatePasswordError: null,
    generatedPassword: null,

    accountManagerConfirmation: null,
    accountManagerConfirmationLoading: false,
    accountManagerConfirmationError: null,

    vehicleCreateRequestLoading: false,
    vehicleCreateRequestError: null,
    vehicleCreateRequestSuccess: false,

    approveRequestLoading: false,
    approveRequestError: null,
    approveRequestSuccess: false,

    approveRegisterRequestLoading: false,
    approveRegisterRequestError: null,
    approveRegisterRequestSuccess: false,

    changeProfileLoading: false,
    changeProfileError: null,

    requestApproveChangeProfileLoading: false,
    requestApproveChangeProfileError: null,
  };

  it('managerChangeProfileHandlerReducer', () => {
    const action = { type: managerChangeProfileHandler.type, payload: { username: 'test' } };
    const stateResults = accountsSlice(state, action);
    expect(stateResults.updateManagerData.username).toBe('test');
  });

  it('setManagerProfileReducer', () => {
    const action = { type: setManagerProfile.type, payload: { first_name: 'test' } };
    const stateResults = accountsSlice(state, action);
    expect(stateResults.updateManagerData.first_name).toBe('test');
  });

  it('inquiriesSuccessNullReducer', () => {
    const action = { type: inquiriesSuccessNull.type, payload: { inquiriesSuccess: false } };
    const stateResults = accountsSlice(state, action);
    expect(stateResults.inquiriesSuccess).toEqual(false);
  });

  it('clearRequestsPaginationReducer', () => {
    const action = { type: clearRequestsPagination.type, payload: { requestsPagination: null, userVehiclesPagination: null } };
    const stateResults = accountsSlice(state, action);
    expect(stateResults.requestsPagination).toEqual(null);
    expect(stateResults.userVehiclesPagination).toEqual(null);
  });
});
