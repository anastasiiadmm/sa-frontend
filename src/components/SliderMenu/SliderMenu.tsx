import { CloudOutlined, HomeOutlined, ImportOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';

import activeNotification from 'assets/images/icons/active-notification.svg';
import activePhone from 'assets/images/icons/active-phone.svg';
import activeUsers from 'assets/images/icons/active-users.svg';
import add from 'assets/images/icons/add_icon.svg';
import cancel from 'assets/images/icons/cancel.svg';
import phone from 'assets/images/icons/mobile-phone.svg';
import more from 'assets/images/icons/more.svg';
import notification from 'assets/images/icons/notification.svg';
import star from 'assets/images/icons/star.svg';
import users from 'assets/images/icons/users.svg';
import logo from 'assets/images/logo.png';
import Spinner from 'components/Spinner/Spinner';
import useWindowWidth from 'hooks/useWindowWidth';
import {
  accountsSelector,
  clearRequestsPagination,
  fetchAccount,
  fetchApks,
} from 'redux/accounts/accountsSlice';
import { logoutUser } from 'redux/auth/authSlice';
import { clearCompaniesPagination } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { urlFormat } from 'utils/files/files';
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

const buttonsData = [
  {
    key: '/',
    text: 'Клиенты',
    icon: <img src={users} alt='users' />,
    activeIcon: <img src={activeUsers} alt='users' />,
  },
  {
    key: '/user-requests',
    text: 'Запросы',
    icon: <img src={notification} alt='notification' />,
    activeIcon: <img src={activeNotification} alt='notification' />,
  },
  {
    key: '/add-new-user',
    text: 'Добавить клиента',
    icon: <img src={add} alt='add' />,
    activeIcon: <img src={add} alt='add' />,
  },
  {
    key: '/apks',
    text: 'Приложение',
    icon: <img src={phone} alt='phone' />,
    activeIcon: <img src={activePhone} alt='activePhone' />,
  },
  {
    key: '/test',
    text: 'Еще',
    icon: <img src={more} alt='more' />,
    activeIcon: <img src={more} alt='more' />,
  },
];

const SliderMenu: React.FC<Props> = ({ collapsed }) => {
  const b = bem('SliderMenu');
  const push = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { account, apk, apkLoading, fetchLoadingAccount } = useAppSelector(accountsSelector);
  const windowWidth = useWindowWidth();
  const [isCancelled, setIsCancelled] = useState(false);
  const cancelIconClassName =
    isCancelled || collapsed ? b('apk-block', { 'cancel-icon-active': true }) : b('apk-block');
  const isFieldClimate = location.pathname.includes('/field-climate');

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchApks({}));
  }, [dispatch]);

  const menuItems: MenuItem[] = [
    getItem(
      <div className='menuItem'>
        {fetchLoadingAccount ? (
          <Skeleton />
        ) : (
          <>
            {account?.last_name} {account?.first_name?.charAt(0)}.{' '}
            {account?.middle_name === '' ? null : `${account?.middle_name.charAt(0)}.`}
          </>
        )}
        <span>{account?.is_manager ? 'Менеджер' : 'Пользователь'}</span>
      </div>,
      'sub1',
      <Avatar
        className='avatar-profile'
        size='large'
        src={urlFormat(account?.image)}
        icon={<UserOutlined />}
      />,
      [
        getItem(
          'Профиль',
          account?.is_manager ? '/manager-profile' : '/user-profile-view',
          <HomeOutlined />,
        ),
        getItem('Выход', '/sign-out', <ImportOutlined />),
      ],
    ),
    { type: 'divider' },
    account?.is_manager
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
            getItem(
              <p>
                Список версий <b>apk</b>
              </p>,
              '/apks',
              <div className='icon-styles phone-icon' />,
            ),
          ],
          'group',
        )
      : getItem(
          '',
          'grp',
          null,
          [
            getItem('Техника', '/', <div className='icon-styles technics-icon' />),
            account?.company?.weather_service
              ? getItem(
                  'FieldClimate',
                  '/field-climate',
                  <CloudOutlined style={{ fontSize: 23 }} />,
                )
              : null,
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

  return windowWidth <= 600 ? (
    <div className={b('mobile-menu')}>
      <div className={b('mobile-block')}>
        {buttonsData.map((button) => (
          <NavLink key={button.key} to={button.key}>
            <Button
              type='link'
              icon={location.pathname === button.key ? button?.activeIcon : button.icon}
              className={b('link-button margin-top')}
              size='small'
            >
              {button?.text}
            </Button>
          </NavLink>
        ))}
      </div>
    </div>
  ) : (
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
      {account?.is_manager && apk?.length ? (
        apkLoading ? (
          <Spinner />
        ) : (
          <div className={cancelIconClassName}>
            <button type='button' className={b('cancel-icon')} onClick={() => setIsCancelled(true)}>
              <img src={cancel} alt='cancel' />
            </button>
            <div>
              <img src={star} alt='star' />
            </div>
            <div className={b('apk-info')}>
              <p>Вышла новая версия приложения</p>
              <Button type='default'>Скачать APK</Button>
            </div>
          </div>
        )
      ) : null}
    </Sider>
  );
};

export default SliderMenu;
