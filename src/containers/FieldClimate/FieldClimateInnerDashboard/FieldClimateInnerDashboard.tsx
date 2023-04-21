import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import bem from 'easy-bem';

const { Sider } = Layout;

import 'containers/FieldClimate/FieldClimateInnerDashboard/_fieldClimateInnerDashboard.scss';

interface Props {
  childrenSider: string | JSX.Element | JSX.Element[];
  children: string | JSX.Element | JSX.Element[];
}

const FieldClimateInnerDashboard: React.FC<Props> = ({ children, childrenSider }) => {
  const b = bem('FieldClimateInnerDashboard');
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '85vh', marginTop: 47 }} className={b('')}>
      <Sider collapsedWidth={0} width={260} trigger={null} collapsible collapsed={collapsed}>
        {childrenSider}
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content className={b('content')}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default FieldClimateInnerDashboard;
