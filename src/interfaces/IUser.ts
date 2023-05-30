export interface IUser {
  id?: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  email: string;
  phone: string;
  username?: string;
  password?: string;
  image?: string;
}

export interface IUserAdd {
  user: IUser;
  name: string;
  location: string;
}

export interface ITokens {
  refresh: string;
  access: string;
  is_manager: boolean;
}

export interface ResetEmail {
  email: string;
}

export interface userMutation {
  username: string;
  password: string;
}

export interface IAccount {
  id?: number | undefined;
  username: string;
  password?: string;
  first_name: string;
  middle_name: string;
  image: string;
  is_manager: boolean;
  last_name: string;
  email: string;
  phone: string;
  coords_timeout: number;
  company: {
    autopilots_amount: number;
    id?: number;
    vehicles_number?: number;
    location: string;
    meteo_requested: boolean;
    name: string;
    weather_service: boolean;
  };
}

export interface ValidationUpdateManagerProfile {
  [key: string]: string;
}

export interface updateManagerDataMutation {
  username?: string;
  password?: string;
  confirm_password?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface accountsManagerConfirmation {
  created_at: string;
  confirmation_type: number;
  inquiry_id: number;
  enterprise: number;
  confirmation_type_text: string;
  enterprise_name: string;
  id: number;
  password: string;
  username: string;
}

export interface RequestType {
  id: number;
  object_id: string | number;
  category: number;
  created_at: string;
  inquiry_id?: string;
  requestor?:
    | {
        email: string;
        name: string;
        phone: string;
      }
    | undefined
    | null;
  uploaded_files: [{ id: string; file: string }] | null;
  data: {
    user: IUser;
    enterprise: {
      location: string;
      name: string;
    };
  };
}

export interface generatedPassword {
  generated_password: string;
}

export interface IOperator {
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface companiesList {
  id?: number;
  name: string;
  location: string;
  autopilots_amount: number;
  user: IUser;
}

export type ICompany = Omit<companiesList, 'id'>;

export interface pagination {
  count: number | undefined;
  next: string | null | undefined;
  previous: string | null | undefined;
  vehicles_count?: string;
}
