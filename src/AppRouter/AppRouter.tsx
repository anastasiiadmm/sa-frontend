import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, theme } from 'antd';
import React, { useState } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router-dom';

import SiderMenu from 'components/SiderMenu/SiderMenu';
import Profile from 'containers/Profile/Profile';
import NewUser from 'containers/Users/NewUser/NewUser';
import UserProfile from 'containers/Users/UserProfile/UserProfile';
import Users from 'containers/Users/Users';
import UserTechnique from 'containers/Users/UserTechnique/UserTechnique';

const { Header, Content } = Layout;

const AppRouter: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh' }}>
      <SiderMenu collapsed={collapsed} />
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
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppRouter;
