import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import NotFound from "../../../../src/components/Errors/NotFound/NotFound";

describe('NotFound', () => {
    const defaultProps = {
        title: 'Test Title',
        text: 'Test Text',
        status: 404,
        statusBool: true,
        showButton: true,
    };

    it('renders without crashing', () => {
        render(<NotFound {...defaultProps} />, { wrapper: MemoryRouter });
    });

    it('displays the title', () => {
        const { getByText } = render(<NotFound {...defaultProps} />, { wrapper: MemoryRouter });
        expect(getByText('Test Title')).toBeInTheDocument();
    });

    it('displays the text', () => {
        const { getByText } = render(<NotFound {...defaultProps} />, { wrapper: MemoryRouter });
        expect(getByText('Test Text')).toBeInTheDocument();
    });

    it('displays the status if statusBool is true', () => {
        const { getByText } = render(<NotFound {...defaultProps} />, { wrapper: MemoryRouter });
        expect(getByText('404')).toBeInTheDocument();
    });

    it('does not display the status if statusBool is false', () => {
        const { queryByText } = render(
            <NotFound {...defaultProps} statusBool={false} />,
            { wrapper: MemoryRouter }
        );
        expect(queryByText('404')).toBeNull();
    });

    it('displays the button if showButton is true', () => {
        const { getByText } = render(<NotFound {...defaultProps} />, { wrapper: MemoryRouter });
        const button = getByText('На главную');
        expect(button).toBeInTheDocument();
    });

    it('does not display the button if showButton is false', () => {
        const { queryByText } = render(
            <NotFound {...defaultProps} showButton={false} />,
            { wrapper: MemoryRouter }
        );
        expect(queryByText('На главную')).toBeNull();
    });

    it('navigates to the homepage when the button is clicked', () => {
        const { getByText } = render(<NotFound {...defaultProps} />, { wrapper: MemoryRouter });
        const button = getByText('На главную');
        fireEvent.click(button);

        expect(window.location.pathname).toBe('/');
    });
});
