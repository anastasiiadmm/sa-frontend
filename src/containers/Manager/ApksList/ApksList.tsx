import {
  Badge,
  Button,
  Card,
  Divider,
  Skeleton,
  Spin,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import bem from 'easy-bem';
import moment from 'moment/moment';
import React, { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';

import downloadButton from 'assets/images/icons/download_button_desktop.svg';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import useWindowWidth from 'hooks/useWindowWidth';
import { IApk } from 'interfaces';
import { accountsSelector, fetchApks } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  dateOnly,
  dateWithTimeSecFormat,
  deleteEmptyQueryStrings,
  downloadFileHandler,
  getPageNumber,
  getPageNumberPrevious,
} from 'utils/helper';
import 'containers/Manager/ApksList/_apksList.scss';

const TableComponent = lazy(() => import('components/TableComponent/TableComponent'));

const { Title, Text } = Typography;

const ApksList = () => {
  const b = bem('ApksList');
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();
  const { apk, apksPagination, apkLoading } = useAppSelector(accountsSelector);
  const [filters, setFilters] = useState({
    page: apksPagination?.next
      ? Number(getPageNumber(apksPagination?.next))
      : Number(getPageNumberPrevious(apksPagination?.previous)),
  });
  const [orderSort, setOrderSort] = useState({ ordering: '' });
  const [isLoadingMap, setIsLoadingMap] = useState<{ [key: string]: boolean }>({});
  const [statusMap, setStatusMap] = useState<{ [key: string]: string }>({});
  const [allApks, setAllApks] = useState<IApk[]>([]);

  useLayoutEffect(() => {
    if (apk && JSON.stringify(allApks.slice(-apk.length)) !== JSON.stringify(apk)) {
      setAllApks((prevApks) => [...prevApks, ...apk]);
    }
  }, [apk, allApks]);

  useEffect(() => {
    const newStatusMap: { [key: string]: string } = {};

    if (allApks && allApks?.length > 0) {
      const sortedApk = [...allApks].sort((a, b) =>
        String(a.version).localeCompare(String(b.version)),
      );

      for (let i = 0; i < sortedApk.length; i++) {
        const version = sortedApk[i].version;
        if (i === sortedApk.length - 1) {
          newStatusMap[version] = 'Актуальное';
        } else if (i === sortedApk.length - 2) {
          newStatusMap[version] = 'Стабильное';
        } else {
          newStatusMap[version] = 'Архив';
        }
      }
    }

    setStatusMap((prevStatusMap: { [key: string]: string }) => {
      const updatedStatusMap = { ...prevStatusMap };
      Object.keys(updatedStatusMap)?.forEach((version) => {
        if (!Object.prototype.hasOwnProperty.call(newStatusMap, version)) {
          delete updatedStatusMap[version];
        }
      });
      return { ...updatedStatusMap, ...newStatusMap };
    });
  }, [apk]);

  useEffect(() => {
    const queryObj = {
      page: filters?.page,
      ordering: orderSort?.ordering,
    };
    const validateQuery = deleteEmptyQueryStrings(queryObj);
    const data = {
      query: validateQuery,
    };
    dispatch(fetchApks({ data }));
  }, [dispatch, filters, orderSort?.ordering]);

  const pagePrevHandler = () => {
    setFilters({
      ...filters,
      page: filters.page - 1,
    });
  };

  const pageNextHandler = () => {
    setFilters({
      ...filters,
      page: Number(getPageNumber(apksPagination?.next)) + 1,
    });
  };

  useInfiniteScroll({
    pageNextHandler,
    pagination: apksPagination,
    allItems: allApks,
    widthNumber: 601,
  });

  const handleTableSortChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<string> | SorterResult<string>[],
  ) => {
    const order = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;
    setOrderSort({
      ordering: order === 'descend' ? '-id' : 'id',
    });
  };

  const handleDownloadClick = (file: string) => {
    setIsLoadingMap((prevIsLoadingMap) => ({ ...prevIsLoadingMap, [file]: true }));
    downloadFileHandler(file, () =>
      setIsLoadingMap((prevIsLoadingMap) => ({ ...prevIsLoadingMap, [file]: false })),
    );
  };

  const columns: ColumnsType<IApk> = [
    {
      key: 'version',
      title: 'Статус версии',
      dataIndex: 'version',
      fixed: 'left',
      width: 170,
      render: (text) => {
        const status = statusMap[text];
        return (
          <Tag
            color={
              status === 'Актуальное' ? 'green' : status === 'Стабильное' ? 'geekblue' : 'orange'
            }
            style={{ width: 115 }}
          >
            <Badge
              className={b('badge-styles')}
              color={
                status === 'Актуальное'
                  ? '#689F3A'
                  : status === 'Стабильное'
                  ? '#3A629F'
                  : '#FAC473'
              }
            />{' '}
            {status}
          </Tag>
        );
      },
    },
    {
      key: 'created_at',
      title: 'Дата загрузки',
      dataIndex: 'created_at',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 170,
      render: (text) => {
        return <p>ver {moment(text, dateWithTimeSecFormat).format(dateOnly)}</p>;
      },
    },
    {
      key: 'version',
      title: 'Версия',
      dataIndex: 'version',
      filterSearch: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 170,
      render: (text) => {
        return <p>ver {text}</p>;
      },
    },
    {
      key: 'description',
      title: 'Изменения',
      dataIndex: 'description',
      filterSearch: true,
    },
    {
      key: 'button',
      dataIndex: 'button',
      filterSearch: true,
      render: (text, record) => {
        const isLoading = isLoadingMap[record?.file];
        const commonButtonProps = {
          role: 'button',
          'data-testid': 'download-button',
          loading: isLoading,
          onClick: () => handleDownloadClick(record?.file),
        };

        return windowWidth <= 990 ? (
          <Button
            type='default'
            icon={<img src={downloadButton} alt='downloadButton' />}
            className={b('download-icon-button')}
            {...commonButtonProps}
          />
        ) : (
          <Button type='default' className={b('download-button')} {...commonButtonProps}>
            Скачать
          </Button>
        );
      },
      width: 170,
    },
  ];

  return (
    <div className={b()} data-testid='apks-id'>
      {windowWidth <= 601 ? (
        <>
          <div className={b('apks-list-block')}>
            {allApks?.map((apk: IApk) => {
              const status = statusMap[apk?.version];

              let tagColor: string;
              let badgeColor: string;
              let tagLabel: string;

              switch (status) {
                case 'Актуальное':
                  tagColor = 'green';
                  badgeColor = '#689F3A';
                  tagLabel = 'Актуальное';
                  break;

                case 'Стабильное':
                  tagColor = 'geekblue';
                  badgeColor = '#3A629F';
                  tagLabel = 'Стабильное';
                  break;

                default:
                  tagColor = 'orange';
                  badgeColor = '#FAC473';
                  tagLabel = 'Архив';
                  break;
              }

              return (
                <Card bordered={false} key={apk?.version} className={b('apks-block')}>
                  <Tag
                    color={tagColor}
                    style={{
                      width: 100,
                      border: 'none',
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Badge color={badgeColor} /> <span style={{ marginLeft: 10 }}>{tagLabel}</span>
                  </Tag>
                  <Text strong style={{ fontSize: 20 }}>
                    ver {apk?.version}
                  </Text>
                  <Text
                    type='secondary'
                    style={{
                      fontSize: 12,
                    }}
                  >
                    {moment(apk?.created_at, dateWithTimeSecFormat).format(dateOnly)}
                  </Text>
                  <Divider style={{ margin: '10px 0' }} />
                  <Text type='secondary'>Изменения</Text>
                  <Tooltip placement='top' title={apk?.description}>
                    <Text type='secondary' className={b('apk-description')}>
                      {apk?.description}
                    </Text>
                  </Tooltip>
                  <Button
                    type='default'
                    className={b('apks-button')}
                    onClick={() => handleDownloadClick(apk?.file)}
                  >
                    Скачать
                  </Button>
                </Card>
              );
            })}
          </div>
          {apkLoading && <Spin className='spin-mobile' style={{ marginBottom: 115 }} />}
        </>
      ) : (
        <div className={b('table')}>
          <Title level={3} data-testid='sign_in_test' className={b('title')}>
            Версии приложения
          </Title>
          <Suspense fallback={<Skeleton active />}>
            <TableComponent
              loading={apkLoading}
              columns={columns}
              data={apk}
              onChange={handleTableSortChange}
              rowKey={(record) => record?.version}
              params={apkLoading ? { previous: null, next: null, count: 0 } : apksPagination}
              pagePrevHandler={pagePrevHandler}
              pageNextHandler={pageNextHandler}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default ApksList;
