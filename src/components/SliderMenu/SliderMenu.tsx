import {
  CloudOutlined,
  HomeOutlined,
  ImportOutlined,
  RetweetOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Link, NavLink } from 'react-router-dom';

import cancel from 'assets/images/icons/cancel.svg';
import meteo from 'assets/images/icons/cloud-tablet.svg';
import menuActive from 'assets/images/icons/menu-button-active.svg';
import more from 'assets/images/icons/more.svg';
import star from 'assets/images/icons/star.svg';
import logo from 'assets/images/logo.png';
import DrawerComponent from 'components/DrawerComponent/DrawerComponent';
import Spinner from 'components/Spinner/Spinner';
import useWindowWidth from 'hooks/useWindowWidth';
import { IButtonsData } from 'interfaces';
import {
  accountsSelector,
  clearRequestsPagination,
  fetchAccount,
  fetchApks,
  postNotificationRequest,
} from 'redux/accounts/accountsSlice';
import { authSelector, logoutUser } from 'redux/auth/authSlice';
import { clearCompaniesPagination } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { deleteCookie, nameRefreshCookies } from 'utils/addCookies/addCookies';
import { logoutLocalStorage } from 'utils/addLocalStorage/addLocalStorage';
import { buttonsDataManager, buttonsDataUser } from 'utils/constants';
import { urlFormat } from 'utils/files/files';
import { downloadApkFileHandler, isPathInButtonsData } from 'utils/helper';

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
  const { tokens } = useAppSelector(authSelector);
  const { account, apk, apkLoading, fetchLoadingAccount } = useAppSelector(accountsSelector);
  const windowWidth = useWindowWidth();
  const [open, setOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState<{ [key: string]: boolean }>({});
  const cancelIconClassName =
    isCancelled || collapsed ? b('apk-block', { 'cancel-icon-active': true }) : b('apk-block');
  const isFieldClimate = location.pathname.includes('/field-climate');

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchApks({}));
  }, [dispatch]);

  const handleDownloadClick = async (file: string) => {
    setIsLoadingMap((prevIsLoadingMap) => ({ ...prevIsLoadingMap, [file]: true }));
    await downloadApkFileHandler(file, () =>
      setIsLoadingMap((prevIsLoadingMap) => ({ ...prevIsLoadingMap, [file]: false })),
    );
    await dispatch(postNotificationRequest());
    setIsCancelled(true);
  };

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
    getItem('Конвертер', '/converter', <div className='icon-styles converter-icon' />),
  ];

  const menuDropdown = [
    {
      key: tokens?.is_manager ? '/manager-profile' : '/user-profile-view',
      icon: <UserOutlined style={{ fontSize: 20 }} />,
      name: 'Профиль',
    },
    {
      key: '/converter',
      icon: <RetweetOutlined style={{ fontSize: 20 }} />,
      name: 'Конвертер',
    },
    {
      key: '/field-climate',
      icon: <img src={meteo} alt='meteo' style={{ fontSize: 20 }} />,
      name: 'Метеосервис',
    },
    {
      key: '/sign-out',
      icon: <ImportOutlined style={{ fontSize: 20 }} />,
      name: 'Выход',
    },
  ];

  const pushLinks: MenuProps['onClick'] = (e) => {
    handleMenuClick(e.key);
  };

  const pushLinksItem = (key: string) => {
    handleMenuClick(key);
  };

  const handleMenuClick = (key: string) => {
    if (key === '/sign-out') {
      push('/');
      logoutLocalStorage();
      deleteCookie(nameRefreshCookies);
      dispatch(logoutUser());
      window.location.reload();
    } else {
      push(key);
      dispatch(clearCompaniesPagination());
      dispatch(clearRequestsPagination());
    }
  };

  const renderButtons = (buttonsData: IButtonsData[]) => {
    return buttonsData.map((button) => (
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
    ));
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const shouldRenderMobile =
    isPathInButtonsData(location.pathname, buttonsDataManager) ||
    isPathInButtonsData(location.pathname, buttonsDataUser) ||
    location.pathname === '/menu-mobile';

  const handleButtonClick = () => {
    const componentPath = '/menu-mobile';

    if (windowWidth >= 601) {
      showDrawer();
    } else {
      push(componentPath);
    }
  };

  const renderMobile = shouldRenderMobile ? (
    <div className={b('mobile-menu')}>
      <div
        className={b('mobile-block')}
        style={{
          top: tokens?.is_manager ? '-29px' : '0',
          justifyContent: tokens?.is_manager ? 'justify-center' : 'space-around',
        }}
      >
        {tokens?.is_manager ? renderButtons(buttonsDataManager) : renderButtons(buttonsDataUser)}
        <Button
          style={{ marginTop: tokens?.is_manager ? 59 : 18 }}
          type='link'
          icon={
            location.pathname === '/menu-mobile' ? (
              <img src={menuActive} alt='menuActive' />
            ) : (
              <img src={more} alt='more' />
            )
          }
          className={b('link-button margin-top')}
          size='small'
          onClick={handleButtonClick}
        >
          Еще
        </Button>
      </div>

      <DrawerComponent open={open} onClose={onClose} placement='bottom' height={85}>
        <div className={b('drawer-block')}>
          {menuDropdown?.map((item) => (
            <React.Fragment key={item.key}>
              {item.key === '/sign-out' ? (
                <Button
                  type='link'
                  icon={item.icon}
                  className={b('link-button')}
                  size='small'
                  onClick={() => pushLinksItem(item.key)}
                >
                  {item.name}
                </Button>
              ) : (
                <Link to={item.key}>
                  <Button
                    onClick={onClose}
                    type='link'
                    icon={item.icon}
                    className={b('link-button')}
                    size='small'
                  >
                    {item.name}
                  </Button>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </DrawerComponent>
    </div>
  ) : null;

  if (windowWidth <= 990) {
    return renderMobile;
  }

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
      {account?.is_manager && apk?.length && !account?.user_latest_version ? (
        apkLoading ? (
          <Spinner />
        ) : (
          <div className={cancelIconClassName}>
            <button
              type='button'
              className={b('cancel-icon')}
              onClick={() => {
                dispatch(postNotificationRequest());
                setIsCancelled(true);
              }}
            >
              <img src={cancel} alt='cancel' />
            </button>
            <div>
              <img src={star} alt='star' />
            </div>
            <div className={b('apk-info')}>
              <p>Вышла новая версия приложения</p>
              <Button
                type='default'
                loading={isLoadingMap}
                onClick={() => handleDownloadClick(apk?.[0]?.file)}
              >
                Скачать APK
              </Button>
            </div>
          </div>
        )
      ) : null}
    </Sider>
  );
};

export default SliderMenu;
