import { IErrors } from 'interfaces/IErrors';

export interface ProcessingData {
  field_name: string;
  work_area: number;
  id: number;
  attachments: {
    toolsWidth: string;
    toolsName: string;
    skipOverlap: string;
    toolsWidthResult: string;
    frontBack: string;
    leftRight: string;
  };
}

export interface Vehicle {
  id: number;
  image: string;
  processing_data: ProcessingData[];
  vin_code: string;
  code: string;
  state_number: string;
  description: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  last_latitude: string;
  last_longitude: string;
  enterprise: number;
}

export interface VehicleV2 {
  id: number | null;
  job_id: number | null;
  description: string;
  code: string;
  image: string | null;
  full_name: string;
  last_latitude: number;
  last_longitude: number;
  point_A_lat: number;
  point_A_lon: number;
  point_B_lat: number;
  point_B_lon: number;
  tool_width: string;
  task_UID: string;
}

export interface IMapState {
  vehicle: {
    loading: boolean;
    errors: IErrors | null;
    results?: Vehicle | null;
  };
  field: {
    loading: boolean;
    errors: IErrors | null;
    results: VehicleV2;
  };
}

export interface VehicleData {
  status: string | undefined;
  all_vehicles_info?: Array<ITechniquesMap> | null;
  online_vehicle_ids?: Array<ITechniquesMapActive> | null;
}

export interface ITechniquesMap {
  description: string;
  id: number;
  last_latitude: number;
  last_longitude: number;
  speed: number;
  license_plate: string;
  vin: string;
  operator: {
    first_name: string;
    last_name: string;
    middle_name: string;
  };
}

export interface ITechniquesMapActive {
  [key: number]: {
    latitude: string;
    longitude: string;
    speed: string;
  };
}

export interface ITechniquesMapActiveButton {
  latitude: string;
  longitude: string;
  speed: string;
}

export interface ITechniquesMapActiveButtonState {
  online_vehicle_ids: ITechniquesMapActive[];
}
