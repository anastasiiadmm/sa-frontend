import bem from 'easy-bem';
import L, { LatLngTuple } from 'leaflet';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';

import drop from 'assets/images/icons/drop.svg';
import 'components/FieldClimateOpenMapComponent/_fieldClimateOpenMapComponent.scss';
import 'leaflet/dist/leaflet.css';

type Props = {
  markers: any;
};

const FieldClimateOpenMapComponent: React.FC<Props> = ({ markers }) => {
  const b = bem('FieldClimateOpenMapComponent');
  const customIcon = L.icon({
    iconUrl: drop,
    iconSize: [30, 30],
  });

  return (
    <MapContainer
      className={b('')}
      center={[11.2773259, 46.3089513]}
      zoom={3}
      scrollWheelZoom
      style={{ width: '100%', height: '90vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      />
      {markers?.map((marker: any) => (
        <Marker key={uuidv4()} icon={customIcon} position={marker.position as LatLngTuple}>
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default FieldClimateOpenMapComponent;
