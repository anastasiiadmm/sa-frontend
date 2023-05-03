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

export const envs = {
  local: 'local',
  development: 'development',
  staging: 'staging',
  production: 'production',
};

export const apiPath = '/api/v1';
export const apiPathV2 = '/api/v2';

export const domains = {
  [envs.local]: 'localhost',
  [envs.development]: 'agri.ltestl.com',
  [envs.staging]: '',
  [envs.production]: '',
};
export const serverUrls = {
  [envs.local]: `https://${domains[envs.local]}:8000`,
  [envs.development]: `https://${domains[envs.development]}`,
  [envs.staging]: `https://${domains[envs.staging]}`,
  [envs.production]: `https://${domains[envs.production]}`,
};

export const apiUrls = {
  [envs.local]: `${serverUrls[envs.local]}${apiPath}`,
  [envs.development]: `${serverUrls[envs.development]}${apiPath}`,
  [envs.staging]: `${serverUrls[envs.staging]}${apiPath}`,
  [envs.production]: `${serverUrls[envs.production]}${apiPath}`,
};

export const apiUrlsV2 = {
  [envs.local]: `${serverUrls[envs.local]}${apiPathV2}`,
  [envs.development]: `${serverUrls[envs.development]}${apiPathV2}`,
  [envs.staging]: `${serverUrls[envs.staging]}${apiPathV2}`,
  [envs.production]: `${serverUrls[envs.production]}${apiPathV2}`,
};
