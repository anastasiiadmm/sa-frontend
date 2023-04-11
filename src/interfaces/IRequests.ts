export interface IConfirmation {
  id: number;
  created_at: string;
  confirmation_type: number;
  inquiry_id: number;
  enterprise: number;
  confirmation_type_text: string;
  enterprise_name: string;
}

export interface IVehicle {
  id: number;
  image: string;
  processing_data: any[]; // Replace any with appropriate type
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

export interface ITechniqueVehicleInfoPut {
  data: any;
  obj: any;
}
