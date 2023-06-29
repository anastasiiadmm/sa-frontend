import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import "@testing-library/jest-dom";
import EmailField from "../../../../src/components/Fields/EmailField/EmailField";

describe('EmailField', () => {
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
    test('displays label correctly', () => {
        const label = 'Email';
        render(<EmailField label={label} />);
        const labelElement = screen.queryByText(label);
        expect(labelElement).toBeInTheDocument()
    });

    test('calls onChange callback when input value changes', () => {
        const onChangeMock = jest.fn();
        const { getByRole } = render(<EmailField onChange={onChangeMock} />);
        const inputElement = getByRole('textbox');
        const inputValue = 'test@example.com';

        fireEvent.change(inputElement, { target: { value: inputValue } });
        expect(onChangeMock).toHaveBeenCalled();
    });

    test('renders with placeholder text', () => {
        const placeholder = 'Enter your email';
        const { getByPlaceholderText } = render(<EmailField placeholder={placeholder} />);
        const inputElement = getByPlaceholderText(placeholder);
        expect(inputElement).toBeInTheDocument();
    });

    test('renders as read-only when readOnly prop is true', () => {
        const { getByRole } = render(<EmailField readOnly />);
        const inputElement = getByRole('textbox');
        expect(inputElement).toHaveAttribute('readonly');
    });

});
