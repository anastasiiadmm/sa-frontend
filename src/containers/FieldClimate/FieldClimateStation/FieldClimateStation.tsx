import { MenuFoldOutlined, MenuUnfoldOutlined, ProfileOutlined } from '@ant-design/icons';
import { Card, Layout, Menu, MenuProps, Table, theme, Typography } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { ColumnsType } from 'antd/lib/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ChartComponent from 'components/ChartComponent/ChartComponent';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  fetchStationInfo,
  fetchStationSensors,
  stationsSelector,
} from 'redux/stations/stationsSlice';
import 'containers/FieldClimate/FieldClimateStation/_fieldClimateStation.scss';

const { Text, Title } = Typography;
const { Sider } = Layout;

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

interface DataType {
  key: React.Key;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const FieldClimateStation = () => {
  const b = bem('FieldClimateStation');
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { stationInfo } = useAppSelector(stationsSelector);
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    dispatch(fetchStationInfo({ id }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStationSensors({ id }));
  }, [dispatch]);

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
            Тип устройства: iMetos 3.3 Прошивка: 08.605.20230113 Смещение часового пояса: 60
            Последнее соединение: 2023-01-18 12:06:57
          </p>,
          '3',
        ),
      ],
    ),
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Chinese Score',
      dataIndex: 'chinese',
      sorter: {
        compare: (a: any, b: any) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Math Score',
      dataIndex: 'math',
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: 'English Score',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      key: '2',
      name: 'Jim Green',
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      key: '3',
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      key: '4',
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
  ];

  return (
    <Layout data-testid='station-id' style={{ height: '85vh', marginTop: 47 }} className={b('')}>
      <Sider width={250} trigger={null} collapsible collapsed={collapsed} className={b()}>
        <Menu mode='inline' theme='light' items={items} triggerSubMenuAction='click' />
      </Sider>
      <Layout className='site-layout'>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content className={b('content')}>
          <div>
            <Title level={3} style={{ margin: 0, textTransform: 'uppercase', color: '#777' }}>
              Данные станции
            </Title>
            <Text>
              {stationInfo?.name?.original} • {stationInfo?.name?.custom} •{' '}
              {stationInfo?.info?.device_name} • Последние данные:{' '}
              {stationInfo?.dates?.last_communication}{' '}
            </Text>
          </div>
          <div>
            <Card className={b('card-style')} bordered={false}>
              <div className={b('card-style-items')}>
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    Все датчики
                  </Title>
                  <Text>2 дня / ежечасно</Text>
                </div>
                <div>
                  Данные станции от <b>{stationInfo?.dates?.last_communication}</b> до{' '}
                  <b>{stationInfo?.dates?.last_communication}</b>
                </div>
              </div>
            </Card>
          </div>
          <div style={{ marginTop: 60 }}>
            <ChartComponent />
          </div>
          <div>
            <Table columns={columns} dataSource={data} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FieldClimateStation;
