import { ProfileOutlined, SettingOutlined, TagOutlined } from '@ant-design/icons';
import { Menu, MenuProps, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';
import { useMatch, useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import Spinner from 'components/Spinner/Spinner';
import FieldClimateInnerDashboard from 'containers/FieldClimate/FieldClimateInnerDashboard/FieldClimateInnerDashboard';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchStationInfo, stationsSelector } from 'redux/stations/stationsSlice';
import 'containers/FieldClimate/FieldClimateSettingsDashboard/_fieldClimateSettingsDashboard.scss';

const { Text, Title } = Typography;

interface Props {
  children?: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const FieldClimateSettingsDashboard: React.FC<Props> = ({ children }) => {
  const b = bem('FieldClimateSettingsDashboard');
  const { id } = useParams<{ id: string }>();
  const push = useNavigate();
  const dispatch = useAppDispatch();
  const { stationInfo, stationInfoLoading } = useAppSelector(stationsSelector);

  useEffect(() => {
    dispatch(fetchStationInfo({ id }));
  }, [dispatch]);

  const menuItems = [
    {
      label: 'Конфигурация',
      icon: <SettingOutlined />,
      path: `/field-climate/config/${id}`,
    },
    {
      label: 'Датчики и узлы',
      icon: <TagOutlined />,
      path: `/field-climate/sensor-names/${id}`,
    },
  ];

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

  const items: MenuItem[] = [
    getItem(
      `${stationInfo?.name?.custom} / ${stationInfo?.name?.original}`,
      'sub1',
      <ProfileOutlined />,
      [
        getItem(
          <p className='menu-info'>
            <span>
              Тип устройства: <b>{stationInfo?.info?.device_name}</b>
            </span>
            <span>
              Прошивка: <b>{stationInfo?.info?.firmware}</b>
            </span>
            <span>
              Смещение часового пояса: <b>{stationInfo?.config?.timezone_offset}</b>
            </span>
            <span>
              Последнее соединение: <b>{stationInfo?.dates?.last_communication}</b>
            </span>
          </p>,
          '3',
        ),
      ],
    ),
  ];

  const childrenSider = (
    <div className={b('sider-block')}>
      {stationInfoLoading ? (
        <Spinner />
      ) : (
        <Menu mode='inline' theme='light' items={items} triggerSubMenuAction='click' />
      )}
      <Title
        level={5}
        style={{ textAlign: 'center', margin: 0, textTransform: 'uppercase', color: '#777' }}
      >
        Настройки устройства
      </Title>
      <Menu
        className={b('')}
        theme='light'
        mode='inline'
        defaultSelectedKeys={[`/field-climate/sensor-names/${id}`]}
        defaultOpenKeys={[`/field-climate/sensor-names/${id}`]}
        selectedKeys={[window.location.pathname]}
        items={menuItems.map((item) => GetItem(item.label, item.path, item.icon))}
        onClick={pushLinks}
      />
    </div>
  );

  return (
    <div className={b('')}>
      <FieldClimateInnerDashboard childrenSider={childrenSider}>
        <div data-testid='station-id'>
          <Title level={3} style={{ margin: 0, textTransform: 'uppercase', color: '#777' }}>
            Конфигурация устройства
          </Title>
          <Text>
            {stationInfo?.name?.original} • {stationInfo?.name?.custom} •{' '}
            {stationInfo?.info?.device_name} • Последние данные:{' '}
            {stationInfo?.dates?.last_communication}{' '}
          </Text>
        </div>
        {children}
      </FieldClimateInnerDashboard>
    </div>
  );
};

export default FieldClimateSettingsDashboard;
