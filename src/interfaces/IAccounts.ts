interface User {
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  email?: string;
  phone?: string;
  username?: string;
}

interface Enterprise {
  name?: string;
  location?: string;
  autopilots_amount?: string;
}

export interface IMyData {
  category?: number | null;
  object_id?: number | undefined | null;
  data?: {
    user?: User | null;
    enterprise?: Enterprise | null;
  };
}

export interface IMyDataApi {
  data?: {
    user?: User | null;
    enterprise?: Enterprise | null;
  };
}
