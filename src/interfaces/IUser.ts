export interface IUser {
  last_name: string;
  first_name: string;
  middle_name: string;
  email: string;
  phone: string;
}

export interface IUserAdd {
  user: IUser;
  name: string;
  location: string;
}
