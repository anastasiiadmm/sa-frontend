export const pathsWithoutMargin = [
  '/open-map',
  '/field-climate',
  '/field-climate/station',
  '/field-climate/config',
];

export const climateOptions = [
  { value: 'last_communication', label: 'Последнее соединение' },
  { value: 'airTemp', label: 'Температура воздуха' },
  { value: 'soilTemp', label: 'Температура почвы' },
  { value: 'rh', label: 'Относительная влажность' },
  { value: 'rain24h', label: 'Осадки, 24ч' },
  { value: 'rain48h', label: 'Осадки, 2сут.' },
  { value: 'rain7d', label: 'Осадки, 7сут.' },
  { value: 'battery', label: 'Батарея' },
];

export const climateColors = {
  red: '%23ca3a3c',
  green: '%23107934',
  skyblue: '%231babe1',
  yellow: '%23f6c12d',
  orange: '%23ee741c',
  blue: '%230b75b9',
  gray: '%23d3d3d3',
};
