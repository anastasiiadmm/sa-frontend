import { Button, Card, Spin, Tooltip, Typography } from 'antd';
import bem from 'easy-bem';
import L, { LatLngExpression, LatLngTuple } from 'leaflet';
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
import { useLocation, useNavigate, useParams } from 'react-router';

import 'components/OpenMapComponent/_openMapComponent.scss';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import endB from 'assets/images/icons/endB.svg';
import locale from 'assets/images/icons/locale.svg';
import map from 'assets/images/icons/map.svg';
import startA from 'assets/images/icons/startA.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import Errors from 'components/Errors/Errors';
import { isLineAbove, metersToLatitude } from 'helper';
import { accountsSelector, fetchVehicleInfo } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import { mapSelector, obtainingCoordinate } from 'redux/map/mapSlice';

// eslint-disable-next-line import/order
import { AimOutlined } from '@ant-design/icons';

const { Title } = Typography;

const purpleOptions = { color: '#1358BF' };
const purpleOptionsTool = { color: 'rgba(45,157,19,0.77)', borderRadius: 0 };

const OpenMapComponent = () => {
  const b = bem('OpenMapComponent');
  const { id, field_name } = useParams();
  const { pathname } = useLocation();
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
    setSocketLoading(true);
    let connectionID = '';

    const connect = () => {
      const socket = new WebSocket('ws://159.89.30.209:8080/ws');

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            kind: 'ping',
            vehicle_id: Number(id),
            connection_id: connectionID,
          }),
        );
      };

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

  const polyline = field.results.map((obj) => {
    const [lat1, lon1] = obj.received_data.PointA.split(',');
    const [lat2, lon2] = obj.received_data.PointB.split(',');
    return [
      [parseFloat(lat1), parseFloat(lon1)],
      [parseFloat(lat2), parseFloat(lon2)],
    ];
  });

  const positions = polyline.map((points) =>
    points.map((point) => [point[0], point[1]] as LatLngTuple),
  );

  const duckIcon = new L.Icon({
    iconUrl: map,
    iconRetinaUrl: map,
    iconAnchor: new L.Point(16, 17),
    popupAnchor: new L.Point(16, 0),
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon',
  });

  const duckIconStart = new L.Icon({
    iconUrl: startA,
    iconRetinaUrl: startA,
    iconAnchor: new L.Point(5, 10),
    popupAnchor: new L.Point(16, 0),
    iconSize: new L.Point(36, 36),
    className: 'leaflet-div-icon',
  });

  const duckIconEnd = new L.Icon({
    iconUrl: endB,
    iconRetinaUrl: endB,
    iconAnchor: new L.Point(5, 10),
    popupAnchor: new L.Point(16, 0),
    iconSize: new L.Point(36, 36),
    className: 'leaflet-div-icon',
  });

  const duckIconStartTool = new L.Icon({
    iconUrl: '',
    iconRetinaUrl: startA,
    iconAnchor: new L.Point(5, 10),
    popupAnchor: new L.Point(16, 0),
    iconSize: new L.Point(1, 36),
    className: 'leaflet-div-icon',
  });

  const duckIconEndTool = new L.Icon({
    iconUrl: '',
    iconRetinaUrl: endB,
    iconAnchor: new L.Point(5, 10),
    popupAnchor: new L.Point(16, 0),
    iconSize: new L.Point(1, 36),
    className: 'leaflet-div-icon',
  });

  const centerMap = () => {
    if (socketMap.latitude && socketMap.longitude) {
      return [Number(socketMap.latitude), Number(socketMap.longitude)];
    }
    return [0, 0];
  };
  const lineMap = () => {
    if (field.results.length) {
      const number1 = field.results[0].received_data.PointA.split(',')[0];
      const number2 =
        field.results[0].received_data.PointA.split(',').length > 1
          ? field.results[0].received_data.PointA.split(',')[1]
          : 0;
      return [Number(number1), Number(number2)];
    }

    return [0, 0];
  };

  const centerMapHandler = () => {
    if (loadingMap) {
      return centerMap() as LatLngExpression;
    }
    if (field.results.length) {
      return lineMap() as LatLngExpression;
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

  function getCoordinateByType(coordinates: number[][][], type: string): number[] {
    if (coordinates.length) {
      if (type === 'start') {
        return coordinates[0][0];
      }
      if (type === 'end') {
        const lastPair = coordinates[coordinates.length - 1];
        return lastPair[lastPair.length - 1];
      }
    }

    return [0, 0];
  }

  function getCoordinateByTypeTool(coordinates: number[][][], type: string): number[] {
    if (coordinates.length) {
      if (type === 'start') {
        return coordinates[0][0];
      }
      if (type === 'end') {
        return centerMap();
      }
    }

    return [0, 0];
  }

  const positionsTool2 = (): any => {
    if (field.results.length && field.resultsV2?.tool_width) {
      return polyline.map((points) => {
        if (isLineAbove(points[0], points[1])) {
          return points.map(
            (point) =>
              [
                point[0] + metersToLatitude(Number(field.resultsV2?.tool_width)),
                point[1],
              ] as LatLngTuple,
          );
        }
        if (!isLineAbove(points[0], points[1])) {
          return points.map(
            (point) =>
              [
                point[0],
                point[1] - metersToLatitude(Number(field.resultsV2?.tool_width)),
              ] as LatLngTuple,
          );
        }
      });
    }

    return [0, 0];
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
  const latLngBounds: L.LatLngBoundsExpression = L.latLngBounds(
    bounds.map((coords: number[]) => [coords[0], coords[1]]),
  );
  const findResults = vehicle.results?.processing_data.find((item) => item.id === Number(id));

  const width = 12;
  const center = [42.858133, 74.602599];
  const sizeInMeters = width / 100000;

  const topLeft: any = [center[0] + sizeInMeters / 2, center[1]];
  const bottomRight: any = [42.858133, 74.603599];

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
                  <span>
                    {!pathname.includes('local-tractor')
                      ? 'Маршрут трактора'
                      : 'Местоположение трактора'}
                  </span>
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
            {id === 'local-tractor' || pathname.includes('local-tractor') ? null : (
              <Polyline weight={5} pathOptions={purpleOptions} positions={positions}>
                <Marker
                  position={getCoordinateByType(positions, 'start') as LatLngExpression}
                  icon={duckIconStart}
                >
                  <Popup>Start</Popup>
                </Marker>
                <Marker
                  position={getCoordinateByType(positions, 'end') as LatLngExpression}
                  icon={duckIconEnd}
                >
                  <Popup>End</Popup>
                </Marker>
              </Polyline>
            )}

            <Rectangle bounds={[topLeft, bottomRight]} color='red' weight={3} />
            {id === 'local-tractor' || pathname.includes('local-tractor') ? null : (
              <Polyline weight={30} pathOptions={purpleOptionsTool} positions={positionsTool2()}>
                <Marker
                  position={getCoordinateByTypeTool(positionsTool2(), 'start') as LatLngExpression}
                  icon={duckIconStartTool}
                >
                  <Popup>Start</Popup>
                </Marker>
                <Marker
                  position={getCoordinateByTypeTool(positionsTool2(), 'end') as LatLngExpression}
                  icon={duckIconEndTool}
                >
                  <Popup>End</Popup>
                </Marker>
              </Polyline>
            )}
          </MapContainer>
        ) : null}
        {socketMap.status === 'no_geo' ? (
          <div className={b('not_coordinates')}>
            <h1>Кординаты не найдено</h1>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OpenMapComponent;
