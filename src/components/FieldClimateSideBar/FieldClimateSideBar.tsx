import { HomeOutlined, SettingOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import React from 'react';
import { useMatch, useNavigate } from 'react-router';

const menuItems = [
  {
    label: 'Панель инструментов',
    icon: <HomeOutlined />,
    path: '/field-climate',
  },
  {
    label: 'Данные станции',
    icon: <SnippetsOutlined />,
    path: '/field-climate/station',
  },
  {
    label: 'Настройки устройства',
    icon: <SettingOutlined />,
    path: '/field-climate/config',
  },
];

const FieldClimateSideBar = () => {
  const push = useNavigate();

  const pushLinks: MenuProps['onClick'] = (e) => {
    push(e.key);
  };

  const GetItem = (label: string, path: string, icon: React.ReactNode) => {
    const match = useMatch(path);
    return {
      key: path,
      label,
      icon,
      path,
      className: match ? 'ant-menu-item-selected' : '',
    };
  };

  return (
    <Menu
      theme='light'
      mode='horizontal'
      defaultSelectedKeys={['/field-climate']}
      defaultOpenKeys={['/field-climate']}
      selectedKeys={[window.location.pathname]}
      items={menuItems.map((item) => GetItem(item.label, item.path, item.icon))}
      onClick={pushLinks}
    />
  );
};

export default FieldClimateSideBar;
