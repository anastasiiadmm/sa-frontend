import '@testing-library/jest-dom';

import converterSlice, {
  clearConvertFileSuccess,
  deleteConverter,
  INITIAL_STATE
} from "../../src/redux/converter/converterSlice";

jest.mock('../../src/redux/store');

describe('reducer converter testings', () => {

  test('should handle initial state', () => {
    const action = { type: deleteConverter.rejected.type }
    expect(converterSlice(INITIAL_STATE, action)).toEqual(INITIAL_STATE)
  });

  it('clearConvertFileSuccess', () => {
    const action = { type: clearConvertFileSuccess.type, payload: { convertFileSuccess: false } };
    const stateResults = converterSlice(INITIAL_STATE, action);
    expect(stateResults.convertFileSuccess).toBe(false);
  });

});
