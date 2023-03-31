const { REACT_APP_API_URL } = process.env;

export const apiURL = REACT_APP_API_URL;

export const apiUrlCrop = 'https://agri.ltestl.com';

export const defaultError = { detail: 'На сервере что-то пошло не так' };

export function flattenCoordinates(coordinates: number[][][]): number[] {
  return coordinates.reduce((acc, val) => acc.concat(val), []).flat();
}
