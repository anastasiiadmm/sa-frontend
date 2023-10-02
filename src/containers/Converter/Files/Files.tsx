import { Button, Card, message, Spin, Typography } from 'antd';
import bem from 'easy-bem';
import moment from 'moment/moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import close from 'assets/images/icons/close.svg';
import notFoundImg from 'assets/images/notFound.svg';
import DrawerComponent from 'components/DrawerComponent/DrawerComponent';
import Errors from 'components/Errors/Errors';
import DeleteModal from 'components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
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
  dateWithTimeSecFormat,
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
  const [allFiles, setAllFiles] = useState<IConverter[]>([]);

  useLayoutEffect(() => {
    if (
      converterList &&
      JSON.stringify(allFiles.slice(-converterList.length)) !== JSON.stringify(converterList)
    ) {
      setAllFiles((prevFiles) => [...prevFiles, ...converterList]);
    }
  }, [converterList, allFiles]);

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

  const pageNextHandler = () => {
    setFilters({ ...filters, page: filters.page + 1 });
  };

  useInfiniteScroll({
    pageNextHandler,
    pagination: converterListPagination,
    allItems: allFiles,
    widthNumber: 990,
  });

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

  if (!allFiles?.length) {
    return (
      <div className={b('history-list')} data-testid='files-add'>
        <img src={notFoundImg} alt='notFound' />
        <h3>Данные отсутствуют</h3>
      </div>
    );
  }

  return (
    <>
      <div className={b('history-list')}>
        {allFiles?.map((converter: IConverter) => {
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
                      {moment(converter?.created_at, dateWithTimeSecFormat).format(
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
                  className={`button-style ${b('btn_file_download')}`}
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
      {converterListLoading && <Spin className='spin-mobile' />}

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

      <DrawerComponent
        open={open}
        onClose={onClose}
        placement='bottom'
        height='auto'
        className={b('delete_apk')}
      >
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
