import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Spin } from 'antd/lib';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import people from 'assets/images/icons/group-active.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import notFoundImages from 'assets/images/notFound.svg';
import Errors from 'components/Errors/Errors';
import TableComponent from 'components/TableComponent/TableComponent';
import { getPageNumber, getPageNumberPrevious } from 'helper';
import useWindowWidth from 'hooks/useWindowWidth';
import { IAccount } from 'interfaces';
import { companiesSelector, fetchUsersList } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import 'containers/Manager/Users/_users.scss';

const { Title, Text } = Typography;

const Users: React.FC = () => {
  const b = bem('Users');
  const push = useNavigate();
  const { companies, fetchCompaniesLoading, companiesListPagination, fetchCompaniesError } =
    useAppSelector(companiesSelector);
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();
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

  const columns: ColumnsType<IAccount> = [
    {
      key: 'last_name',
      title: 'ФИО',
      dataIndex: 'name',
      width: '30%',
      fixed: 'left',
      render: (text: string, record: IAccount) => {
        return (
          <p className={b('user-name')}>
            {record?.last_name} {record?.first_name} {record?.middle_name}
          </p>
        );
      },
    },
    {
      title: 'Название компании',
      key: 'name',
      dataIndex: 'name',
      filterSearch: true,
      width: '30%',
      render: (text: string, record: IAccount) => {
        return <p>{record?.company?.name}</p>;
      },
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phone',
      key: 'phone',
      filterSearch: true,
      width: '30%',
      render: (text: string, record: IAccount) => {
        return <p>{record?.phone}</p>;
      },
    },
    {
      title: 'Блоки автопилота',
      key: 'autopilots_amount',
      dataIndex: 'autopilots_amount',
      filterSearch: true,
      width: '25%',
      render: (text: string, record: IAccount) => (
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
        <Card className={b('card-style')} bordered={false}>
          <Title className={b('card-title')}>Добавлено пользователей</Title>
          <div className={b('card-content')}>
            <img src={people} alt='group' />
            <p>{companiesListPagination?.count || 0}</p>
          </div>
        </Card>
        <Card className={b('card-style')} bordered={false}>
          <Title className={b('card-title')}>Добавлено Техники</Title>
          <div className={b('card-content')}>
            <img src={tractorBlue} alt='group' />
            <p>{companiesListPagination?.vehicles_count}</p>
          </div>
        </Card>
      </div>
      {windowWidth <= 600 ? (
        fetchCompaniesLoading ? (
          <Spin />
        ) : companies?.length === 0 ? (
          <img src={notFoundImages} alt='notFoundImages' />
        ) : (
          companies?.map((comp) => {
            return (
              <Card className={b('card-style-mobile')} bordered={false} key={comp?.id}>
                <Title level={3} style={{ margin: 0 }}>
                  {comp?.last_name} {comp?.first_name?.charAt(0)}.{' '}
                  {comp?.middle_name === '' ? null : `${comp?.middle_name.charAt(0)}.`}
                </Title>
                <div className={b('card-content-mobile')}>
                  <div className={b('mobile-titles-block')}>
                    <Text type='secondary'>Название компании</Text>
                    <Text strong>{comp?.company?.name}</Text>
                  </div>
                  <div className={b('mobile-info-block')}>
                    <div className={b('mobile-titles-block')}>
                      <Text type='secondary'>Номер телефона</Text>
                      <Text strong>{comp?.phone}</Text>
                    </div>
                    <div className={b('mobile-titles-block')}>
                      <Text type='secondary'>Блоки автопилота</Text>
                      <Text strong>{comp?.company?.autopilots_amount}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )
      ) : (
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
      )}
    </div>
  );
};

export default Users;
