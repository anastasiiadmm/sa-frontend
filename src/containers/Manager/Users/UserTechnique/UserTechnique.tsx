import { EyeOutlined } from '@ant-design/icons';
import { Button, message, Skeleton, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import deleteIcon from 'assets/images/icons/delete.svg';
import edit from 'assets/images/icons/edit.svg';
import successIcon from 'assets/images/icons/success.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import tractor from 'assets/images/icons/tractor-image.svg';
import Errors from 'components/Errors/Errors';
import AddUpdateTechnique from 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique';
import RequestModal from 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/RequestModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import ResultComponent from 'components/ResultComponent/ResultComponent';
import TableComponent from 'components/TableComponent/TableComponent';
import { getErrorMessage, getPageNumber, getPageNumberPrevious } from 'helper';
import { ErrorObject, userVehicles } from 'interfaces';
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

import 'containers/Manager/Users/UserTechnique/_userTechnique.scss';

const { Title } = Typography;

const UserTechnique: React.FC = () => {
  const b = bem('UserTechnique');
  const dispatch = useAppDispatch();
  const { id, idVehicle } = useParams() as { id: string; idVehicle: string };
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
    if (vehicleCreateSuccess) {
      showCreateSuccessModal();
      handleOkCancel();
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
    setIsModalOpen(true);
  };

  const handleOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditOkCancel = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const showDeleteModal = () => {
    setIsDeleteEditModalOpen(true);
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
      await handleDeleteOkCancel();
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

  const editHandler = (id: string) => {
    showEditModal();
    setVehicleId(id);
    dispatch(fetchUserVehicleInfo(id));
  };
  const columns: ColumnsType<userVehicles> = [
    {
      title: 'Код техники',
      dataIndex: 'code',
      width: '20%',
      fixed: 'left',
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
            <Tooltip
              title='Редактировать'
              color='#BBBBBB'
              overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            >
              <Button type='text' onClick={() => editHandler(record?.id.toString())}>
                <img src={edit} alt='edit' className='link-icons' />
              </Button>
            </Tooltip>

            <Tooltip
              title='Просмотреть профиль'
              color='#BBBBBB'
              overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            >
              <Link to={`/profile-technique/${id}/${record?.id}`}>
                <Button type='text'>
                  <EyeOutlined style={{ fontSize: '27px', color: '#1358bf' }} />
                </Button>
              </Link>
            </Tooltip>

            <Tooltip
              title='Просмотреть на карте'
              color='#BBBBBB'
              overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            >
              <Link to={`/open-map/${record.id}/local-tractor`}>
                <Button type='text' style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={tractorBlue}
                    alt='tractorBlue'
                    className={b('tractor-blue link-icons')}
                  />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip
              title='Удалить'
              color='#BBBBBB'
              overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            >
              <Button
                type='text'
                onClick={() => {
                  showDeleteModal();
                  setVehicleId(record?.id.toString());
                }}
              >
                <img src={deleteIcon} alt='deleteIcon' className='link-icons' />
              </Button>
            </Tooltip>
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

  return (
    <>
      <div className={b()} data-testid='user-technique-id'>
        <div className={b('table')}>
          <div className={b('header')}>
            {userInfoByManagerLoading ? (
              <Skeleton active />
            ) : (
              <div className={b('header-title')}>
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
              </div>
            )}

            <div>
              <Button type='primary' onClick={showModal}>
                Добавить технику
              </Button>
              <Link to='/technique-map'>
                <Button type='default' className={b('view-button')}>
                  Посмотреть всю технику
                </Button>
              </Link>
            </div>
          </div>

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

      <ModalComponent
        title='Добавить технику'
        open={isModalOpen}
        handleOk={handleOkCancel}
        handleCancel={handleOkCancel}
      >
        <AddUpdateTechnique userId={id} titleBool={false} />
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
          subTitle='Вы уверены, что хотите удалить'
          loading={deleteUserVehicleLoading}
          handleDeleteCancel={handleDeleteOkCancel}
          requestHandler={deleteTechniqueHandler}
        />
      </ModalComponent>

      <ModalComponent dividerShow={false} open={isModalCreateOpen} closable={false}>
        <ResultComponent
          icon={<img src={successIcon} alt='success' />}
          status='info'
          title='Техника добавлена'
        />
        <Button
          type='primary'
          style={{ width: '100%', borderRadius: 4 }}
          onClick={goToTechniqueListHandler}
        >
          Хорошо
        </Button>
      </ModalComponent>
    </>
  );
};

export default UserTechnique;
