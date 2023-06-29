import React from 'react';
import "@testing-library/jest-dom";

import { render, fireEvent, screen } from '@testing-library/react';
import DefaultField from "../../../../src/components/Fields/DefaultField/DefaultField";

describe('DefaultField', () => {
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
        const label = 'Test Label';
        render(<DefaultField label={label} />);
        const labelElement = screen.queryByText(label);
        expect(labelElement).toBeInTheDocument()
    });

    test('calls onChange callback when input value changes', () => {
        const onChangeMock = jest.fn();
        const { getByRole } = render(<DefaultField onChange={onChangeMock} />);
        const inputElement = getByRole('textbox');
        const inputValue = 'Test Value';

        fireEvent.change(inputElement, { target: { value: inputValue } });
        expect(onChangeMock).toHaveBeenCalled();
    });

    test('renders with placeholder text', () => {
        const placeholder = 'Test Placeholder';
        const { getByPlaceholderText } = render(<DefaultField placeholder={placeholder} />);
        const inputElement = getByPlaceholderText(placeholder);
        expect(inputElement).toBeInTheDocument();
    });

    test('renders as read-only when readOnly prop is true', () => {
        const { getByRole } = render(<DefaultField readOnly />);
        const inputElement = getByRole('textbox');
        expect(inputElement).toHaveAttribute('readonly');
    });

});
