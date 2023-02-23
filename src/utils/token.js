import { deleteCookie } from 'utils/addCookies/addCookies';

export const userLocalStorage = (refresh = '') => {
  try {
    const tokenLocal = JSON.parse(localStorage.getItem('users') || '');
    if (tokenLocal) {
      tokenLocal.token.refresh = refresh;
    }
    return tokenLocal;
  } catch (error) {
    logoutLocalStorage();
    return null;
  }
};
export const logoutLocalStorage = () => {
  deleteCookie('refresh');
  localStorage.setItem('users', JSON.stringify({ user: null, token: null }));
};
