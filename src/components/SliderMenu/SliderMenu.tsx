import { CloudOutlined, HomeOutlined, ImportOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import logo from 'assets/images/logo.png';
import {
  accountsSelector,
  clearRequestsPagination,
  fetchManager,
  fetchUser,
} from 'redux/accounts/accountsSlice';
import { authSelector, logoutUser } from 'redux/auth/authSlice';
import { clearCompaniesPagination } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { apiUrlCrop } from 'utils/config';
import { logoutLocalStorage } from 'utils/token';

import 'components/SliderMenu/_sliderMenu.scss';

const { Sider } = Layout;

type Props = {
  collapsed: boolean;
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const SliderMenu: React.FC<Props> = ({ collapsed }) => {
  const b = bem('SliderMenu');
  const push = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector(authSelector);
  const { manager, updateManagerDataLoading, user: userAccount } = useAppSelector(accountsSelector);
  const isFieldClimate = location.pathname.includes('/field-climate');

  useEffect(() => {
    if (user?.is_manager) {
      dispatch(fetchManager());
    } else {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  const menuItems: MenuItem[] = [
    getItem(
      <div className='menuItem'>
        {user?.is_manager ? (
          updateManagerDataLoading ? (
            <Skeleton />
          ) : (
            <>
              {manager?.last_name} {manager?.first_name?.charAt(0)}.{' '}
              {manager?.middle_name?.charAt(0)}.
            </>
          )
        ) : (
          <>
            {userAccount?.user?.last_name} {userAccount?.user?.first_name?.charAt(0)}.{' '}
            {userAccount?.user?.middle_name?.charAt(0)}.
          </>
        )}
        <span>{user?.is_manager ? 'Менеджер' : 'Пользователь'}</span>
      </div>,
      'sub1',
      <Avatar
        className='avatar-profile'
        size='large'
        src={
          manager?.image || userAccount?.user?.image
            ? `${apiUrlCrop}${user?.is_manager ? manager?.image : userAccount?.user?.image}`
            : null
        }
        icon={<UserOutlined />}
      />,
      [
        getItem(
          'Профиль',
          user?.is_manager ? '/manager-profile' : '/user-profile-view',
          <HomeOutlined />,
        ),
        getItem('Выход', '/sign-out', <ImportOutlined />),
      ],
    ),
    { type: 'divider' },
    user?.is_manager
      ? getItem(
          '',
          'grp',
          null,
          [
            getItem('Пользователи', '/', <div className='icon-styles users-icon' />),
            getItem(
              'Добавить нового пользователя',
              '/add-new-user',
              <div className='icon-styles add-icon' />,
            ),
            getItem('Запросы', '/user-requests', <div className='icon-styles request-icon' />),
          ],
          'group',
        )
      : getItem(
          '',
          'grp',
          null,
          [
            getItem('Техника', '/', <div className='icon-styles technics-icon' />),
            getItem('FieldClimate', '/field-climate', <CloudOutlined style={{ fontSize: 23 }} />),
          ],
          'group',
        ),
  ];

  const pushLinks: MenuProps['onClick'] = (e) => {
    if (e.key === '/sign-out') {
      push('/');
      logoutLocalStorage();
      dispatch(logoutUser());
      window.location.reload();
    } else {
      push(e.key);
      dispatch(clearCompaniesPagination());
      dispatch(clearRequestsPagination());
    }
  };

  return (
    <Sider width={250} trigger={null} collapsible collapsed={collapsed} className={b()}>
      <div className={b('logo')}>
        <img src={logo} alt='logo' />
      </div>
      <Menu
        className='menu-items'
        mode='inline'
        defaultSelectedKeys={['/']}
        defaultOpenKeys={['/']}
        selectedKeys={isFieldClimate ? ['/field-climate'] : [window.location.pathname]}
        theme='light'
        items={menuItems}
        onClick={pushLinks}
      />
    </Sider>
  );
};

export default SliderMenu;
