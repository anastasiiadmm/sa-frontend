import '@testing-library/jest-dom';

import converterSlice, {
  clearConvertFileSuccess,
  deleteConverter,
  INITIAL_STATE
} from "../../src/redux/converter/converterSlice";

jest.mock('../../src/redux/store');

describe('reducer converter testings', () => {
  const state = {
    converterList: null,
    converterListPagination: null,
    converterListLoading: false,
    converterListError: null,
    deleteConverterLoading: false,
    deleteConverterError: null,
    convertFileLoading: false,
    convertFileSuccess: false,
    convertFileError: null,
  };

  test('should handle initial state', () => {
    const initialState = {
      ...INITIAL_STATE,
    };
    const action = { type: deleteConverter.rejected.type }
    expect(converterSlice(initialState, action)).toEqual(initialState)
  });

  it('clearConvertFileSuccess', () => {
    const action = { type: clearConvertFileSuccess.type, payload: { convertFileSuccess: false } };
    const stateResults = converterSlice(state, action);
    expect(stateResults.convertFileSuccess).toBe(false);
  });

});
