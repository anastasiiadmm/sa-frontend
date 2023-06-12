export interface Weather {
  dates: string[];
  data: SensorDataEntry[];
}

export interface SensorDataEntry {
  aggr: string[];
  ch: number;
  code: number;
  color: string;
  decimals: number;
  desc: string;
  divider: number;
  group: number;
  isActive: boolean;
  is_user_set: {
    color: boolean;
    name: boolean;
    unit: boolean;
  };
  mac: string;
  multiplier: string;
  name: string;
  name_custom: string;
  registered: string;
  serial: string;
  size: string;
  type: string;
  unit: string;
  unit_default: string;
  units: string[];
  vals: {
    max: number;
    min: number;
  };
}

export interface SensorUpdate {
  channel: number;
  code: number;
  color: string;
  name: string;
  unit: string | boolean;
}

export interface userStation {
  account_close_token: string;
  address: Object;
  api_access: Object;
  company: Object;
  create_time: string;
  created_by: string;
  customizations: Object;
  dashboardTexts: number[];
  info: Object;
  last_access: string;
  newsletter: Object;
  note: string;
  settings: Object;
  terms_accepted: boolean;
  username: string;
}

export interface APIWeatherResponse {
  data: SensorDataEntry[];
  dates: string[];
}

export interface APIError {
  message: string;
}

export interface StationState {
  user: userStation | null;
  isLoading: boolean;
  error: APIError | null;
  weather: Weather | null;
  isWeatherLoading: boolean;
  isWeatherError: APIError | null;
  stations: stationInfo | null;
  stationsLoading: boolean;
  stationsError: APIError | null;
  stationInfo: stationInfo | null;
  stationInfoLoading: boolean;
  stationInfoError: APIError | null;
  sensors: SensorDataEntry[] | undefined | null;
  sensorsLoading: boolean;
  sensorsError: APIError | null;
  updateStationSensorLoading: boolean;
  updateStationSensorError: APIError | null;
  sensorData: StationSensor | null;
  sensorDataLoading: boolean;
  sensorDataError: APIError | null;
  sensorPutLoading: boolean;
  sensorPutError: APIError | null;
  timezone: Timezone | null;
  timezoneLoading: boolean;
  timezoneError: APIError | null;
  elevation: Elevation | null;
  elevationLoading: boolean;
  elevationError: APIError | null;
  location: Location | null;
  locationLoading: boolean;
  locationError: APIError | null;
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
  series?: [];
  sources?: string[];
  subtitle?: string;
  title?: {
    floating: boolean;
    align: string;
    text: string;
    style: Object;
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

export interface stationInfo {
  config: {
    activity_mode: number;
    fixed_transfer_interval: number;
    logging_interval: number;
    measuring_interval: number;
    precision_reduction: number;
    rain_monitor: number;
    scheduler: number;
    schedulerOld: string;
    timezone_offset: number;
    water_level_monitor: number;
    x_min_transfer_interval: number;
  };
  dates: {
    created_at: string;
    last_communication: string;
    max_date: string;
    min_date: string;
  };
  flags: Object;
  info: {
    apn_table: number;
    description: string;
    device_id: number;
    device_name: string;
    firmware: string;
    hardware: string;
    programmed: string;
    uid: string;
  };
  licenses: Object;
  meta: Object;
  metadata: Object;
  name: {
    custom: string;
    original: string;
  };
  networking: Object;
  note: string;
  position: {
    altitude: number;
    geo: {
      coordinates: number[];
      timezoneCode: string;
    };
    timezoneCode: string;
    rights: string;
  };
  rights: string;
  warnings: Object;
}

export interface StationSensor {
  chartsOptions: Sensor[];
  grid: gridSensor;
  notifications: [];
  topology: SensorData[];
}

export interface headerGrid {
  children?:
    | {
        field: string;
        filter: string;
        headerName: string;
        headerTooltip: string;
        suppressSorting: boolean;
        width: number;
      }[]
    | undefined;
  groupId?: string;
  field?: string;
  headerName: string;
  pinned?: boolean;
  sort?: string;
  suppressMenu?: boolean;
  suppressSorting?: boolean;
}

export interface gridSensor {
  data: number[];
  headers: headerGrid[];
}

export interface SensorData {
  expanded: boolean;
  name: string;
  name_custom: string;
  nodes: [];
  sensors: TopologySensor[];
  type: string;
}

export interface TopologySensor {
  chart: number;
  groupId: string;
  sensor: {
    ch: number;
    code: number;
    color: string;
    group: number;
    mac: string;
    name: string;
    serial: string;
  };
}

export interface Timezone {
  dstOffset: number;
  rawOffset: number;
  status: string;
  timeZoneId: string;
  timeZoneName: string;
}

export interface Elevation {
  results: [
    {
      latitude: number;
      longitude: number;
      elevation: number;
    },
  ];
}

export interface Location {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon: string;
}

export interface Locales {
  [key: string]: string;
}

export interface climateOptions {
  value: string;
  label: string;
}
