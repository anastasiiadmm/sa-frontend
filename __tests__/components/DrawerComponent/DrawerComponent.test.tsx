import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DrawerComponent from "../../../src/components/DrawerComponent/DrawerComponent";

describe('DrawerComponent', () => {
    let onCloseMock = jest.fn();

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
        onCloseMock = jest.fn();
        render(
            <Router>
                <DrawerComponent onClose={onCloseMock} open={true} />
            </Router>
        );
    });

    it('should close the drawer when the close button is clicked', () => {
        const closeButton = screen.getByAltText('close');
        userEvent.click(closeButton);
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('should display the correct information in the drawer', () => {
        expect(screen.getByPlaceholderText('Название техники')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Гос номер')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('VIN код')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Фамилия')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Отчество')).toBeInTheDocument();
    });

    it('should redirect to the correct route when the button is clicked', () => {
        const viewButton = screen.getByText('Посмотреть полностью');
        userEvent.click(viewButton);
        expect(window.location.pathname).toBe('/technique-map');
    });
});
