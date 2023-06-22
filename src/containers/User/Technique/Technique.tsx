import { CheckOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, message, Spin, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import cloudy from 'assets/images/icons/cloudy.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import tractor from 'assets/images/icons/tractor-image.svg';
import Errors from 'components/Errors/Errors';
import AddUpdateTechnique from 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique';
import RequestModal from 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/RequestModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import TableComponent from 'components/TableComponent/TableComponent';
import { getPageNumber, getPageNumberPrevious } from 'helper';
import { userVehicles } from 'interfaces';
import {
  accountsSelector,
  approveFieldClimateRequest,
  fetchAccount,
  fetchUserVehicles,
} from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { apiUrlCrop } from 'utils/config';

import 'containers/User/Technique/_technique.scss';

const { Title } = Typography;

const Technique = () => {
  const b = bem('Technique');
  const {
    fetchLoadingAccount,
    account,
    userVehicles,
    fetchUserVehiclesLoading,
    userVehiclesPagination,
    fetchUserVehiclesError,
    inquiriesLoading,
    inquiriesError,
  } = useAppSelector(accountsSelector);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFieldClimateOpen, setIsModalFieldClimateOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: userVehiclesPagination?.next
      ? Number(getPageNumber(userVehiclesPagination?.next))
      : Number(getPageNumberPrevious(userVehiclesPagination?.previous)),
  });

  const cardStyle = {
    width: account?.company?.meteo_requested ? 300 : account?.company?.weather_service ? 340 : 300,
  };

  useEffect(() => {
    if (account?.company.id) {
      const data = {
        query: {
          page: filters?.page || 1,
        },
      };
      dispatch(fetchUserVehicles({ id: account?.company.id, page: data.query.page }));
    }
  }, [dispatch, account?.company?.id, filters]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const showFieldClimateModal = () => {
    setIsModalFieldClimateOpen(true);
  };

  const handleFieldClimateOkCancel = () => {
    setIsModalFieldClimateOpen(!isModalFieldClimateOpen);
  };

  const pagePrevHandler = () => {
    if (account?.company.id) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  const pageNextHandler = () => {
    if (account?.company.id) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  const postInquiriesHandler = async () => {
    try {
      await dispatch(approveFieldClimateRequest({ category: 4, object_id: account?.company?.id }));
      await dispatch(fetchAccount());
      await setIsModalFieldClimateOpen(false);
    } catch (e) {
      await message.error('Не удалось отправить запрос');
    }
  };

  const columns: ColumnsType<userVehicles> = [
    {
      key: 'code',
      title: 'Код техники',
      dataIndex: 'code',
      width: '20%',
      fixed: 'left',
      render: (text: string, record) => {
        return (
          <div style={{ display: 'flex', gap: 12 }}>
            <img
              className={b('image-styles')}
              src={record.image ? `${apiUrlCrop}${record.image}` : tractor}
              alt='tractor'
            />
            <p className={b('name-column-style')}>{record.code}</p>
          </div>
        );
      },
    },
    {
      key: 'description',
      title: 'Название',
      dataIndex: 'description',
      width: '30%',
    },
    {
      key: 'jobs_number',
      title: 'Задача на обработку',
      dataIndex: 'jobs_number',
      width: '20%',
      render: (text: number, record) => (
        <p className={b('name-column-style')}>{record?.jobs_number}</p>
      ),
    },
    {
      key: 'processed_area',
      title: 'Общая Площадь',
      dataIndex: 'processed_area',
      width: '28%',
      render: (text: number, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
          <p className={b('name-column-style-text')}>{record?.area}</p>
          <Tooltip
            title='Просмотреть профиль'
            color='#BBBBBB'
            overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
          >
            <Link to={`/profile-technique/${account?.id}/${record.id}`}>
              <Button type='text'>
                <EyeOutlined style={{ fontSize: '27px', color: '#1358bf' }} />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip
            title='Просмотреть на карте'
            color='#BBBBBB'
            overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            placement='topRight'
          >
            <Link to={`/open-map/${record.id}/local-tractor/`}>
              <Button type='text' style={{ display: 'flex', alignItems: 'center' }}>
                <img style={{ width: 27 }} src={tractorBlue} alt='tractorBlue' />
              </Button>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (fetchUserVehiclesError || inquiriesError) {
    return (
      <Errors
        status={fetchUserVehiclesError?.status || inquiriesError?.status}
        detail={fetchUserVehiclesError?.detail || inquiriesError?.detail}
      />
    );
  }

  return (
    <>
      <div className={b()} data-testid='technique-id'>
        <div className={b('card-block')}>
          <Card className={b('card-style')} bordered={false}>
            <div className={b('card-style-blocks')}>
              <div>
                <Title className={b('card-title')}>Количество техники</Title>
                {fetchLoadingAccount ? (
                  <SkeletonBlock active={fetchLoadingAccount} num={1} titleBool />
                ) : (
                  <div className={b('card-content')}>
                    <img src={tractorBlue} alt='group' />
                    <p>{userVehiclesPagination?.count}</p>
                  </div>
                )}
              </div>
              <div>
                <Card style={cardStyle} className={b('card-style-cloud')} bordered={false}>
                  <div className={b('card-style-cloud-blocks')}>
                    <div>
                      <img src={cloudy} alt='cloudy' />
                    </div>
                    <div>
                      {fetchLoadingAccount ? (
                        <Spin className={b('card-style-cloud-button')} />
                      ) : account?.company?.meteo_requested ? (
                        <>
                          <Title className={b('card-title meteo-h1')}>Подключите метеосервис</Title>
                          <p className='meteo-h1'>Все про погоду и почву</p>
                          <Button
                            disabled
                            type='primary'
                            danger
                            className={b('card-style-cloud-button')}
                          >
                            Запрос на рассмотрении
                          </Button>
                        </>
                      ) : account?.company?.weather_service ? (
                        <Button
                          icon={<CheckOutlined />}
                          disabled
                          type='dashed'
                          className={b('card-style-cloud-button')}
                        >
                          Метеостанция подключена
                        </Button>
                      ) : (
                        <>
                          <Title className={b('card-title meteo-h1')}>Подключите метеосервис</Title>
                          <p className='meteo-h1'>Все про погоду и почву</p>
                          <Button
                            className={b('card-style-cloud-button')}
                            onClick={showFieldClimateModal}
                          >
                            Отправить запрос
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
        <div className={b('table')}>
          <div className={b('title')}>
            <Title level={3} data-testid='sign_in_test' className={b('title')}>
              Техника
            </Title>

            <div>
              <Button type='primary' onClick={showModal} style={{ marginRight: 15 }}>
                Запрос на добавление техники
              </Button>
              <Link to='/technique-map'>
                <Button type='default' className={b('view-button')}>
                  Посмотреть всю технику
                </Button>
              </Link>
            </div>
          </div>

          <TableComponent
            loading={fetchUserVehiclesLoading}
            columns={columns}
            data={userVehicles}
            rowKey={(record) => record.id as number}
            params={
              fetchUserVehiclesLoading
                ? { previous: null, next: null, count: 0 }
                : userVehiclesPagination
            }
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
        <AddUpdateTechnique userId={null} isRequest handleEditOkCancel={handleOkCancel} />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        open={isModalFieldClimateOpen}
        handleOk={handleFieldClimateOkCancel}
        handleCancel={handleFieldClimateOkCancel}
      >
        <RequestModal
          title='Запрос на подключение метеостанции'
          textCancel='Отправить'
          subTitle='Отправить запрос на подключение метеостанции?'
          handleDeleteCancel={handleFieldClimateOkCancel}
          loading={inquiriesLoading}
          requestHandler={postInquiriesHandler}
        />
      </ModalComponent>
    </>
  );
};

export default Technique;
