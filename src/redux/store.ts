import { configureStore } from '@reduxjs/toolkit';

import accountsReducer from 'redux/accounts/accountsSlice';
import authReducer from 'redux/auth/authSlice';
import companiesReducer from 'redux/companies/companiesSlice';
import stationsReducer from 'redux/stations/stationsSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    companies: companiesReducer,
    stations: stationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
