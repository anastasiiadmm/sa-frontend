import { Button, Drawer, message, Skeleton, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import mapProfileIcon from 'assets/images/icons/mapProfile.svg';
import deleteIcon from 'assets/images/icons/newIcon/delete.svg';
import deleteIconDrawer from 'assets/images/icons/newIcon/deleteIcons.svg';
import edit from 'assets/images/icons/newIcon/edit.svg';
import mapIcon from 'assets/images/icons/newIcon/map.svg';
import successIcon from 'assets/images/icons/newIcon/success.svg';
import tractorBlue from 'assets/images/icons/newIcon/tractor.svg';
import tractor from 'assets/images/icons/tractor-image.svg';

import tractorProfileIcon from 'assets/images/icons/tratorProfile.svg';
import Errors from 'components/Errors/Errors';
import HeaderMobile from 'components/HeaderMobile/HeaderMobile';
import AddUpdateTechnique from 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique';
import RequestModal from 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/RequestModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import ResultComponent from 'components/ResultComponent/ResultComponent';
import TableComponent from 'components/TableComponent/TableComponent';
import useWindowWidth from 'hooks/useWindowWidth';
import { ErrorObject, userVehicles, VehicleList } from 'interfaces';
import {
  companiesSelector,
  deleteUserVehicle,
  fetchUserInfoByManager,
  fetchUserVehicleInfo,
  fetchUserVehicleList,
  setNullReducerVehicleCreate,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { apiUrlCrop } from 'utils/config';
import { urlFormat } from 'utils/files/files';

import { getErrorMessage, getPageNumber, getPageNumberPrevious } from 'utils/helper';

import 'containers/Manager/Users/UserTechnique/_userTechnique.scss';

const { Title, Text } = Typography;

const UserTechnique: React.FC = () => {
  const b = bem('UserTechnique');
  const dispatch = useAppDispatch();
  const { id, idVehicle } = useParams() as { id: string; idVehicle: string };
  const windowWidth = useWindowWidth();
  const {
    vehicleList,
    fetchVehicleListLoading,
    vehicleListPagination,
    userInfoByManager,
    userInfoByManagerLoading,
    userInfoByManagerError,
    vehicleCreateSuccess,
    deleteUserVehicleLoading,
    fetchVehicleListError,
  } = useAppSelector(companiesSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteEditModalOpen] = useState(false);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [mobileEditOpen, setMobileEditOpen] = useState(false);
  const [mobileDeleteOpen, setMobileDeleteOpen] = useState(false);
  const [openAddTechnique, setOpenAddTechnique] = useState(false);
  const [openDrawerSuccess, setOpenDrawerSuccess] = useState(false);
  const push = useNavigate();
  const [filters, setFilters] = useState({
    page: vehicleListPagination?.next
      ? Number(getPageNumber(vehicleListPagination?.next))
      : Number(getPageNumberPrevious(vehicleListPagination?.previous)),
  });

  useEffect(() => {
    const data = {
      idVehicle,
      query: {
        page: filters?.page,
      },
    };
    dispatch(fetchUserVehicleList({ data }));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(fetchUserInfoByManager({ id }));
  }, [dispatch]);

  useEffect(() => {
    if (vehicleCreateSuccess && windowWidth > 990) {
      showCreateSuccessModal();
      handleOkCancel();
    }

    if (vehicleCreateSuccess && windowWidth < 990 && windowWidth > 620) {
      setOpenAddTechnique(false);
      showCreateSuccessModal();
    }

    if (vehicleCreateSuccess && windowWidth < 620) {
      setOpenAddTechnique(false);
      setOpenDrawerSuccess(true);
    }
  }, [vehicleCreateSuccess]);

  const pagePrevHandler = () => {
    setFilters({
      ...filters,
      page: filters.page - 1,
    });
  };

  const pageNextHandler = () => {
    setFilters({
      ...filters,
      page: Number(getPageNumber(vehicleListPagination?.next)) + 1,
    });
  };

  const showModal = () => {
    if (windowWidth < 990) {
      setOpenAddTechnique(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditOkCancel = () => {
    if (windowWidth < 990) {
      setMobileEditOpen(false);
    } else {
      setIsEditModalOpen(!isEditModalOpen);
    }
  };

  const showDeleteModal = () => {
    if (windowWidth < 620) {
      setMobileDeleteOpen(true);
    } else {
      setIsDeleteEditModalOpen(true);
    }
  };

  const handleDeleteOkCancel = () => {
    setIsDeleteEditModalOpen(!isDeleteModalOpen);
  };

  const showCreateSuccessModal = () => {
    setIsModalCreateOpen(true);
  };

  const handleCreateOkCancel = () => {
    setIsModalCreateOpen(!isModalCreateOpen);
  };

  const deleteTechniqueHandler = async () => {
    try {
      await dispatch(deleteUserVehicle(vehicleId)).unwrap();
      if (windowWidth < 620) {
        await setMobileDeleteOpen(false);
      } else {
        await handleDeleteOkCancel();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e as ErrorObject, 'username');
      await message.error(`${errorMessage}`);
    }
  };

  const goToTechniqueListHandler = () => {
    handleCreateOkCancel();
    const data = {
      idVehicle,
      query: {
        page: filters?.page,
      },
    };

    dispatch(fetchUserVehicleList({ data }));
    dispatch(setNullReducerVehicleCreate());
  };

  const successHandler = () => {
    const data = {
      idVehicle,
      query: {
        page: filters?.page,
      },
    };
    dispatch(fetchUserVehicleList({ data }));
    dispatch(setNullReducerVehicleCreate());
    setOpenDrawerSuccess(false);
  };

  const editHandler = (id: string) => {
    setVehicleId(id);
    dispatch(fetchUserVehicleInfo(id));
    if (windowWidth < 990) {
      setMobileEditOpen(true);
    } else {
      showEditModal();
    }
  };

  const overlayInnerStyle = { padding: '5px 15px', borderRadius: 15 };

  const renderIcons = (record: VehicleList | userVehicles) => {
    return (
      <>
        <Tooltip title='Редактировать' color='#BBBBBB' overlayInnerStyle={overlayInnerStyle}>
          <Button
            type='text'
            onClick={() => editHandler(record?.id.toString())}
            className={b('btn_table')}
          >
            <img src={edit} alt='edit' className='link-icons' />
          </Button>
        </Tooltip>

        <Tooltip title='Просмотреть профиль' color='#BBBBBB' overlayInnerStyle={overlayInnerStyle}>
          <Link to={`/profile-technique/${record?.id}`}>
            <Button className={b('btn_table')} type='text'>
              <img src={tractorBlue} alt='tractorBlue' className={b('tractor-blue link-icons')} />
            </Button>
          </Link>
        </Tooltip>

        <Tooltip title='Просмотреть на карте' color='#BBBBBB' overlayInnerStyle={overlayInnerStyle}>
          <Link to={`/open-map/${record.id}/local-tractor/${record?.code}`}>
            <Button className={b('btn_table')} type='text'>
              <img src={mapIcon} alt='tractorBlue' className={b('tractor-blue link-icons')} />
            </Button>
          </Link>
        </Tooltip>
        <Tooltip title='Удалить' color='#BBBBBB' overlayInnerStyle={overlayInnerStyle}>
          <Button
            type='text'
            className={`${b('btn_table')} ${b('deleteBg')}`}
            onClick={() => {
              showDeleteModal();
              setVehicleId(record?.id.toString());
            }}
          >
            <img src={deleteIcon} alt='deleteIcon' className='link-icons' />
          </Button>
        </Tooltip>
      </>
    );
  };
  const columns: ColumnsType<userVehicles> = [
    {
      title: 'Код техники',
      dataIndex: 'code',
      width: '20%',
      render: (text: string, record: userVehicles) => {
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
      title: 'Название',
      dataIndex: 'description',
      filterSearch: true,
      width: '20%',
    },
    {
      title: 'Задача на обработку',
      dataIndex: 'jobs_number',
      filterSearch: true,
      width: '20%',
      render: (text: number, record: userVehicles) => {
        return <p>{record?.jobs_number}</p>;
      },
    },
    {
      title: 'Общая Площадь',
      dataIndex: 'area',
      filterSearch: true,
      width: '45%',
      render: (text: number, record: userVehicles) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
            <p className={b('text_processed_area')}>{record?.area || 0}</p>
            {renderIcons(record)}
          </div>
        );
      },
    },
  ];

  if (fetchVehicleListError || userInfoByManagerError) {
    return (
      <Errors
        status={fetchVehicleListError?.status || userInfoByManagerError?.status}
        detail={fetchVehicleListError?.detail || userInfoByManagerError?.detail}
      />
    );
  }

  const renderMobileTable = () => {
    if (fetchVehicleListLoading) {
      return <Skeleton active />;
    }

    return vehicleList.map((item) => {
      return (
        <div className={b('table_mobile')} key={item.id}>
          <div className='block_avatar'>
            <div>
              <img src={urlFormat(item.image)} alt={item.first_name} />
            </div>
            <div className='block_title'>
              <p>
                <b>Название техники</b>
              </p>
              <p className='todo'>{item.description}</p>
              <p className='todo'>
                Задачи <b>{item.jobs_number}</b>
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 10,
            }}
          >
            {renderIcons(item as VehicleList)}
          </div>
        </div>
      );
    });
  };
  const findVehicle = vehicleList.find((item) => item.id === Number(vehicleId));

  return (
    <>
      <div className={b()} data-testid='user-technique-id'>
        <HeaderMobile>
          <>
            <button onClick={() => push(-1)} type='button'>
              <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
            </button>
            <span>Техника пользователя</span>
          </>
        </HeaderMobile>
        <div className={b('table')}>
          <div className={b('header')}>
            {userInfoByManagerLoading ? (
              <Skeleton active />
            ) : (
              <div className={b('header-title')}>
                {windowWidth <= 990 ? (
                  <Title level={3} className={b('title')}>
                    <h3 className={b('subtitle')}>
                      {userInfoByManager?.last_name} {userInfoByManager?.first_name?.charAt(0)}.{' '}
                      {userInfoByManager?.middle_name === ''
                        ? null
                        : `${userInfoByManager?.middle_name.charAt(0)}.`}
                    </h3>
                    <Text className={b('subtitle')}>Техника пользователя</Text>
                  </Title>
                ) : (
                  <>
                    <Link to={`/user-profile/${id}`}>
                      <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
                    </Link>
                    <Title level={3} className={b('title')}>
                      Техника пользователя -{' '}
                      <p className={b('subtitle')}>
                        {userInfoByManager?.last_name} {userInfoByManager?.first_name?.charAt(0)}.{' '}
                        {userInfoByManager?.middle_name === ''
                          ? null
                          : `${userInfoByManager?.middle_name.charAt(0)}.`}
                      </p>
                    </Title>
                  </>
                )}
              </div>
            )}
            <div className={b('mobile_block')}>
              <Button onClick={showModal}>
                <div>
                  <p>
                    <img src={tractorProfileIcon} alt='tractorProfileIcon' />
                  </p>
                  <p>Добавить технику</p>
                </div>
              </Button>
              <Button onClick={() => push(`/technique-map/${idVehicle}`)}>
                <div>
                  <p>
                    <img src={mapProfileIcon} alt='tractorProfileIcon' />
                  </p>
                  <p>
                    Посмотреть всю <br /> технику
                  </p>
                </div>
              </Button>
            </div>
            <div className={b('btn_handler')}>
              <Button type='primary' onClick={showModal}>
                Добавить технику
              </Button>
              <Link to={`/technique-map/${idVehicle}`}>
                <Button type='default' className={b('view-button')}>
                  Вся техника на карте
                </Button>
              </Link>
            </div>
          </div>
          {windowWidth < 620 && !vehicleList.length ? (
            <Errors status={null} detail='Техники нет' />
          ) : null}
          <div className={b('table_list')}>
            <TableComponent
              rowKey={(record) => record.id as number}
              loading={fetchVehicleListLoading}
              columns={columns}
              data={vehicleList}
              params={
                fetchVehicleListLoading
                  ? { previous: null, next: null, count: 0 }
                  : vehicleListPagination
              }
              pagePrevHandler={pagePrevHandler}
              pageNextHandler={pageNextHandler}
            />
          </div>
        </div>
        <div className={b('list_table_mobile')}>{renderMobileTable()}</div>
      </div>

      <ModalComponent
        title='Добавить технику'
        open={isModalOpen}
        handleOk={handleOkCancel}
        handleCancel={handleOkCancel}
      >
        <AddUpdateTechnique userId={id} titleBool={false} onCancel={handleOkCancel} />
      </ModalComponent>

      <ModalComponent
        title='Редактировать технику'
        open={isEditModalOpen}
        handleOk={handleEditOkCancel}
        handleCancel={handleEditOkCancel}
      >
        <AddUpdateTechnique
          isEdit
          userId={id}
          vehicleId={vehicleId}
          titleBool={false}
          onCancel={handleEditOkCancel}
          handleEditOkCancel={handleEditOkCancel}
        />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        open={isDeleteModalOpen}
        handleOk={handleDeleteOkCancel}
        handleCancel={handleDeleteOkCancel}
      >
        <RequestModal
          title='Удалить?'
          textCancel='Удалить'
          subTitle={`Вы уверены, что хотите удалить ${findVehicle?.description}`}
          loading={deleteUserVehicleLoading}
          handleDeleteCancel={handleDeleteOkCancel}
          requestHandler={deleteTechniqueHandler}
        />
      </ModalComponent>

      <ModalComponent dividerShow={false} open={isModalCreateOpen} closable={false}>
        <ResultComponent
          icon={<img src={successIcon} alt='success' width='58px' height='58px' />}
          status='info'
          title='Техника добавлена'
        />
        <Button
          type='primary'
          style={{ width: '100%', borderRadius: 8, height: 36, marginTop: 10 }}
          onClick={goToTechniqueListHandler}
        >
          Готово
        </Button>
      </ModalComponent>
      <Drawer
        open={mobileEditOpen}
        width='100%'
        title={
          <p
            style={{
              textAlign: 'center',
              padding: 0,
              margin: 0,
              fontWeight: 500,
            }}
          >
            Редактировать технику
          </p>
        }
        onClose={() => setMobileEditOpen(false)}
      >
        <AddUpdateTechnique
          isEdit
          userId={id}
          mobileBtn
          onCancel={() => setMobileEditOpen(false)}
          vehicleId={vehicleId}
          titleBool={false}
          handleEditOkCancel={handleEditOkCancel}
        />
      </Drawer>
      <Drawer
        open={mobileDeleteOpen}
        onClose={() => setMobileDeleteOpen(false)}
        placement='bottom'
        closable={false}
        height={290}
      >
        <div className={b('delete_mobile')}>
          <div>
            <img src={deleteIconDrawer} alt='deleteIconDrawer' />
          </div>
          <h4>Удалить?</h4>
          <p>
            Вы уверены, что хотите удалить <b>{findVehicle?.description}</b>
          </p>
          <Button
            loading={deleteUserVehicleLoading}
            onClick={deleteTechniqueHandler}
            style={{
              backgroundColor: '#B80B0B',
              color: '#ffffff',
            }}
          >
            Удалить
          </Button>
          <Button
            onClick={() => setMobileDeleteOpen(false)}
            style={{
              backgroundColor: '#F8F8F8',
              color: '#689F3A',
            }}
          >
            Отмена
          </Button>
        </div>
      </Drawer>
      <Drawer
        open={openAddTechnique}
        onClose={() => setOpenAddTechnique(false)}
        width='100%'
        title={<p className={b('text_add_drawer')}>Добавить технику</p>}
      >
        <AddUpdateTechnique
          userId={id}
          titleBool={false}
          mobileBtn
          onCancel={() => setOpenAddTechnique(false)}
        />
      </Drawer>
      <Drawer
        open={openDrawerSuccess}
        closable={false}
        height={211}
        onClose={() => setOpenDrawerSuccess(false)}
        placement='bottom'
      >
        <div>
          <img src={successIcon} width={56} height={56} alt='successIcon' />
          <p className={b('title_drawer_success')}>Техника добавлена</p>
          <Button className={b('btn_drawer_mobile_success')} onClick={successHandler}>
            Готово
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default UserTechnique;
