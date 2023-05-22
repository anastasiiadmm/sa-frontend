export interface IErrors {
  detail: string | null;
  status: number | null;
}

export interface ErrorObject {
  [key: string]: string | string[] | ErrorObject;
}
