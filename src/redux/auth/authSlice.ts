import { createSlice } from '@reduxjs/toolkit';

import { RootState } from 'redux/store';

interface AuthState {
  user: object | null;
  tokens: {
    access: string | null;
    refresh: string | null;
  };
  errors: string | null;
  commonError: string | null;
  success: boolean | null;
  loading: boolean | null;
}

const nameSpace = 'auth';

const INITIAL_STATE: AuthState = {
  user: null,
  tokens: {
    access: '',
    refresh: '',
  },
  errors: null,
  commonError: null,
  success: null,
  loading: false,
};

export const authSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {},
});

export const authSelector = (state: RootState) => state.auth;
export default authSlice.reducer;
