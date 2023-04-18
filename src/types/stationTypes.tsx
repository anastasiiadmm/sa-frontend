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
  stationInfo: any;
  stationInfoLoading: boolean;
  stationInfoError: APIError | null;
  sensors: any;
  sensorsLoading: boolean;
  sensorsError: APIError | null;
  sensorData: any;
  sensorDataLoading: boolean;
  sensorDataError: APIError | null;
}

export interface MarkerData {
  id: string;
  position: [number, number];
  name: string;
  dates: {
    min_date: string;
    max_date: string;
    created_at: string;
    last_communication: string;
  };
  meta: {
    time: number;
    solarRadiation: number;
    solarPanel: number;
    battery: number;
    lw: number;
    airTemp: number;
    rh: number;
    soilTemp: number;
    volumetricAverage: number;
    tensiometricAverage: number;
    rain7d: {
      vals: number[];
      sum: number;
    };
    rain48h: {
      vals: number[];
      sum: number;
    };
    rain24h: {
      vals: number[];
      sum: number;
    };
  };
}

export interface Sensor {
  chart?: {
    zoomType: string;
    marginTop: number;
    height: number;
    marginRight: number;
    marginLeft: number;
  };
  credits?: {
    enabled: boolean;
  };
  exporting?: {
    enabled: boolean;
  };
  legend?: {
    backgroundColor: string;
    enabled: boolean;
    align: string;
    verticalAlign: string;
    layout: string;
  };
  series?: any;
  sources?: string[];
  subtitle?: string;
  title?: {
    floating: boolean;
    align: string;
    text: string;
    style: any;
    x: number;
  };
  tooltip?: {
    xDateFormat: string;
    useHTML: boolean;
    headerFormat: string;
    pointFormat: string;
    footerFormat: string;
  };
  xAxis?: {
    type: string;
    gridLineWidth: number;
    crosshair: boolean;
    labels: any;
    lineWidth: number;
  };
  yAxis?: {
    [index: number]: {
      title: Object;
      labels: Object;
      opposite?: boolean;
    };
  }[];
}

export interface SensorData {
  aggr: string[];
  calibration_id: string;
  ch: number;
  code: number;
  color: string;
  decimals: number;
  desc: string;
  divider: number;
  group: number;
  isActive: boolean;
  is_user_set: {
    name: boolean;
    unit: boolean;
    color: boolean;
  };
  mac: string;
  multiplier: number;
  name: string;
  name_custom: string;
  registered: string;
  serial: string;
  size: string;
  unit: string;
  unit_default: string;
  units: string[];
  vals: {
    min: number;
    max: number;
  };
}

export interface ChartOption {
  color: string;
  data: [number, number][];
  groupId: string;
  label: {
    enabled: boolean;
  };
  series?: any;
  name: string;
  tooltip: {
    xDateFormat: string;
    useHTML: boolean;
    headerFormat: string;
    pointFormat: string;
    footerFormat: string;
  };
  turboThreshold: number;
  type: string;
  visible: boolean;
  yAxis: number;
}

