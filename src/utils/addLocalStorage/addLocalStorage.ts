import { IJWTokens } from 'interfaces/IJWTokens';
import { deleteCookie, nameRefreshCookies } from 'utils/addCookies/addCookies';

export const nameLocalStorage = 'infoLocalStorage';
export const defaultLocalStorage = { user: null, token: null };
export const userLocalStorage = (refresh = '') => {
  try {
    const tokenLocal = JSON.parse(localStorage.getItem(nameLocalStorage) || '');
    if (tokenLocal) {
      tokenLocal.refresh = refresh;
    }
    return tokenLocal;
  } catch (error) {
    logoutLocalStorage();
    return null;
  }
};

export const logoutLocalStorage = () => {
  deleteCookie(nameRefreshCookies);
  localStorage.setItem(nameLocalStorage, JSON.stringify(defaultLocalStorage));
};

export const addLocalStorage = (login: IJWTokens) => {
  localStorage.setItem(nameLocalStorage, JSON.stringify(login));
};
