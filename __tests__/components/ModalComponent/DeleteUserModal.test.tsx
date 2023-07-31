import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../../../__mocks__/matchMedia.mock';
import DeleteUserModal
    from "../../../src/components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal";

describe('DeleteUserModal', () => {
    let handleDeleteCancel: jest.Mock;
    let deleteUserHandler: jest.Mock;

    beforeEach(() => {
        handleDeleteCancel = jest.fn();
        deleteUserHandler = jest.fn();
    });

    it('renders alert message', () => {
        const { getByText } = render(
            <DeleteUserModal
                handleDeleteCancel={handleDeleteCancel}
                deleteUserHandler={deleteUserHandler}
                loading={false}
            />
        );

        expect(getByText(/Вы уверены, что хотите удалить пользователя?/i)).toBeInTheDocument();
    });

    it('triggers handleDeleteCancel on cancel button click', async () => {
        const { getByText } = render(
            <DeleteUserModal
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
            <DeleteUserModal
                handleDeleteCancel={handleDeleteCancel}
                deleteUserHandler={deleteUserHandler}
                loading={false}
            />
        );

        fireEvent.click(getByText('Удалить'));
        await waitFor(() => expect(deleteUserHandler).toHaveBeenCalledTimes(1));
    });
});
