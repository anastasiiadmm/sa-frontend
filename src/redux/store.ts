import { configureStore } from '@reduxjs/toolkit';

import authReducer from 'redux/auth/authSlice';

const configureStoreCreator = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export default configureStoreCreator;
