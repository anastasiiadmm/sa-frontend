import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Errors from "../../../src/components/Errors/Errors";
import {BrowserRouter} from "react-router-dom";


describe('Errors', () => {
    test('renders a 404 error message when status is 404', () => {
        render(<BrowserRouter><Errors status={404} detail={'Test Detail'} /></BrowserRouter>);

        expect(screen.getByText('Test Detail')).toBeInTheDocument();
        expect(screen.getByText('Попробуйте перейти на главную страницу или другую интересующую вас')).toBeInTheDocument();
    });

    test('renders a generic error message when status is not 404', () => {
        render(<BrowserRouter><Errors status={500} detail={'Test Detail'} /></BrowserRouter>);

        expect(screen.getByText('Test Detail')).toBeInTheDocument();
        expect(screen.getByText('Попробуйте перейти на главную страницу или другую интересующую вас')).toBeInTheDocument();
    });

    test('renders a default error message when no detail is provided', () => {
        render(<BrowserRouter><Errors status={500} detail={null} /></BrowserRouter>);

        expect(screen.getByText('Что-то пошло не так!')).toBeInTheDocument();
        expect(screen.getByText('Попробуйте перейти на главную страницу или другую интересующую вас')).toBeInTheDocument();
    });
});
