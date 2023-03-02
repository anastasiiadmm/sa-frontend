import { configureStore } from '@reduxjs/toolkit';

import accountsReducer from 'redux/accounts/accountsSlice';
import authReducer from 'redux/auth/authSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
