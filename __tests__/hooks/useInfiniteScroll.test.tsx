import { renderHook, act } from '@testing-library/react-hooks';
import useInfiniteScroll from "../../src/hooks/useInfiniteScroll";
import "@testing-library/jest-dom";
import { IAccount, IApk, IConverter, Requestor } from "../../src/interfaces";
import useWindowWidth from "../../src/hooks/useWindowWidth";

jest.mock('../../src/hooks/useWindowWidth');

describe('useInfiniteScroll', () => {

  beforeEach(() => {
    const container = document.createElement('div');
    container.className = 'ant-layout-content';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should call pageNextHandler when scrolled to bottom', () => {
    const mockPageNextHandler = jest.fn();
    const mockPagination = {
      next: 2,
    };
    const mockAllItems: IApk[] | IAccount[] | Requestor[] | IConverter[] = [];

    useWindowWidth.mockReturnValue(980);

    const { rerender } = renderHook(() => useInfiniteScroll({
      pageNextHandler: mockPageNextHandler,
      pagination: mockPagination,
      allItems: mockAllItems,
      widthNumber: 980,
    }));

    const element = document.querySelector('.ant-layout-content');
    if (element) {
      Object.defineProperty(element, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(element, 'scrollTop', { value: 800, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: 200, configurable: true });

      act(() => {
        const event = new Event('scroll');
        element.dispatchEvent(event);
        rerender();
      });

      expect(mockPageNextHandler).toHaveBeenCalled();
    }
  });
});
