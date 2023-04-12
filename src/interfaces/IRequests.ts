export interface IConfirmation {
  id: number;
  created_at: string;
  confirmation_type: number;
  inquiry_id: number;
  enterprise: number;
  confirmation_type_text: string;
  enterprise_name: string;
}

interface IAttachment {
  Mode: string;
  toolsWidth: string;
  toolsName: string;
  skipOverlap: string;
  toolsWidthResult: string;
  frontBack: string;
  leftRight: string;
}

interface IField {
  field_name: string;
  work_area: number;
  id: number;
  attachments: IAttachment;
}

export interface IVehicle {
  id: number;
  image: string;
  processing_data: IField[];
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

export interface ICarRequest {
  fio: string;
  description: string;
  state_number: string;
  vin_code: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  code: string;
  enterprise: number;
}

export interface ITechniqueVehicleInfoPut {
  data: IConfirmation | null;
  obj: FormData;
}
