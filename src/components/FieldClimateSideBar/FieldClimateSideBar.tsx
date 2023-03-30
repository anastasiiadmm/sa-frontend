import { Layout, Menu, MenuProps, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const FieldClimateSideBar: React.FC<Props> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Header className='header' style={{ padding: 0, background: colorBgContainer }}>
        <Menu theme='light' mode='horizontal' defaultSelectedKeys={['2']} items={items1} />
      </Header>
      <Layout>{children}</Layout>
    </Layout>
  );
};

export default FieldClimateSideBar;
