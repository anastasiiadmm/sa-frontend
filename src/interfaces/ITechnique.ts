import { JSX } from 'react';

import { IOperator } from 'interfaces/IUser';

export interface IValueFinish {
  description: string;
  state_number: string;
  vin_code: string;
  last_name: string;
  first_name: string;
  middle_name: string;
}

export interface Result {
  id: number;
  readable_id: JSX.Element;
  tool: string;
  tool_width: string;
  tool_overlap: string;
  tool_width_total: string;
  left_right: string;
  area: string;
}

export interface vehicleListPagination {
  count: number;
  next: string;
  previous: string;
}

export interface VehicleList {
  id: number;
  image: string;
  processing_data: string;
  code: string;
  vin_code: string;
  state_number: string;
  description: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  last_latitude: string;
  last_longitude: string;
  enterprise: number;
  vehicle_fields_data: {
    field_count: number;
    processed_area: number | null;
  };
}

export interface VehicleType {
  id?: string | null | undefined;
  vin: string;
  code?: string;
  license_plate: string;
  description: string;
  image?: string;
  enterprise?: number;
  operator: IOperator;
}

export interface userVehicleInfo {
  count: number;
  next: string | null;
  previous: string | null;
  results: Result[];
  vehicle: VehicleType;
}

export interface userVehicles {
  id: number;
  code: string;
  description: string;
  jobs_number: number;
  area: string;
  image: string;
}
