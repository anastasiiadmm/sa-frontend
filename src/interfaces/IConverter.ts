export interface IConverter {
  id: number;
  created_at: string;
  task_UID: string;
  file: string;
}

export interface converterPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results?: IConverter[] | undefined;
}
