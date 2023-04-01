import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { message } from 'antd';

import { IMapState, resultsAB, Vehicle } from 'interfaces';
import { RootState } from 'redux/hooks';
import axiosApi from 'utils/axios-api';

const nameSpace = 'map';

const initialState = {
  vehicle: {
    loading: false,
    errors: null,
    results: null,
  },
  field: {
    loading: false,
    errors: null,
    results: [],
  },
} as IMapState;

export const mapVehicleFetch = createAsyncThunk(
  `${nameSpace}/mapVehicleFetch`,
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(`/accounts/user/vehicle/${id}/`);
      return response.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const dataExchangeFetchFetch = createAsyncThunk(
  `${nameSpace}/dataExchangeFetchFetch`,
  async (
    {
      id,
      field_name,
    }: {
      id: number;
      field_name: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosApi.get(`data_exchange/route/${id}/?field_name=${field_name}`);
      if (response.data.length) {
        return response.data;
      }
      message.error('Кординаты для маршрута не найдено');
      return [];
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.data?.status,
      });
    }
  },
);

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(mapVehicleFetch.pending, (state) => {
      state.vehicle.loading = true;
      state.vehicle.errors = null;
    });
    builder.addCase(mapVehicleFetch.fulfilled, (state, action: PayloadAction<Vehicle>) => {
      state.vehicle.loading = false;
      state.vehicle.results = action.payload;
    });
    builder.addCase(mapVehicleFetch.rejected, (state, action: PayloadAction<any>) => {
      state.vehicle.loading = false;
      state.vehicle.errors = action.payload;
    });
    builder.addCase(dataExchangeFetchFetch.pending, (state) => {
      state.field.loading = true;
      state.field.errors = null;
    });
    builder.addCase(
      dataExchangeFetchFetch.fulfilled,
      (state, action: PayloadAction<resultsAB[]>) => {
        state.field.loading = false;
        state.field.results = action.payload;
      },
    );
    builder.addCase(dataExchangeFetchFetch.rejected, (state, action: PayloadAction<any>) => {
      state.field.loading = false;
      state.field.errors = action.payload;
    });
  },
});

export const mapSelector = (state: RootState) => state.map;

export default mapSlice.reducer;
