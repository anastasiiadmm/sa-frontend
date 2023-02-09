import { Button, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import bem from 'easy-bem';
import React from 'react';
import { Link } from 'react-router-dom';

import 'containers/Users/UserTechnique/_userTechnique.scss';
import arrowLeft from 'assets/images/icons/arrow-left.svg';
import deleteIcon from 'assets/images/icons/delete.svg';
import edit from 'assets/images/icons/edit.svg';
import tractor from 'assets/images/icons/tractor-image.svg';

const { Title } = Typography;

interface DataType {
  key: React.Key;
  code: string;
  name: string;
  fields: string;
  area: string;
}

const UserTechnique: React.FC = () => {
  const b = bem('UserTechnique');

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
      key: '2',
      code: 'AVP123344',
      name: 'Беларус',
      fields: '3',
      area: '120 га',
    },
    {
      key: '3',
      code: 'AVP123344',
      name: 'Беларус',
      fields: '3',
      area: '120 га',
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {};

  return (
    <div className={b()}>
      <div className={b('table')}>
        <div className={b('header')}>
          <div className={b('header-title')}>
            <Link to='/user-profile'>
              <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
            </Link>
            <Title level={3} data-testid='sign_in_test' className={b('title')}>
              Техника пользователя - <p className={b('subtitle')}> Иванов И.И</p>
            </Title>
          </div>

          <div>
            <Button type='primary'>Добавить технику</Button>
          </div>
        </div>

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

export default UserTechnique;