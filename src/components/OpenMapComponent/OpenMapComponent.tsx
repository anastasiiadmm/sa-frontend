import { Alert, Button, Card, Spin, Tooltip, Typography } from 'antd';
import bem from 'easy-bem';
import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import React, { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { useLocation, useNavigate, useParams } from 'react-router';

import 'components/OpenMapComponent/_openMapComponent.scss';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import endB from 'assets/images/icons/endB.svg';
import locale from 'assets/images/icons/locale.svg';
import map from 'assets/images/icons/map.svg';
import startA from 'assets/images/icons/startA.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import Errors from 'components/Errors/Errors';
import { authSelector } from 'redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import { clearField, mapSelector, obtainingCoordinate, tractorLocation } from 'redux/map/mapSlice';

const { Title } = Typography;

const purpleOptions = { color: '#1358BF' };

const OpenMapComponent = () => {
  const b = bem('OpenMapComponent');
  const { id, vehicleId } = useParams();
  const { pathname } = useLocation();
  const { vehicle, field } = useAppSelector(mapSelector);
  const { user } = useAppSelector(authSelector);
  const [bounds] = useState<number[][]>([
    [-90, -180],
    [90, 180],
  ]);
  const dispatch = useAppDispatch();
  const history = useNavigate();
  useEffect(() => {
    if (user?.is_manager) {
      dispatch(tractorLocation(`/companies/${id}/vehicle/${vehicleId}/`));
    } else {
      dispatch(tractorLocation(`/accounts/user/vehicle/${vehicleId}/`));
    }
  }, []);

  useEffect(() => {
    const findResultsMap = vehicle.results?.processing_data.find((item) => item.id === Number(id));
    if (findResultsMap && !pathname.includes('local-tractor')) {
      dispatch(
        obtainingCoordinate({
          id: Number(vehicleId),
          field_name: findResultsMap?.field_name || 'NotFound',
        }),
      );
    } else {
      dispatch(clearField());
    }
  }, [vehicle.results?.processing_data]);

  const polyline = field.results.map((obj) => {
    const [lat1, lon1] = obj.PointA.split(',');
    const [lat2, lon2] = obj.PointB.split(',');
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
    iconSize: new L.Point(36, 36),
    className: 'leaflet-div-icon',
  });

  const duckIconStart = new L.Icon({
    iconUrl: startA,
    iconRetinaUrl: startA,
    iconAnchor: new L.Point(5, 17),
    popupAnchor: new L.Point(16, 0),
    iconSize: new L.Point(36, 36),
    className: 'leaflet-div-icon',
  });

  const duckIconEnd = new L.Icon({
    iconUrl: endB,
    iconRetinaUrl: endB,
    iconAnchor: new L.Point(5, 17),
    popupAnchor: new L.Point(16, 0),
    iconSize: new L.Point(36, 36),
    className: 'leaflet-div-icon',
  });

  const centerMap = () => {
    if (vehicle.results?.last_latitude && vehicle.results?.last_longitude) {
      return [Number(vehicle.results.last_latitude), Number(vehicle.results?.last_longitude)];
    }
    return [0, 0];
  };
  const lineMap = () => {
    if (field.results.length) {
      const number1 = field.results[0].PointA.split(',')[0];
      const number2 =
        field.results[0].PointA.split(',').length > 1 ? field.results[0].PointA.split(',')[1] : 0;
      return [Number(number1), Number(number2)];
    }

    return [0, 0];
  };

  const renderHandler = () => {
    if (user?.is_manager) {
      dispatch(tractorLocation(`/companies/${id}/vehicle/${vehicleId}/`));
    } else {
      dispatch(tractorLocation(`/accounts/user/vehicle/${id}/`));
    }
    const findResultsMap = vehicle.results?.processing_data.find(
      (item) => item.id === Number(vehicleId),
    );
    if (findResultsMap) {
      dispatch(obtainingCoordinate({ id: Number(id), field_name: findResultsMap.field_name }));
    }
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

  if (vehicle.loading || field.loading) {
    return (
      <div data-testid='loading' className={b('loading')}>
        <div>
          <Spin size='large' />
        </div>
      </div>
    );
  }

  if (vehicle.errors || field.errors) {
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
                      ? findResults?.field_name
                      : 'Местоположение трактора'}
                  </span>
                </p>
              </Tooltip>
            </Title>
            <Title level={3} className={b('title')}>
              <img src={tractorBlue} alt='tractor' className={b('img-title img-tractor')} />
              <p className={b('subtitle')}>{vehicle.results?.description}</p>
            </Title>
            <Button onClick={() => renderHandler()} className={b('render_btn')}>
              Обновить данные
            </Button>
          </div>
          {field.results.length ||
          id === 'local-tractor' ||
          pathname.includes('local-tractor') ? null : (
            <Alert
              message='Кординаты для маршрута не найдено'
              type='error'
              style={{
                marginTop: 20,
              }}
            />
          )}
        </Card>
      </div>
      <div className={b('map-block')}>
        <MapContainer
          center={
            field.results.length
              ? (lineMap() as LatLngExpression)
              : (centerMap() as LatLngExpression)
          }
          zoom={13}
          minZoom={2}
          maxZoom={18}
          scrollWheelZoom
          maxBounds={latLngBounds}
          style={{ width: '100%', height: '100vh' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          />
          <CircleMarker center={centerMap() as LatLngExpression} opacity={0} radius={10}>
            <Marker position={centerMap() as LatLngExpression} icon={duckIcon}>
              <Popup>
                <span className={b('title_uppercase')}>{vehicle.results?.description}</span>
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
        </MapContainer>
      </div>
    </div>
  );
};

export default OpenMapComponent;
