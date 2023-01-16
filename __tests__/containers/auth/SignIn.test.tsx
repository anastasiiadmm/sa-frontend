import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import '../../../__mocks__/matchMedia.mock';
import '@testing-library/jest-dom';
import '../../../__mocks__/utils';
import { mockedUseSelectors } from '../../../__mocks__/utils';
import SignIn from "../../../src/containers/SignIn/SignIn";

describe('<SignIn />', () => {
  test('Render component toMatchSnapshot()', () => {
    mockedUseSelectors.mockReturnValue([]);

    const tree = renderer
      .create(
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});