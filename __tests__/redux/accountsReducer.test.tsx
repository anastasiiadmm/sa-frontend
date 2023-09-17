import '@testing-library/jest-dom';

import accountsSlice, {
  managerChangeProfileHandler,
  setManagerProfile,
  inquiriesSuccessNull,
  clearRequestsPagination, INITIAL_STATE,
} from '../../src/redux/accounts/accountsSlice';

jest.mock('../../src/redux/store');

describe('reducer accounts testings', () => {

  it('managerChangeProfileHandlerReducer', () => {
    const action = { type: managerChangeProfileHandler.type, payload: { username: 'test' } };
    const stateResults = accountsSlice(INITIAL_STATE, action);
    expect(stateResults.updateManagerData.username).toBe('test');
  });

  it('setManagerProfileReducer', () => {
    const action = { type: setManagerProfile.type, payload: { first_name: 'test' } };
    const stateResults = accountsSlice(INITIAL_STATE, action);
    expect(stateResults.updateManagerData.first_name).toBe('test');
  });

  it('inquiriesSuccessNullReducer', () => {
    const action = { type: inquiriesSuccessNull.type, payload: { inquiriesSuccess: false } };
    const stateResults = accountsSlice(INITIAL_STATE, action);
    expect(stateResults.inquiriesSuccess).toEqual(false);
  });

  it('clearRequestsPaginationReducer', () => {
    const action = { type: clearRequestsPagination.type, payload: { requestsPagination: null, userVehiclesPagination: null } };
    const stateResults = accountsSlice(INITIAL_STATE, action);
    expect(stateResults.requestsPagination).toEqual(null);
    expect(stateResults.userVehiclesPagination).toEqual(null);
  });
});
