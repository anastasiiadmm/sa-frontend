import { Card, Typography } from 'antd';
import bem from 'easy-bem';
import L from 'leaflet';
import React, { useState } from 'react';
import { CircleMarker, MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router';

import active from 'assets/images/icons/active_tracktor.svg';
import arrowLeft from 'assets/images/icons/arrow-left.svg';
import inactive from 'assets/images/icons/inactive_tracktor.svg';
import DrawerComponent from 'components/DrawerComponent/DrawerComponent';
import 'containers/TechniqueMap/_techniqueMap.scss';

const { Text } = Typography;

const TechniqueMap = () => {
  const b = bem('TechniqueMap');
  const history = useNavigate();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const duckIcon = new L.Icon({
    iconUrl: active,
    iconRetinaUrl: active,
    iconAnchor: new L.Point(14, 14),
    popupAnchor: new L.Point(14, 0),
    iconSize: new L.Point(28, 30),
    className: 'leaflet-div-icon',
  });

  const backHandler = () => {
    history(-1);
  };

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
                Всего техники - <Text strong>123 техники</Text>
              </Text>

              <Text className={b('title')}>
                <img src={active} alt='locale' className={b('img-title')} />
                Активны - <Text strong>24</Text>
              </Text>

              <Text className={b('title')}>
                <img src={inactive} alt='locale' className={b('img-title')} />
                Неактивны - <Text strong>12</Text>
              </Text>
            </div>
          </Card>
        </div>

        <div className={b('map-block')}>
          <MapContainer
            center={[42.902956, 74.623199]}
            zoom={27}
            minZoom={2}
            maxZoom={18}
            scrollWheelZoom
            style={{ width: '100%', height: '100vh' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
            <CircleMarker center={[42.902956, 74.623199]} opacity={0} radius={10}>
              <Marker
                position={[42.902956, 74.623199]}
                icon={duckIcon}
                eventHandlers={{
                  click: showDrawer,
                }}
              />
            </CircleMarker>
          </MapContainer>
        </div>
      </div>

      <DrawerComponent onClose={() => setOpen(!open)} open={open} />
    </>
  );
};

export default TechniqueMap;
