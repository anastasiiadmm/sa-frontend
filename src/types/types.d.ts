import { JSX } from 'react';

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
  is_manager: boolean;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface IAccount {
  id: number | undefined;
  username: string;
  password: string;
  first_name: string;
  middle_name: string;
  is_manager: boolean;
  last_name: string;
  email: string;
  phone: string;
  image: string;
  coords_timeout: number;
  company: {
    autopilots_amount: number;
    id: number;
    location: string;
    meteo_requested: boolean;
    name: string;
    weather_service: boolean;
  };
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
  image?: string;
}

export interface ValidationUpdateManagerProfile {
  [key: string]: string;
}

export interface profile {
  [key: string]: Object;
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
    image: string;
  };
}

export interface PostNewUser extends Omit<IUserAccount, 'user'> {
  user: Omit<IUserAccount['user'], 'password'> & {
    generated_password: string;
    image: string;
  };
}

export interface userVehicles {
  id: number;
  code: string;
  description: string;
  jobs_number: number;
  area: string;
  image: string;
}

export interface userVehiclesPagination {
  count: number | undefined;
  next: string | undefined | null;
  previous: string | undefined | null;
}

export interface companiesList {
  id?: number;
  name: string;
  location: string;
  autopilots_amount: number;
  user: {
    id?: number;
    username?: string;
    password?: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone: string;
    image?: string;
  };
}

export interface requestData {
  category: number;
  created_at: string;
  id: number;
  object_id: number;
  requestor?: {
    email: string;
    name: string;
    phone: string;
  } | null;
  uploaded_files: Array;
  data: {
    user: {
      username?: string;
      password?: string;
      first_name: string;
      middle_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
    enterprise: {
      location: string;
      name: string;
    };
  };
}

export interface requestUserProfileData {
  id?: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  image: string;
  is_manager: boolean;
  company: {
    id?: number;
    name: string;
    location: string;
    autopilots_amount: number;
    weather_service: boolean;
    meteo_requested: boolean;
    vehicles_number: number;
  };
  coords_timeout: number;
}

export interface usersListPagination {
  count: number;
  next: string;
  previous: string;
  vehicles_count: number;
}

export interface userRequest {
  id: number;
  created_at: string;
  confirmation_type: number;
  inquiry_id: number;
  enterprise: number;
  confirmation_type_text: string;
}

export interface userRequestPagination {
  count: number;
  next: string;
  previous: string;
}

export type ICompany = Omit<companiesList, 'id'>;

interface ErrorObject {
  [key: string]: string | string[] | ErrorObject;
}

export interface vehicleList {
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

export interface vehicleListPagination {
  count: number;
  next: string;
  previous: string;
}

export interface fieldsList {
  attachments: {
    frontBack: string;
    leftRight: string;
    skipOverlap: string;
    toolsName: string;
    toolsWidth: string;
    toolsWidthResult: string;
  };
  field_name: JSX.Element;
  work_area: number;
  id?: number | null;
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

interface Vehicle {
  vin: string;
  license_plate: string;
  description: string;
  image: string;
  operator: {
    first_name: string;
    last_name: string;
    middle_name: string;
  };
}

export interface userVehicleInfo {
  count: number;
  next: string | null;
  previous: string | null;
  results: Result[];
  vehicle: Vehicle;
}

interface Operator {
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface IVehicleV2 {
  id: string | null | undefined;
  vin: string;
  license_plate: string;
  description: string;
  operator: Operator;
}

export interface userVehicleInfoCompanies {
  id: number;
  image: string;
  code: string;
  processing_data: fieldsList[];
  vin_code: string;
  state_number: string;
  description: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  last_latitude: string;
  last_longitude: string;
  enterprise: number;
}

interface IOperator {
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface vehicleCreateData {
  enterprise: number;
  vin: string;
  license_plate: string;
  description: string;
  operator: IOperator;
}

export interface generatedPassword {
  generated_password: string;
}

export interface RequestType {
  id: number;
  object_id: string;
  category: number;
  created_at: string;
  inquiry_id?: string;
  requestor?: string;
  data: {
    enterprise: {
      location: string;
      name: string;
    };
    user: {
      email: string;
      first_name: string;
      last_name: string;
      middle_name: string;
      phone: string;
      username: string;
    };
  };
}

export interface userRequest {
  coords_timeout: number;
  email: string;
  first_name: string;
  id: number;
  image: string;
  is_manager: boolean;
  last_name: string;
  middle_name: string;
  phone: string;
  username: string;
  company: {
    autopilots_amount: number;
    id: number;
    location: string;
    meteo_requested: boolean;
    name: string;
    vehicles_number: number;
    weather_service: boolean;
  };
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

interface UserIds {
  requestId: string | null;
  userId: string | null;
}

interface climateOptions {
  value: string;
  label: string;
}
