import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';

import AppRouter from 'AppRouter/AppRouter';
import Registration from 'containers/Registration/Registration';
import SignIn from 'containers/SignIn/SignIn';
import { authSelector } from 'redux/auth/authSlice';

const App: React.FC = () => {
  const { success, user, tokens } = useSelector(authSelector);

  return (
    <div>
      {success && user && tokens ? (
        <AppRouter />
      ) : (
        <Routes>
          <Route path='/sign-up/' element={<Registration />} />
          {success && user && tokens ? null : <Route path='*' element={<SignIn />} />}
        </Routes>
      )}
    </div>
  );
};

export default App;
