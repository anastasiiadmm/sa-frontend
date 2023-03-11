import { Button, Card, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import tractor from 'assets/images/icons/tractor-image.svg';
import AddUpdateTechnique from 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import TableComponent from 'components/TableComponent/TableComponent';
import { accountsSelector, fetchUser, fetchUserVehicles } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { userVehicles } from 'types';
import 'containers/User/Technique/_technique.scss';

const { Title } = Typography;

const Technique = () => {
  const b = bem('Technique');
  const {
    user: userAccount,
    fetchLoadingUser,
    userVehicles,
    fetchUserVehiclesLoading,
    userVehiclesPagination,
  } = useAppSelector(accountsSelector);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    const data = {
      query: {
        page: filters?.page,
      },
    };

    dispatch(fetchUserVehicles({ data }));
  }, [dispatch, filters]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const pagePrevHandler = () => {
    setFilters({ ...filters, page: filters.page - 1 });
  };

  const pageNextHandler = () => {
    setFilters({ ...filters, page: filters.page + 1 });
  };

  const columns: ColumnsType<userVehicles> = [
    {
      key: 'code',
      title: 'Код техники',
      dataIndex: 'code',
      width: '20%',
      fixed: 'left',
      render: (text: string, record) => (
        <div style={{ display: 'flex', gap: 12 }}>
          <img src={record.image ? record.image : tractor} alt='tractor' />
          <p className={b('name-column-style')}>{record.code}</p>
        </div>
      ),
    },
    {
      key: 'description',
      title: 'Название',
      dataIndex: 'description',
      width: '30%',
    },
    {
      key: 'field_count',
      title: 'Поля',
      dataIndex: 'field_count',
      width: '20%',
      render: (text: number, record) => (
        <p className={b('name-column-style')}>{record?.vehicle_fields_data?.field_count}</p>
      ),
    },
    {
      key: 'processed_area',
      title: 'Общая Площадь',
      dataIndex: 'processed_area',
      width: '20%',
      render: (text: number, record) => (
        <p className={b('name-column-style')}>{record?.vehicle_fields_data?.processed_area}</p>
      ),
    },
    {
      dataIndex: 'profile',
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

  return (
    <>
      <div className={b()}>
        <div className={b('card-block')}>
          <Card className={b('card-style')} bordered={false}>
            <Title className={b('card-title')}>Количество техники</Title>
            {fetchLoadingUser ? (
              <SkeletonBlock active={fetchLoadingUser} num={1} titleBool />
            ) : (
              <div className={b('card-content')}>
                <img src={tractorBlue} alt='group' />
                <p>{userAccount?.vehicles_amount}</p>
              </div>
            )}
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

          <TableComponent
            loading={fetchUserVehiclesLoading}
            columns={columns}
            data={userVehicles}
            rowKey={(record: userVehicles) => record.id}
            params={userVehiclesPagination}
            pagePrevHandler={pagePrevHandler}
            pageNextHandler={pageNextHandler}
          />
        </div>
      </div>

      <ModalComponent
        title='Добавить технику'
        open={isModalOpen}
        handleOk={handleOkCancel}
        handleCancel={handleOkCancel}
      >
        <AddUpdateTechnique />
      </ModalComponent>
    </>
  );
};

export default Technique;
