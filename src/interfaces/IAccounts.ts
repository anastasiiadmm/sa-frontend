interface User {
  last_name: string;
  first_name: string;
  middle_name: string;
  email: string;
  phone: string;
}

interface Enterprise {
  name: string;
  location: string;
}

export interface IMyData {
  category: number;
  object_id?: number | undefined;
  data?: {
    user: User;
    enterprise: Enterprise;
  };
}
