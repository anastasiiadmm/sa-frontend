import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { converterPagination, IConverter, IErrors } from 'interfaces';
import { RootState } from 'redux/hooks';
import axiosApi from 'utils/axios-api';

interface ConverterState {
  converterList: IConverter[] | null;
  converterListPagination: converterPagination | null;
  converterListLoading: boolean;
  converterListError: IErrors | null;
}

const nameSpace = 'converter';

const INITIAL_STATE = {
  converterList: null,
  converterListPagination: null,
  converterListLoading: false,
  converterListError: null,
} as ConverterState;

export const fetchConverterList = createAsyncThunk<converterPagination, void>(
  'accounts/fetchUsersList',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<converterPagination | null>(`/common/converter/`);
      const converterList = resp.data;

      if (converterList === null) {
        throw new Error('Not Found!');
      }

      return converterList;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

const converterSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConverterList.pending, (state) => {
      state.converterListLoading = true;
      state.converterListError = null;
    });
    builder.addCase(fetchConverterList.fulfilled, (state, { payload }: any) => {
      state.converterListLoading = false;
      state.converterListError = null;
      state.converterList = payload.results;
      state.converterListPagination = {
        ...state.converterListPagination,
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
      };
    });
    builder.addCase(fetchConverterList.rejected, (state, { payload }) => {
      state.converterListLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.converterListError = {
          ...state.converterListError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });
  },
});

export const converterSelector = (state: RootState) => state.converter;
export default converterSlice.reducer;
