import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ResultComponent from "../../../src/components/ResultComponent/ResultComponent";

describe('ResultComponent', () => {
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
    it('renders with an icon if provided', () => {
        const icon = <i data-testid="icon" className="fas fa-check"></i>;
        render(<ResultComponent status="success" icon={icon} />);
        const iconElement = screen.getByTestId('icon');
        expect(iconElement).toBeInTheDocument();
    });

    it('renders with the correct title', () => {
        render(<ResultComponent status="success" title="Success Title" />);
        const titleElement = screen.getByText('Success Title');
        expect(titleElement).toBeInTheDocument();
    });

    it('renders with the correct subtitle', () => {
        render(<ResultComponent status="success" subTitle="Success SubTitle" />);
        const subtitleElement = screen.getByText('Success SubTitle');
        expect(subtitleElement).toBeInTheDocument();
    });

    it('renders with the correct technique name', () => {
        render(<ResultComponent status="success" techniqueName="Technique Name" />);
        const techniqueNameElement = screen.getByText('Technique Name');
        expect(techniqueNameElement).toBeInTheDocument();
    });
});
