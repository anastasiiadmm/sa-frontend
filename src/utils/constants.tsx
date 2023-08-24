import React from 'react';

import activeNotification from 'assets/images/icons/active-notification.svg';
import activePhone from 'assets/images/icons/active-phone.svg';
import activeUsers from 'assets/images/icons/active-users.svg';
import add from 'assets/images/icons/add_icon.svg';
import deleteIcon from 'assets/images/icons/delete-round.svg';
import lockIcon from 'assets/images/icons/lock-round.svg';
import phone from 'assets/images/icons/mobile-phone.svg';
import notification from 'assets/images/icons/notification.svg';
import pen from 'assets/images/icons/pen-green.svg';
import tractorActive from 'assets/images/icons/tracktor-active-menu.svg';
import tractorGreen from 'assets/images/icons/tractor-green.svg';
import tractorMenu from 'assets/images/icons/tractor-menu.svg';
import users from 'assets/images/icons/users.svg';

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
export const dateMomentTypeDash = 'DD.MM.YYYY';

export const envs = {
  local: 'local',
  development: 'development',
  staging: 'staging',
  production: 'production',
};

export const apiPath = '/api/v2';

export const domains = {
  [envs.local]: 'localhost',
  [envs.development]: 'agri.ltestl.com',
  [envs.staging]: 'stage-agri.ltestl.com',
  [envs.production]: '',
};

export const serverUrlsSocket = {
  [envs.local]: `wss://${domains[envs.local]}/ws`,
  [envs.development]: `wss://${domains[envs.development]}/ws`,
  [envs.staging]: `wss://${domains[envs.staging]}/ws`,
  [envs.production]: `wss://${domains[envs.production]}/ws`,
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

export const routesTitles: { [key: string]: string } = {
  '/user-profile/': 'Данные о клиенте',
  '/add-new-user': 'Добавить нового пользователя',
  '/manager-profile': 'Профиль',
  '/user-profile-view': 'Профиль',
  '/profile-technique/': 'Техника пользователя',
  '/edit-user/': 'Редактирование профиля пользователя',
  '/user-technique/': 'Техника пользователя',
  '/converter': 'Конвертер',
  '/files': 'Мои файлы',
  '/field-climate': 'Метеосервис',
};

export const buttonsMenu = [
  { key: '1', image: tractorGreen, text: 'Техника пользователя', action: 'user-technique' },
  { key: '2', image: pen, text: 'Редактировать пользователя', action: 'edit-user' },
  { key: '3', image: deleteIcon, text: 'Удалить пользователя', action: 'showDeleteModal' },
  { key: '4', image: lockIcon, text: 'Сгенерировать пароль', action: 'generatePassword' },
];

export const buttonsDataManager = [
  {
    key: '/',
    text: 'Клиенты',
    icon: <img src={users} alt='users' />,
    activeIcon: <img src={activeUsers} alt='users' />,
  },
  {
    key: '/user-requests',
    text: 'Запросы',
    icon: <img src={notification} alt='notification' />,
    activeIcon: <img src={activeNotification} alt='notification' />,
  },
  {
    key: '/add-new-user',
    text: 'Добавить клиента',
    icon: <img src={add} alt='add' />,
    activeIcon: <img src={add} alt='add' />,
  },
  {
    key: '/apks',
    text: 'Приложение',
    icon: <img src={phone} alt='phone' />,
    activeIcon: <img src={activePhone} alt='activePhone' />,
  },
];

export const buttonsDataUser = [
  {
    key: '/',
    text: 'Техника',
    icon: <img src={tractorMenu} alt='tractorMenu' />,
    activeIcon: <img src={tractorActive} alt='tractorActive' />,
  },
];
