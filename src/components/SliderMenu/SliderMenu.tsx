import { HomeOutlined, ImportOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Layout, Menu } from 'antd';
import bem from 'easy-bem';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import logo from 'assets/images/logo.png';
import { authSelector, logoutUser } from 'redux/auth/authSlice';
import { useAppSelector } from 'redux/hooks';
import 'components/SliderMenu/_sliderMenu.scss';
import { logoutLocalStorage } from 'utils/token';

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
  const { user } = useAppSelector(authSelector);
  const dispatch = useDispatch();

  const menuItems: MenuItem[] = [
    getItem(
      <p className='menuItem'>
        {`${user?.last_name} ${user?.first_name.charAt(0)}. ${user?.middle_name.charAt(0)}.`}
        <span>{user?.is_manager ? 'Менеджер' : 'Пользователь'}</span>
      </p>,
      'sub1',
      <Avatar className='avatar-profile' size='large' icon={<UserOutlined />} />,
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
          ],
          'group',
        )
      : getItem(
          '',
          'grp',
          null,
          [getItem('Техника', '/', <div className='icon-styles technics-icon' />)],
          'group',
        ),
  ];

  const pushLinks: MenuProps['onClick'] = (e) => {
    if (e.key === '/sign-out') {
      logoutLocalStorage();
      dispatch(logoutUser());
      window.location.reload();
    } else {
      push(e.key);
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
        theme='light'
        items={menuItems}
        onClick={pushLinks}
      />
    </Sider>
  );
};

export default SliderMenu;
