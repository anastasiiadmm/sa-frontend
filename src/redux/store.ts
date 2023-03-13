import { configureStore } from '@reduxjs/toolkit';

import accountsReducer from 'redux/accounts/accountsSlice';
import authReducer from 'redux/auth/authSlice';
import companiesReducer from 'redux/companies/companiesSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    companies: companiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
