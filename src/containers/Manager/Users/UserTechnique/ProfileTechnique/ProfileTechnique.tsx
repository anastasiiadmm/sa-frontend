import { EyeOutlined } from '@ant-design/icons';
import { Button, Form, Image, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import bem from 'easy-bem';
import React from 'react';
import { Link } from 'react-router-dom';

import 'containers/Manager/Users/UserTechnique/ProfileTechnique/_profileTechnique.scss';
import arrowLeft from 'assets/images/icons/arrow-left.svg';
import technique from 'assets/images/image-profile-technique.jpg';
import FormField from 'components/FormField/FormField';

const { Title } = Typography;

interface DataType {
  key: React.Key;
  fields: string;
  area: string;
}

const ProfileTechnique = () => {
  const b = bem('ProfileTechnique');

  const columns: ColumnsType<DataType> = [
    {
      title: 'Поля техники',
      dataIndex: 'fields',
      width: '40%',
      sorter: true,
      fixed: 'left',
    },
    {
      title: 'Площадь поля',
      dataIndex: 'area',
      filterSearch: true,
      width: '40%',
      sorter: true,
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '20%',
      render: () => (
        <div style={{ display: 'flex', gap: 37 }}>
          <Link className={b('profile-link')} to='/'>
            Просмотр на карте
          </Link>
        </div>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      fields: 'Поле№1',
      area: '120 га',
    },
    {
      key: '2',
      fields: 'Поле№2',
      area: '120 га',
    },
    {
      key: '3',
      fields: 'Поле№3',
      area: '120 га',
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {};

  return (
    <div className={b()}>
      <div className={b('table')}>
        <div className={b('header')}>
          <div className={b('header-title')}>
            <Link to='/user-technique'>
              <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
            </Link>
            <Title level={3} className={b('title')}>
              Профиль техники - <p className={b('subtitle')}> AVP123344 </p> - John Deer
            </Title>
          </div>

          <div>
            <Button type='link' icon={<EyeOutlined />} size='large'>
              Техника на карте
            </Button>
          </div>
        </div>

        <div className={b('technique-profile-info')}>
          <Image src={technique} width={242} />
          <div className={b('profile-info')}>
            <Form autoComplete='off' layout='vertical'>
              <Title level={5} className={b('profile-title')}>
                Информация о технике
              </Title>
              <div className={b('form-block')}>
                <FormField
                  readOnly
                  id='technique_name_id'
                  label='Название техники'
                  name='technique_name'
                  placeholder='Название техники'
                />

                <FormField
                  readOnly
                  id='technique_number_id'
                  label='Гос номер'
                  name='technique_number'
                  placeholder='Гос номер'
                />

                <FormField
                  readOnly
                  id='code_id'
                  label='VIN код'
                  name='code'
                  placeholder='VIN код'
                />
              </div>
              <Title level={5} className={b('profile-title')}>
                Информация о механизаторе
              </Title>
              <div className={b('form-block')}>
                <FormField
                  readOnly
                  id='first_name_id'
                  label='Фамилия'
                  name='first_name'
                  placeholder='Фамилия'
                />

                <FormField
                  readOnly
                  id='last_name_id'
                  label='Имя'
                  name='last_name'
                  placeholder='Имя'
                />

                <FormField
                  readOnly
                  id='surname_id'
                  label='Отчество'
                  name='surname'
                  placeholder='Отчество'
                />
              </div>
            </Form>
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

export default ProfileTechnique;
