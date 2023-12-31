import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

import { IErrors, ITokens, IUser, userMutation } from 'interfaces';
import { RootState } from 'redux/hooks';
import { addLocalStorage } from 'utils/addLocalStorage/addLocalStorage';
import axiosApi from 'utils/axios-api';
import { apiURL } from 'utils/config';
import { getUserLocalStorage } from 'utils/storage';

interface AuthState {
  user: IUser | null;
  tokens: ITokens;
  errors: Object | null;
  commonError: IErrors | null;
  success: boolean | null;
  loading: boolean;
}

const nameSpace = 'auth';

export const INITIAL_STATE = {
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
      const resp = await axios.post(`${apiURL}/accounts/login/`, loginData);
      addLocalStorage({
        access: resp.data.access,
        refresh: resp.data.refresh,
        is_manager: resp.data.is_manager,
      });
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
  const tokens = getUserLocalStorage();

  if (tokens?.refresh) {
    const resp = await axiosApi.post('/token/refresh/', tokens.refresh);
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
    checkForTokens: (state, { payload }) => {
      state.tokens = {
        ...state.tokens,
        ...payload,
      };
    },
    clearTokens: (state) => {
      state.tokens = INITIAL_STATE.tokens;
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

export const { logoutUser, checkForTokens, clearTokens } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export default authSlice.reducer;
