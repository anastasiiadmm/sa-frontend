import axios from 'axios';

import { checkForTokens, logoutUser } from 'redux/auth/authSlice';
import { apiURL } from 'utils/config';
import { logoutLocalStorage } from 'utils/token';
import store from 'redux/store';

const axiosApi = axios.create({
  baseURL: apiURL,
});

axiosApi.interceptors.request.use(async (config) => {
  const key = store.getState()?.auth?.tokens?.access;

  if (key) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    } as any;
  }
  return config;
});

axiosApi.interceptors.response.use(
  async (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    const statusCode = error?.response?.status;
    const index = store;
    const { tokens } = index.getState().auth;
    if (
      tokens &&
      statusCode === 401 &&
      error.config &&
      !error.config._isReady &&
      error.response.data.messages
    ) {
      originalRequest._isReady = true;
      try {
        const resp = await axiosApi.post('/accounts/refresh/', { refresh: tokens.refresh });
        if (resp.status === 200) {
          const newTokens = resp.data;
          axiosApi.defaults.headers.Authorization = `Bearer ${newTokens.access}`;
          const usersLocal = {
            user: index.getState()?.auth?.user,
            token: {
              access: resp.data.access,
              refresh: tokens.refresh,
            },
          };
          index.dispatch(checkForTokens(usersLocal));
          const obj: any = usersLocal;
          delete obj.token.refresh;
          localStorage.setItem('users', JSON.stringify(obj));
          window.dispatchEvent(new Event('storage'));
          return axiosApi(originalRequest);
        }
      } catch (e) {
        logoutLocalStorage();
        window.location.reload();
      }

      store.dispatch(logoutUser());
    }

    return Promise.reject(error);
  },
);

export default axiosApi;
