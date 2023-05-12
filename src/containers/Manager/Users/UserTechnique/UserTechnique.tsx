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
import {
  companiesSelector,
  deleteUserVehicle,
  fetchUserInfo,
  fetchUserVehicleList,
  setNullReducerVehicleCreate,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { vehicleList } from 'types/types';
import { apiUrlCrop } from 'utils/config';

import 'containers/Manager/Users/UserTechnique/_userTechnique.scss';

const { Title } = Typography;

const UserTechnique: React.FC = () => {
  const b = bem('UserTechnique');
  const dispatch = useAppDispatch();
  const { id } = useParams() as { id: string };
  const {
    vehicleList,
    fetchVehicleListLoading,
    vehicleListPagination,
    userInfo,
    vehicleCreateSuccess,
    deleteUserVehicleLoading,
    fetchVehicleListError,
    userInfoError,
    userInfoLoading,
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
      userId: id,
      query: {
        page: filters?.page,
      },
    };
    dispatch(fetchUserVehicleList({ data }));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(fetchUserInfo({ id }));
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
      await dispatch(deleteUserVehicle({ userId: id, vehicleId })).unwrap();
      await handleDeleteOkCancel();
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
    }
  };

  const goToTechniqueListHandler = () => {
    handleCreateOkCancel();
    const data = {
      userId: id,
      query: {
        page: 1,
      },
    };

    dispatch(fetchUserVehicleList({ data }));
    dispatch(setNullReducerVehicleCreate());
  };

  const columns: ColumnsType<vehicleList> = [
    {
      title: 'Код техники',
      dataIndex: 'code',
      width: '20%',
      fixed: 'left',
      render: (text: string, record: vehicleList) => {
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
      title: 'Поля',
      dataIndex: 'field_count',
      filterSearch: true,
      width: '20%',
      render: (text: string, record: vehicleList) => {
        return <p>{record?.vehicle_fields_data?.field_count}</p>;
      },
    },
    {
      title: 'Общая Площадь',
      dataIndex: 'processed_area',
      filterSearch: true,
      width: '45%',
      render: (text: string, record: vehicleList) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
            <p className={b('text_processed_area')}>
              {record?.vehicle_fields_data?.processed_area || 0}
            </p>
            <Tooltip
              title='Редактировать'
              color='#BBBBBB'
              overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            >
              <Button
                type='text'
                onClick={() => {
                  showEditModal();
                  setVehicleId(record?.id.toString());
                }}
              >
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

  if (fetchVehicleListError || userInfoError) {
    return (
      <Errors
        status={fetchVehicleListError?.status || userInfoError?.status}
        detail={fetchVehicleListError?.detail || userInfoError?.detail}
      />
    );
  }

  return (
    <>
      <div className={b()} data-testid='user-technique-id'>
        <div className={b('table')}>
          <div className={b('header')}>
            {userInfoLoading ? (
              <Skeleton active />
            ) : (
              <div className={b('header-title')}>
                <Link to={`/user-profile/${id}`}>
                  <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
                </Link>
                <Title level={3} className={b('title')}>
                  Техника пользователя -{' '}
                  <p className={b('subtitle')}>
                    {' '}
                    {`${userInfo?.data?.user?.last_name} ${userInfo?.data?.user?.first_name?.charAt(
                      0,
                    )}. ${userInfo?.data?.user?.middle_name?.charAt(0)}.`}
                  </p>
                </Title>
              </div>
            )}

            <div>
              <Button type='primary' onClick={showModal}>
                Добавить технику
              </Button>
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
