import { Table, Typography } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import bem from 'easy-bem';
import React from 'react';
import { Link } from 'react-router-dom';

import 'containers/Users/_users.scss';

const { Title } = Typography;

interface DataType {
  key: React.Key;
  name: string;
  address: string;
  phone: string;
  blocks: string;
  profile: React.ReactNode;
}

const Users: React.FC = () => {
  const b = bem('Users');

  const columns: ColumnsType<DataType> = [
    {
      title: 'ФИО',
      dataIndex: 'name',
      width: '20%',
      sorter: true,
      fixed: 'left',
    },
    {
      title: 'Название компании',
      dataIndex: 'address',
      filterSearch: true,
      width: '30%',
      sorter: true,
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phone',
      filterSearch: true,
      width: '20%',
      sorter: true,
    },
    {
      title: 'Блоки автопилота',
      dataIndex: 'blocks',
      filterSearch: true,
      width: '20%',
      sorter: true,
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '30%',
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'Иванов ИП',
      address: 'New York No. 1 Lake Park',
      phone: '+78889932',
      blocks: '5',
      profile: (
        <Link className={b('profile-link')} to='/user-profile'>
          Просмотреть профиль
        </Link>
      ),
    },
    {
      key: '2',
      name: 'Самсонов ИП',
      address: 'London No. 1 Lake Park',
      phone: '+78889932',
      blocks: '11',
      profile: (
        <Link className={b('profile-link')} to='/user-profile'>
          Просмотреть профиль
        </Link>
      ),
    },
    {
      key: '3',
      name: 'Жук ИП',
      address: 'Sydney No. 1 Lake Park',
      phone: '+78889932',
      blocks: '6',
      profile: (
        <Link className={b('profile-link')} to='/user-profile'>
          Просмотреть профиль
        </Link>
      ),
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {};

  return (
    <div className={b()}>
      <div className={b('table')}>
        <Title level={3} data-testid='sign_in_test' className={b('title')}>
          Пользователи
        </Title>

        <Table
          scroll={{
            x: 950,
          }}
          columns={columns}
          dataSource={data}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Users;
