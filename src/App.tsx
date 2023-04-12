import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router';
import { Routes } from 'react-router-dom';

import AppRouter from 'AppRouter/AppRouter';
import SignIn from 'containers/SignIn/SignIn';
import { IListener } from 'interfaces';
import { authSelector, checkForTokens, logoutUser } from 'redux/auth/authSlice';
import { useAppSelector } from 'redux/hooks';
import { getCookie } from 'utils/addCookies/addCookies';
import { logoutLocalStorage, userLocalStorage } from 'utils/token';

const App: React.FC = () => {
  const { success, user, tokens } = useAppSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const tokensLocal = userLocalStorage(getCookie('refresh'));
    if (tokensLocal) {
      dispatch(checkForTokens(tokensLocal));
    } else {
      logoutLocalStorage();
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, []);

  const listener = ({ key, newValue }: IListener) => {
    if (key === 'users') {
      if (newValue === '{"user":null,"token":null}' || newValue === null) {
        dispatch(logoutUser());
        logoutLocalStorage();
      } else {
        const tokensCopy = JSON.parse(newValue);
        tokensCopy.token.refresh = getCookie('refresh');
        dispatch(checkForTokens(tokensCopy));
      }
    }
  };

  return success && user && tokens ? (
    <AppRouter />
  ) : (
    <Routes>{success && user && tokens ? null : <Route path='*' element={<SignIn />} />}</Routes>
  );
};

export default App;
