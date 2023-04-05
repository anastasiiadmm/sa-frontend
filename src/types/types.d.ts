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
  image: string;
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

export interface UpdatedCompaniesList extends companiesList {
  id?: number;
  name?: string;
  location?: string;
  autopilots_amount?: number;
  user?: {
    id?: number;
    username?: string;
    password?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    image?: string;
  };
}

export interface usersListPagination {
  count: number;
  next: string;
  previous: string;
  vehicles_amount: number;
}

export interface IUserRegister {
  name: string;
  location: string;
  user: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
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
}

export interface userVehicleInfo {
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

export interface vehicleCreateData {
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

export interface generatedPassword {
  generated_password: string;
}

export interface Request {
  id: number;
  created_at: string;
  enterprise_name: string;
  confirmation_type: number;
  enterprise: number;
  confirmation_type_text: string;
  inquiry_id: number;
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

