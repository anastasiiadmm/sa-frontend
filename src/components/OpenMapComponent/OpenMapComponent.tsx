import { AimOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Tooltip, Typography } from 'antd';
import { AES, enc, mode } from 'crypto-js';
import bem from 'easy-bem';
import L, { LatLngExpression } from 'leaflet';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import localeRound from 'assets/images/icons/field-location.svg';
import speedRound from 'assets/images/icons/speed-round.svg';
import tractorBlue from 'assets/images/icons/traktor-round.svg';
import Errors from 'components/Errors/Errors';
import { accountsSelector, fetchConfigs, fetchVehicleInfo } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { mapSelector, obtainingCoordinate } from 'redux/map/mapSlice';
import { socketApiSocket } from 'utils/config';
import 'components/OpenMapComponent/_openMapComponent.scss';
import { activeIcon, duckIconEnd, duckIconStart, inactiveIcon } from 'utils/constantMap';

const { Title } = Typography;

const purpleOptions = { color: '#1358BF' };

const OpenMapComponent = () => {
  const b = bem('OpenMapComponent');
  const { id, field_name, code } = useParams() as { id: string; field_name: string; code: string };
  const { account, configs } = useAppSelector(accountsSelector);
  const { vehicle, field } = useAppSelector(mapSelector);
  const markerRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
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
    speed: 0,
  });
  const { userVehicleInfo, userVehicleInfoLoading } = useAppSelector(accountsSelector);
  const [loadingMap, setLoadingMap] = useState(false);
  const [loadingMapUpdate, setLoadingMapUpdate] = useState(false);
  const [socketLoading, setSocketLoading] = useState(false);

  const moveSpeed = account?.coords_timeout ? account.coords_timeout * 1000 + 200 : 0;

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

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            kind: 'ping',
            timeout: time,
            vehicle_code: code,
            connection_id: connectionID,
          }),
        );
      };

      return socket;
    };

    return connect();
  };

  useEffect(() => {
    dispatch(fetchConfigs());
  }, [dispatch]);

  useEffect(() => {
    if (account?.coords_timeout && configs?.websocket_auth_secret_key) {
      const socket = connectWebSocket(
        account?.coords_timeout ?? 0,
        configs?.websocket_auth_secret_key ?? '',
      );

      return () => {
        socket.close();
      };
    }
  }, [account?.coords_timeout, configs?.websocket_auth_secret_key]);

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
    if (
      markerRef.current &&
      socketMap.latitude &&
      socketMap.longitude &&
      Number(socketMap?.speed) >= 2
    ) {
      const newPosition = [Number(socketMap.latitude), Number(socketMap.longitude)];
      const start = markerPosition || newPosition;
      const end = newPosition;

      const distance = Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);

      const duration = Math.max(moveSpeed, distance * 50);

      let progress = 0;
      const steps = 60;

      const timer = setInterval(() => {
        progress += 1 / steps;
        const currentLng = start[1] + (end[1] - start[1]) * progress;
        const currentLat = start[0] + (end[0] - start[0]) * progress;
        const currentPos: [number, number] = [currentLat, currentLng];
        setMarkerPosition(currentPos);

        if (progress >= 1) {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [socketMap.latitude, socketMap.longitude, socketMap.speed]);

  useEffect(() => {
    if (loadingMapUpdate) {
      setLoadingMapUpdate(false);
    }
  }, [loadingMapUpdate]);

  const centerMap = () => {
    if (socketMap.latitude && socketMap.longitude) {
      return [Number(socketMap.latitude), Number(socketMap.longitude)];
    }
    if (field?.results?.last_latitude && field?.results?.last_longitude) {
      return [Number(field?.results?.last_latitude), Number(field?.results?.last_longitude)];
    }
    return [0, 0];
  };

  const centerMapHandler = () => {
    if (loadingMap) {
      return centerMap() as LatLngExpression;
    }

    if (field?.results.point_A_lon && field?.results.point_B_lat) {
      return [field?.results.point_A_lon, field?.results.point_A_lat] as LatLngExpression;
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
        field?.results.point_A_lon as number,
        field?.results.point_A_lat as number,
      ] as LatLngExpression,
      [
        field?.results.point_B_lon as number,
        field?.results.point_B_lat as number,
      ] as LatLngExpression,
    ];
  };

  function getCoordinateByType(coordinates: LatLngExpression[], type: string): LatLngExpression {
    if (type === 'start') {
      return [field?.results.point_A_lon as number, field?.results.point_A_lat as number];
    }
    if (type === 'end') {
      return [field?.results.point_B_lon as number, field?.results.point_B_lat as number];
    }

    throw new Error('Invalid type provided');
  }

  const latLngBounds: L.LatLngBoundsExpression = L.latLngBounds(
    bounds.map((coords: number[]) => [coords[0], coords[1]]),
  );

  const findResults = vehicle?.results?.processing_data.find((item) => item.id === Number(id));

  if (
    vehicle?.loading ||
    field?.loading ||
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

  const fieldOne: LatLngExpression[] | LatLngExpression[][] = [
    [
      [52.68477, 39.618794],
      [52.686644, 39.62108],
    ],
    [
      [52.684656, 39.619088],
      [52.688475, 39.623862],
    ],
    [
      [52.686795, 39.621271],
      [52.690209, 39.62566],
    ],
    [
      [52.688709, 39.624191],
      [52.690079, 39.625992],
    ],
    [
      [52.689934, 39.626383],
      [52.684515, 39.619354],
    ],
  ];

  const fieldTwo: LatLngExpression[] | LatLngExpression[][] = [
    [
      [52.703808, 39.625391],
      [52.707549, 39.610904],
    ],
    [
      [52.703903, 39.62546],
      [52.704985, 39.621277],
    ],
    [
      [52.705126, 39.620722],
      [52.707643, 39.61098],
    ],
    [
      [52.707799, 39.611086],
      [52.704948, 39.622093],
    ],
    [
      [52.70492, 39.622222],
      [52.704051, 39.625583],
    ],
    [
      [52.704229, 39.625725],
      [52.70639, 39.617251],
    ],
    [
      [52.706635, 39.616292],
      [52.707972, 39.61119],
    ],
  ];

  const tractorFieldThree: LatLngExpression[] | LatLngExpression[][] = [
    [
      [45.229611, 39.590714],
      [45.238571, 39.590604],
    ],
    [
      [45.23857, 39.590778],
      [45.237515, 39.590795],
    ],
    [
      [45.237444, 39.590787],
      [45.230102, 39.590888],
    ],
    [
      [45.238577, 39.590958],
      [45.229622, 39.591069],
    ],
  ];

  if (vehicle?.errors?.detail || field?.errors?.detail) {
    return (
      <div>
        <Errors
          status={vehicle?.errors?.status || field?.errors?.status}
          detail={vehicle?.errors?.detail || field?.errors?.detail}
        />
      </div>
    );
  }

  const generateUniqueId = (() => {
    let id = 0;
    return () => `rectangle-${id++}`;
  })();

  return (
    <div className={b()}>
      <div className={b('card-block')}>
        <div>
          <Card className={`${b('card-style')} top_btn`} bordered={false}>
            <div className={b('header-title')}>
              <button type='button' className='btn_none_style' onClick={backHandler}>
                <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
              </button>
              <p className={b('title_maps')}>Техника на карте</p>
            </div>
          </Card>
        </div>
        <div className={b('card-block-info')}>
          {field.results?.task_UID !== null ? (
            <Card className={b('card-style')} bordered={false}>
              <div className={b('header-title')}>
                <Title level={3} className={b('title')}>
                  <img src={localeRound} alt='locale' className={b('img-title')} />
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
              </div>
            </Card>
          ) : null}
          <Card className={b('card-style')} bordered={false}>
            <div className={b('header-title')}>
              <Title level={3} className={b('title')}>
                <img src={tractorBlue} alt='tractor' className={b('img-title img-tractor')} />
                <p className={`${b('subtitle')} textEllipsis`}>
                  {userVehicleInfo?.vehicle?.description}
                </p>
              </Title>
            </div>
          </Card>
          <Card className={b('card-style')} bordered={false}>
            <div className={b('header-title')}>
              <Title level={3} className={b('title')}>
                <img src={speedRound} alt='speedRound' className={b('img-title img-tractor')} />
                <p className={b('subtitle')}>
                  {socketMap.status !== 'no_geo' && Number(socketMap?.speed) >= 2
                    ? Math.floor(Number(socketMap?.speed))
                    : 0}{' '}
                  км/ч
                </p>
              </Title>
            </div>
          </Card>
        </div>
      </div>
      <Button onClick={() => renderHandler()} className={b('render_btn')}>
        <AimOutlined />
      </Button>
      <div className={b('map-block')}>
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
          <CircleMarker
            ref={markerRef}
            center={markerPosition !== null ? markerPosition : (centerMap() as LatLngExpression)}
            opacity={0}
            radius={10}
            interactive={false}
          >
            <Marker
              position={
                markerPosition !== null ? markerPosition : (centerMap() as LatLngExpression)
              }
              icon={
                socketMap?.latitude === '' && socketMap?.longitude === ''
                  ? inactiveIcon
                  : activeIcon
              }
            >
              <Popup>
                <span className={b('title_uppercase')}>
                  {userVehicleInfo?.vehicle?.description}
                </span>
              </Popup>
            </Marker>
          </CircleMarker>

          <Polyline weight={3} pathOptions={purpleOptions} positions={positions()}>
            <Marker position={getCoordinateByType(positions(), 'start')} icon={duckIconStart}>
              <Popup>Start</Popup>
            </Marker>
            <Marker position={getCoordinateByType(positions(), 'end')} icon={duckIconEnd}>
              <Popup>End</Popup>
            </Marker>
          </Polyline>
          {field?.results?.point_A_lat === 39.6186 && field?.results?.point_A_lon === 52.684864
            ? fieldOne.map((bounds) => (
                <Polyline
                  key={generateUniqueId()}
                  positions={bounds}
                  color='rgba(30, 191, 19, 0.5)'
                  weight={33}
                />
              ))
            : field?.results?.point_A_lat === 39.625304 && field?.results?.point_A_lon === 52.703667
            ? fieldTwo.map((bounds) => (
                <Polyline
                  key={generateUniqueId()}
                  positions={bounds}
                  color='rgba(30, 191, 19, 0.5)'
                  weight={33}
                />
              ))
            : tractorFieldThree.map((bounds) => (
                <Polyline
                  key={generateUniqueId()}
                  positions={bounds}
                  color='rgba(30, 191, 19, 0.5)'
                  weight={33}
                />
              ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default OpenMapComponent;
