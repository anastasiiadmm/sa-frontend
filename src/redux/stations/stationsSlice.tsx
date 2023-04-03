import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { RootState } from 'redux/hooks';
import {
  APIError,
  APIResponse,
  APIWeatherResponse,
  StationState,
  Weather,
} from 'types/stationTypes';

const {
  REACT_APP_CLIMATE_API_BASE_URL_DEV,
  REACT_APP_CLIMATE_API_PUBLIC_KEY_DEV,
  REACT_APP_CLIMATE_API_PRIVATE_KEY_DEV,
  REACT_APP_CLIMATE_STATION_ID_DEV,
} = process.env;

const timestamp = new Date().toUTCString();

const signContent = (method: string, request: string, timestamp: string) => {
  const contentToSign = method + request + timestamp + REACT_APP_CLIMATE_API_PUBLIC_KEY_DEV;
  const privateKey = REACT_APP_CLIMATE_API_PRIVATE_KEY_DEV || '';
  return CryptoJS.HmacSHA256(contentToSign, privateKey);
};

const getAuthorizationHeader = (method: string, request: string) => {
  const signature = signContent(method, request, timestamp);
  const hmacStr = `hmac ${REACT_APP_CLIMATE_API_PUBLIC_KEY_DEV}:${signature}`;
  return {
    Authorization: hmacStr,
    'Request-Date': timestamp,
  };
};

const initialState: StationState = {
  user: [],
  isLoading: false,
  error: null,

  weather: null,
  isWeatherLoading: false,
  isWeatherError: null,

  stations: [],
  stationsLoading: false,
  stationsError: null,
};

export const fetchUser = createAsyncThunk<APIResponse, void, { rejectValue: APIError }>(
  'stations/fetchUser',
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
      const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL_DEV + params.request, {
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
      request: `/data/${REACT_APP_CLIMATE_STATION_ID_DEV}/GROUP-BY/last/1`,
    };
    const headers = {
      ...getAuthorizationHeader(params.method, params.request),
      Accept: 'application/json',
    };
    try {
      const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL_DEV + params.request, {
        headers,
      });

      const data: APIWeatherResponse = response.data;
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch weather data.' });
    }
  },
);

export const fetchStations = createAsyncThunk<APIWeatherResponse, void, { rejectValue: APIError }>(
  'stations/fetchStations',
  async (_, { rejectWithValue }) => {
    const params = {
      method: 'GET',
      request: `/user/stations`,
    };
    const headers = {
      ...getAuthorizationHeader(params.method, params.request),
      Accept: 'application/json',
    };
    try {
      const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL_DEV + params.request, {
        headers,
      });

      const data: APIWeatherResponse = response.data;
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch station data.' });
    }
  },
);

const stationSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
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

    builder
      .addCase(fetchStations.pending, (state) => {
        state.stationsLoading = true;
        state.stationsError = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.stationsLoading = false;
        state.stations = action.payload;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.stationsLoading = false;
        state.stationsError = action.payload!;
      });
  },
});

export const stationsSelector = (state: RootState) => state.stations;
export default stationSlice.reducer;
