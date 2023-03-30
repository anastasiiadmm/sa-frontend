import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, theme } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { Route, useLocation } from 'react-router';
import { Routes } from 'react-router-dom';

import OpenMapComponent from 'components/OpenMapComponent/OpenMapComponent';
import SliderMenu from 'components/SliderMenu/SliderMenu';
import Stations from 'components/stations/Stations';
import ManagerProfile from 'containers/Manager/Profile/Profile';
import UserRequests from 'containers/Manager/UserRequests/UserRequests';
import NewUser from 'containers/Manager/Users/NewUser/NewUser';
import UserProfile from 'containers/Manager/Users/UserProfile/UserProfile';
import Users from 'containers/Manager/Users/Users';
import UserTechnique from 'containers/Manager/Users/UserTechnique/UserTechnique';
import ProfileTechnique from 'containers/Technique/ProfileTechnique/ProfileTechnique';
import Profile from 'containers/User/Profile/Profile';
import Technique from 'containers/User/Technique/Technique';
import { authSelector } from 'redux/auth/authSlice';
import { useAppSelector } from 'redux/hooks';
import 'AppRouter/appRouter.scss';
import FieldClimateSideBar from 'components/FieldClimateSideBar/FieldClimateSideBar';
import FieldClimateComponent from '../containers/FieldClimateComponent/FieldClimateComponent';

const { Header, Content } = Layout;

const AppRouter: React.FC = () => {
  const b = bem('AppRouter');
  const { user } = useAppSelector(authSelector);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { pathname } = useLocation();

  return (
    <Layout style={{ height: '100vh' }} className={b('')}>
      <SliderMenu collapsed={collapsed} />
      <Layout className='site-layout'>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          style={{
            margin: pathname === '/open-map' ? 0 : '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'none',
          }}
        >
          <Routes>
            {user?.is_manager ? (
              <>
                <Route path='/' index element={<Users />} />
                <Route path='/add-new-user' element={<NewUser />} />
                <Route path='/manager-profile' element={<ManagerProfile />} />
                <Route path='/user-profile/:id' element={<UserProfile />} />
                <Route path='/user-technique/:id' element={<UserTechnique />} />
                <Route path='/user-requests' element={<UserRequests />} />
              </>
            ) : (
              <>
                <Route path='/' index element={<Technique />} />
                <Route path='/user-profile-view' element={<Profile />} />
                <Route path='/open-map' element={<OpenMapComponent />} />
                <Route
                  path='/field-climate'
                  element={
                    <FieldClimateSideBar>
                      <Routes>
                        <Route path='/main' element={<FieldClimateComponent />} />
                      </Routes>
                    </FieldClimateSideBar>
                  }
                />
              </>
            )}
            <Route path='/profile-technique/:userId/:vehicleId' element={<ProfileTechnique />} />
            <Route path='/stations' element={<Stations />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppRouter;
