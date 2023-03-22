export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface APIResponse {
  stations: Station[];
}

export interface APIError {
  message: string;
}

export interface StationState {
  stations: Station[];
  isLoading: boolean;
  error: APIError | null;
}

export interface FetchParams {
  method: string;
  request: string;
  body?: BodyInit;
}
