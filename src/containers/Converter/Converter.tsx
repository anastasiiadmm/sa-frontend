import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, message, Spin, Typography } from 'antd';
import bem from 'easy-bem';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import arrowDown from 'assets/images/icons/arrow-down.svg';
import converterFile from 'assets/images/icons/converter-file.svg';
import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import DeleteModal from 'components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import PaginationComponent from 'components/TableComponent/PaginationComponent/PaginationComponent';
import useWindowWidth from 'hooks/useWindowWidth';
import { IConverter } from 'interfaces/IConverter';
import {
  clearConvertFileSuccess,
  converterSelector,
  convertFile,
  deleteConverter,
  fetchConverterList,
} from 'redux/converter/converterSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { convertOptions } from 'utils/constants';
import {
  dateWithTimeFormat,
  dateWithTimeSecFormat,
  downloadConvertedFileHandler,
  getPageNumber,
  getPageNumberPrevious,
} from 'utils/helper';
import 'containers/Converter/_converter.scss';

const { Title, Text } = Typography;

const Converter = () => {
  const b = bem('Converter');
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    converterList,
    converterListPagination,
    converterListLoading,
    converterListError,
    deleteConverterLoading,
    deleteConverterError,
    convertFileSuccess,
  } = useAppSelector(converterSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      dispatch(clearConvertFileSuccess());
    };
  }, [dispatch, convertFileSuccess]);

  useEffect(() => {
    const data = {
      query: {
        page: filters?.page || 1,
      },
    };
    dispatch(fetchConverterList({ data }));
  }, [dispatch, filters]);

  const pagePrevHandler = () => {
    setFilters({ ...filters, page: filters.page - 1 });
  };

  const pageNextHandler = () => {
    setFilters({ ...filters, page: filters.page + 1 });
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownloadClick = (file: string) => {
    setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [file]: true }));
    downloadConvertedFileHandler(file, () =>
      setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [file]: false })),
    );
  };

  const showDeleteModal = (id: number, name: string) => {
    setIsModalOpen(true);
    setFileName({ id, name });
  };

  const handleDeleteOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const clearFileHandle = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConvertHandler = async () => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      await dispatch(convertFile(formData)).unwrap();
      await clearFileHandle();
      message.success('Файл успешно сконвертирован');
    } catch (e) {
      if (e?.detail?.non_field_errors) {
        const errorMessage = e?.detail?.non_field_errors[0];

        if (errorMessage === 'Archive file does not contain supported file format') {
          await message.error('Архивный файл не содержит поддерживаемого формата файла');
        }
      } else {
        await message.error('Произошла ошибка');
      }
    }
  };

  const deleteHandler = async () => {
    try {
      await dispatch(deleteConverter(fileName?.id)).unwrap();
      setFileName({ id: null, name: '' });
      setIsModalOpen(!isModalOpen);
    } catch (e) {
      await message.error(`${e?.detail}`);
    }
  };

  if (windowWidth >= 990 && (converterListError || deleteConverterError)) {
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
                  dropdownStyle={{ display: 'none' }}
                  defaultValue={convertOptions[0]}
                  className={b('select-field')}
                  type='select'
                  customStyle='80px'
                  suffixIcon={<img src={arrowDown} alt='arrowDown' />}
                />{' '}
                в{' '}
                <FormField
                  dropdownStyle={{ display: 'none' }}
                  defaultValue={convertOptions[1]}
                  className={b('select-field')}
                  type='select'
                  customStyle='80px'
                  suffixIcon={<img src={arrowDown} alt='arrowDown' />}
                />
              </div>
              {file ? (
                <div className={b('file-info-block')}>
                  <Text strong>{file?.name}</Text>
                  <Button size='small' icon={<CloseOutlined />} onClick={clearFileHandle} />
                </div>
              ) : null}
              {file ? (
                <Button type='primary' className='button-style' onClick={handleConvertHandler}>
                  Конвертировать
                </Button>
              ) : (
                <Button className='button-style' onClick={handleButtonClick}>
                  Выбрать файл
                </Button>
              )}

              <input
                ref={fileInputRef}
                data-testid='image-input'
                id='image-input'
                type='file'
                onChange={onFileChange}
              />
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
                    const isLoadingState = isLoading[converter?.file];

                    return (
                      <Card className={b('card-file-block')} key={converter?.id}>
                        <div className={b('converter-card')}>
                          <div className={b('info-column')}>
                            <Title className={b('heading')} level={5}>
                              {converter?.task_UID && converter?.file
                                ? converter.task_UID +
                                  converter.file.substring(converter.file.lastIndexOf('.'))
                                : converter?.task_UID}
                            </Title>
                          </div>
                          <div className={b('info-column')}>
                            <div className={b('info-item')}>
                              <Text type='secondary' className={b('subtitle')}>
                                {moment(converter?.created_at, dateWithTimeSecFormat).format(
                                  dateWithTimeFormat,
                                )}
                              </Text>
                            </div>
                            <div className={b('info-item')}>
                              <Button
                                className='button-style button-width'
                                loading={isLoadingState}
                                onClick={() => handleDownloadClick(converter?.file)}
                              >
                                Скачать
                              </Button>
                              <Button
                                className='button-style button-width'
                                danger
                                onClick={() => showDeleteModal(converter?.id, converter?.task_UID)}
                              >
                                Удалить
                              </Button>
                            </div>
                          </div>
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
        <DeleteModal
          title='Удалить?'
          loading={deleteConverterLoading}
          fullName={fileName?.name}
          handleDeleteCancel={handleDeleteOkCancel}
          deleteButtonHandler={deleteHandler}
        />
      </ModalComponent>
    </>
  );
};

export default Converter;
