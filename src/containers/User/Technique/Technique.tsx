import { CheckOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, message, Skeleton, Spin, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import cloudy from 'assets/images/icons/cloudy.svg';
import geolocationIcon from 'assets/images/icons/newIcon/geolocation.svg';

import group from 'assets/images/icons/newIcon/group.svg';
import map from 'assets/images/icons/newIcon/mapFons.svg';
import tractorNew from 'assets/images/icons/newIcon/tractor.svg';
import tractorIcons from 'assets/images/icons/newIcon/tractorBlue.svg';
import tractorFons from 'assets/images/icons/newIcon/tractorFons.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import tractor from 'assets/images/icons/tractor-image.svg';
import logo from 'assets/images/logo.svg';
import Errors from 'components/Errors/Errors';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import TableComponent from 'components/TableComponent/TableComponent';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import useWindowWidth from 'hooks/useWindowWidth';
import { userVehicles } from 'interfaces';
import {
  accountsSelector,
  approveFieldClimateRequest,
  fetchAccount,
  fetchUserVehicles,
} from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { apiUrlCrop } from 'utils/config';
import { urlFormat } from 'utils/files/files';
import { getPageNumber, getPageNumberPrevious } from 'utils/helper';
import 'containers/User/Technique/_technique.scss';

const AddUpdateTechnique = lazy(
  () =>
    import(
      'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique'
    ),
);
const RequestModal = lazy(
  () =>
    import('components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/RequestModal'),
);
const { Title } = Typography;

const Technique = () => {
  const b = bem('Technique');
  const windowWidth = useWindowWidth();
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
  const push = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFieldClimateOpen, setIsModalFieldClimateOpen] = useState(false);
  const [openDrawerTechnique, setOpenDrawerTechnique] = useState(false);
  const [filters, setFilters] = useState({
    page: userVehiclesPagination?.next
      ? Number(getPageNumber(userVehiclesPagination?.next))
      : Number(getPageNumberPrevious(userVehiclesPagination?.previous)),
  });
  const [allVehicles, setAllVehicles] = useState<userVehicles[]>([]);

  useEffect(() => {
    if (
      userVehicles &&
      JSON.stringify(allVehicles.slice(-userVehicles.length)) !== JSON.stringify(userVehicles)
    ) {
      setAllVehicles((prevVehicles) => [...prevVehicles, ...userVehicles]);
    }
  }, [userVehicles]);

  const cardStyle = {
    width: account?.company?.meteo_requested ? 300 : account?.company?.weather_service ? 340 : 300,
  };

  useEffect(() => {
    if (account?.company?.id) {
      const data = {
        query: {
          page: filters?.page || 1,
        },
      };
      dispatch(fetchUserVehicles({ id: account?.company?.id, page: data.query.page }));
    }
  }, [dispatch, account?.company?.id, filters]);

  const showModal = () => {
    if (windowWidth <= 990) {
      setOpenDrawerTechnique(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleOkCancel = () => {
    if (windowWidth <= 990) {
      setOpenDrawerTechnique(false);
    } else {
      setIsModalOpen(!isModalOpen);
    }
  };

  const showFieldClimateModal = () => {
    setIsModalFieldClimateOpen(true);
  };

  const handleFieldClimateOkCancel = () => {
    setIsModalFieldClimateOpen(!isModalFieldClimateOpen);
  };

  const pagePrevHandler = () => {
    if (account?.company?.id) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  const pageNextHandler = () => {
    if (account?.company?.id) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  useInfiniteScroll({
    pageNextHandler,
    pagination: userVehiclesPagination,
    allItems: allVehicles,
    widthNumber: 601,
  });

  const postInquiriesHandler = async () => {
    try {
      await dispatch(approveFieldClimateRequest({ category: 4, object_id: account?.company?.id }));
      await dispatch(fetchAccount());
      setIsModalFieldClimateOpen(false);
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
            <Link to={`/profile-technique/${record.id}`}>
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
        {windowWidth >= 991 ? (
          <div className={b('logo')}>
            <img src={logo} alt='logo' />
          </div>
        ) : null}
        <div className={b('card-block')}>
          <Card className={b('card-style')} bordered={false}>
            <div className={b('card-style-blocks')}>
              <div className={b('card-technique')}>
                {fetchLoadingAccount ? (
                  <Spin style={{ padding: '0 10px 10px' }} />
                ) : (
                  <>
                    <Title className={b('card-title')}>Количество техники</Title>
                    <div className={b('card-content')}>
                      <img src={tractorBlue} alt='group' />
                      <p>{userVehiclesPagination?.count}</p>
                    </div>
                  </>
                )}
              </div>
              <div className={`${b('card-technique-block')} ${b('card_btn_technique')}`}>
                {fetchLoadingAccount ? (
                  <Spin style={{ padding: '0 10px 10px' }} />
                ) : (
                  <>
                    <div className='logo_mobile'>
                      <img src={tractorNew} alt='group' />
                    </div>
                    <p>Кол-во техники</p>
                    <div className={b('card-content')}>
                      <p>{userVehiclesPagination?.count}</p>
                    </div>
                  </>
                )}
              </div>
              <div className={b('cloud_block_style')}>
                <Card
                  style={{
                    ...cardStyle,
                    width: 214,
                    height: 94,
                    borderRadius: 12,
                  }}
                  className={b('card-style-cloud')}
                  bordered={false}
                >
                  <div className={b('card-style-cloud-blocks')}>
                    <div>
                      {fetchLoadingAccount ? (
                        <Spin className={b('card-style-cloud-button')} />
                      ) : account?.company?.meteo_requested ? (
                        <div className={b('')}>
                          <div className={b('cloudy_img_not')}>
                            <img src={group} alt='cloudy' />
                          </div>
                          <p className='meteo-title_cloudy'>Все про погоду и почву</p>
                          <p className='meteo-title'>Подключите метеосервис</p>
                          <Button
                            disabled
                            type='primary'
                            danger
                            className={b('card-style-cloud-button_meteo')}
                          >
                            Запрос на рассмотрении
                          </Button>
                        </div>
                      ) : account?.company?.weather_service ? (
                        <>
                          <div className={b('cloudy_img')}>
                            <img src={group} alt='cloudy' />
                          </div>
                          <Button
                            icon={<CheckOutlined />}
                            disabled
                            type='dashed'
                            className={b('card-style-cloud-button')}
                          >
                            Метеостанция подключена
                          </Button>
                        </>
                      ) : (
                        <div className={b('')}>
                          <div className={b('cloudy_img_not')}>
                            <img src={group} alt='cloudy' />
                          </div>
                          <p className='meteo-title_cloudy'>Все про погоду и почву</p>
                          <p className='meteo-title'>Подключите метеосервис</p>
                          <Button
                            className={b('card-style-cloud-button_meteo')}
                            onClick={showFieldClimateModal}
                          >
                            Отправить запрос
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              <div className={b('cloud_block')}>
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
            <div className={b('mobile_data')}>
              <div className='tractor'>
                <div>
                  <img src={tractorIcons} alt='tractorNew' className={b('tractor_icon_mobile')} />
                </div>
                <div className='text_mobile_header'>
                  Ваша техника <br />
                  <b>{userVehiclesPagination?.count}</b>
                </div>
              </div>
              <div className={b('btn_mobile')}>
                <h3>Техника</h3>
                <div>
                  <Button onClick={showModal}>
                    <div>
                      <img src={tractorFons} alt='tractor' />
                    </div>
                    <p>
                      Запрос на <br />
                      добавление техники
                    </p>
                  </Button>
                  <Button onClick={() => push(`/technique-map/${account?.company?.id}`)}>
                    <div>
                      <img src={geolocationIcon} alt='geolocationIcon' />
                    </div>
                    <p>
                      Посмотреть всю <br />
                      технику
                    </p>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className={b('table')}>
          <div className={b('title')}>
            <Title level={3} data-testid='sign_in_test' className={b('title')}>
              Техника
            </Title>

            <div className={b('btn_title')}>
              <Button type='primary' onClick={showModal} style={{ marginRight: 15 }}>
                Запрос на добавление техники
              </Button>
              <Link to={`/technique-map/${account?.company?.id}`}>
                <Button type='default' className={b('view-button')}>
                  Посмотреть всю технику
                </Button>
              </Link>
            </div>
          </div>
          <div className={b('table')}>
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
        <div className={b('table_mobile')}>
          {userVehicles?.length ? (
            allVehicles?.map((item) => {
              return (
                <div key={item.id}>
                  <div className='table_img'>
                    <div>
                      <img src={urlFormat(item.image)} alt={item.image} />
                    </div>
                    <div className='text_table'>
                      <p>
                        <b>Название техники</b>
                      </p>
                      <p>{item.code}</p>
                      <p>
                        Задачи <b>{item.jobs_number}</b>
                      </p>
                    </div>
                  </div>
                  <div className={b('btn_click')}>
                    <Button onClick={() => push(`/profile-technique/${item.id}`)}>
                      <img src={tractorIcons} alt='tractor' />
                    </Button>
                    <Button
                      onClick={() => push(`/open-map/${item.id}/local-tractor/${item?.code}`)}
                    >
                      <img src={map} alt='tractor' />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <Errors status={undefined} detail='Данные отсутствуют' />
          )}
          {fetchUserVehiclesLoading && <Spin className='spin-mobile' />}
        </div>
      </div>

      <ModalComponent
        title='Добавить технику'
        open={isModalOpen}
        handleOk={handleOkCancel}
        handleCancel={handleOkCancel}
      >
        <Suspense fallback={<Skeleton active />}>
          <AddUpdateTechnique
            userId={null}
            isRequest
            handleEditOkCancel={handleOkCancel}
            onCancel={handleOkCancel}
          />
        </Suspense>
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        open={isModalFieldClimateOpen}
        handleOk={handleFieldClimateOkCancel}
        handleCancel={handleFieldClimateOkCancel}
      >
        <Suspense fallback={<Skeleton active />}>
          <RequestModal
            title='Запрос на подключение метеостанции'
            textCancel='Отправить'
            subTitle='Отправить запрос на подключение метеостанции?'
            handleDeleteCancel={handleFieldClimateOkCancel}
            loading={inquiriesLoading}
            requestHandler={postInquiriesHandler}
          />
        </Suspense>
      </ModalComponent>
      <Drawer
        open={openDrawerTechnique}
        title={<p className={b('title_drawer')}>Запрос на добавление техники</p>}
        onClose={() => setOpenDrawerTechnique(false)}
        width='100%'
      >
        <Suspense fallback={<Skeleton active />}>
          <AddUpdateTechnique
            userId={null}
            isRequest
            mobileBtn
            textBtn='Отправить запрос'
            handleEditOkCancel={handleOkCancel}
            onCancel={handleOkCancel}
          />
        </Suspense>
      </Drawer>
    </>
  );
};

export default Technique;
