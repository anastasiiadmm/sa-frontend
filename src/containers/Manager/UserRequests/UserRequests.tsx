import { Button, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useState } from 'react';

import new_user from 'assets/images/icons/new_user_request.svg';
import tractor_request from 'assets/images/icons/tractor_request.svg';
import user from 'assets/images/icons/user_request.svg';
import DeleteRejectTechniqueModal from 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/DeleteTechniqueModal';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import RequestAddTechnique from 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestAddTechnique/RequestAddTechnique';
import RequestRegisterUser from 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestRegisterUser/RequestRegisterUser';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import 'containers/Manager/UserRequests/_userRequests.scss';

const { Title } = Typography;

interface DataType {
  key: React.Key;
  date: string;
  type: string;
  name: string;
}

const UserRequests = () => {
  const b = bem('UserRequests');
  const [isModalTechniqueOpen, setIsModalTechniqueOpen] = useState(false);
  const [isModalRegisterUserOpen, setIsModalRegisterUserTechniqueOpen] = useState(false);
  const [isModalRejectOpen, setIsModalRejectOpen] = useState(false);
  const [isModalUserInfoOpen, setIsModalUserInfoRejectOpen] = useState(false);

  const showRejectModal = () => {
    setIsModalRejectOpen(true);
  };

  const handleOkRejectCancel = () => {
    setIsModalRejectOpen(!isModalRejectOpen);
  };

  const rejectTechniqueHandler = () => {};

  const showTechniqueModal = () => {
    setIsModalTechniqueOpen(true);
  };

  const handleOkTechniqueCancel = () => {
    setIsModalTechniqueOpen(!isModalTechniqueOpen);
  };

  const showRegisterUserModal = () => {
    setIsModalRegisterUserTechniqueOpen(true);
  };

  const handleOkRegisterUserCancel = () => {
    setIsModalRegisterUserTechniqueOpen(!isModalRegisterUserOpen);
  };

  const showUserInfoModal = () => {
    setIsModalUserInfoRejectOpen(true);
  };

  const handleOkUserInfoCancel = () => {
    setIsModalUserInfoRejectOpen(!isModalUserInfoOpen);
  };

  const columns: ColumnsType<DataType> = [
    {
      dataIndex: 'type_request',
      filterSearch: true,
      width: '10%',
      fixed: 'left',
      render: (text, row) => {
        return (
          <img
            alt='info'
            src={
              row?.type === 'Личная информация'
                ? user
                : row?.type === 'Добавление техники'
                ? tractor_request
                : new_user
            }
          />
        );
      },
    },
    {
      title: 'Дата запроса',
      dataIndex: 'date',
      width: '20%',
      sorter: true,
    },
    {
      title: 'Тип запроса',
      dataIndex: 'type',
      filterSearch: true,
      width: '35%',
      sorter: true,
    },
    {
      title: 'Название компании',
      dataIndex: 'name',
      filterSearch: true,
      width: '35%',
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '20%',
      render: (text, row) => (
        <Button
          type='link'
          onClick={
            row?.type === 'Личная информация'
              ? showUserInfoModal
              : row?.type === 'Добавление техники'
              ? showTechniqueModal
              : showRegisterUserModal
          }
        >
          Просмотр запроса
        </Button>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      date: '20/02/2023',
      type: 'Личная информация',
      name: 'Иванов ИП',
    },
    {
      key: '2',
      date: '20/02/2023',
      type: 'Добавление техники',
      name: 'Иванов ИП',
    },
    {
      key: '3',
      date: '20/02/2023',
      type: 'Регистрация нового профиля',
      name: 'Иванов ИП',
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {};

  return (
    <>
      <div className={b()}>
        <div className={b('table')}>
          <Title level={3} data-testid='sign_in_test' className={b('title')}>
            Запросы
          </Title>

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
        dividerShow={false}
        title='Запрос на добавление техники'
        open={isModalTechniqueOpen}
        handleOk={handleOkTechniqueCancel}
        handleCancel={handleOkTechniqueCancel}
      >
        <RequestAddTechnique
          handleOkCancel={handleOkTechniqueCancel}
          showRejectModal={showRejectModal}
        />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        title='Запрос на регистрацию'
        open={isModalRegisterUserOpen}
        handleOk={handleOkRegisterUserCancel}
        handleCancel={handleOkRegisterUserCancel}
      >
        <RequestRegisterUser
          handleOkCancel={handleOkRegisterUserCancel}
          showRejectModal={showRejectModal}
        />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        title='Запрос на изменение личной информации'
        open={isModalUserInfoOpen}
        handleOk={handleOkUserInfoCancel}
        handleCancel={handleOkUserInfoCancel}
      >
        <EditUserProfileModal
          handleOkCancel={handleOkUserInfoCancel}
          showRejectModal={showRejectModal}
          changeUserInfoRequest
        />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        open={isModalRejectOpen}
        handleOk={handleOkRejectCancel}
        handleCancel={handleOkRejectCancel}
      >
        <DeleteRejectTechniqueModal
          title='Отклонить?'
          subTitle='Вы уверены, что хотите отклонить запрос'
          techniqueName='Личная информация Иванов И.И?'
          handleDeleteCancel={handleOkRejectCancel}
          deleteRejectTechniqueHandler={rejectTechniqueHandler}
        />
      </ModalComponent>
    </>
  );
};

export default UserRequests;
