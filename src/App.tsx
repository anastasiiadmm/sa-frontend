import React, { lazy, Suspense, useCallback, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Spinner from 'components/Spinner/Spinner';
import SignIn from 'containers/SignIn/SignIn';
import { useTokenConfigs } from 'hooks/useTokensConfigs';
import { IListener } from 'interfaces';
import { checkForTokens, clearTokens, logoutUser } from 'redux/auth/authSlice';
import { useAppDispatch } from 'redux/hooks';
import { defaultLocalStorage, logoutLocalStorage } from 'utils/addLocalStorage/addLocalStorage';
import { tokensLocalStorage } from 'utils/config';
import { getUserLocalStorage } from 'utils/storage';

const AppRouter = lazy(() => import('AppRouter/AppRouter'));
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const tokenConfigs = useTokenConfigs();

  const initializeApp = useCallback(() => {
    const tokensLocal = getUserLocalStorage();
    if (tokensLocal?.access && tokensLocal?.refresh) {
      dispatch(checkForTokens(tokensLocal));
    } else {
      logoutLocalStorage();
      dispatch(clearTokens());
    }
  }, [dispatch]);

  const handleStorageEvent = useCallback(
    ({ key, newValue }: IListener) => {
      if (key === tokensLocalStorage && newValue === JSON.stringify(defaultLocalStorage)) {
        dispatch(logoutUser());
        logoutLocalStorage();
      } else {
        dispatch(checkForTokens(JSON.parse(newValue || '')));
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
