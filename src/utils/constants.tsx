export const apiPathV1 = '/api/v1/';
export const apiPathV2 = '/api/v2/';

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

export const rangeDataDaysSensors = [
  { value: 'raw', label: 'Необработанный' },
  { value: 'hourly', label: 'Ежечасно' },
  { value: 'daily', label: 'Ежедневно' },
  { value: 'monthly', label: 'Ежемесячно' },
];

export const rangeDataHoursSensors = [
  { value: '24_hours', label: '24 часа' },
  { value: '2_days', label: '2 дня' },
  { value: '7_days', label: '7 дней' },
  { value: '10_days', label: '10 дней' },
  { value: '14_days', label: '14 дней' },
  { value: '30_days', label: '30 дней' },
];

export const dateMomentTypeString = 'YYYY-MM-DD HH:mm:ss';
