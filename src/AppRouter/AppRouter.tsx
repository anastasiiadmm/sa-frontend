import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Skeleton, theme, Typography } from 'antd';
import bem from 'easy-bem';
import React, { lazy, PropsWithChildren, Suspense, useState } from 'react';
import { Route, useLocation, useNavigate } from 'react-router';
import { Routes } from 'react-router-dom';

import arrowLeft from 'assets/images/icons/arrow_left.svg';
import FieldClimateSideBar from 'components/FieldClimateSideBar/FieldClimateSideBar';
import MenuMobileComponent from 'components/MenuMobileComponent/MenuMobileComponent';
import OpenMapComponent from 'components/OpenMapComponent/OpenMapComponent';
import Spinner from 'components/Spinner/Spinner';
import Converter from 'containers/Converter/Converter';
import ConverterList from 'containers/Converter/ConverterList/ConverterList';
import Files from 'containers/Converter/Files/Files';
import FieldClimateConfigurations from 'containers/FieldClimate/FieldClimateConfigurations/FieldClimateConfigurations';
import FieldClimateDashboard from 'containers/FieldClimate/FieldClimateDashboard';
import FieldClimateStation from 'containers/FieldClimate/FieldClimateStation/FieldClimateStation';
import SensorsAndNodes from 'containers/FieldClimate/SensorsAndNodes/SensorsAndNodes';
import ApksList from 'containers/Manager/ApksList/ApksList';
import UserRequests from 'containers/Manager/UserRequests/UserRequests';
import UserProfileTablet from 'containers/Manager/Users/UserProfile/UserProfileTablet/UserProfileTablet';
import Users from 'containers/Manager/Users/Users';
import UserTechnique from 'containers/Manager/Users/UserTechnique/UserTechnique';
import ProfileTechnique from 'containers/Technique/ProfileTechnique/ProfileTechnique';
import TechniqueMap from 'containers/TechniqueMap/TechniqueMap';
import Profile from 'containers/User/Profile/Profile';
import Technique from 'containers/User/Technique/Technique';
import useWindowWidth from 'hooks/useWindowWidth';
import { accountsSelector } from 'redux/accounts/accountsSlice';
import { authSelector } from 'redux/auth/authSlice';
import { useAppSelector } from 'redux/hooks';
import { buttonsDataManager, buttonsDataUser, routesTitles } from 'utils/constants';

import 'AppRouter/appRouter.scss';

const NewUser = lazy(() => import('containers/Manager/Users/NewUser/NewUser'));
const ManagerProfile = lazy(() => import('containers/Manager/Profile/Profile'));
const SliderMenu = lazy(() => import('components/SliderMenu/SliderMenu'));
const NotFound = lazy(() => import('components/Errors/NotFound/NotFound'));
const UserProfile = lazy(() => import('containers/Manager/Users/UserProfile/UserProfile'));
const { Header, Content } = Layout;
const { Title } = Typography;

interface AppRouterWrapperProps extends PropsWithChildren<{}> {}

const AppRouterWrapper: React.FC<AppRouterWrapperProps> = ({ children }) => {
  const { pathname } = useLocation();

  const shouldRenderSidebar = pathname.includes('/field-climate');

  return (
    <>
      {shouldRenderSidebar && <FieldClimateSideBar />}
      {children}
    </>
  );
};

