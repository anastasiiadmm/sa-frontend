import React, { lazy, Suspense, useCallback, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Spinner from 'components/Spinner/Spinner';
import SignIn from 'containers/SignIn/SignIn';
import { useTokenConfigs } from 'hooks/useTokensConfigs';
import { IListener } from 'interfaces';
import { checkForTokens, clearTokens, logoutUser } from 'redux/auth/authSlice';
import { useAppDispatch } from 'redux/hooks';
import { deleteCookie, getCookie, nameRefreshCookies } from 'utils/addCookies/addCookies';
import {
  defaultLocalStorage,
  logoutLocalStorage,
  nameLocalStorage,
  userLocalStorage,
} from 'utils/addLocalStorage/addLocalStorage';

const AppRouter = lazy(() => import('AppRouter/AppRouter'));
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const tokenConfigs = useTokenConfigs();

  const initializeApp = useCallback(() => {
    const tokensLocal = userLocalStorage(getCookie(nameRefreshCookies));
    if (tokensLocal?.access && tokensLocal?.refresh) {
      dispatch(checkForTokens(tokensLocal));
    } else {
      deleteCookie(nameRefreshCookies);
      logoutLocalStorage();
      dispatch(clearTokens());
    }
  }, [dispatch]);

  const handleStorageEvent = useCallback(
    ({ key, newValue }: IListener) => {
      if (key === nameLocalStorage) {
        if (newValue === JSON.stringify(defaultLocalStorage) || newValue === null) {
          dispatch(logoutUser());
          logoutLocalStorage();
        } else {
          const tokensCopy = JSON.parse(newValue);
          tokensCopy.refresh = getCookie(nameRefreshCookies);
          dispatch(checkForTokens(tokensCopy));
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [handleStorageEvent]);

  return tokenConfigs ? (
    <Suspense fallback={<Spinner />}>
      <AppRouter />
    </Suspense>
  ) : (
    <Routes>
      <Route path='*' element={<SignIn />} />
    </Routes>
  );
};

export default App;
