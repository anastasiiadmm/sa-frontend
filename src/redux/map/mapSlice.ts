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

export const tractorLocation = createAsyncThunk(
  `${nameSpace}/tractorLocation`,
  async (link: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(link);
      return response.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const obtainingCoordinate = createAsyncThunk(
  `${nameSpace}/obtainingCoordinate`,
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
      message.error('Координаты для маршрута не найдены');
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
  reducers: {
    clearField: (state) => {
      state.field = initialState.field;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(tractorLocation.pending, (state) => {
      state.vehicle.loading = true;
      state.vehicle.errors = null;
    });
    builder.addCase(tractorLocation.fulfilled, (state, action: PayloadAction<Vehicle>) => {
      state.vehicle.loading = false;
      state.vehicle.results = action.payload;
    });
    builder.addCase(tractorLocation.rejected, (state, action: PayloadAction<any>) => {
      state.vehicle.loading = false;
      state.vehicle.errors = action.payload;
    });
    builder.addCase(obtainingCoordinate.pending, (state) => {
      state.field.loading = true;
      state.field.errors = null;
    });
    builder.addCase(obtainingCoordinate.fulfilled, (state, action: PayloadAction<resultsAB[]>) => {
      state.field.loading = false;
      state.field.results = action.payload;
    });
    builder.addCase(obtainingCoordinate.rejected, (state, action: PayloadAction<any>) => {
      state.field.loading = false;
      state.field.errors = action.payload;
    });
  },
});

export const { clearField } = mapSlice.actions;

export const mapSelector = (state: RootState) => state.map;

export default mapSlice.reducer;
