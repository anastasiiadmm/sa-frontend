export interface IApk {
  file: string;
  version: string | number;
  description: string;
  created_at: string;
}

export interface apksPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: IApk[];
  links?: {
    next: string | undefined;
    previous: string | undefined;
  };
}
