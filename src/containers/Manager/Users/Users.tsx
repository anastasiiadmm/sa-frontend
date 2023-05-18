import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import people from 'assets/images/icons/group-active.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import Errors from 'components/Errors/Errors';
import TableComponent from 'components/TableComponent/TableComponent';
import { getPageNumber, getPageNumberPrevious } from 'helper';
import { companiesSelector, fetchUsersList } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { requestUserProfileData } from 'types/types';

import 'containers/Manager/Users/_users.scss';

const { Title } = Typography;

const Users: React.FC = () => {
  const b = bem('Users');
  const push = useNavigate();
  const { companies, fetchCompaniesLoading, companiesListPagination, fetchCompaniesError } =
    useAppSelector(companiesSelector);
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: companiesListPagination?.next
      ? Number(getPageNumber(companiesListPagination?.next))
      : Number(getPageNumberPrevious(companiesListPagination?.previous)),
  });

  useEffect(() => {
    const data = {
      query: {
        page: filters?.page,
      },
    };

    dispatch(fetchUsersList({ data }));
  }, [dispatch, filters]);

  const pagePrevHandler = () => {
    setFilters({
      ...filters,
      page: filters.page - 1,
    });
  };

  const pageNextHandler = () => {
    setFilters({
      ...filters,
      page: Number(getPageNumber(companiesListPagination?.next)) + 1,
    });
  };

  const nextBrowserUserInfoHandler = (id: number) => {
    push(`/user-profile/${id}/`);
  };

  const columns: ColumnsType<requestUserProfileData> = [
    {
      key: 'last_name',
      title: 'ФИО',
      dataIndex: 'name',
      width: '30%',
      fixed: 'left',
      render: (text: string, record: requestUserProfileData) => {
        return (
          <p className={b('user-name')}>
            {record?.last_name} {record?.first_name} {record?.middle_name}
          </p>
        );
      },
    },
    {
      title: 'Название компании',
      dataIndex: 'name',
      filterSearch: true,
      width: '30%',
      render: (text: string, record: requestUserProfileData) => {
        return <p>{record?.company?.name}</p>;
      },
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phone',
      filterSearch: true,
      width: '30%',
      render: (text: string, record: requestUserProfileData) => {
        return <p>{record?.phone}</p>;
      },
    },
    {
      title: 'Блоки автопилота',
      dataIndex: 'autopilots_amount',
      filterSearch: true,
      width: '25%',
      render: (text: string, record: requestUserProfileData) => (
        <>
          <span>{record?.company?.autopilots_amount}</span>
          <Tooltip
            title='Просмотреть профиль'
            color='#BBBBBB'
            overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            placement='left'
          >
            <Button
              type='link'
              className={b('profile-link')}
              onClick={() => nextBrowserUserInfoHandler(record?.id as number)}
            >
              <EyeOutlined style={{ fontSize: '23px' }} />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  if (fetchCompaniesError) {
    return <Errors status={fetchCompaniesError.status} detail={fetchCompaniesError.detail} />;
  }

  return (
    <div className={b()} data-testid='companies-id'>
      <div className={b('card-block')}>
        <Card className={b('card-style')} bordered={false} style={{ width: 300 }}>
          <Title className={b('card-title')}>Добавлено пользователей</Title>
          <div className={b('card-content')}>
            <img src={people} alt='group' />
            <p>{companiesListPagination?.count || 0}</p>
          </div>
        </Card>
        <Card className={b('card-style')} bordered={false} style={{ width: 300 }}>
          <Title className={b('card-title')}>Добавлено Техники</Title>
          <div className={b('card-content')}>
            <img src={tractorBlue} alt='group' />
            <p>{companiesListPagination?.vehicles_count}</p>
          </div>
        </Card>
      </div>
      <div className={b('table')}>
        <Title level={3} data-testid='sign_in_test' className={b('title')}>
          Пользователи
        </Title>
        <TableComponent
          rowKey={(record) => record.id as number}
          loading={fetchCompaniesLoading}
          columns={columns}
          data={companies}
          params={
            fetchCompaniesLoading
              ? { previous: null, next: null, count: 0 }
              : companiesListPagination
          }
          pagePrevHandler={pagePrevHandler}
          pageNextHandler={pageNextHandler}
        />
      </div>
    </div>
  );
};

export default Users;
