import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '../../../__mocks__/matchMedia.mock';
import DrawerComponent from "../../../src/components/DrawerComponent/DrawerComponent";

const vehicleData = {
    description: 'Test-0000',
    id: 93,
    last_latitude: 0.00000,
    last_longitude: 0.00000,
    speed: 0.0,
    license_plate: 'oQ34D',
    vin: 'oQ34D',
    operator: {
        first_name: 'Test',
        last_name: 'Test',
        middle_name: 'Test',
    }
}

describe('DrawerComponent', () => {
    let onCloseMock = jest.fn();

    beforeEach(() => {
        onCloseMock = jest.fn();
        render(
            <Router>
                <DrawerComponent onClose={onCloseMock} open={true} vehicle={vehicleData} />
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
        expect(screen.getByPlaceholderText('Фамилия')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Отчество')).toBeInTheDocument();
    });

    it('should redirect to the correct route when the button is clicked', () => {
        const viewButton = screen.getByText('Посмотреть полностью');
        userEvent.click(viewButton);
        expect(window.location.pathname).toBe(`/profile-technique/${vehicleData?.id}`);
    });
});
