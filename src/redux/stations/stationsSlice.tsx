import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { unixTimestamp } from 'helper';
import { RootState } from 'redux/hooks';
import {
  APIError,
  APIWeatherResponse,
  Elevation,
  Location,
  stationInfo,
  StationSensor,
  StationState,
  Timezone,
  userStation,
} from 'types/stationTypes';

const {
  REACT_APP_CLIMATE_API_BASE_URL,
  REACT_APP_CLIMATE_API_PUBLIC_KEY,
  REACT_APP_CLIMATE_API_PRIVATE_KEY,
  REACT_APP_CLIMATE_STATION_ID,
  REACT_APP_GOOGLE_APIS_KEY,
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
  user: null,
  isLoading: false,
  error: null,

  weather: null,
  isWeatherLoading: false,
  isWeatherError: null,

  stations: null,
  stationsLoading: false,
  stationsError: null,

  stationInfo: null,
  stationInfoLoading: false,
  stationInfoError: null,

  sensors: [],
  sensorsLoading: false,
  sensorsError: null,

  sensorData: null,
  sensorDataLoading: false,
  sensorDataError: null,

  sensorPutLoading: false,
  sensorPutError: null,

  timezone: null,
  timezoneLoading: false,
  timezoneError: null,

  elevation: null,
  elevationLoading: false,
  elevationError: null,

  location: null,
  locationLoading: false,
  locationError: null,
};

export const fetchUser = createAsyncThunk<userStation, void, { rejectValue: APIError }>(
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
      const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL + params.request, {
        headers,
      });

      const data: userStation = response.data;
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

export const fetchStations = createAsyncThunk<stationInfo, void, { rejectValue: APIError }>(
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
      const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL + params.request, {
        headers,
      });

      const data: stationInfo = response.data;
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch station data.' });
    }
  },
);

interface stationInfoParams {
  id: string | null | undefined;
}

export const fetchStationInfo = createAsyncThunk<
  stationInfo,
  stationInfoParams,
  { rejectValue: APIError }
>('stations/fetchStationInfo', async ({ id }, { rejectWithValue }) => {
  const params = {
    method: 'GET',
    request: `/station/${id}`,
  };
  const headers = {
    ...getAuthorizationHeader(params.method, params.request),
    Accept: 'application/json',
  };
  try {
    const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL + params.request, {
      headers,
    });

    return response.data;
  } catch (error) {
    return rejectWithValue({ message: 'Failed to fetch station data.' });
  }
});

interface stationParams {
  id: string | undefined;
}

export const fetchStationSensors = createAsyncThunk<
  StationSensor,
  stationParams,
  { rejectValue: APIError }
>('stations/fetchStationSensors', async ({ id }, { rejectWithValue }) => {
  const params = {
    method: 'GET',
    request: `/station/${id}/sensors`,
  };
  const headers = {
    ...getAuthorizationHeader(params.method, params.request),
    Accept: 'application/json',
  };
  try {
    const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL + params.request, {
      headers,
    });

    return response.data;
  } catch (error) {
    return rejectWithValue({ message: 'Failed to fetch station data.' });
  }
});

interface postStationSensorsParams {
  data: {
    id: string | null | undefined;
    name: {
      name: string | null | undefined;
    };
    day_type: string | null | undefined;
    date_from: string | null | undefined;
    date_to: string | null | undefined;
  };
}

export const postStationSensors = createAsyncThunk<
  StationSensor,
  postStationSensorsParams,
  { rejectValue: APIError }
>('stations/postStationSensors', async ({ data }, { rejectWithValue }) => {
  const params = {
    method: 'POST',
    request: `/fc/${data?.id}/${data?.day_type}/from/${data?.date_from}/to/${data?.date_to}`,
  };
  const headers = {
    ...getAuthorizationHeader(params.method, params.request),
    Accept: 'application/json',
    'Accept-Language': 'ru',
  };
  try {
    const response = await axios.post(REACT_APP_CLIMATE_API_BASE_URL + params.request, data?.name, {
      headers,
    });

    return response.data;
  } catch (error) {
    return rejectWithValue({ message: 'Failed to fetch station data.' });
  }
});

interface putStationParams {
  id: string | null | undefined;
  data: string | Object | null | undefined;
}

