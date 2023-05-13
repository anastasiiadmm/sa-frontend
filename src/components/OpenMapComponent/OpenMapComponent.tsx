import { AimOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Tooltip, Typography } from 'antd';
import bem from 'easy-bem';
import L, { LatLngExpression } from 'leaflet';
import React, { useEffect, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet';
import { useNavigate, useParams } from 'react-router';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import endB from 'assets/images/icons/endB.svg';
import locale from 'assets/images/icons/locale.svg';
import map from 'assets/images/icons/map.svg';
import startA from 'assets/images/icons/startA.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import Errors from 'components/Errors/Errors';

import { accountsSelector, fetchVehicleInfo } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import { mapSelector, obtainingCoordinate } from 'redux/map/mapSlice';

import 'components/OpenMapComponent/_openMapComponent.scss';
import { socketApiSocket } from 'utils/config';

const { Title } = Typography;

const purpleOptions = { color: '#1358BF' };

const OpenMapComponent = () => {
  const b = bem('OpenMapComponent');
  const { id, field_name } = useParams();
  const { vehicle, field } = useAppSelector(mapSelector);
  const [bounds] = useState<number[][]>([
    [-90, -180],
    [90, 180],
  ]);
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const [socketMap, setSocketMap] = useState({
    status: '',
    latitude: '',
    longitude: '',
  });
  const { userVehicleInfo, userVehicleInfoLoading } = useAppSelector(accountsSelector);
  const [loadingMap, setLoadingMap] = useState(false);
  const [loadingMapUpdate, setLoadingMapUpdate] = useState(false);
  const [socketLoading, setSocketLoading] = useState(false);
  const connectWebSocket = () => {
    let connectionID = '';

    const connect = () => {
      const socket = new WebSocket(socketApiSocket);
      socket.onopen = () => {
        setSocketLoading(true);
        socket.send(
          JSON.stringify({
            kind: 'ping',
            vehicle_id: Number(id),
            connection_id: connectionID,
          }),
        );
      };

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            kind: 'ping',
            vehicle_id: Number(id),
            connection_id: connectionID,
          }),
        );
      }

      socket.onmessage = (event) => {
        setSocketLoading(false);
        const messageData = JSON.parse(event.data);
        connectionID = messageData.connection_id;
        setSocketMap({ ...socketMap, status: messageData.kind });
        if (messageData?.data?.latitude && messageData?.data?.longitude) {
          setSocketMap({ ...socketMap, ...messageData.data });
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

    const socket = connect();
    return socket;
  };

  useEffect(() => {
    const socket = connectWebSocket();

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchVehicleInfo({ vehicleId: String(id), pageUrl: '1' }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      obtainingCoordinate({
        id: Number(id),
        field_name: !field_name?.includes('local-tractor') ? `?job=${field_name}` : '',
      }),
    );

    if (field_name?.includes('local-tractor')) {
      setLoadingMap(true);
      setLoadingMapUpdate(true);
    }
  }, []);

  useEffect(() => {
    if (loadingMapUpdate) {
      setLoadingMapUpdate(false);
    }
  }, [loadingMapUpdate]);

  const duckIcon = new L.Icon({
    iconUrl: map,
    iconRetinaUrl: map,
    iconAnchor: new L.Point(14, 14),
    popupAnchor: new L.Point(14, 0),
    iconSize: new L.Point(28, 30),
    className: 'leaflet-div-icon',
  });

  const duckIconStart = new L.Icon({
    iconUrl: startA,
    iconRetinaUrl: startA,
    iconAnchor: new L.Point(14, 14),
    popupAnchor: new L.Point(14, 0),
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon',
  });

  const duckIconEnd = new L.Icon({
    iconUrl: endB,
    iconRetinaUrl: endB,
    iconAnchor: new L.Point(14, 14),
    popupAnchor: new L.Point(14, 0),
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon',
  });

  const centerMap = () => {
    if (socketMap.latitude && socketMap.longitude) {
      return [Number(socketMap.latitude), Number(socketMap.longitude)];
    }
    return [0, 0];
  };

  const centerMapHandler = () => {
    if (loadingMap) {
      return centerMap() as LatLngExpression;
    }

    if (field.results.point_A_lon && field.results.point_B_lat) {
      return [field.results.point_A_lat, field.results.point_A_lon] as LatLngExpression;
    }

    return centerMap() as LatLngExpression;
  };
  const renderHandler = () => {
    setLoadingMap(true);
    setLoadingMapUpdate(true);
  };

  const backHandler = () => {
    history(-1);
  };

  const positions = (): LatLngExpression[] => {
    return [
      [
        field.results.point_A_lat as number,
        field.results.point_A_lon as number,
      ] as LatLngExpression,
      [
        field.results.point_B_lat as number,
        field.results.point_B_lon as number,
      ] as LatLngExpression,
    ];
  };

  function getCoordinateByType(coordinates: LatLngExpression[], type: string): LatLngExpression {
    if (type === 'start') {
      return [field.results.point_A_lat as number, field.results.point_A_lon as number];
    }
    if (type === 'end') {
      return [field.results.point_B_lat as number, field.results.point_B_lon as number];
    }

    throw new Error('Invalid type provided');
  }

  const latLngBounds: L.LatLngBoundsExpression = L.latLngBounds(
    bounds.map((coords: number[]) => [coords[0], coords[1]]),
  );
  const findResults = vehicle.results?.processing_data.find((item) => item.id === Number(id));

  const lineMapHistory = () => {
    const width = Number(field.results?.tool_width);
    const center = [field.results.point_A_lat, field.results.point_A_lon];
    const sizeInMeters = width / 100000;

    let topLeft: LatLngExpression = [center[0] + sizeInMeters / 2, center[1]];

    const bottomRight: LatLngExpression = [field.results.point_B_lat, field.results.point_B_lon];

    if (center[0] > field.results.point_B_lat) {
      const widthIncrease = width / 100000;
      bottomRight[1] -= width / 100000;
      topLeft = [field.results.point_A_lat, bottomRight[1] - widthIncrease];
    } else {
      bottomRight[0] += width / 100000;
      topLeft = [topLeft[0], topLeft[1]];
    }

    return [topLeft, bottomRight];
  };

  if (
    vehicle.loading ||
    field.loading ||
    loadingMapUpdate ||
    socketLoading ||
    userVehicleInfoLoading
  ) {
    return (
      <div data-testid='loading' className={b('loading')}>
        <div>
          <Spin size='large' />
        </div>
      </div>
    );
  }

  if (vehicle.errors?.detail || field.errors?.detail) {
    return (
      <div>
        <Errors
          status={vehicle.errors?.status || field.errors?.status}
          detail={vehicle.errors?.detail || field.errors?.detail}
        />
      </div>
    );
  }

  return (
    <div className={b()}>
      <div className={b('card-block')}>
        <Card className={b('card-style')} bordered={false}>
          <div className={b('header-title')}>
            <button type='button' className='btn_none_style' onClick={backHandler}>
              <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
            </button>
            <Title level={3} className={b('title')}>
              <img src={locale} alt='locale' className={b('img-title')} />
              <Tooltip
                title={findResults?.field_name}
                color='#BBBBBB'
                overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
                placement='topLeft'
              >
                <p className={b('subtitle')}>
                  <span>{field.results?.task_UID}</span>
                </p>
              </Tooltip>
            </Title>
            <Title level={3} className={b('title')}>
              <img src={tractorBlue} alt='tractor' className={b('img-title img-tractor')} />
              <p className={b('subtitle')}>{userVehicleInfo?.vehicle?.description}</p>
            </Title>
          </div>
        </Card>
      </div>
      <Button onClick={() => renderHandler()} className={b('render_btn')}>
        <AimOutlined />
      </Button>
      <div className={b('map-block')}>
        {socketMap.latitude && socketMap.latitude ? (
          <MapContainer
            center={centerMapHandler()}
            zoom={27}
            minZoom={2}
            maxZoom={18}
            scrollWheelZoom
            maxBounds={latLngBounds}
            style={{ width: '100%', height: '100vh' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
            <CircleMarker center={centerMap() as LatLngExpression} opacity={0} radius={10}>
              <Marker position={centerMap() as LatLngExpression} icon={duckIcon}>
                <Popup>
                  <span className={b('title_uppercase')}>
                    {userVehicleInfo?.vehicle?.description}
                  </span>
                </Popup>
              </Marker>
            </CircleMarker>
            <Polyline weight={5} pathOptions={purpleOptions} positions={positions()}>
              <Marker position={getCoordinateByType(positions(), 'start')} icon={duckIconStart}>
                <Popup>Start</Popup>
              </Marker>
              <Marker position={getCoordinateByType(positions(), 'end')} icon={duckIconEnd}>
                <Popup>End</Popup>
              </Marker>
            </Polyline>

            <Rectangle bounds={lineMapHistory()} color='#1EBF13FF' weight={2} />
          </MapContainer>
        ) : null}
        {socketMap.status === 'no_geo' ? (
          <div className={b('not_coordinates')}>
            <h1>Координаты не найдены</h1>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OpenMapComponent;
