import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import CheckboxField from "../../../../src/components/Fields/CheckboxField/CheckboxField";

describe('CheckboxField', () => {
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
    test('renders checkbox with label', () => {
        const label = 'Test Checkbox';
        render(<CheckboxField label={label} />);

        const checkbox = screen.getByLabelText(label);
        expect(checkbox).toBeInTheDocument();
    });

    test('calls onChange when checkbox is clicked', () => {
        const onChange = jest.fn();
        render(<CheckboxField label="Test Checkbox" onChange={onChange} />);

        const checkbox = screen.getByLabelText('Test Checkbox');
        fireEvent.click(checkbox);

        expect(onChange).toHaveBeenCalled();
    });

    test('sets the checked prop correctly', () => {
        render(<CheckboxField label="Test Checkbox" checked={true} />);

        const checkbox = screen.getByLabelText('Test Checkbox');
        expect(checkbox).toBeChecked();
    });
});
