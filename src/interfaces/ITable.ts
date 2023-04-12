export interface IRequest {
  id: number;
  created_at: string;
  enterprise_name: string;
  confirmation_type: number;
  enterprise: number;
  confirmation_type_text: string;
  inquiry_id: number;
}

export interface IUserRequest {
  id: number;
  created_at: string;
  confirmation_type: number;
  inquiry_id: number;
  enterprise: number;
  confirmation_type_text: string;
}
