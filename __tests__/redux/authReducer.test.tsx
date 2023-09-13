import '@testing-library/jest-dom';

import authSlice, {
  logoutUser, checkForTokens, INITIAL_STATE
} from '../../src/redux/auth/authSlice';

jest.mock('../../src/redux/store');

describe('reducer auth testings', () => {

  it('logoutUserReducer', () => {
    const action = { type: logoutUser.type, payload: {
        user: null,
        tokens: {
          access: '',
          refresh: '',
          is_manager: false,
        },
        errors: null,
        commonError: null,
        success: null,
        loading: false,
      }
    };
    const stateResults = authSlice(INITIAL_STATE, action);
    expect(stateResults).toStrictEqual({
      user: null,
      tokens: {
        access: '',
        refresh: '',
        is_manager: false,
      },
      errors: null,
      commonError: null,
      success: null,
      loading: false,
    });
  });

  it('checkForTokensReducer', () => {
    const action = { type: checkForTokens.type, payload: {
        access: 'dkjSADH234Mnasmxc',
        refresh: 'dkjSADH234MnasmxKSDB236475',
        is_manager: false,
      }
    };
    const stateResults = authSlice(INITIAL_STATE, action);
    expect(stateResults.tokens.access).toBe('dkjSADH234Mnasmxc');
    expect(stateResults.tokens.refresh).toBe('dkjSADH234MnasmxKSDB236475');
    expect(stateResults.tokens.is_manager).toEqual(false);
  });

});
