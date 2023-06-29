import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeneratedPasswordModal
    from "../../../src/components/ModalComponent/ModalChildrenComponents/GeneratedPasswordModal/GeneratedPasswordModal";

describe('<GeneratedPasswordModal />', () => {
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
    it('renders the subtitle and password', () => {
        const subtitle = 'Test Subtitle';
        const password = 'TestPassword';

        const { getByText } = render(<GeneratedPasswordModal subtitle={subtitle} generatedPassword={password} onClose={() => {}} />);

        expect(getByText(subtitle)).toBeInTheDocument();
        expect(getByText(password)).toBeInTheDocument();
    });

    it('renders the OK button and handles click event', () => {
        const onClose = jest.fn();
        const { getByTestId } = render(<GeneratedPasswordModal subtitle='Test Subtitle' generatedPassword='TestPassword' onClose={onClose} />);

        const okButton = getByTestId('ok-button');
        fireEvent.click(okButton);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
