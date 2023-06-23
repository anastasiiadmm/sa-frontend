import {
  Badge,
  Button,
  Card,
  Divider,
  message,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { Spin } from 'antd/lib';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import TableComponent from 'components/TableComponent/TableComponent';
import { getPageNumber, getPageNumberPrevious } from 'helper';
import useWindowWidth from 'hooks/useWindowWidth';
import { IApk } from 'interfaces';
import { accountsSelector, fetchApks } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import 'containers/Manager/ApksList/_apksList.scss';

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

  useEffect(() => {
    const data = {
      query: {
        page: filters?.page,
        ordering: orderSort?.ordering,
      },
    };
    dispatch(fetchApks({ data }));
  }, [dispatch, filters, orderSort?.ordering]);

  const downloadApkFileHandler = async (file: string) => {
    try {
      const link = document.createElement('a');
      link.href = `https://agri.ltestl.com${file}`;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      await message.error(error?.detail);
    }
  };

  const highestVersion =
    apk !== null &&
    apk?.reduce((highest: string | number, obj: IApk) => {
      return obj.version > highest ? obj.version : highest;
    }, '0.0.0');

  const columns: ColumnsType<IApk> = [
    {
      key: 'version',
      title: 'Статус версии',
      dataIndex: 'version',
      fixed: 'left',
      width: 170,
      render: (text, record, index) => {
        const previousVersion =
          apk !== null && index > 0 ? apk[index - 1]?.version ?? '0.0.1' : '0.0.1';

        if (text > previousVersion) {
          return (
            <Tag color='green' style={{ width: 115 }}>
              <Badge color='#689F3A' /> Актуальное
            </Tag>
          );
        }

        if (text < highestVersion) {
          return (
            <Tag color='geekblue' style={{ width: 115 }}>
              <Badge color='#3A629F' /> Стабильное
            </Tag>
          );
        }

        return (
          <Tag color='orange' style={{ width: 115 }}>
            <Badge color='#FAC473' /> Архив
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
        return <p>ver {`${text}`}</p>;
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
      render: () => {
        return (
          <Button type='default' style={{ float: 'right' }}>
            Скачать
          </Button>
        );
      },
      width: 170,
    },
  ];

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

  const handleTableSortChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<string> | SorterResult<string>[],
  ) => {
    const columnKey = Array.isArray(sorter) ? sorter[0]?.column?.key : sorter?.column?.key;
    const order = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;

    const sortableColumnKeys = ['created_at', 'version'];

    if (columnKey && sortableColumnKeys.includes(columnKey as string)) {
      setOrderSort({
        ordering: order === 'descend' ? '-id' : 'id',
      });
    }
  };

  return (
    <div className={b()} data-testid='apks-id'>
      {windowWidth <= 990 ? (
        apkLoading ? (
          <Spin />
        ) : (
          <div className={b('apks-list-block')}>
            {apk?.map((apk: IApk, index: number, apkArray: IApk[]) => {
              const previousVersion =
                apk !== null && index > 0 ? apkArray[index - 1]?.version ?? '0.0.1' : '0.0.1';

              let tagColor: string;
              let badgeColor: string;
              let tagLabel: string;

              switch (true) {
                case apk?.version > previousVersion:
                  tagColor = 'green';
                  badgeColor = '#689F3A';
                  tagLabel = 'Актуальное';
                  break;

                case apk?.version < highestVersion.toString():
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
                  <Tag color={tagColor} style={{ width: 115 }}>
                    <Badge color={badgeColor} /> {tagLabel}
                  </Tag>
                  <Text strong style={{ fontSize: 20 }}>
                    ver {apk?.version}
                  </Text>
                  <Text type='secondary'>ver {apk?.created_at}</Text>
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
                    onClick={() => downloadApkFileHandler(apk?.file)}
                  >
                    Скачать
                  </Button>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <div className={b('table')}>
          <Title level={3} data-testid='sign_in_test' className={b('title')}>
            Версии приложения
          </Title>

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
        </div>
      )}
    </div>
  );
};

export default ApksList;