const AppRouter: React.FC = () => {
  const b = bem('AppRouter');
  const history = useNavigate();
  const { tokens } = useAppSelector(authSelector);
  const { account } = useAppSelector(accountsSelector);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { pathname } = useLocation();
  const windowWidth = useWindowWidth();

  const backHandler = () => {
    history(-1);
  };

  let title = Object.keys(routesTitles).find((route) => pathname.includes(route));
  title = title ? routesTitles[title] : '';

  const renderSlider =
    windowWidth <= 990 ? (
      title ? (
        <div className={b('top-sidebar')}>
          <Button
            icon={<img src={arrowLeft} alt='arrowLeft' className={b('sidebar-arrow')} />}
            className={b('sidebar-button')}
            role='button'
            onClick={backHandler}
          />

          <div className={b('sidebar-info')}>
            <Title level={4} className={b('sidebar-title')}>
              {title}
            </Title>
          </div>
        </div>
      ) : (
        <>
          {pathname === '/menu-mobile' && (
            <Title level={4} className={b('title-mobile')}>
              Меню
            </Title>
          )}
          {tokens?.is_manager
            ? buttonsDataManager.map((button) =>
                pathname === button?.key ? (
                  <Title level={4} key={button.key} className={b('title-mobile')}>
                    {pathname.includes('/user-requests') ? (
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 500,
                          color: '#1D2024',
                        }}
                      >
                        {button.text}
                      </span>
                    ) : (
                      button.text
                    )}
                  </Title>
                ) : null,
              )
            : buttonsDataUser.map((button) =>
                pathname === button?.key ? (
                  <Title level={4} key={button.key} className={b('title-mobile')}>
                    {button.text}
                  </Title>
                ) : null,
              )}
        </>
      )
    ) : (
      <>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(!collapsed),
        })}
      </>
    );

  return (
    <Layout style={{ height: '100vh' }} className={b('')} data-testid='app-router'>
      <Suspense fallback={<Skeleton />}>
        <SliderMenu collapsed={collapsed} />
      </Suspense>
      <Layout className='site-layout'>
        <Header
          style={{
            padding: 0,
            background: pathname.includes('user-requests') ? '#f5f5f5' : colorBgContainer,
          }}
          className={
            pathname.includes('user-technique') ||
            pathname.includes('user-profile-view') ||
            (!account?.is_manager && !pathname.split('/')[1] && windowWidth < 540)
              ? 'header_none'
              : ''
          }
        >
          {renderSlider}
        </Header>
        <Content
          style={{
            margin:
              pathname.includes('/field-climate') ||
              pathname.includes('/open-map') ||
              pathname.includes('/technique-map')
                ? 0
                : windowWidth <= 990
                ? '0 0 5px 0'
                : '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'none',
          }}
        >
          <AppRouterWrapper>
            <Routes>
              {tokens?.is_manager ? (
                <>
                  <Route path='/' index element={<Users />} />
                  <Route
                    path='/add-new-user'
                    element={
                      <Suspense fallback={<Spinner />}>
                        <NewUser />
                      </Suspense>
                    }
                  />
                  <Route
                    path='/manager-profile'
                    element={
                      <Suspense fallback={<Spinner />}>
                        <ManagerProfile />
                      </Suspense>
                    }
                  />
                  <Route
                    path='/user-profile/:id'
                    element={
                      <Suspense fallback={<Spinner />}>
                        <UserProfile />{' '}
                      </Suspense>
                    }
                  />
                  <Route path='/edit-user/:id' element={<UserProfileTablet />} />
                  <Route path='/user-technique/:id/:idVehicle' element={<UserTechnique />} />
                  <Route path='/user-requests' element={<UserRequests />} />
                  <Route path='/apks' element={<ApksList />} />
                </>
              ) : (
                <>
                  <Route path='/' index element={<Technique />} />
                  <Route path='/user-profile-view' element={<Profile />} />
                  {account?.company?.weather_service ? (
                    <>
                      <Route path='/field-climate' element={<FieldClimateDashboard />} />
                      <Route path='/field-climate/station/:id' element={<FieldClimateStation />} />
                      <Route
                        path='/field-climate/config/:id'
                        element={<FieldClimateConfigurations />}
                      />
                      <Route path='/field-climate/sensor-names/:id' element={<SensorsAndNodes />} />
                    </>
                  ) : null}
                </>
              )}
              <Route path='/menu-mobile' element={<MenuMobileComponent />} />
              <Route path='/open-map/:id/:field_name/:code?' element={<OpenMapComponent />} />
              <Route path='/technique-map/:techniqueId' element={<TechniqueMap />} />
              <Route path='/profile-technique/:vehicleId' element={<ProfileTechnique />} />
              <Route path='/converter' element={<Converter />} />
              <Route path='/files' element={<Files />} />
              <Route path='/converter-list' element={<ConverterList />} />
              <Route
                path='*'
                element={
                  <Suspense fallback={<Spinner />}>
                    <NotFound
                      showButton
                      title='Страница не найдена'
                      text='Попробуйте перейти на главную страницу или любую интересующую вас'
                    />
                  </Suspense>
                }
              />
            </Routes>
          </AppRouterWrapper>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppRouter;
