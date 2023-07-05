import { Card, Spin, Typography } from 'antd';
import { AES, enc, mode } from 'crypto-js';
import bem from 'easy-bem';
import { DivIcon, Icon, IconOptions, LatLngExpression } from 'leaflet';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import active from 'assets/images/icons/active_tracktor.svg';
import arrowLeft from 'assets/images/icons/arrow-left.svg';
import inactive from 'assets/images/icons/inactive_tracktor.svg';
import DrawerComponent from 'components/DrawerComponent/DrawerComponent';
import {
  ITechniquesMap,
  ITechniquesMapActive,
  ITechniquesMapActiveButton,
  ITechniquesMapActiveButtonState,
  VehicleData,
} from 'interfaces';
import { accountsSelector, fetchConfigs } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { socketApiSocket } from 'utils/config';
import { activeIcon, inactiveIcon } from 'utils/constantMap';
import 'containers/TechniqueMap/_techniqueMap.scss';

const { Text } = Typography;

const TechniqueMap = () => {
  const b = bem('TechniqueMap');
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const { techniqueId } = useParams() as { techniqueId: string };
  const { account, configs } = useAppSelector(accountsSelector);
  const [open, setOpen] = useState(false);
  const [socketLoading, setSocketLoading] = useState(false);
  const [socketMap, setSocketMap] = useState<VehicleData | null>({
    status: '',
    online_vehicle_ids: null,
    all_vehicles_info: null,
  });
  const [vehicle, setVehicle] = useState<ITechniquesMap | null>(null);
  const [latestSocketData, setLatestSocketData] = useState<ITechniquesMapActiveButtonState | null>(
    null,
  );
  const [vehicleActive, setVehicleActive] = useState<ITechniquesMapActiveButton | null>(null);

  useEffect(() => {
    if (vehicle && latestSocketData) {
      const activeVehicleData = latestSocketData?.online_vehicle_ids?.find(
        (item) => item[vehicle?.id],
      );

      if (activeVehicleData) {
        const activeVehicle = activeVehicleData[vehicle?.id];
        setVehicleActive(activeVehicle);
      }
    }
  }, [vehicle, latestSocketData]);

  const connectWebSocket = (time: number, secret: string) => {
    let connectionID = '';
    const message = moment().format('YYYY-MM-DD');
    const key = enc.Utf8.parse(secret);
    const encrypted = AES.encrypt(message, key, { mode: mode.ECB }).toString();
    const encodedEncrypted = encodeURIComponent(encrypted);

    const connect = () => {
      const socket = new WebSocket(`${socketApiSocket}?Authentication=${encodedEncrypted}`);

      socket.onopen = () => {
        setSocketLoading(true);
        socket.send(
          JSON.stringify({
            kind: 'info',
            timeout: time,
            company_id: techniqueId,
            connection_id: connectionID,
          }),
        );
      };

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            kind: 'info',
            timeout: time,
            company_id: techniqueId,
            connection_id: connectionID,
          }),
        );
      }

      socket.onmessage = (event) => {
        setSocketLoading(false);
        const messageData = JSON.parse(event.data);
        connectionID = messageData.connection_id;
        setSocketMap({ ...socketMap, status: messageData.kind });
        if (Object.keys(messageData?.data || {}).length) {
          setSocketMap({ ...socketMap, ...messageData.data });
          setLatestSocketData(messageData?.data);
        }
      };

      socket.onclose = (event) => {
        if (event.code === 1000) {
          socket.close();
        } else {
          connect();
        }
      };

      return socket;
    };

    return connect();
  };

  useEffect(() => {
    dispatch(fetchConfigs());
  }, [dispatch]);

  useEffect(() => {
    if (account?.coords_timeout || configs?.websocket_auth_secret_key) {
      const socket = connectWebSocket(
        account?.coords_timeout ?? 0,
        configs?.websocket_auth_secret_key ?? '',
      );

      return () => {
        socket.close();
      };
    }
  }, [account?.coords_timeout, configs?.websocket_auth_secret_key]);

  const showDrawer = (vehicleData: ITechniquesMap) => {
    setOpen(true);
    setVehicle(vehicleData);
  };

  const backHandler = () => {
    history(-1);
  };

  const renderCircleMarker = (
    vehicleData: ITechniquesMap,
    position: LatLngExpression,
    icon: Icon<IconOptions> | DivIcon | undefined,
    showDrawer: (vehicleData: ITechniquesMap) => void,
  ) => {
    const vehicleId = vehicleData.id;

    return (
      <CircleMarker key={vehicleId} center={position} opacity={0} radius={10}>
        <Marker
          position={position}
          icon={icon}
          eventHandlers={{ click: () => showDrawer(vehicleData) }}
        />
      </CircleMarker>
    );
  };

  const countVehicles = (
    allVehicles: ITechniquesMap[] | null | undefined,
    onlineVehicles: ITechniquesMapActive[] | null | undefined,
  ) => {
    let activeVehiclesCount = 0;

    allVehicles?.forEach((vehicle) => {
      const vehicleInOnlineVehicles = onlineVehicles?.find((item) => item[vehicle?.id]);
      const isActive = Boolean(vehicleInOnlineVehicles);

      if (isActive) {
        activeVehiclesCount++;
      }
    });

    const inactiveVehiclesCount = (allVehicles?.length || 0) - activeVehiclesCount;

    return { activeVehiclesCount, inactiveVehiclesCount };
  };

  const { activeVehiclesCount: activeCount, inactiveVehiclesCount: inactiveCount } = countVehicles(
    socketMap?.all_vehicles_info,
    socketMap?.online_vehicle_ids,
  );

  if (socketLoading) {
    return (
      <div data-testid='loading' className='loading'>
        <div>
          <Spin className='spin' size='large' />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={b()}>
        <div className={b('card-block')}>
          <Card className={b('card-style')} bordered={false}>
            <div className={b('header-title')}>
              <button type='button' className='btn_none_style' onClick={backHandler}>
                <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
              </button>

              <Text className={b('title')}>
                Всего техники - <Text strong>{socketMap?.all_vehicles_info?.length || 0}</Text>
              </Text>
              <Text className={b('title')}>
                <img src={active} alt='locale' className={b('img-title')} />
                Активны - <Text strong>{activeCount}</Text>
              </Text>
              <Text className={b('title')}>
                <img src={inactive} alt='locale' className={b('img-title')} />
                Неактивны - <Text strong>{inactiveCount}</Text>
              </Text>
            </div>
          </Card>
        </div>

        <div className={b('map-block')}>
          <MapContainer
            center={[60.735277, 92.628906]}
            zoom={3}
            minZoom={2}
            maxZoom={27}
            scrollWheelZoom
            style={{ width: '100%', height: '100vh' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
            {socketMap?.all_vehicles_info?.map((vehicle) => {
              const vehicleInOnlineVehicles = socketMap?.online_vehicle_ids?.find(
                (item) => item[vehicle?.id],
              );

              if (vehicleInOnlineVehicles) {
                const latitude = parseFloat(vehicleInOnlineVehicles[vehicle?.id]?.latitude);
                const longitude = parseFloat(vehicleInOnlineVehicles[vehicle?.id]?.longitude);
                return renderCircleMarker(vehicle, [latitude, longitude], activeIcon, showDrawer);
              }

              return renderCircleMarker(
                vehicle,
                [vehicle?.last_latitude, vehicle?.last_longitude],
                inactiveIcon,
                showDrawer,
              );
            })}
          </MapContainer>
        </div>
      </div>

      <DrawerComponent
        vehicle={vehicle}
        vehicleActive={vehicleActive}
        onClose={() => {
          setOpen(!open);
          setVehicleActive(null);
        }}
        open={open}
      />
    </>
  );
};

export default TechniqueMap;
