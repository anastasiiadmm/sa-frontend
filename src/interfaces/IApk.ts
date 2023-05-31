export interface IApk {
  file: string;
  version: string;
  description: string;
}

export interface UploadApk extends Omit<IApk, 'file'> {}
