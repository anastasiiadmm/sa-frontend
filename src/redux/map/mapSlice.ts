import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IMapState, Vehicle, VehicleV2 } from 'interfaces';
import { RootState } from 'redux/hooks';
import { axiosApi, axiosApi2 } from 'utils/axios-api';

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
    results: {
      id: null,
      description: '',
      image: '',
      full_name: '',
      point_A_lat: 0,
      point_A_lon: 0,
      point_B_lat: 0,
      point_B_lon: 0,
      tool_width: '',
      task_UID: '',
    },
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
      const response = await axiosApi2.get(`/vehicles/${id}/routes/${field_name}`);
      return response.data;
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
    builder.addCase(tractorLocation.rejected, (state, { payload }) => {
      state.vehicle.loading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.vehicle.errors = {
          ...state.vehicle.errors,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });
    builder.addCase(obtainingCoordinate.pending, (state) => {
      state.field.loading = true;
      state.field.errors = null;
    });
    builder.addCase(obtainingCoordinate.fulfilled, (state, action: PayloadAction<VehicleV2>) => {
      state.field.loading = false;
      state.field.results = {
        ...state.field.results,
        ...action.payload,
      };
    });
    builder.addCase(obtainingCoordinate.rejected, (state, { payload }) => {
      state.field.loading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.field.errors = {
          ...state.field.errors,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });
  },
});

export const { clearField } = mapSlice.actions;

export const mapSelector = (state: RootState) => state.map;

export default mapSlice.reducer;
