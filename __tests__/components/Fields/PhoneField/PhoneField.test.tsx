import React from 'react';
import "@testing-library/jest-dom";

import {render, fireEvent, screen} from '@testing-library/react';
import PhoneField from "../../../../src/components/Fields/PhoneField/PhoneField";

describe('PhoneField', () => {
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
    it('renders without crashing', () => {
        const { getByTestId } = render(<PhoneField />);
        expect(getByTestId('phone-field')).toBeInTheDocument();
    });

    it('renders the label', () => {
        render(<PhoneField label="Phone Number" />);
        const labelElement = screen.queryByText('Phone Number');
        expect(labelElement).toBeInTheDocument();
    });

    it('renders the placeholder', () => {
        const { getByPlaceholderText } = render(<PhoneField placeholder="Enter your phone number" />);
        expect(getByPlaceholderText('Enter your phone number')).toBeInTheDocument();
    });

    it('calls onChange when the input value changes', () => {
        const mockOnChange = jest.fn();
        const { getByTestId } = render(<PhoneField onChange={mockOnChange} />);
        fireEvent.change(getByTestId('phone-field-input'), { target: { value: '1234567890' } });
        expect(mockOnChange).toHaveBeenCalled();
    });
});
