export interface ResetEmail {
  email: string;
}

export interface IUser {
  username: string;
  password: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_manager: string;
}

export interface ITokens {
  refresh: string;
  access: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface loginResponse {
  user: IUser;
  tokens: ITokens;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  name: string;
  _name: string;
  message: string;
}

export interface IManager {
  id: string;
  username: string;
  password: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface IManagerMutation {
  username?: string;
  password?: string;
  confirm_password?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface ValidationUpdateManagerProfile {
  [key: string]: string;
}

export interface updateManagerDataMutation {
  username: string;
  password?: string;
  confirm_password?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface IUserAccount {
  id: number;
  name: string;
  location: string;
  autopilots_amount: number;
  vehicles_amount: number;
  user: {
    id: number;
    username: string;
    password: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone: string;
  }
}

export interface userVehicles {
  id: number;
  code: string;
  vin_code: string;
  image: string;
  description: string;
  state_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  enterprise: string;
  vehicle_fields_data: {
    field_count: number;
    processed_area: number;
  };
}

export interface userVehiclesPagination {
  count: number;
  next: string;
  previous: string;
}
