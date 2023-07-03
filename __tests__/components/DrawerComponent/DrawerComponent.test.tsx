import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '../../../__mocks__/matchMedia.mock';
import DrawerComponent from "../../../src/components/DrawerComponent/DrawerComponent";
import { act } from "react-dom/test-utils";

describe('DrawerComponent', () => {
    let onCloseMock = jest.fn();

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

    it('should redirect to the correct route when the button is clicked', async () => {
        const viewButton = screen.getByText('Посмотреть полностью');
        await act(async () => {
            userEvent.click(viewButton);
            expect(window.location.pathname).toBe('/technique-map');
        });
    });
});
