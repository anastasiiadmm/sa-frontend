import { useEffect, useRef } from 'react';

import useWindowWidth from 'hooks/useWindowWidth';
import {
  apksPagination,
  IAccount,
  IApk,
  IConverter,
  pagination,
  Requestor,
  userVehicles,
} from 'interfaces';

interface UseInfiniteScrollProps {
  pageNextHandler: () => void;
  pagination: apksPagination | pagination | null;
  allItems: IApk[] | IAccount[] | Requestor[] | IConverter[] | userVehicles[];
  widthNumber: number;
}

const useInfiniteScroll = ({
  pageNextHandler,
  pagination,
  allItems,
  widthNumber,
}: UseInfiniteScrollProps) => {
  const lastScrollTop = useRef(0);
  const windowWidth = useWindowWidth();

  const loadMoreItems = () => {
    pageNextHandler();
  };

  const onScrollHandler = () => {
    const element = document.querySelector('.ant-layout-content');
    const threshold = 10;
    if (element) {
      const { scrollHeight, scrollTop, clientHeight } = element;

      if (
        scrollTop > lastScrollTop.current &&
        scrollHeight - scrollTop <= clientHeight + threshold &&
        pagination?.next
      ) {
        loadMoreItems();
      }

      lastScrollTop.current = scrollTop;
    }
  };

  useEffect(() => {
    if (windowWidth <= widthNumber) {
      const element = document.querySelector('.ant-layout-content');
      if (element) {
        element.addEventListener('scroll', onScrollHandler);
      }

      return () => {
        if (element) {
          element.removeEventListener('scroll', onScrollHandler);
        }
      };
    }
  }, [windowWidth, allItems]);
};

export default useInfiniteScroll;
