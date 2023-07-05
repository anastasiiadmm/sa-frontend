import L from 'leaflet';

import active from 'assets/images/icons/active_tracktor.svg';
import endB from 'assets/images/icons/endB.svg';
import inactive from 'assets/images/icons/inactive_tracktor.svg';
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
export const activeIcon = new L.Icon({
  iconUrl: active,
  iconRetinaUrl: active,
  iconAnchor: new L.Point(14, 14),
  popupAnchor: new L.Point(14, 0),
  iconSize: new L.Point(28, 30),
  className: 'leaflet-div-icon',
});

export const inactiveIcon = new L.Icon({
  iconUrl: inactive,
  iconRetinaUrl: inactive,
  iconAnchor: new L.Point(14, 14),
  popupAnchor: new L.Point(14, 0),
  iconSize: new L.Point(28, 30),
  className: 'leaflet-div-icon',
});
