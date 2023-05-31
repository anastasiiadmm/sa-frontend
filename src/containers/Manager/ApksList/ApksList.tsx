import { Badge, Button, Tag, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import TableComponent from 'components/TableComponent/TableComponent';
import 'containers/Manager/ApksList/_apksList.scss';

const { Title } = Typography;

const ApksList = () => {
  const b = bem('ApksList');

  const columns = [
    {
      title: 'Статус версии',
      dataIndex: 'status',
      filterSearch: true,
      fixed: 'left',
      sorter: true,
      width: 170,
    },
    {
      title: 'Дата загрузки',
      dataIndex: 'created_at',
      sorter: true,
      width: 170,
    },
    {
      title: 'Версия',
      dataIndex: 'version',
      filterSearch: true,
      sorter: true,
      width: 170,
    },
    {
      title: 'Изменения',
      dataIndex: 'changes',
      filterSearch: true,
      sorter: true,
    },
    {
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

  const data = [
    {
      key: '1',
      status: (
        <Tag color='green' style={{ width: 115 }}>
          <Badge color='#689F3A' /> Актуальное
        </Tag>
      ),
      created_at: '03.04.2023',
      version: 'ver 2.3.2.1',
      changes: 'Изменения должны быть в 2 строки не более, старайтесь писать вкратце...',
    },
    {
      key: '2',
      status: (
        <Tag color='orange' style={{ width: 115 }}>
          <Badge color='#FAC473' /> Архив
        </Tag>
      ),
      created_at: '03.04.2023',
      version: 'ver 2.3.2.1',
      changes: 'Изменения должны быть в 2 строки не более, старайтесь писать вкратце...',
    },
    {
      key: '3',
      status: (
        <Tag color='geekblue' style={{ width: 115 }}>
          <Badge color='#3A629F' /> Стабильное
        </Tag>
      ),
      created_at: '03.04.2023',
      version: 'ver 2.3.2.1',
      changes: 'Изменения должны быть в 2 строки не более, старайтесь писать вкратце...',
    },
  ];

  return (
    <div className={b()} data-testid='apks-id'>
      <div className={b('table')}>
        <Title level={3} data-testid='sign_in_test' className={b('title')}>
          Версии приложения
        </Title>

        <TableComponent
          loading={false}
          columns={columns}
          data={data}
          rowKey={(record) => record.key as number}
        />
      </div>
    </div>
  );
};

export default ApksList;
