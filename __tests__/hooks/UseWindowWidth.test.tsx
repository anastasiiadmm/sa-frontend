import { render, act } from '@testing-library/react';
import "@testing-library/jest-dom";
import UseWindowWidth from "../../src/hooks/useWindowWidth";
jest.mock('../../src/redux/store');

(global as any).innerWidth = 500;
const resizeWindow = (x: number) => {
    (global as any).innerWidth = x;
    window.dispatchEvent(new Event('resize'));
};

describe('UseWindowWidth', () => {
    it('returns initial window width', () => {
        let result: number;
        function TestComponent() {
            result = UseWindowWidth();
            return null;
        }

        render(<TestComponent />);

        expect(result).toBe(500);
    });

    it('updates width after window resize', () => {
        let result: number;
        function TestComponent() {
            result = UseWindowWidth();
            return null;
        }

        render(<TestComponent />);

        act(() => {
            resizeWindow(800);
        });

        expect(result).toBe(800);
    });

    it('cleans up event listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        let result: number;
        function TestComponent() {
            result = UseWindowWidth();
            return null;
        }

        const { unmount } = render(<TestComponent />);
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
});
