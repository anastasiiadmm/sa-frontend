import {
  BackwardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Button, Card, Layout, Menu, MenuProps, Table, theme, Tooltip, Typography } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { ColumnsType } from 'antd/lib/table';
import bem from 'easy-bem';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ChartComponent from 'components/ChartComponent/ChartComponent';
import NotFound from 'components/Errors/NotFound/NotFound';
import CustomDropdown from 'components/Fields/CustomDropdown/CustomDropdown';
import FormField from 'components/FormField/FormField';
import Spinner from 'components/Spinner/Spinner';
import { calculateDateRange } from 'helper';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  fetchStationInfo,
  fetchStations,
  postStationSensors,
  stationsSelector,
} from 'redux/stations/stationsSlice';
import { dateMomentTypeString, rangeDataDaysSensors, rangeDataHoursSensors } from 'utils/constants';
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { stationInfo, sensorData, sensorDataLoading } = useAppSelector(stationsSelector);
  const maxDate = moment(stationInfo?.dates?.max_date);
  const twoDaysAgo = maxDate.clone().subtract(2, 'days').unix().toString();
  const dayString = moment(stationInfo?.dates?.max_date)
    .subtract(2, 'days')
    .format(dateMomentTypeString);
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    name: 'All sensors',
    day_type: 'hourly',
    date_type: '2_days',
    date_string: dayString,
    date_from: twoDaysAgo,
    date_to: maxDate.unix().toString(),
  });

  useEffect(() => {
    dispatch(fetchStationInfo({ id }));
  }, [dispatch]);

  useEffect(() => {
    const data = {
      id,
      name: { name: filters?.name },
      day_type: filters?.day_type,
      date_from: filters?.date_from,
      date_to: filters?.date_to,
    };
    dispatch(postStationSensors({ data }));
  }, [dispatch, filters, id]);

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
        compare: (a, b) => a.chinese - b.chinese,
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

  const handleChangeDaysTypeHandler = (value: string) => {
    setFilters({
      ...filters,
      day_type: value,
    });
  };

  const handleChangeHoursTypeHandler = (value: string) => {
    const { fromDate, toDate } = calculateDateRange(value, stationInfo);
    const fromTimestamp = moment(fromDate).unix();
    const toTimestamp = moment(toDate).unix();

    setFilters({
      ...filters,
      date_type: value,
      date_string: moment(fromDate).format(dateMomentTypeString),
      date_from: fromTimestamp.toString(),
      date_to: toTimestamp.toString(),
    });
  };

  const setLastDataHandler = () => {
    setFilters({
      ...filters,
      date_from: twoDaysAgo,
      date_to: maxDate.unix().toString(),
    });
  };

  return (
    <Layout data-testid='station-id' style={{ height: '85vh', marginTop: 47 }} className={b('')}>
      <Sider collapsedWidth={0} width={250} trigger={null} collapsible collapsed={collapsed}>
        <div className={b('sider-block')}>
          <Menu mode='inline' theme='light' items={items} triggerSubMenuAction='click' />
          {sensorData?.topology?.[0]?.sensors?.length ? (
            <CustomDropdown id={id} dropdownOptions={sensorData?.topology?.[0]?.sensors} />
          ) : null}
        </div>
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
                  <Text>
                    {rangeDataHoursSensors.find((item) => item.value === filters?.date_type)?.label}{' '}
                    / {rangeDataDaysSensors.find((item) => item.value === filters?.day_type)?.label}
                  </Text>
                </div>
                <div>
                  Данные станции от <b>{filters?.date_string}</b> до{' '}
                  <b>{stationInfo?.dates?.last_communication}</b>
                </div>
              </div>
              <div className={b('card-style-items-sensors')}>
                <Tooltip placement='top' title='Последние данные'>
                  <Button type='primary' icon={<BackwardOutlined />} onClick={setLastDataHandler} />
                </Tooltip>
                <FormField
                  type='select'
                  customStyle='160px'
                  handleChange={handleChangeDaysTypeHandler}
                  options={rangeDataDaysSensors}
                  defaultValue={rangeDataDaysSensors[1]}
                />
                <FormField
                  type='select'
                  customStyle='120px'
                  handleChange={handleChangeHoursTypeHandler}
                  options={rangeDataHoursSensors}
                  defaultValue={rangeDataHoursSensors[1]}
                />
              </div>
            </Card>
          </div>

          {sensorData?.chartsOptions?.length ? (
            <div className={b('station-block')}>
              {sensorDataLoading ? (
                <Spinner />
              ) : (
                <>
                  <div style={{ marginTop: 60, marginBottom: 60 }}>
                    <ChartComponent data={sensorData && sensorData?.chartsOptions} />
                  </div>
                  <div>
                    <Table columns={columns} dataSource={data} />
                  </div>
                </>
              )}
            </div>
          ) : (
            <NotFound title='Нет данных для выбранной станции' />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default FieldClimateStation;
