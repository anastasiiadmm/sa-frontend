import { Button } from 'antd';
import bem from 'easy-bem';
import L, { LatLngTuple } from 'leaflet';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router';

import { checkTooltipVisibility, lastCommunication } from 'helper';
import { climateColors } from 'utils/constants';
import 'components/FieldClimateOpenMapComponent/_fieldClimateOpenMapComponent.scss';
import 'leaflet/dist/leaflet.css';

type Props = {
  markers: any;
  selectedOption: string;
};

const FieldClimateOpenMapComponent: React.FC<Props> = ({ markers, selectedOption }) => {
  const b = bem('FieldClimateOpenMapComponent');
  const history = useNavigate();

  const pushToStationHandler = async (id: string) => {
    await localStorage.setItem('stationId', id);
    await history(`/field-climate/station/${id}`);
  };

  return (
    <MapContainer
      className={b('')}
      center={[11.2773259, 46.3089513]}
      zoom={3}
      scrollWheelZoom
      style={{ width: '100%', height: '94vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      />
      {markers?.map((marker: any) => {
        let fillColor = '%23d3d3d3';

        switch (selectedOption) {
          case 'last_communication':
            if (lastCommunication(marker?.dates?.last_communication)) {
              fillColor = climateColors?.green;
            } else {
              fillColor = climateColors?.red;
            }
            break;
          case 'airTemp':
            if (marker?.meta?.airTemp <= 5) {
              fillColor = climateColors?.skyblue;
            } else if (marker?.meta?.airTemp >= 5 && marker?.meta?.airTemp <= 15) {
              fillColor = climateColors?.green;
            } else if (marker?.meta?.airTemp >= 15) {
              fillColor = climateColors?.yellow;
            }
            break;
          case 'soilTemp':
            if (marker?.meta?.soilTemp <= 5) {
              fillColor = climateColors?.skyblue;
            } else if (marker?.meta?.soilTemp >= 5 && marker?.meta?.soilTemp <= 13) {
              fillColor = climateColors?.green;
            } else if (marker?.meta?.soilTemp >= 13 && marker?.meta?.soilTemp <= 16) {
              fillColor = climateColors?.yellow;
            } else if (marker?.meta?.soilTemp >= 16) {
              fillColor = climateColors?.orange;
            }
            break;
          case 'rh':
            if (marker?.meta?.rh <= 5) {
              fillColor = climateColors?.yellow;
            } else if (marker?.meta?.rh >= 5 && marker?.meta?.rh <= 60) {
              fillColor = climateColors?.green;
            } else if (marker?.meta?.rh >= 60) {
              fillColor = climateColors?.blue;
            }
            break;
          case 'rain24h':
            if (marker?.meta?.rain24h?.sum <= 0.0) {
              fillColor = climateColors?.yellow;
            } else if (marker?.meta?.rain24h?.sum >= 0.1) {
              fillColor = climateColors?.blue;
            }
            break;
          case 'rain48h':
            if (marker?.meta?.rain48h?.sum <= 0.0) {
              fillColor = climateColors?.yellow;
            } else if (marker?.meta?.rain24h?.sum >= 0.1) {
              fillColor = climateColors?.blue;
            }
            break;
          case 'rain7d':
            if (marker?.meta?.rain48h?.sum <= 0.0) {
              fillColor = climateColors?.yellow;
            } else if (marker?.meta?.rain24h?.sum >= 0.1) {
              fillColor = climateColors?.blue;
            }
            break;
          case 'battery':
            if (marker?.meta?.battery <= 5999) {
              fillColor = climateColors?.orange;
            } else if (marker?.meta?.battery >= 6000) {
              fillColor = climateColors?.green;
            }
            break;
          default:
            fillColor = climateColors?.gray;
            break;
        }

        const customIcon = L.icon({
          iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24" fill="none" stroke="%23fafafa" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"><path d="M12.61 2.21C12.25 1.93 11.75 1.93 11.39 2.21C9.49004 3.66 3.88003 8.39 3.91003 13.9C3.91003 18.36 7.54004 22 12.01 22C16.48 22 20.11 18.37 20.11 13.91C20.12 8.48 14.5 3.67 12.61 2.21Z" stroke="%23ffffff" fill="${fillColor}" stroke-width="1.5" stroke-miterlimit="10"/></g></svg>`,
          iconSize: [30, 30],
        });

        return (
          <Marker key={marker?.id} icon={customIcon} position={marker?.position as LatLngTuple}>
            {checkTooltipVisibility(selectedOption, marker) && (
              <Tooltip direction='top' permanent className={b('custom-tooltip')}>
                {selectedOption === 'airTemp' && marker?.meta?.airTemp?.toFixed(2)}
                {selectedOption === 'soilTemp' && marker?.meta?.soilTemp.toFixed(2)}
                {selectedOption === 'rh' && marker?.meta?.rh}
                {selectedOption === 'rain24h' && marker?.meta?.rain24h?.sum}
                {selectedOption === 'rain48h' && marker?.meta?.rain48h?.sum}
                {selectedOption === 'rain7d' && marker?.meta?.rain7d?.sum}
                {selectedOption === 'battery' && marker?.meta?.battery}
              </Tooltip>
            )}
            <Popup>
              <div className={b('custom-popup')}>
                <p>
                  {marker?.name} ({marker?.id})
                </p>
                <Button type='link' onClick={() => pushToStationHandler(marker?.id)}>
                  Детальная информация
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default FieldClimateOpenMapComponent;
