import React from 'react';
import { Route, Routes } from 'react-router';

import AppRouter from 'AppRouter/AppRouter';
import SignIn from 'containers/SignIn/SignIn';
import { authSelector } from 'redux/auth/authSlice';
import { useAppSelector } from 'redux/hooks';

const App: React.FC = () => {
  const { success, user, tokens } = useAppSelector(authSelector);

  return (
    <div>
      {success && user && tokens ? (
        <AppRouter />
      ) : (
        <Routes>
          {success && user && tokens ? null : <Route path='*' element={<SignIn />} />}
        </Routes>
      )}
    </div>
  );
};

export default App;
