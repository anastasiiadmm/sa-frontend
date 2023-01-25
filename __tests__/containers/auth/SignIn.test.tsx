import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render } from "@testing-library/react";
import '../../../__mocks__/matchMedia.mock';
import '@testing-library/jest-dom';
import '../../../__mocks__/utils';
import { mockedUseSelectors } from '../../../__mocks__/utils';
import SignIn from "../../../src/containers/SignIn/SignIn";
import ModalComponent from "../../../src/components/ModalComponent/ModalComponent";
import ModalPasswordReset
  from "../../../src/components/ModalComponent/ModalChildrenComponents/ModalPasswordReset/ModalPasswordReset";

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

  it("Opening a modal and closing it", () => {
    const handleClose = jest.fn();
    const yesDeleteHandler = jest.fn();

    render(
      <ModalComponent open title='Восстановление пароля' handleOk={yesDeleteHandler} handleCancel={handleClose}>
        <ModalPasswordReset />
      </ModalComponent>
    );
  });
});