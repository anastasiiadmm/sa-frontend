import { Button, Card, message, Spin, Typography } from 'antd';
import bem from 'easy-bem';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';

import close from 'assets/images/icons/close.svg';
import DrawerComponent from 'components/DrawerComponent/DrawerComponent';
import Errors from 'components/Errors/Errors';
import DeleteModal from 'components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import PaginationComponent from 'components/TableComponent/PaginationComponent/PaginationComponent';
import useWindowWidth from 'hooks/useWindowWidth';
import { IConverter } from 'interfaces/IConverter';
import {
  converterSelector,
  deleteConverter,
  fetchConverterList,
} from 'redux/converter/converterSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  dateWithTimeFormat,
  downloadConvertedFileHandler,
  getPageNumber,
  getPageNumberPrevious,
} from 'utils/helper';
import 'containers/Converter/Files/_files.scss';

const { Title, Text } = Typography;

const Files = () => {
  const b = bem('Files');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const {
    converterList,
    converterListPagination,
    converterListLoading,
    converterListError,
    deleteConverterLoading,
    deleteConverterError,
  } = useAppSelector(converterSelector);
  const windowWidth = useWindowWidth();
  const [filters, setFilters] = useState({
    page: converterListPagination?.next
      ? Number(getPageNumber(converterListPagination?.next))
      : Number(getPageNumberPrevious(converterListPagination?.previous)),
  });
  const [fileName, setFileName] = useState<{ id: number | null; name: string }>({
    id: null,
    name: '',
  });
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const data = {
      query: {
        page: filters?.page || 1,
      },
    };
    dispatch(fetchConverterList({ data }));
  }, [dispatch, filters]);

  const showDeleteHandler = (id: number, name: string) => {
    if (windowWidth <= 600) {
      setOpen(true);
    } else {
      setIsModalOpen(true);
    }
    setFileName({ id, name });
  };

  const handleDownloadClick = (file: string) => {
    setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [file]: true }));
    downloadConvertedFileHandler(file, () =>
      setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [file]: false })),
    );
  };

  const handleDeleteModalOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const pagePrevHandler = () => {
    setFilters({ ...filters, page: filters.page - 1 });
  };

  const pageNextHandler = () => {
    setFilters({ ...filters, page: filters.page + 1 });
  };

  const onClose = () => {
    setOpen(false);
  };

  const deleteHandler = async () => {
    try {
      await dispatch(deleteConverter(fileName?.id)).unwrap();
      setFileName({ id: null, name: '' });
      if (windowWidth <= 600) {
        setOpen(false);
      } else {
        setIsModalOpen(!isModalOpen);
      }
    } catch (e) {
      await message.error(`${e?.detail}`);
    }
  };

  if (converterListError || deleteConverterError) {
    return <Errors status={converterListError?.status} detail={converterListError?.detail} />;
  }

  return (
    <>
      {converterListLoading ? (
        <Spin className='spin' />
      ) : (
        <>
          <div className={b('history-list')}>
            {converterList?.map((converter: IConverter) => {
              const isLoadingState = isLoading[converter?.file];

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
                        onClick={() => showDeleteHandler(converter?.id, converter?.task_UID)}
                        className={b('close-button')}
                        icon={<img src={close} alt={close} />}
                      />
                    </div>
                    <Button
                      className='button-style'
                      loading={isLoadingState}
                      onClick={() => handleDownloadClick(converter?.file)}
                    >
                      Скачать
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
          <PaginationComponent
            paginationFilesBlock='pagination-bg'
            params={
              converterListLoading
                ? { previous: null, next: null, count: 0 }
                : converterListPagination
            }
            pagePrevHandler={pagePrevHandler}
            pageNextHandler={pageNextHandler}
          />
        </>
      )}

      <ModalComponent
        dividerShow={false}
        open={isModalOpen}
        handleOk={handleDeleteModalOkCancel}
        handleCancel={handleDeleteModalOkCancel}
      >
        <DeleteModal
          title='Удалить?'
          loading={deleteConverterLoading}
          fullName={fileName?.name}
          handleDeleteCancel={handleDeleteModalOkCancel}
          deleteButtonHandler={deleteHandler}
        />
      </ModalComponent>

      <DrawerComponent open={open} onClose={onClose} placement='bottom' height='auto'>
        <DeleteModal
          title='Удалить?'
          loading={deleteConverterLoading}
          fullName={fileName?.name}
          handleDeleteCancel={onClose}
          deleteButtonHandler={deleteHandler}
        />
      </DrawerComponent>
    </>
  );
};

export default Files;
