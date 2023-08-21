import { configureStore } from '@reduxjs/toolkit';

import accountsReducer from 'redux/accounts/accountsSlice';
import authReducer from 'redux/auth/authSlice';
import companiesReducer from 'redux/companies/companiesSlice';
import converterReducer from 'redux/converter/converterSlice';
import mapReducer from 'redux/map/mapSlice';
import stationsReducer from 'redux/stations/stationsSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    companies: companiesReducer,
    stations: stationsReducer,
    map: mapReducer,
    converter: converterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
