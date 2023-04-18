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

export interface resultsAB {
  PointA: string;
  PointB: string;
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
    results: resultsAB[];
  };
}
