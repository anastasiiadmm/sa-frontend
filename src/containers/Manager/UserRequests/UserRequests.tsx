import { EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import newUser from 'assets/images/icons/new_user_request.svg';
import tractorRequest from 'assets/images/icons/tractor_request.svg';
import user from 'assets/images/icons/user_request.svg';
import DeleteRejectTechniqueModal from 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/DeleteTechniqueModal';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import RequestAddTechnique from 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestAddTechnique/RequestAddTechnique';
import RequestRegisterUser from 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestRegisterUser/RequestRegisterUser';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import TableComponent from 'components/TableComponent/TableComponent';
import { accountsSelector, fetchRequests } from 'redux/accounts/accountsSlice';
import { companiesSelector, fetchUserInfo } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Request, UserIds } from 'types/types';
import 'containers/Manager/UserRequests/_userRequests.scss';

const { Title } = Typography;

const UserRequests = () => {
  const b = bem('UserRequests');
  const dispatch = useAppDispatch();
  const { requests, fetchRequestsLoading, requestsPagination } = useAppSelector(accountsSelector);
  const { userInfo, userInfoLoading } = useAppSelector(companiesSelector);
  const [isModalTechniqueOpen, setIsModalTechniqueOpen] = useState(false);
  const [isModalRegisterUserOpen, setIsModalRegisterUserTechniqueOpen] = useState(false);
  const [isModalRejectOpen, setIsModalRejectOpen] = useState(false);
  const [isModalUserInfoOpen, setIsModalUserInfoRejectOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1 });
  const [userIds, setUserIds] = useState<UserIds | null>({ requestId: null, userId: null });

  useEffect(() => {
    const data = {
      query: {
        page: filters?.page,
      },
    };

    dispatch(fetchRequests({ data }));
  }, [dispatch, filters]);

  useEffect(() => {
    const data = {
      id: userIds?.userId,
    };
    if (userIds?.userId) {
      dispatch(fetchUserInfo({ data }));
    }
  }, [dispatch, userIds?.userId]);

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

  const pagePrevHandler = () => {
    setFilters({ ...filters, page: filters.page - 1 });
  };

  const pageNextHandler = () => {
    setFilters({ ...filters, page: filters.page + 1 });
  };

  const columns: ColumnsType<Request> = [
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
              row?.confirmation_type === 2
                ? user
                : row?.confirmation_type === 3
                ? tractorRequest
                : newUser
            }
          />
        );
      },
    },
    {
      title: 'Дата запроса',
      dataIndex: 'created_at',
      width: '20%',
      sorter: true,
    },
    {
      title: 'Тип запроса',
      dataIndex: 'confirmation_type_text',
      filterSearch: true,
      width: '35%',
      sorter: true,
    },
    {
      title: 'Название компании',
      dataIndex: 'enterprise_name',
      filterSearch: true,
      width: '35%',
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '20%',
      render: (text, row) => {
        return (
          <Tooltip
            title='Просмотреть запрос'
            color='#BBBBBB'
            overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
          >
            <Button
              type='link'
              onClick={
                row?.confirmation_type === 2
                  ? () => {
                      showUserInfoModal();
                    }
                  : row?.confirmation_type === 3
                  ? () => {
                      showTechniqueModal();
                    }
                  : () => {
                      showRegisterUserModal();
                      setUserIds({
                        requestId: row?.id.toString(),
                        userId: row?.enterprise.toString(),
                      });
                    }
              }
            >
              <EyeOutlined style={{ fontSize: '20px' }} />
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <div className={b()} data-testid='requests-id'>
        <div className={b('table')}>
          <Title level={3} data-testid='sign_in_test' className={b('title')}>
            Запросы
          </Title>

          <TableComponent
            loading={fetchRequestsLoading}
            columns={columns}
            data={requests}
            rowKey={(record) => record.id as number}
            params={requestsPagination}
            pagePrevHandler={pagePrevHandler}
            pageNextHandler={pageNextHandler}
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
          userInfo={userInfo}
          userIds={userIds}
          userInfoLoading={userInfoLoading}
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
