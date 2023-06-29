import "@testing-library/jest-dom";

import { render } from '@testing-library/react';
import AlertComponent from "../../../src/components/AlertComponent/AlertComponent";

describe('AlertComponent', () => {
    test('renders message', () => {
        const { getByText } = render(<AlertComponent message="Test Message" type="success" showIcon />);
        expect(getByText("Test Message")).toBeInTheDocument();
    });

    test('renders with correct type', () => {
        const { container } = render(<AlertComponent message="Test Message" type="error" showIcon />);
        expect(container.firstChild).toHaveClass("ant-alert-error");
    });

    test('renders with icon', () => {
        const { container } = render(<AlertComponent message="Test Message" type="success" showIcon />);
        expect(container.querySelector(".ant-alert-icon")).toBeInTheDocument();
    });

    test('renders without icon', () => {
        const { container } = render(<AlertComponent message="Test Message" type="success" showIcon={false} />);
        expect(container.querySelector(".ant-alert-icon")).toBeNull();
    });
});
