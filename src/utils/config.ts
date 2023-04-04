const { REACT_APP_API_URL, REACT_APP_IMAGE_API } = process.env;

export const apiURL = REACT_APP_API_URL;

export const apiUrlCrop = REACT_APP_IMAGE_API;

export const defaultError = { detail: 'На сервере что-то пошло не так' };
