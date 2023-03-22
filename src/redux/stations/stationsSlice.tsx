import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { APIError, APIResponse, StationState } from 'types/stationTypes';

const API_BASE_URL = 'https://api.fieldclimate.com/v2';
const API_PUBLIC_KEY = 'f729364b9d924fc8a4bb702085920b416a472e89d8e28dbb';
const API_PRIVATE_KEY = '87a853f12aa5344d768f0ecb5d79bdf49372e28bd218f2a3';

const signContent = (method: string, request: string, timestamp: string) => {
  const contentToSign = method + request + timestamp + API_PUBLIC_KEY;
  return CryptoJS.HmacSHA256(contentToSign, API_PRIVATE_KEY);
};

const getAuthorizationHeader = (method: string, request: string) => {
  const timestamp = new Date().toUTCString();
  const signature = signContent(method, request, timestamp);
  const hmacStr = `hmac ${API_PUBLIC_KEY}:${signature}`;
  return {
    Authorization: hmacStr,
    'Request-Date': timestamp,
  };
};

const initialState: StationState = {
  stations: [],
  isLoading: false,
  error: null,
};

export const fetchStations = createAsyncThunk<APIResponse, void, { rejectValue: APIError }>(
  'stations/fetchStations',
  async () => {
    const params = {
      method: 'GET',
      request: '/user',
    };
    const headers = {
      ...getAuthorizationHeader(params.method, params.request),
      Accept: 'application/json',
    };
    try {
      const response = await axios.get(API_BASE_URL + params.request, {
        headers,
      });
      console.log(response);
      const data: APIResponse = response.data;
      return data;
    } catch (error) {
      throw new Error('Failed to fetch stations.');
    }
  },
);

const stationSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stations = action.payload.stations;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload!;
      });
  },
});

export default stationSlice.reducer;
