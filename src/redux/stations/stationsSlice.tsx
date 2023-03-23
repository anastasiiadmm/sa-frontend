import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import {
  APIError,
  APIResponse,
  APIWeatherResponse,
  StationState,
  Weather,
} from 'types/stationTypes';

const {
  REACT_APP_CLIMATE_API_BASE_URL,
  REACT_APP_CLIMATE_API_PUBLIC_KEY,
  REACT_APP_CLIMATE_API_PRIVATE_KEY,
  REACT_APP_CLIMATE_STATION_ID,
} = process.env;

const timestamp = new Date().toUTCString();

const signContent = (method: string, request: string, timestamp: string) => {
  const contentToSign = method + request + timestamp + REACT_APP_CLIMATE_API_PUBLIC_KEY;
  const privateKey = REACT_APP_CLIMATE_API_PRIVATE_KEY || '';
  return CryptoJS.HmacSHA256(contentToSign, privateKey);
};

const getAuthorizationHeader = (method: string, request: string) => {
  const signature = signContent(method, request, timestamp);
  const hmacStr = `hmac ${REACT_APP_CLIMATE_API_PUBLIC_KEY}:${signature}`;
  return {
    Authorization: hmacStr,
    'Request-Date': timestamp,
  };
};

const initialState: StationState = {
  stations: [],
  isLoading: false,
  error: null,

  weather: null,
  isWeatherLoading: false,
  isWeatherError: null,
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
      const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL + params.request, {
        headers,
      });

      const data: APIResponse = response.data;
      return data;
    } catch (error) {
      throw new Error('Failed to fetch stations.');
    }
  },
);

export const fetchWeather = createAsyncThunk<APIWeatherResponse, void, { rejectValue: APIError }>(
  'stations/fetchWeather',
  async (_, { rejectWithValue }) => {
    const params = {
      method: 'GET',
      request: `/data/${REACT_APP_CLIMATE_STATION_ID}/GROUP-BY/last/1`,
    };
    const headers = {
      ...getAuthorizationHeader(params.method, params.request),
      Accept: 'application/json',
    };
    try {
      const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL + params.request, {
        headers,
      });

      const data: APIWeatherResponse = response.data;
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch weather data.' });
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
        state.stations = action.payload;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload!;
      });

    builder
      .addCase(fetchWeather.pending, (state) => {
        state.isWeatherLoading = true;
        state.isWeatherError = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isWeatherLoading = false;
        const weatherData: Weather = {
          dates: action.payload.dates,
          data: action.payload.data,
        };
        state.weather = weatherData;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isWeatherLoading = false;
        state.isWeatherError = action.payload ? action.payload : null;
      });
  },
});

export default stationSlice.reducer;
