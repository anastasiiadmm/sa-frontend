import { Button, Card, Spin, Typography } from 'antd';
import bem from 'easy-bem';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';

import close from 'assets/images/icons/close.svg';
import Errors from 'components/Errors/Errors';
import DeleteUserModal from 'components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import PaginationComponent from 'components/TableComponent/PaginationComponent/PaginationComponent';
import { IConverter } from 'interfaces/IConverter';
import { converterSelector, fetchConverterList } from 'redux/converter/converterSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { dateWithTimeFormat, getPageNumber, getPageNumberPrevious } from 'utils/helper';
import 'containers/Converter/Files/_files.scss';

const { Title, Text } = Typography;

const Files = () => {
  const b = bem('Files');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { converterList, converterListPagination, converterListLoading, converterListError } =
    useAppSelector(converterSelector);
  const [filters, setFilters] = useState({
    page: converterListPagination?.next
      ? Number(getPageNumber(converterListPagination?.next))
      : Number(getPageNumberPrevious(converterListPagination?.previous)),
  });

  useEffect(() => {
    const data = {
      query: {
        page: filters?.page || 1,
      },
    };
    dispatch(fetchConverterList({ data }));
  }, [dispatch, filters]);

  const showDeleteModal = () => {
    setIsModalOpen(true);
  };

  const handleDeleteOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const pagePrevHandler = () => {
    setFilters({ ...filters, page: filters.page - 1 });
  };

  const pageNextHandler = () => {
    setFilters({ ...filters, page: filters.page + 1 });
  };

  if (converterListError) {
    return <Errors status={converterListError?.status} detail={converterListError?.detail} />;
  }

  return (
    <>
      {converterListLoading ? (
        <Spin className='spin' />
      ) : (
        <div>
          <div className={b('history-list')}>
            {converterList?.map((converter: IConverter) => {
              return (
                <Card className={b('card-file-block')} key={converter?.id}>
                  <div className={b('converter-card')}>
                    <div className={b('info')}>
                      <div>
                        <Title className={b('heading')} level={5}>
                          {converter?.task_UID && converter?.file
                            ? converter.task_UID +
                              converter.file.substring(converter.file.lastIndexOf('.'))
                            : converter?.task_UID}
                        </Title>
                        <Text type='secondary'>
                          {moment(converter?.created_at, 'DD/MM/YYYY HH:mm:ssZ').format(
                            dateWithTimeFormat,
                          )}
                        </Text>
                      </div>
                      <Button
                        onClick={showDeleteModal}
                        className={b('close-button')}
                        icon={<img src={close} alt={close} />}
                      />
                    </div>
                    <Button className='button-style'>Скачать</Button>
                  </div>
                </Card>
              );
            })}
          </div>
          <PaginationComponent
            params={
              converterListLoading
                ? { previous: null, next: null, count: 0 }
                : converterListPagination
            }
            pagePrevHandler={pagePrevHandler}
            pageNextHandler={pageNextHandler}
          />
        </div>
      )}

      <ModalComponent
        dividerShow={false}
        open={isModalOpen}
        handleOk={handleDeleteOkCancel}
        handleCancel={handleDeleteOkCancel}
      >
        <DeleteUserModal
          title='Удалить?'
          fullName='файл'
          handleDeleteCancel={handleDeleteOkCancel}
        />
      </ModalComponent>
    </>
  );
};

export default Files;
