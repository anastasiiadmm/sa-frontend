import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateNewUserCredentials
    from "../../../src/components/ModalComponent/ModalChildrenComponents/CreateNewUserCredentials/CreateNewUserCredentials";


describe('CreateNewUserCredentials', () => {
    let handleOkCancel:any;

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
        handleOkCancel = jest.fn();
    });

    it('renders form fields with initial values', () => {
        render(
            <CreateNewUserCredentials
                handleOkCancel={handleOkCancel}
                userCreateData={{
                    username: 'testuser',
                    password: 'testpassword'
                }}
            />
        );
        const username:any = screen.queryByPlaceholderText('Логин');
        const password:any = screen.queryByPlaceholderText('Пароль');
        expect(username.value).toBe('testuser');
        expect(password.value).toBe('testpassword');
    });

    it('triggers handleOkCancel on button click', async () => {
        const { getByText } = render(
            <CreateNewUserCredentials
                handleOkCancel={handleOkCancel}
                userCreateData={{
                    username: 'testuser',
                    password: 'testpassword'
                }}
            />
        );

        fireEvent.click(getByText('Готово'));
        await waitFor(() => expect(handleOkCancel).toHaveBeenCalledTimes(1));
    });
});
