import { Card, Table, Typography } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import bem from 'easy-bem';
import React from 'react';
import { Link } from 'react-router-dom';

import people from 'assets/images/icons/group-active.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import 'containers/Manager/Users/_users.scss';

const { Title } = Typography;

interface DataType {
  key: React.Key;
  name: string;
  address: string;
  phone: string;
  blocks: string;
}

const Users: React.FC = () => {
  const b = bem('Users');

  const columns: ColumnsType<DataType> = [
    {
      title: 'ФИО',
      dataIndex: 'name',
      width: '30%',
      sorter: true,
      fixed: 'left',
      render: (text: string) => <p className={b('name-column-style')}>{text}</p>,
    },
    {
      title: 'Название компании',
      dataIndex: 'address',
      filterSearch: true,
      width: '40%',
      sorter: true,
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phone',
      filterSearch: true,
      width: '25%',
      sorter: true,
      render: (text: string) => <p className={b('center-column-style')}>{text}</p>,
    },
    {
      title: 'Блоки автопилота',
      dataIndex: 'blocks',
      filterSearch: true,
      width: '25%',
      sorter: true,
      render: (text: string) => <p className={b('center-column-style')}>{text}</p>,
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '25%',
      render: () => (
        <Link className={b('profile-link')} to='/user-profile'>
          Просмотреть профиль
        </Link>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'Иванов ИП',
      address: 'New York No. 1 Lake Park',
      phone: '+78889932',
      blocks: '5',
    },
    {
      key: '2',
      name: 'Самсонов ИП',
      address: 'London No. 1 Lake Park',
      phone: '+78889932',
      blocks: '11',
    },
    {
      key: '3',
      name: 'Жук ИП',
      address: 'Sydney No. 1 Lake Park',
      phone: '+78889932',
      blocks: '6',
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {};

  return (
    <div className={b()}>
      <div className={b('card-block')}>
        <Card className={b('card-style')} bordered={false} style={{ width: 300 }}>
          <Title className={b('card-title')}>Добавлено пользователей</Title>
          <div className={b('card-content')}>
            <img src={people} alt='group' />
            <p>48</p>
          </div>
        </Card>
        <Card className={b('card-style')} bordered={false} style={{ width: 300 }}>
          <Title className={b('card-title')}>Добавлено Техники</Title>
          <div className={b('card-content')}>
            <img src={tractorBlue} alt='group' />
            <p>122</p>
          </div>
        </Card>
      </div>
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
