import { Button, Card, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import tractor from 'assets/images/icons/tractor-image.svg';
import 'containers/User/Technique/_technique.scss';
import AddUpdateTechnique from 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique';
import ModalComponent from 'components/ModalComponent/ModalComponent';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        <div style={{ display: 'flex', gap: 37, alignItems: 'center' }}>
          <Link className={b('profile-link')} to='/open-map'>
            Просмотр на карте
          </Link>
          <Link to='/profile-technique'>
            <Button type='text'>
              <img style={{ width: 27 }} src={tractorBlue} alt='tractorBlue' />
            </Button>
          </Link>
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
      fields: '2',
      area: '120 га',
    },
    {
      key: '3',
      code: 'AVP123344',
      name: 'Беларус',
      fields: '1',
      area: '120 га',
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {};

  return (
    <>
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

            <Button type='primary' onClick={showModal}>
              Запрос на добавление техники
            </Button>
          </div>

          <Table
            scroll={{
              x: 950,
            }}
            rowKey='key'
            columns={columns}
            dataSource={data}
            onChange={onChange}
          />
        </div>
      </div>

      <ModalComponent
        title='Добавить технику'
        open={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      >
        <AddUpdateTechnique />
      </ModalComponent>
    </>
  );
};

export default Technique;
