import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IErrors, ITokens, IUser, userMutation } from 'interfaces';
import { RootState } from 'redux/hooks';
import store from 'redux/store';
import { addCookies } from 'utils/addCookies/addCookies';
import { axiosApi } from 'utils/axios-api';

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
    is_manager: false,
  },
  errors: null,
  commonError: null,
  success: null,
  loading: false,
} as AuthState;

export const loginUser = createAsyncThunk<ITokens, userMutation>(
  `${nameSpace}/loginUser`,
  async (loginData, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post('/accounts/login/', loginData);
      addCookies('refresh', resp.data.refresh);
      localStorage.setItem(
        'users',
        JSON.stringify({
          access: resp.data.access,
          is_manager: resp.data.is_manager,
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
    const data = { refresh };
    const resp = await axiosApi.post('/accounts/refresh/', data);
    return resp.data;
  }
});

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
      state.tokens.access = payload.payload?.access;
      state.tokens.refresh = payload.payload?.refresh;
      state.tokens.is_manager = payload.payload?.is_manager;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.commonError = null;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.tokens = payload;
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
