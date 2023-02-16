import { HomeOutlined, ImportOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Layout, Menu } from 'antd';
import bem from 'easy-bem';
import React from 'react';
import { useNavigate } from 'react-router';

import logo from 'assets/images/logo.png';
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

/* const ManagerItems: MenuItem[] = [
  getItem(
    <p className='menuItem'>
      Петр В.И.<span>Менеджер</span>
    </p>,
    'sub1',
    <Avatar className='avatar-profile' size='large' icon={<UserOutlined />} />,
    [
      getItem('Профиль', '/manager-profile', <HomeOutlined />),
      getItem('Выход', '/', <ImportOutlined />),
    ],
  ),
  { type: 'divider' },
  getItem(
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
  ),
]; */

const UserItems: MenuItem[] = [
  getItem(
    <p className='menuItem'>
      Иванов И.И<span>Пользователь</span>
    </p>,
    'sub1',
    <Avatar className='avatar-profile' size='large' icon={<UserOutlined />} />,
    [
      getItem('Профиль', '/user-profile-view', <HomeOutlined />),
      getItem('Выход', '/sign-out', <ImportOutlined />),
    ],
  ),
  { type: 'divider' },
  getItem(
    '',
    'grp',
    null,
    [getItem('Техника', '/', <div className='icon-styles technics-icon' />)],
    'group',
  ),
];

const SliderMenu: React.FC<Props> = ({ collapsed }) => {
  const b = bem('SliderMenu');
  const push = useNavigate();

  const pushLinks: MenuProps['onClick'] = (e) => {
    push(e.key);
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
        items={UserItems}
        onClick={pushLinks}
      />
    </Sider>
  );
};

export default SliderMenu;
