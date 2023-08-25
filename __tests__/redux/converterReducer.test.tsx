import '@testing-library/jest-dom';

import converterSlice, {
  clearConvertFileSuccess,
  deleteConverter,
  INITIAL_STATE
} from "../../src/redux/converter/converterSlice";

jest.mock('../../src/redux/store');

describe('reducer converter testings', () => {
  const state = {
    ...INITIAL_STATE,
  };

  test('should handle initial state', () => {
    const action = { type: deleteConverter.rejected.type }
    expect(converterSlice(state, action)).toEqual(state)
  });

  it('clearConvertFileSuccess', () => {
    const action = { type: clearConvertFileSuccess.type, payload: { convertFileSuccess: false } };
    const stateResults = converterSlice(state, action);
    expect(stateResults.convertFileSuccess).toBe(false);
  });

});
