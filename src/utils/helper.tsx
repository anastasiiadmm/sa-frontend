import { message } from 'antd';
import React from 'react';

import activeNotification from 'assets/images/icons/active-notification.svg';
import activePhone from 'assets/images/icons/active-phone.svg';
import activeUsers from 'assets/images/icons/active-users.svg';
import add from 'assets/images/icons/add_icon.svg';
import phone from 'assets/images/icons/mobile-phone.svg';
import notification from 'assets/images/icons/notification.svg';
import users from 'assets/images/icons/users.svg';
import { ErrorObject, updateManagerDataMutation } from 'interfaces';
import { Locales, SensorDataEntry, stationInfo } from 'interfaces/IStation';
import { apiUrlCrop } from 'utils/config';
import { dateMomentTypeString } from 'utils/constants';

const moment = require('moment');

type IndexableObject = {
  [key: string]: unknown;
};

export const removeEmptyValuesFromObject = (
  obj: IndexableObject | null | unknown | undefined | any,
) => {
  const newObj: IndexableObject | unknown | undefined | any = {};
  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      const value = obj[i];
      if (typeof value === 'object') {
        newObj[i] = removeEmptyValuesFromObject(value);
      } else if (value !== '' && value !== undefined && value !== null) {
        newObj[i] = value;
      }
    }
  }
  return newObj;
};

export const isObjectChangeValidate = (
  origin: updateManagerDataMutation,
  update: updateManagerDataMutation,
) => {
  const originJson = {
    username: origin.username,
    password: origin.password,
    first_name: origin.first_name,
    middle_name: origin.middle_name,
    last_name: origin.last_name,
    email: origin.email,
    phone: origin.phone,
  };
  const updateJson = {
    username: update.username,
    password: update.password,
    first_name: update.first_name,
    middle_name: update.middle_name,
    last_name: update.last_name,
    email: update.email,
    phone: update.phone,
  };
  return (
    JSON.stringify(originJson).replace(/ /g, '') === JSON.stringify(updateJson).replace(/ /g, '')
  );
};

export const getErrorMessage = (errors: ErrorObject, key: string): string => {
  const errorKey = key in errors ? key : Object.keys(errors)[0];
  const errorValue = errors[errorKey];

  if (typeof errorValue === 'string') {
    return errorValue;
  }

  if (Array.isArray(errorValue)) {
    const firstError = errorValue[0];
    return typeof firstError === 'string' ? firstError : '';
  }

  if (typeof errorValue === 'object') {
    return getErrorMessage(errorValue, Object.keys(errorValue)[0]);
  }

  return '';
};

export const mergeAndRemoveDuplicateValues = (obj1: any, obj2?: any) => {
  const result: Record<string, any> = {};
  const modifiedKeys: Set<string> = new Set();

  for (const key in obj1) {
    if (
      Object.prototype.hasOwnProperty.call(obj1, key) &&
      !Object.prototype.hasOwnProperty.call(obj2, key)
    ) {
      result[key] = obj1[key];
    } else if (
      Object.prototype.hasOwnProperty.call(obj1, key) &&
      Object.prototype.hasOwnProperty.call(obj2, key) &&
      typeof obj1[key] === 'object' &&
      typeof obj2[key] === 'object'
    ) {
      result[key] = mergeAndRemoveDuplicateValues(obj1[key], obj2[key]);

      if (Object.keys(result[key]).length > 0) {
        modifiedKeys.add(key);
      }
    } else if (
      Object.prototype.hasOwnProperty.call(obj1, key) &&
      Object.prototype.hasOwnProperty.call(obj2, key) &&
      obj1[key] !== obj2[key]
    ) {
      result[key] = obj2[key];
      modifiedKeys.add(key);
    }
  }

  for (const key in obj2) {
    if (
      Object.prototype.hasOwnProperty.call(obj2, key) &&
      !Object.prototype.hasOwnProperty.call(obj1, key)
    ) {
      result[key] = obj2[key];
      modifiedKeys.add(key);
    }
  }

  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key) && !modifiedKeys.has(key)) {
      delete result[key];
    }
  }

  return result;
};

export const lastCommunication = (lastComm: string) => {
  const aWeekAgo = moment().subtract(7, 'days');
  const lastCommMoment = moment(lastComm, dateMomentTypeString);
  return lastCommMoment.isAfter(aWeekAgo);
};

