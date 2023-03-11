import { Card, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import people from 'assets/images/icons/group-active.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import TableComponent from 'components/TableComponent/TableComponent';
import { companiesSelector, fetchUsersList } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { companiesList } from 'types';
import 'containers/Manager/Users/_users.scss';

const { Title } = Typography;

const Users: React.FC = () => {
  const b = bem('Users');
  const { companies, fetchCompaniesLoading, companiesListPagination } =
    useAppSelector(companiesSelector);
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
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
    setFilters({ ...filters, page: filters.page - 1 });
  };

  const pageNextHandler = () => {
    setFilters({ ...filters, page: filters.page + 1 });
  };

  const columns: ColumnsType<companiesList> = [
    {
      key: 'last_name',
      title: 'ФИО',
      dataIndex: 'name',
      width: '30%',
      sorter: true,
      fixed: 'left',
      render: (text: string, record: companiesList) => {
        return (
          <p>
            {record?.user?.last_name} {record?.user?.first_name} {record?.user?.middle_name}
          </p>
        );
      },
    },
    {
      title: 'Название компании',
      dataIndex: 'name',
      filterSearch: true,
      width: '30%',
      sorter: true,
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phone',
      filterSearch: true,
      width: '30%',
      sorter: true,
      render: (text: string, record: companiesList) => {
        return <p>{record?.user?.phone}</p>;
      },
    },
    {
      title: 'Блоки автопилота',
      dataIndex: 'autopilots_amount',
      filterSearch: true,
      width: '25%',
      sorter: true,
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '30%',
      render: () => (
        <Link className={b('profile-link')} to='/user-profile'>
          Просмотреть профиль
        </Link>
      ),
    },
  ];

  return (
    <div className={b()}>
      <div className={b('card-block')}>
        <Card className={b('card-style')} bordered={false} style={{ width: 300 }}>
          <Title className={b('card-title')}>Добавлено пользователей</Title>
          <div className={b('card-content')}>
            <img src={people} alt='group' />
            <p>48</p>
          </div>
        </Card>
        <Card className={b('card-style')} bordered={false} style={{ width: 300 }}>
          <Title className={b('card-title')}>Добавлено Техники</Title>
          <div className={b('card-content')}>
            <img src={tractorBlue} alt='group' />
            <p>122</p>
          </div>
        </Card>
      </div>
      <div className={b('table')}>
        <Title level={3} data-testid='sign_in_test' className={b('title')}>
          Пользователи
        </Title>

        <TableComponent
          rowKey={(record) => record.id}
          loading={fetchCompaniesLoading}
          columns={columns}
          data={companies}
          params={companiesListPagination}
          pagePrevHandler={pagePrevHandler}
          pageNextHandler={pageNextHandler}
        />
      </div>
    </div>
  );
};

export default Users;
