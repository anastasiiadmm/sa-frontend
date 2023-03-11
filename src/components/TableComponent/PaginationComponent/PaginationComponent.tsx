import { Button } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import 'components/TableComponent/PaginationComponent/_paginationComponent.scss';
import nextIcons from 'assets/images/icons/white-arrow.svg';

interface Props {
  params: any | undefined;
  pagePrevHandler: () => void;
  pageNextHandler: () => void;
}

const PaginationComponent: React.FC<Props> = ({ params, pagePrevHandler, pageNextHandler }) => {
  const b = bem('pagination');

  return (
    <div className={b()}>
      <div className={b('pagination_show')}>
        <div className='glav_pagination'>
          <div className='next_table'>
            <Button
              disabled={params?.previous === null}
              onClick={pagePrevHandler}
              icon={<img src={nextIcons} alt='backIcons' />}
              className='pagination_buttons pagination_buttons-prev'
            />
            <Button
              role='button'
              disabled={params?.next === null}
              onClick={pageNextHandler}
              icon={<img src={nextIcons} alt='nextIcons' />}
              className='pagination_buttons pagination_buttons-next'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
