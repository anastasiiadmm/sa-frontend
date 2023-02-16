import { Card, Typography } from 'antd';
import bem from 'easy-bem';
import { LatLngExpression } from 'leaflet';
import React from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';

import 'components/OpenMapComponent/_openMapComponent.scss';
import arrowLeft from 'assets/images/icons/arrow-left.svg';
import locale from 'assets/images/icons/locale.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';

const { Title } = Typography;

const center = [42.503613, 78.50689];

const polyline = [
  [42.503816, 78.505621],
  [42.50264, 78.506488],
  [42.503613, 78.50689],
];

const purpleOptions = { color: '#1358BF' };
const redOptions = { color: 'red' };

const OpenMapComponent = () => {
  const b = bem('OpenMapComponent');

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
              <p className={b('subtitle')}> AVP123344 </p> - Беларус / Трактор
            </Title>
          </div>
        </Card>
      </div>
      <div className={b('map-block')}>
        <MapContainer
          center={center as LatLngExpression}
          zoom={17}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100vh' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          />
          <CircleMarker center={[42.503613, 78.50689]} pathOptions={redOptions} radius={10}>
            <Popup>Popup in CircleMarker</Popup>
          </CircleMarker>
          <Polyline pathOptions={purpleOptions} positions={polyline as LatLngExpression[]} />
        </MapContainer>
      </div>
    </div>
  );
};

export default OpenMapComponent;
