import { Button } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import nextIcons from 'assets/images/icons/white-arrow.svg';
import { pagination } from 'interfaces';
import 'components/TableComponent/PaginationComponent/_paginationComponent.scss';

interface Props {
  params: pagination | null | undefined;
  pagePrevHandler?: () => void;
  pageNextHandler?: () => void;
  paginationFilesBlock?: string;
}

const PaginationComponent: React.FC<Props> = ({
  params,
  pagePrevHandler,
  pageNextHandler,
  paginationFilesBlock,
}) => {
  const b = bem('pagination');

  return (
    <div className={`${b('')} ${paginationFilesBlock}`}>
      <div className={b('pagination_show')}>
        <div className='glav_pagination'>
          <div className='next_table'>
            <Button
              disabled={!params?.previous}
              onClick={pagePrevHandler}
              icon={<img src={nextIcons} alt='backIcons' />}
              className='pagination_buttons pagination_buttons-prev'
            />
            <Button
              role='button'
              disabled={!params?.next}
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
