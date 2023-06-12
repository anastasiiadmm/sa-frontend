export interface IApk {
  file: string;
  version: string;
  description: string;
}

export interface UploadApk extends Omit<IApk, 'file'> {}

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
