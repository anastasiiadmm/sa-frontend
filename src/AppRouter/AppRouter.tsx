import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, theme } from 'antd';
import React, { useState } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router-dom';

import SliderMenu from 'components/SliderMenu/SliderMenu';
import Profile from 'containers/Manager/Profile/Profile';
import NewUser from 'containers/Manager/Users/NewUser/NewUser';
import UserProfile from 'containers/Manager/Users/UserProfile/UserProfile';
import Users from 'containers/Manager/Users/Users';
import ProfileTechnique from 'containers/Manager/Users/UserTechnique/ProfileTechnique/ProfileTechnique';
import UserTechnique from 'containers/Manager/Users/UserTechnique/UserTechnique';
/* import Profile from 'containers/User/Profile/Profile';
import Technique from 'containers/User/Technique/Technique'; */

const { Header, Content } = Layout;

const AppRouter: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh' }}>
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
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'none',
          }}
        >
          <Routes>
            <Route path='/' element={<Users />} />
            <Route path='/add-new-user' element={<NewUser />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/user-profile' element={<UserProfile />} />
            <Route path='/user-technique' element={<UserTechnique />} />
            <Route path='/profile-technique' element={<ProfileTechnique />} />

            {/* <Route path='/' element={<Technique />} />
            <Route path='/user-profile' element={<Profile />} />  */}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppRouter;
