import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../../../__mocks__/matchMedia.mock';
import SkeletonBlock from "../../../src/components/SkeletonBlock/SkeletonBlock";

afterEach(cleanup);

describe('SkeletonBlock', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render(<SkeletonBlock active={true} num={1} />);
        expect(getByTestId('loading')).toBeTruthy();
    });

    it('renders correct number of Skeletons when active', () => {
        const { container } = render(<SkeletonBlock active={true} num={3} />);
        expect(container.querySelectorAll('.ant-skeleton').length).toBe(3);
    });

    it('', () => {
        const { container } = render(<SkeletonBlock active={false} num={0} />);
        expect(container.querySelectorAll('.ant-skeleton').length).toBe(0);
    });
});
