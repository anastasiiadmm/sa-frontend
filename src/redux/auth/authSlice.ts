import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IErrors } from 'interfaces';
import { RootState } from 'redux/hooks';
import store from 'redux/store';
import { ITokens, IUser, LoginMutation, loginResponse } from 'types/types';
import { addCookies } from 'utils/addCookies/addCookies';
import axiosApi from 'utils/axios-api';

interface AuthState {
  user: IUser | null;
  tokens: ITokens;
  errors: Object | null;
  commonError: IErrors | null;
  success: boolean | null;
  loading: boolean;
}

const nameSpace = 'auth';

const INITIAL_STATE = {
  user: null,
  tokens: {
    access: '',
    refresh: '',
  },
  errors: null,
  commonError: null,
  success: null,
  loading: false,
} as AuthState;

export const loginUser = createAsyncThunk<loginResponse, LoginMutation>(
  `${nameSpace}/loginUser`,
  async (loginData, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post<loginResponse>('/accounts/login/', loginData);
      addCookies('refresh', resp.data.tokens.refresh);
      localStorage.setItem(
        'users',
        JSON.stringify({
          user: resp.data.user,
          token: {
            access: resp.data.tokens.access,
          },
        }),
      );
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const refreshToken = createAsyncThunk(`${nameSpace}/refreshToken`, async () => {
  const refresh = store.getState()?.auth?.tokens?.refresh;
  if (refresh) {
    const asd = { refresh };
    const resp = await axiosApi.post('/accounts/refresh/', asd);
    return resp.data;
  }
});

export const resetUserPasswordSendEmail = createAsyncThunk<void, Object>(
  `${nameSpace}/resetUserPasswordSendEmail`,
  async (data, { rejectWithValue }) => {
    try {
      await axiosApi.post('/accounts/password-reset/', data);
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const authSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.success = false;
      state.errors = null;
    },
    logoutUser: () => INITIAL_STATE,
    refreshAccessToken: (state, { payload }) => {
      state.tokens = { ...state.tokens, ...payload };
    },
    checkForTokens: (state, payload) => {
      state.user = payload.payload?.user;
      state.tokens.access = payload.payload?.token?.access;
      state.tokens.refresh = payload.payload?.token?.refresh;
      state.success = true;
    },
  },
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
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.commonError = {
          ...state.commonError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
      state.errors = payload;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.commonError = null;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.tokens = payload.tokens;
      state.loading = false;
      state.success = true;
      state.errors = null;
      state.commonError = null;
    });
    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.commonError = {
          ...state.commonError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(refreshToken.fulfilled, (state, { payload }) => {
      state.tokens = { ...state.tokens, ...payload };
    });
  },
});

export const { logoutUser, checkForTokens } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export default authSlice.reducer;
