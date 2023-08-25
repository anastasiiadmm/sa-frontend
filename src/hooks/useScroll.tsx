import React, { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  loadMore: () => Promise<void>;
}

const UseScroll: React.FC<Props> = ({ children, loadMore }) => {
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);

    return function () {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const scrollHandler = () => {
    if (fetching) return;

    const scrollOffset = 200;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollHeight - (scrollTop + windowHeight) < scrollOffset) {
      setFetching(true);
      loadMore()
        .then(() => {
          setFetching(false);
        })
        .catch(() => {
          setFetching(false);
        });
    }
  };

  return <div>{children}</div>;
};

export default UseScroll;
