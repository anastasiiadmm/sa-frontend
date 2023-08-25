import '@testing-library/jest-dom';

import converterSlice, { clearConvertFileSuccess } from '../../src/redux/converter/converterSlice';

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

  it('clearConvertFileSuccess', () => {
    const action = { type: clearConvertFileSuccess.type, payload: { convertFileSuccess: false } };
    const stateResults = converterSlice(state, action);
    expect(stateResults.convertFileSuccess).toBe(false);
  });

});
