import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from 'redux/hooks';
import { IManager } from 'types';
import axiosApi from 'utils/axios-api';
import { defaultError } from 'utils/config';

const nameSpace = 'accounts';

interface AccountsState {
  manager: IManager | null;
  fetchLoadingManager: boolean;
  fetchErrorManager: Object | null;
}

const INITIAL_STATE = {
  manager: null,
  fetchLoadingManager: false,
  fetchErrorManager: null,
} as AccountsState;

export const fetchManager = createAsyncThunk(
  'accounts/fetchManager',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<IManager | null>('/accounts/manager/');
      const manager = resp.data;
      if (manager === null) {
        throw new Error('Not Found!');
      }
      return manager;
    } catch (e) {
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
    }
  },
);

const accountsSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchManager.pending, (state) => {
      state.fetchErrorManager = null;
      state.fetchLoadingManager = true;
    });
    builder.addCase(fetchManager.fulfilled, (state, { payload: manager }) => {
      state.fetchErrorManager = null;
      state.fetchLoadingManager = false;
      state.manager = manager;
    });
    builder.addCase(fetchManager.rejected, (state, { payload }: any) => {
      state.fetchErrorManager = payload?.detail;
      state.fetchLoadingManager = false;
    });
  },
});

export const accountsSelector = (state: RootState) => state.accounts;
export default accountsSlice.reducer;
