import React, { useEffect } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router-dom';

import AppRouter from 'AppRouter/AppRouter';
import SignIn from 'containers/SignIn/SignIn';
import { useTokenConfigs } from 'hooks/useTokensConfigs';
import { IListener } from 'interfaces';
import { checkForTokens, clearTokens, logoutUser } from 'redux/auth/authSlice';
import { useAppDispatch } from 'redux/hooks';
import { deleteCookie, getCookie, nameRefreshCookies } from 'utils/addCookies/addCookies';
import {
  logoutLocalStorage,
  nameLocalStorage,
  userLocalStorage,
} from 'utils/addLocalStorage/addLocalStorage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const tokenConfigs = useTokenConfigs();

  useEffect(() => {
    const tokensLocal = userLocalStorage(getCookie(nameRefreshCookies));
    if (tokensLocal?.access && tokensLocal?.refresh) {
      dispatch(checkForTokens(tokensLocal));
    } else {
      deleteCookie(nameRefreshCookies);
      logoutLocalStorage();
      dispatch(clearTokens());
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, []);

  const listener = ({ key, newValue }: IListener) => {
    if (key === nameLocalStorage) {
      if (newValue === '{"user":null,"token":null}' || newValue === null) {
        dispatch(logoutUser());
        logoutLocalStorage();
      } else {
        const tokensCopy = JSON.parse(newValue);
        tokensCopy.refresh = getCookie(nameRefreshCookies);
        dispatch(checkForTokens(tokensCopy));
      }
    }
  };
  return tokenConfigs ? (
    <AppRouter />
  ) : (
    <Routes>{tokenConfigs ? null : <Route path='*' element={<SignIn />} />}</Routes>
  );
};

export default App;
