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
  category: number;
  object_id: number;
  created_at: string;
  requestor: {
    name: string;
  };
  data: {
    vehicle: {
      vin: string;
      license_plate: string;
      description: string;
    };
    operator: {
      first_name: string;
      last_name: string;
      middle_name: string;
    };
  };
  uploaded_files: Array<{
    id: number;
    file: string;
  }>;
}

export interface ITechniqueVehicleInfoPut {
  id: number;
  formData: FormData;
}

export interface IValueRequest {
  fullName: string;
  description: string;
  license_plate: string;
  vin: string;
  last_name: string;
  first_name: string;
  middle_name: string;
}
