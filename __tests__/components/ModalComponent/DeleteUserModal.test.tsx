import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteUserModal
    from "../../../src/components/ModalComponent/ModalChildrenComponents/DeleteUserModal/DeleteUserModal";

describe('DeleteUserModal', () => {
    let handleDeleteCancel: jest.Mock;
    let deleteUserHandler: jest.Mock;

    beforeAll(() => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }))
        });
    });

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

        expect(getByText(/Вы действительно хотите удалить профиль пользователя?/i)).toBeInTheDocument();
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
