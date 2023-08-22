import { Button, Card, Spin, Typography } from 'antd';
import bem from 'easy-bem';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import arrowDown from 'assets/images/icons/arrow-down.svg';
import converterFile from 'assets/images/icons/converter-file.svg';
import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import DeleteUserModal from 'components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import PaginationComponent from 'components/TableComponent/PaginationComponent/PaginationComponent';
import useWindowWidth from 'hooks/useWindowWidth';
import { IConverter } from 'interfaces/IConverter';
import { converterSelector, fetchConverterList } from 'redux/converter/converterSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { dateWithTimeFormat, getPageNumber, getPageNumberPrevious } from 'utils/helper';
import 'containers/Converter/_converter.scss';

const { Title, Text } = Typography;

const Converter = () => {
  const b = bem('Converter');
  const dispatch = useAppDispatch();
  const { converterList, converterListPagination, converterListLoading, converterListError } =
    useAppSelector(converterSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const windowWidth = useWindowWidth();
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

  if (windowWidth >= 990 && converterListError) {
    return <Errors status={converterListError?.status} detail={converterListError?.detail} />;
  }

  return (
    <>
      <div className={b('')} data-testid='converter-test-id'>
        <Card>
          <div className={b('converter-block')}>
            <div>
              <img src={converterFile} alt={converterFile} />
            </div>
            <div className={b('convert-item')}>
              <Title className={b('title')} level={3}>
                Конвертер
              </Title>
              <p>Сконвертируйте ваши файлы в любой формат</p>
              <div className={b('select-block')}>
                из{' '}
                <FormField
                  className={b('select-field')}
                  type='select'
                  customStyle='80px'
                  suffixIcon={<img src={arrowDown} alt='arrowDown' />}
                />{' '}
                в{' '}
                <FormField
                  className={b('select-field')}
                  type='select'
                  customStyle='80px'
                  suffixIcon={<img src={arrowDown} alt='arrowDown' />}
                />
              </div>
              <Button className='button-style'>Выбрать файл</Button>
            </div>
          </div>
        </Card>

        {windowWidth <= 990 ? (
          <Link to='/files'>
            <Card hoverable style={{ width: 170 }}>
              <div className={b('files-link-block')}>
                <img src={converterFile} alt='converterFile' className={b('link-img')} />
                <Text strong>Мои файлы</Text>
              </div>
            </Card>
          </Link>
        ) : (
          <>
            <Text className={b('title title-heading')}>История конвертаций</Text>
            {converterListLoading ? (
              <Spin />
            ) : (
              <div>
                <div className={b('history-list')}>
                  {converterList?.map((converter: IConverter) => {
                    return (
                      <Card className={b('card-file-block')} key={converter?.id}>
                        <div className={b('converter-card')}>
                          <Title className={b('heading')} level={5}>
                            {converter?.task_UID && converter?.file
                              ? converter.task_UID +
                                converter.file.substring(converter.file.lastIndexOf('.'))
                              : converter?.task_UID}
                          </Title>
                          <Text type='secondary' className={b('subtitle')}>
                            {moment(converter?.created_at, 'DD/MM/YYYY HH:mm:ssZ').format(
                              dateWithTimeFormat,
                            )}
                          </Text>
                          <Button className='button-style button-width'>Скачать</Button>
                          <Button
                            className='button-style button-width'
                            danger
                            onClick={showDeleteModal}
                          >
                            Удалить
                          </Button>
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
          </>
        )}
      </div>

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

export default Converter;
