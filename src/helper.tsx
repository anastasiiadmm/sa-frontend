import { Locales, SensorDataEntry, stationInfo } from 'types/stationTypes';
import { companiesList, ErrorObject, ICompany, updateManagerDataMutation } from 'types/types';
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

export const isObjectChangeUserProfileValidate = (origin: ICompany, update: ICompany) => {
  const originJson = {
    user: {
      username: origin.user.username,
      password: origin.user.password,
      last_name: origin.user.last_name,
      first_name: origin.user.first_name,
      middle_name: origin.user.middle_name,
      email: origin.user.email,
      phone: origin.user.phone,
    },
    name: origin.name,
    location: origin.location,
    autopilots_amount: origin.autopilots_amount,
  };
  const updateJson = {
    user: {
      username: update.user.username,
      password: update.user.password,
      last_name: update.user.last_name,
      first_name: update.user.first_name,
      middle_name: update.user.middle_name,
      email: update.user.email,
      phone: update.user.phone,
    },
    name: update.name,
    location: update.location,
    autopilots_amount: update.autopilots_amount,
  };

  return (
    JSON.stringify(originJson).replace(/ /g, '') === JSON.stringify(updateJson).replace(/ /g, '')
  );
};

export const isObjectChangeUserConfirmationProfileValidate = (
  origin: companiesList,
  update: ICompany,
) => {
  const originJson = {
    user: {
      last_name: origin.user.last_name,
      first_name: origin.user.first_name,
      middle_name: origin.user.middle_name,
      email: origin.user.email,
      phone: origin.user.phone,
    },
    name: origin.name,
    location: origin.location,
    autopilots_amount: origin.autopilots_amount,
  };
  const updateJson = {
    user: {
      last_name: update.user.last_name,
      first_name: update.user.first_name,
      middle_name: update.user.middle_name,
      email: update.user.email,
      phone: update.user.phone,
    },
    name: update.name,
    location: update.location,
    autopilots_amount: update.autopilots_amount,
  };

  return (
    JSON.stringify(originJson).replace(/ /g, '') !== JSON.stringify(updateJson).replace(/ /g, '')
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

export const mergeAndRemoveDuplicateValues = (obj1: any, obj2: any) => {
  const result: Record<string, any> = {};

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
    } else if (
      Object.prototype.hasOwnProperty.call(obj1, key) &&
      Object.prototype.hasOwnProperty.call(obj2, key) &&
      obj1[key] !== obj2[key]
    ) {
      result[key] = obj2[key];
    }
  }

  for (const key in obj2) {
    if (
      Object.prototype.hasOwnProperty.call(obj2, key) &&
      !Object.prototype.hasOwnProperty.call(obj1, key)
    ) {
      result[key] = obj2[key];
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
