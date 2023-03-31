import { Button, Card, Spin, Typography } from 'antd';
import bem from 'easy-bem';
import L, { LatLngExpression } from 'leaflet';
import React, { useEffect } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import 'components/OpenMapComponent/_openMapComponent.scss';
import arrowLeft from 'assets/images/icons/arrow-left.svg';
import endB from 'assets/images/icons/endB.svg';
import locale from 'assets/images/icons/locale.svg';
import map from 'assets/images/icons/map.svg';
import startA from 'assets/images/icons/startA.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import { dataExchangeFetchFetch, mapSelector, mapVehicleFetch } from 'redux/map/mapSlice';

const { Title } = Typography;

const purpleOptions = { color: '#1358BF' };

const OpenMapComponent = () => {
  const b = bem('OpenMapComponent');
  const { id, vehicleId } = useParams();
  const { vehicle, field } = useAppSelector(mapSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(mapVehicleFetch(Number(id)));
  }, []);

  useEffect(() => {
    const findResultsMap = vehicle.results?.processing_data.find(
      (item) => item.id === Number(vehicleId),
    );
    if (findResultsMap) {
      dispatch(dataExchangeFetchFetch({ id: Number(id), field_name: findResultsMap.field_name }));
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

  const renderHandler = () => {
    dispatch(mapVehicleFetch(Number(id)));
    const findResultsMap = vehicle.results?.processing_data.find(
      (item) => item.id === Number(vehicleId),
    );
    if (findResultsMap) {
      dispatch(dataExchangeFetchFetch({ id: Number(id), field_name: findResultsMap.field_name }));
    }
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
      <div className={b('loading')}>
        <div>
          <Spin size='large' />
        </div>
      </div>
    );
  }

  if (vehicle.errors || field.errors) {
    return (
      <div>
        {vehicle.errors?.message} {field.errors?.message}
      </div>
    );
  }

  return (
    <div className={b()}>
      <div className={b('card-block')}>
        <Card className={b('card-style')} bordered={false}>
          <div className={b('header-title')}>
            <Link to='/'>
              <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
            </Link>
            <Title level={3} className={b('title')}>
              <img src={locale} alt='locale' className={b('img-title')} />
              <p className={b('subtitle')}> 11223344 </p> - Поле #2 / 32 га
            </Title>
            <Title level={3} className={b('title')}>
              <img src={tractorBlue} alt='tractor' className={b('img-title img-tractor')} />
              <p className={b('subtitle')}>
                {typeof vehicle.results?.first_name === 'string'
                  ? vehicle.results?.first_name.toUpperCase()
                  : null}
              </p>
              - Беларус / Трактор
            </Title>
            <Button onClick={() => renderHandler()} className={b('render_btn')}>
              Обновить данные
            </Button>
          </div>
        </Card>
      </div>
      <div className={b('map-block')}>
        <MapContainer
          center={centerMap() as LatLngExpression}
          zoom={18}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100vh' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          />
          <CircleMarker center={centerMap() as LatLngExpression} opacity={0} radius={10}>
            <Marker position={centerMap() as LatLngExpression} icon={duckIcon}>
              <Popup>
                {typeof vehicle.results?.first_name === 'string'
                  ? vehicle.results?.first_name.toUpperCase()
                  : null}
              </Popup>
            </Marker>
          </CircleMarker>
          <Polyline
            weight={5}
            pathOptions={purpleOptions}
            positions={polyline as LatLngExpression[] | any[]}
          >
            <Marker
              position={getCoordinateByType(polyline, 'start') as LatLngExpression}
              icon={duckIconStart}
            >
              <Popup>Start Point</Popup>
            </Marker>
            <Marker
              position={getCoordinateByType(polyline, 'end') as LatLngExpression}
              icon={duckIconEnd}
            >
              <Popup>End Point</Popup>
            </Marker>
          </Polyline>
        </MapContainer>
      </div>
    </div>
  );
};

export default OpenMapComponent;
