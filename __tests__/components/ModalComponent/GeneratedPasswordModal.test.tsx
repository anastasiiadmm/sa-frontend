import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '../../../__mocks__/matchMedia.mock';
import '@testing-library/jest-dom';
import GeneratedPasswordModal
    from "../../../src/components/ModalComponent/ModalChildrenComponents/GeneratedPasswordModal/GeneratedPasswordModal";

describe('<GeneratedPasswordModal />', () => {
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
