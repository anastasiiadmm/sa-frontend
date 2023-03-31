export interface Weather {
  dates: string[];
  data: WeatherDataEntry[];
}

interface WeatherDataEntry {
  aggr: string[];
  ch: number;
  code: number;
  decimals: number;
  group: number;
  mac: string;
  name: string;
  name_original: string;
  registered: string;
  serial: string;
  type: string;
  unit: string;
  vals: any;
  values: {
    avg: number[];
  };
}

export interface APIResponse {
  stations: any[];
}

export interface APIWeatherResponse {
  data: WeatherDataEntry[];
  dates: string[];
}

export interface APIError {
  message: string;
}

export interface StationState {
  user: any;
  isLoading: boolean;
  error: APIError | null;
  weather: Weather | null;
  isWeatherLoading: boolean;
  isWeatherError: any;
  stations: any;
  stationsLoading: boolean;
  stationsError: any;
}

export interface MarkerData {
  position: [number, number];
  name: string;
}
