import * as reduxHooks from 'react-redux';

jest.mock('../src/redux/store');
jest.mock('react-redux');

export const mockedUseSelectors = jest.spyOn(reduxHooks, 'useSelector');
export const mockedDispatch = jest.spyOn(reduxHooks, 'useDispatch');