export const checkTooltipVisibility = (selectedOption: string, marker: any): boolean => {
  if (marker.meta === null) {
    return false;
  }
  switch (selectedOption) {
    case 'airTemp':
      return marker?.meta && Object.prototype.hasOwnProperty.call(marker.meta, 'airTemp');
    case 'soilTemp':
      return marker?.meta && Object.prototype.hasOwnProperty.call(marker.meta, 'soilTemp');
    case 'rh':
      return marker?.meta && Object.prototype.hasOwnProperty.call(marker.meta, 'rh');
    case 'rain24h':
      return marker?.meta && Object.prototype.hasOwnProperty.call(marker.meta, 'rain24h');
    case 'rain48h':
      return marker?.meta && Object.prototype.hasOwnProperty.call(marker.meta, 'rain48h');
    case 'rain7d':
      return marker?.meta && Object.prototype.hasOwnProperty.call(marker.meta, 'rain7d');
    case 'battery':
      return marker?.meta && Object.prototype.hasOwnProperty.call(marker.meta, 'battery');
    default:
      return false;
  }
};

export const calculateDateRange = (value: string, sensorData: stationInfo | null) => {
  const maxDate = moment(sensorData?.dates?.max_date);
  let fromDate;
  let toDate;

  switch (value) {
    case '24_hours':
      fromDate = maxDate.clone().subtract(24, 'hours').valueOf();
      toDate = maxDate.valueOf();
      break;
    case '2_days':
      fromDate = maxDate.clone().subtract(2, 'days').valueOf();
      toDate = maxDate.valueOf();
      break;
    case '7_days':
      fromDate = maxDate.clone().subtract(7, 'days').valueOf();
      toDate = maxDate.valueOf();
      break;
    case '10_days':
      fromDate = maxDate.clone().subtract(10, 'days').valueOf();
      toDate = maxDate.valueOf();
      break;
    case '14_days':
      fromDate = maxDate.clone().subtract(14, 'days').valueOf();
      toDate = maxDate.valueOf();
      break;
    case '30_days':
      fromDate = maxDate.clone().subtract(30, 'days').valueOf();
      toDate = maxDate.valueOf();
      break;
    default:
      fromDate = null;
      toDate = null;
  }

  return { fromDate, toDate };
};

export function getPageNumber(url: string | undefined | null): string | number {
  if (url) {
    const regex = /page=(\d+)/;
    const match = url.match(regex);
    return Number(match ? match[1] : 1) - 1;
  }

  return 1;
}

export function getPageNumberPrevious(url: string | undefined | null): string | number {
  if (url) {
    const regex = /page=(\d+)/;
    const match = url.match(regex);
    return Number(match ? match[1] : 1) + 1;
  }

  return 1;
}

export const unixTimestamp = moment().unix();

export const updateDataNames = (data: SensorDataEntry[], jsonData: Locales) => {
  return data?.map((obj) => {
    if (jsonData[obj.name]) {
      return { ...obj, name: jsonData[obj.name] };
    }
    return obj;
  });
};

export function getPageParam(url: string | undefined | null): string | null {
  if (url) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const page = urlParams.get('page');

    return page;
  }

  return '';
}

export const isEmptyObject = (data: any) => {
  return Object.keys(data).length === 0;
};

export const appendDataFields = (formData: FormData, data: Record<string, any>, prefix = '') => {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      const fieldName = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object') {
        appendDataFields(formData, value, fieldName);
      } else {
        formData.append(fieldName, value);
      }
    }
  }
};

export const appendDataFieldsAndDeleteEmptyKeys = (
  formData: FormData,
  data: Record<string, any>,
  prefix = '',
) => {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      const fieldName = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object') {
        if (Object.keys(value).length > 0) {
          appendDataFieldsAndDeleteEmptyKeys(formData, value, fieldName);
        }
      } else if (value !== null && value !== undefined && value !== '') {
        formData.append(fieldName, value);
      } else {
        formData.delete(fieldName);
      }
    }
  }
};

export const buttonsData = [
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

export const downloadApkFileHandler = async (
  file: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);

    const link = document.createElement('a');
    link.href = `${apiUrlCrop}${file}`;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsLoading(false);
  } catch (error) {
    await message.error(error?.detail);
    setIsLoading(false);
  }
};
