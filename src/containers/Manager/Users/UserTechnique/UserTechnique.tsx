import { Button, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import deleteIcon from 'assets/images/icons/delete.svg';
import edit from 'assets/images/icons/edit.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import tractor from 'assets/images/icons/tractor-image.svg';
import AddUpdateTechnique from 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique';
import DeleteRejectTechniqueModal from 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/DeleteTechniqueModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import TableComponent from 'components/TableComponent/TableComponent';
import { companiesSelector, fetchUserVehicleList } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { vehicleList } from 'types';
import 'containers/Manager/Users/UserTechnique/_userTechnique.scss';

const { Title } = Typography;

const UserTechnique: React.FC = () => {
  const b = bem('UserTechnique');
  const dispatch = useAppDispatch();
  const { id } = useParams() as { id: string };
  const { vehicleList, fetchVehicleListLoading, vehicleListPagination } =
    useAppSelector(companiesSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
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

  const pagePrevHandler = () => {
    setFilters({ ...filters, page: filters.page - 1 });
  };

  const pageNextHandler = () => {
    setFilters({ ...filters, page: filters.page + 1 });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditOk = () => {
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const showDeleteModal = () => {
    setIsDeleteEditModalOpen(true);
  };

  const handleDeleteOk = () => {
    setIsDeleteEditModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteEditModalOpen(false);
  };

  const deleteTechniqueHandler = () => {};

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
              src={record.image ? `https://agri.ltestl.com${record.image}` : tractor}
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
      width: '20%',
      render: (text: string, record: vehicleList) => {
        return <p>{record?.vehicle_fields_data?.processed_area || 0}</p>;
      },
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '40%',
      render: () => (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link className={b('profile-link')} to='/user-profile'>
            Просмотр на карте
          </Link>
          <Button type='text' onClick={showEditModal}>
            <img src={edit} alt='edit' className='link-icons' />
          </Button>
          <Link to='/profile-technique'>
            <Button type='text'>
              <img src={tractorBlue} alt='tractorBlue' className={b('tractor-blue link-icons')} />
            </Button>
          </Link>
          <Button type='text' onClick={showDeleteModal}>
            <img src={deleteIcon} alt='deleteIcon' className='link-icons' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={b()}>
        <div className={b('table')}>
          <div className={b('header')}>
            <div className={b('header-title')}>
              <Link to={`/user-profile/${id}`}>
                <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
              </Link>
              <Title level={3} className={b('title')}>
                Техника пользователя - <p className={b('subtitle')}> Иванов И.И</p>
              </Title>
            </div>

            <div>
              <Button type='primary' onClick={showModal}>
                Добавить технику
              </Button>
            </div>
          </div>

          <TableComponent
            rowKey={(record) => record.id}
            loading={fetchVehicleListLoading}
            columns={columns}
            data={vehicleList}
            params={vehicleListPagination}
            pagePrevHandler={pagePrevHandler}
            pageNextHandler={pageNextHandler}
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

      <ModalComponent
        title='Редактировать технику'
        open={isEditModalOpen}
        handleOk={handleEditOk}
        handleCancel={handleEditCancel}
      >
        <AddUpdateTechnique isEdit />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        open={isDeleteModalOpen}
        handleOk={handleDeleteOk}
        handleCancel={handleDeleteCancel}
      >
        <DeleteRejectTechniqueModal
          title='Удалить?'
          subTitle='Вы уверены, что хотите удалить'
          techniqueName='Камаз 6595?'
          handleDeleteCancel={handleDeleteCancel}
          deleteRejectTechniqueHandler={deleteTechniqueHandler}
        />
      </ModalComponent>
    </>
  );
};

export default UserTechnique;
