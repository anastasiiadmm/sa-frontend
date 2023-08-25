import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { converterPagination, IConverter } from 'interfaces/IConverter';
import { IErrors } from 'interfaces/IErrors';
import { RootState } from 'redux/hooks';
import axiosApi from 'utils/axios-api';
import toQueryParams from 'utils/toQueryParams';

interface ConverterState {
  converterList: IConverter[] | null | undefined;
  converterListPagination: converterPagination | null;
  converterListLoading: boolean;
  converterListError: IErrors | null;
  deleteConverterLoading: boolean;
  deleteConverterError: IErrors | null;
  convertFileLoading: boolean;
  convertFileSuccess: boolean;
  convertFileError: IErrors | null;
}

const nameSpace = 'converter';

export const INITIAL_STATE = {
  converterList: null,
  converterListPagination: null,
  converterListLoading: false,
  converterListError: null,
  deleteConverterLoading: false,
  deleteConverterError: null,
  convertFileLoading: false,
  convertFileSuccess: false,
  convertFileError: null,
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

export const deleteConverter = createAsyncThunk(
  `${nameSpace}/deleteConverter`,
  async (id: number | null, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`/common/converter/${id}/`);
      return id;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const convertFile = createAsyncThunk<void, FormData>(
  `${nameSpace}/convertFile`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/common/converter/`, data);
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

const converterSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {
    clearConvertFileSuccess: (state) => {
      state.convertFileSuccess = false;
    },
  },
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
    builder.addCase(deleteConverter.fulfilled, (state, { payload }) => {
      state.deleteConverterLoading = false;
      state.converterList = state.converterList?.filter((item) => item.id !== Number(payload));
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

    builder.addCase(convertFile.pending, (state) => {
      state.convertFileLoading = true;
      state.convertFileSuccess = false;
      state.convertFileError = null;
    });
    builder.addCase(convertFile.fulfilled, (state) => {
      state.convertFileLoading = false;
      state.convertFileSuccess = true;
      state.convertFileError = null;
    });
    builder.addCase(convertFile.rejected, (state, { payload }) => {
      state.convertFileLoading = false;
      state.convertFileSuccess = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.convertFileError = {
          ...state.convertFileError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });
  },
});

export const { clearConvertFileSuccess } = converterSlice.actions;
export const converterSelector = (state: RootState) => state.converter;
export default converterSlice.reducer;
