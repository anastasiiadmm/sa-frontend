import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router';
import { Routes } from 'react-router-dom';

import AppRouter from 'AppRouter/AppRouter';
import SignIn from 'containers/SignIn/SignIn';
import { IListener } from 'interfaces';
import { authSelector, checkForTokens, logoutUser } from 'redux/auth/authSlice';
import { useAppSelector } from 'redux/hooks';
import { getCookie, nameRefreshCookies } from 'utils/addCookies/addCookies';
import { logoutLocalStorage, nameLocalStorage, userLocalStorage } from 'utils/token';

const App: React.FC = () => {
  const { tokens } = useAppSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const tokensLocal = userLocalStorage(getCookie(nameRefreshCookies));
    if (tokensLocal) {
      dispatch(checkForTokens(tokensLocal));
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
  return tokens?.access ? (
    <AppRouter />
  ) : (
    <Routes>{tokens?.access ? null : <Route path='*' element={<SignIn />} />}</Routes>
  );
};

export default App;
