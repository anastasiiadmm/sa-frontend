import { Button, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import deleteIcon from 'assets/images/icons/delete.svg';
import edit from 'assets/images/icons/edit.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import tractor from 'assets/images/icons/tractor-image.svg';
import AddUpdateTechnique from 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/AddUpdateTechnique';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import 'containers/Manager/Users/UserTechnique/_userTechnique.scss';
import DeleteRejectTechniqueModal from 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/DeleteTechniqueModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteEditModalOpen] = useState(false);

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
      width: '20%',
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
    <>
      <div className={b()}>
        <div className={b('table')}>
          <div className={b('header')}>
            <div className={b('header-title')}>
              <Link to='/user-profile'>
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
