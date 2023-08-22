import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { converterPagination, IConverter } from 'interfaces/IConverter';
import { IErrors } from 'interfaces/IErrors';
import { RootState } from 'redux/hooks';
import axiosApi from 'utils/axios-api';
import toQueryParams from 'utils/toQueryParams';

interface ConverterState {
  converterList: IConverter[] | null;
  converterListPagination: converterPagination | null;
  converterListLoading: boolean;
  converterListError: IErrors | null;
  deleteConverterLoading: boolean;
  deleteConverterError: IErrors | null;
}

const nameSpace = 'converter';

const INITIAL_STATE = {
  converterList: null,
  converterListPagination: null,
  converterListLoading: false,
  converterListError: null,
  deleteConverterLoading: false,
  deleteConverterError: null,
} as ConverterState;

interface fetchConverterParams {
  data?: {
    query?: {
      page?: number | undefined;
    };
  };
}

export const fetchConverterList = createAsyncThunk<converterPagination, fetchConverterParams>(
  `${nameSpace}/fetchConverterList`,
  async ({ data }, { rejectWithValue }) => {
    try {
      let query = '';
      if (data?.query) {
        query = toQueryParams(data.query);
      }

      const resp = await axiosApi.get<converterPagination | null>(`/common/converter/${query}`);
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

interface deleteConverterParams {
  id: number | null;
}

export const deleteConverter = createAsyncThunk<void, deleteConverterParams>(
  `${nameSpace}/deleteConverter`,
  async ({ id }, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.delete(`/common/converter/${id}/`);

      return resp.data;
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

    builder.addCase(deleteConverter.pending, (state) => {
      state.deleteConverterLoading = true;
      state.deleteConverterError = null;
    });
    builder.addCase(deleteConverter.fulfilled, (state) => {
      state.deleteConverterLoading = false;
    });
    builder.addCase(deleteConverter.rejected, (state, { payload }) => {
      state.deleteConverterLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.deleteConverterError = {
          ...state.deleteConverterError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });
  },
});

export const converterSelector = (state: RootState) => state.converter;
export default converterSlice.reducer;
