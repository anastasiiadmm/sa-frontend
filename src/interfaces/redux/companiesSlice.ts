interface User {
  id: number;
  password: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  image: string;
}

interface Company {
  id: number;
  name: string;
  location: string;
  autopilots_amount: number;
  weather_service: boolean;
  user: User;
}

export interface CompanyListResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  results: Company[];
}
