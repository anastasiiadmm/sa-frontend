import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from 'redux/store';
import axiosApi from 'utils/axios-api';
import { defaultError } from 'utils/config';

interface AuthState {
  user: object | null;
  tokens: {
    access: string | null;
    refresh: string | null;
  };
  errors: null | Object;
  commonError: Object;
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
  commonError: {},
  success: null,
  loading: false,
};

export const resetUserPasswordSendEmail = createAsyncThunk<void, Object>(
  `${nameSpace}/resetUserPasswordSendEmail`,
  async (data, { rejectWithValue }) => {
    try {
      await axiosApi.post('/accounts/password-reset/', data);
    } catch (e: any) {
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
    }
  },
);

export const authSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserPasswordSendEmail.pending, (state) => {
      state.loading = true;
      state.success = false;
    });
    builder.addCase(resetUserPasswordSendEmail.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(resetUserPasswordSendEmail.rejected, (state, payload) => {
      state.loading = false;
      state.success = false;
      state.commonError = payload;
      state.errors = payload;
    });
  },
});

export const authSelector = (state: RootState) => state.auth;
export default authSlice.reducer;
