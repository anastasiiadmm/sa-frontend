
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

export interface userVehicles {
  id: number;
  code: string;
  description: string;
  jobs_number: number;
  area: string;
  image: string;
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















