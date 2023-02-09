import { Button, Card, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import bem from 'easy-bem';
import React from 'react';
import { Link } from 'react-router-dom';

import deleteIcon from 'assets/images/icons/delete.svg';
import edit from 'assets/images/icons/edit.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import tractor from 'assets/images/icons/tractor-image.svg';
import 'containers/User/Technique/_technique.scss';

const { Title } = Typography;

interface DataType {
  key: React.Key;
  code: string;
  name: string;
  fields: string;
  area: string;
}

const Technique = () => {
  const b = bem('Technique');

  const columns: ColumnsType<DataType> = [
    {
      title: 'Код техники',
      dataIndex: 'code',
      width: '20%',
      sorter: true,
      fixed: 'left',
      render: (text: string) => (
        <div style={{ display: 'flex', gap: 12 }}>
          <img src={tractor} alt='tractor' />
          <p className={b('name-column-style')}>{text}</p>
        </div>
      ),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      filterSearch: true,
      width: '30%',
      sorter: true,
    },
    {
      title: 'Поля',
      dataIndex: 'fields',
      filterSearch: true,
      width: '20%',
      sorter: true,
    },
    {
      title: 'Общая Площадь',
      dataIndex: 'area',
      filterSearch: true,
      width: '20%',
      sorter: true,
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '30%',
      render: () => (
        <div style={{ display: 'flex', gap: 37 }}>
          <Link className={b('profile-link')} to='/user-profile'>
            Просмотр на карте
          </Link>
          <img src={edit} alt='edit' />
          <img src={deleteIcon} alt='deleteIcon' />
        </div>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      code: 'AVP123344',
      name: 'Беларус',
      fields: '3',
      area: '120 га',
    },
    {
      key: '1',
      code: 'AVP123344',
      name: 'Беларус',
      fields: '2',
      area: '120 га',
    },
    {
      key: '1',
      code: 'AVP123344',
      name: 'Беларус',
      fields: '1',
      area: '120 га',
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {};

  return (
    <div className={b()}>
      <div className={b('card-block')}>
        <Card className={b('card-style')} bordered={false}>
          <Title className={b('card-title')}>Количество техники</Title>
          <div className={b('card-content')}>
            <img src={tractorBlue} alt='group' />
            <p>5</p>
          </div>
        </Card>
      </div>
      <div className={b('table')}>
        <div className={b('title')}>
          <Title level={3} data-testid='sign_in_test' className={b('title')}>
            Техника
          </Title>

          <Button type='primary'>Запрос на добавление техники</Button>
        </div>

        <Table
          scroll={{
            x: 950,
          }}
          rowKey='id'
          columns={columns}
          dataSource={data}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Technique;
