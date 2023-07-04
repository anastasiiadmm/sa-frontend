import L from 'leaflet';

import endB from 'assets/images/icons/endB.svg';
import map from 'assets/images/icons/map.svg';
import startA from 'assets/images/icons/startA.svg';

export const duckIcon = new L.Icon({
  iconUrl: map,
  iconRetinaUrl: map,
  iconAnchor: new L.Point(14, 14),
  popupAnchor: new L.Point(14, 0),
  iconSize: new L.Point(28, 30),
  className: 'leaflet-div-icon',
});

export const duckIconStart = new L.Icon({
  iconUrl: startA,
  iconRetinaUrl: startA,
  iconAnchor: new L.Point(14, 14),
  popupAnchor: new L.Point(14, 0),
  iconSize: new L.Point(30, 30),
  className: 'leaflet-div-icon',
});

export const duckIconEnd = new L.Icon({
  iconUrl: endB,
  iconRetinaUrl: endB,
  iconAnchor: new L.Point(14, 14),
  popupAnchor: new L.Point(14, 0),
  iconSize: new L.Point(30, 30),
  className: 'leaflet-div-icon',
});