export const putStation = createAsyncThunk<void, putStationParams, { rejectValue: APIError }>(
  'stations/putStation',
  async ({ id, data }, { rejectWithValue }) => {
    const params = {
      method: 'PUT',
      request: `/station/${id}`,
    };
    const headers = {
      ...getAuthorizationHeader(params.method, params.request),
      Accept: 'application/json',
      'Accept-Language': 'ru',
    };
    try {
      const response = await axios.put(REACT_APP_CLIMATE_API_BASE_URL + params.request, data, {
        headers,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch station data.' });
    }
  },
);

interface getTimezoneParams {
  position: number[];
}

export const getTimezone = createAsyncThunk<Timezone, getTimezoneParams, { rejectValue: APIError }>(
  'stations/getTimezone',
  async ({ position }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${position[0]},${position[1]}&timestamp=${unixTimestamp}&key=${REACT_APP_GOOGLE_APIS_KEY}`,
      );
      return await response.data;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch timezone data.' });
    }
  },
);

interface getElevationParams {
  position: number[];
}

export const getElevation = createAsyncThunk<
  Elevation,
  getElevationParams,
  { rejectValue: APIError }
>('stations/getElevation', async ({ position }, { rejectWithValue }) => {
  try {
    const params = {
      method: 'GET',
      request: `/elevation?lat=${position[0]}&lon=${position[1]}`,
    };
    const headers = {
      ...getAuthorizationHeader(params.method, params.request),
      Accept: 'application/json',
      'Accept-Language': 'ru',
    };
    try {
      const response = await axios.get(REACT_APP_CLIMATE_API_BASE_URL + params.request, {
        headers,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch station data.' });
    }
  } catch (error) {
    return rejectWithValue({ message: 'Failed to fetch elevation data.' });
  }
});

interface getLocationParams {
  location: string;
}

export const getLocationParams = createAsyncThunk<
  Location,
  getLocationParams,
  { rejectValue: APIError }
>('stations/getLocationParams', async ({ location }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`,
    );
    return await response.data;
  } catch (error) {
    return rejectWithValue({ message: 'Failed to fetch location data.' });
  }
});

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
        state.weather = {
          dates: action.payload.dates,
          data: action.payload.data,
        };
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

    builder
      .addCase(fetchStationSensors.pending, (state) => {
        state.sensorsLoading = true;
        state.sensorsError = null;
      })
      .addCase(fetchStationSensors.fulfilled, (state, action) => {
        state.sensorsLoading = false;
        state.sensors = action.payload;
      })
      .addCase(fetchStationSensors.rejected, (state, action) => {
        state.sensorsLoading = false;
        state.sensorsError = action.payload!;
      });

    builder
      .addCase(fetchStationInfo.pending, (state) => {
        state.isWeatherLoading = true;
        state.isWeatherError = null;
      })
      .addCase(fetchStationInfo.fulfilled, (state, action) => {
        state.isWeatherLoading = false;
        state.stationInfo = action.payload;
      })
      .addCase(fetchStationInfo.rejected, (state, action) => {
        state.isWeatherLoading = false;
        state.isWeatherError = action.payload ? action.payload : null;
      });

    builder
      .addCase(postStationSensors.pending, (state) => {
        state.sensorDataLoading = true;
        state.sensorDataError = null;
      })
      .addCase(postStationSensors.fulfilled, (state, action) => {
        state.sensorDataLoading = false;
        state.sensorData = action.payload;
      })
      .addCase(postStationSensors.rejected, (state, action) => {
        state.sensorDataLoading = false;
        state.sensorDataError = action.payload ? action.payload : null;
      });

    builder
      .addCase(putStation.pending, (state) => {
        state.sensorPutLoading = true;
        state.sensorPutError = null;
      })
      .addCase(putStation.fulfilled, (state) => {
        state.sensorPutLoading = false;
      })
      .addCase(putStation.rejected, (state, action) => {
        state.sensorPutLoading = false;
        state.sensorPutError = action.payload ? action.payload : null;
      });

    builder
      .addCase(getTimezone.pending, (state) => {
        state.timezoneLoading = true;
        state.timezoneError = null;
      })
      .addCase(getTimezone.fulfilled, (state, action) => {
        state.timezoneLoading = false;
        state.timezone = action.payload;
      })
      .addCase(getTimezone.rejected, (state, action) => {
        state.timezoneLoading = false;
        state.timezoneError = action.payload ? action.payload : null;
      });

    builder
      .addCase(getElevation.pending, (state) => {
        state.elevationLoading = true;
        state.elevationError = null;
      })
      .addCase(getElevation.fulfilled, (state, action) => {
        state.elevationLoading = false;
        state.elevation = action.payload;
      })
      .addCase(getElevation.rejected, (state, action) => {
        state.elevationLoading = false;
        state.elevationError = action.payload ? action.payload : null;
      });

    builder
      .addCase(getLocationParams.pending, (state) => {
        state.locationLoading = true;
        state.locationError = null;
      })
      .addCase(getLocationParams.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.location = action.payload;
      })
      .addCase(getLocationParams.rejected, (state, action) => {
        state.locationLoading = false;
        state.locationError = action.payload ? action.payload : null;
      });
  },
});

export const stationsSelector = (state: RootState) => state.stations;
export default stationSlice.reducer;
