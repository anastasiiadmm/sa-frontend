import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../../../__mocks__/matchMedia.mock';
import DeleteModal from "../../../src/components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal";

describe('DeleteModal', () => {
    let handleDeleteCancel: jest.Mock;
    let deleteUserHandler: jest.Mock;

    beforeEach(() => {
        handleDeleteCancel = jest.fn();
        deleteUserHandler = jest.fn();
    });

    it('renders alert message', () => {
        const { queryByText } = render(
          <DeleteModal
            handleDeleteCancel={handleDeleteCancel}
            deleteUserHandler={deleteUserHandler}
            loading={false}
            title='Вы уверены, что хотите удалить пользователя?'
            fullName='Test'
          />
        );

        expect(queryByText(/Вы уверены, что хотите удалить пользователя?/i)).toBeInTheDocument();
        expect(queryByText('Test')).toBeInTheDocument();
    });

    it('triggers handleDeleteCancel on cancel button click', async () => {
        const { getByText } = render(
            <DeleteModal
                fullName=''
                handleDeleteCancel={handleDeleteCancel}
                deleteUserHandler={deleteUserHandler}
                loading={false}
            />
        );

        fireEvent.click(getByText('Отменить'));
        await waitFor(() => expect(handleDeleteCancel).toHaveBeenCalledTimes(1));
    });

    it('triggers deleteUserHandler on delete button click', async () => {
        const { getByText } = render(
            <DeleteModal
                fullName=''
                handleDeleteCancel={handleDeleteCancel}
                deleteUserHandler={deleteUserHandler}
                loading={false}
            />
        );

        fireEvent.click(getByText('Удалить'));
        await waitFor(() => expect(deleteUserHandler).toHaveBeenCalledTimes(1));
    });
});
