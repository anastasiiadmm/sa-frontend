import React from 'react';

import AppRouter from 'AppRouter/AppRouter';
import { authSelector } from 'redux/auth/authSlice';
import { useAppSelector } from 'redux/hooks';

const App: React.FC = () => {
  const { success, user, tokens } = useAppSelector(authSelector);

  return (
    <>
      <AppRouter />
      {/*      {success && user && tokens ? (
        <AppRouter />
      ) : (
        <Routes>
          <Route path='/sign-up/' element={<Registration />} />
          {success && user && tokens ? null : <Route path='*' element={<SignIn />} />}
        </Routes>
      )}*/}
    </>
  );
};

export default App;
