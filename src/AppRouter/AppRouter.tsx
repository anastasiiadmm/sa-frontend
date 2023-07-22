import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, theme, Typography } from 'antd';
import bem from 'easy-bem';
import React, { PropsWithChildren, useState } from 'react';
import { Route, useLocation } from 'react-router';
import { Routes } from 'react-router-dom';

import NotFound from 'components/Errors/NotFound/NotFound';
import FieldClimateSideBar from 'components/FieldClimateSideBar/FieldClimateSideBar';
import OpenMapComponent from 'components/OpenMapComponent/OpenMapComponent';
import SliderMenu from 'components/SliderMenu/SliderMenu';
import FieldClimateConfigurations from 'containers/FieldClimate/FieldClimateConfigurations/FieldClimateConfigurations';
import FieldClimateDashboard from 'containers/FieldClimate/FieldClimateDashboard';
import FieldClimateStation from 'containers/FieldClimate/FieldClimateStation/FieldClimateStation';
import SensorsAndNodes from 'containers/FieldClimate/SensorsAndNodes/SensorsAndNodes';
import ApksList from 'containers/Manager/ApksList/ApksList';
import ManagerProfile from 'containers/Manager/Profile/Profile';
import UserRequests from 'containers/Manager/UserRequests/UserRequests';
import NewUser from 'containers/Manager/Users/NewUser/NewUser';
import UserProfile from 'containers/Manager/Users/UserProfile/UserProfile';
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
import { buttonsDataManager, buttonsDataUser } from 'utils/helper';

import 'AppRouter/appRouter.scss';

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
  const { tokens } = useAppSelector(authSelector);
  const { account } = useAppSelector(accountsSelector);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { pathname } = useLocation();
  const windowWidth = useWindowWidth();
  const renderSlider = () => {
    if (windowWidth <= 990) {
      if (tokens?.is_manager) {
        return buttonsDataManager.map(
          (button) =>
            pathname === button.key && (
              <Title level={3} key={button?.key} className={b('title-mobile')}>
                {button?.text}
              </Title>
            ),
        );
      }
      return buttonsDataUser.map(
        (button) =>
          pathname === button.key && (
            <Title level={3} key={button?.key} className={b('title-mobile')}>
              {button?.text}
            </Title>
          ),
      );
    }

    return React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
      className: 'trigger',
      onClick: () => setCollapsed(!collapsed),
    });
  };

  return (
    <Layout style={{ height: '100vh' }} className={b('')} data-testid='app-router'>
      <SliderMenu collapsed={collapsed} />
      <Layout className='site-layout'>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className={pathname.includes('user-technique') ? 'header_none' : ''}
        >
          {renderSlider()}
        </Header>
        <Content
          style={{
            margin:
              pathname.includes('/field-climate') ||
              pathname.includes('/open-map') ||
              pathname.includes('/technique-map')
                ? 0
                : windowWidth <= 990
                ? '0 0 71px 0'
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
                  <Route path='/add-new-user' element={<NewUser />} />
                  <Route path='/manager-profile' element={<ManagerProfile />} />
                  <Route path='/user-profile/:id' element={<UserProfile />} />
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
              <Route path='/open-map/:id/:field_name/:code?' element={<OpenMapComponent />} />
              <Route path='/technique-map/:techniqueId' element={<TechniqueMap />} />
              <Route path='/profile-technique/:vehicleId' element={<ProfileTechnique />} />
              <Route
                path='*'
                element={
                  <NotFound
                    showButton
                    title='Страница не найдена'
                    text='Попробуйте перейти на главную страницу или любую интересующую вас'
                  />
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
