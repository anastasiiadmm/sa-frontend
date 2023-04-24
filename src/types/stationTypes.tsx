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
  data: WeatherDataEntry[];
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
  sensors: Object | null;
  sensorsLoading: boolean;
  sensorsError: APIError | null;
  sensorData: StationSensor | null;
  sensorDataLoading: boolean;
  sensorDataError: APIError | null;
  sensorPutLoading: boolean;
  sensorPutError: APIError | null;
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
  position: Object;
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
  children?: {
    field: string;
    filter: string;
    headerName: string;
    headerTooltip: string;
    suppressSorting: boolean;
    width: number;
  }[] | undefined;
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

